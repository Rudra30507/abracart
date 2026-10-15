import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case 'electronics':
      return '💻';
    case 'fashion':
      return '👗';
    case 'books':
      return '📚';
    case 'home':
      return '🏠';
    default:
      return '🛒';
  }
};

const WishlistCard = ({ product, onRemove }) => {
  const { _id, name, price, category, image, stock } = product;
  const [removing, setRemoving] = useState(false);

  const handleRemove = async (e) => {
    e.preventDefault();
    if (removing) return;

    setRemoving(true);
    try {
      await onRemove(_id);
    } catch (err) {
      console.error('Failed to remove item:', err);
      setRemoving(false);
    }
  };

  return (
    <div className="bg-white/95 dark:bg-[#141C26]/95 backdrop-blur-md rounded-2xl border border-[#E8E2D8] dark:border-white/10 hover:border-rose-300 dark:hover:border-rose-400/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group overflow-hidden">
      <div className="relative aspect-square w-full bg-[#F7F5F0] dark:bg-[#0E151E] overflow-hidden flex items-center justify-center">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
          }}
        />

        <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#16806A] dark:text-emerald-400 bg-white/95 dark:bg-[#141C26]/95 backdrop-blur-md rounded-lg border border-[#16806A]/20 dark:border-emerald-500/30 shadow-xs flex items-center gap-1 z-10">
          <span>{getCategoryIcon(category)}</span>
          <span>{category}</span>
        </span>

        <button
          onClick={handleRemove}
          disabled={removing}
          title="Remove from Wishlist"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-500 dark:hover:bg-rose-600 text-rose-500 hover:text-white flex items-center justify-center backdrop-blur-md transition-all shadow-xs cursor-pointer active:scale-90"
        >
          {removing ? (
            <span className="text-xs animate-spin">⏳</span>
          ) : (
            <span className="text-base leading-none">♥</span>
          )}
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 
            className="text-sm sm:text-base font-bold text-[#1F2E29] dark:text-white line-clamp-2 group-hover:text-[#16806A] dark:group-hover:text-emerald-400 transition-colors leading-snug"
            title={name}
          >
            {name}
          </h3>
          <span className="inline-block text-[11px] font-medium text-[#1F2E29]/60 dark:text-slate-400 mt-1">
            {category}
          </span>
        </div>

        <div className="pt-3 border-t border-[#E8E2D8]/70 dark:border-white/10">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#1F2E29]/50 dark:text-slate-400 block">Price</span>
              <span className="text-xl font-extrabold text-[#1F2E29] dark:text-white">
                ₹{Number(price).toLocaleString('en-IN')}
              </span>
            </div>
            
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
              stock > 0 
                ? 'text-[#16806A] dark:text-emerald-400 bg-[#E3F6EF] dark:bg-emerald-950/60' 
                : 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50'
            }`}>
              {stock > 0 ? `${stock} left` : 'Out of stock'}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              to={`/products/${_id}`}
              className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#16806A] hover:bg-[#126A57] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#16806A]/10 cursor-pointer text-center"
            >
              <span>View Details</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <button
              onClick={handleRemove}
              disabled={removing}
              className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 bg-rose-50/60 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 hover:border-rose-300 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {removing ? (
                <span>⏳ Removing...</span>
              ) : (
                <>
                  <span>Remove from Wishlist</span>
                  <span>♥</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
