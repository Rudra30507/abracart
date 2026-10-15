import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

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

const ProductCard = ({ product, onWishlistChange }) => {
  const { _id, name, price, category, image, stock } = product;

  // Cart State
  const { cart, addToCart: addProductToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);

  const cartItem = cart?.find(
    (item) => (item.product?._id || item.product) === _id
  );
  const isInCart = Boolean(cartItem);

  // Wishlist State from global context
  const { isWishlisted: checkWishlisted, toggleWishlist } = useWishlist();
  const isWishlisted = checkWishlisted(_id);
  const [saving, setSaving] = useState(false);
  const [justToggled, setJustToggled] = useState(false);

  // Toast System
  const { addToast } = useToast();

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent duplicate clicks while saving
    if (saving) return;

    setSaving(true);
    setJustToggled(true);

    try {
      const res = await toggleWishlist(_id);
      addToast({
        message: res.isWishlisted ? `Added "${name}" to Wishlist! ❤️` : `Removed "${name}" from Wishlist`,
        type: res.isWishlisted ? 'heart' : 'info'
      });

      if (onWishlistChange) {
        onWishlistChange(_id, res.isWishlisted);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        addToast({ message: 'Please login to save products', type: 'error' });
      } else {
        addToast({ message: err.response?.data?.message || 'Unable to update wishlist.', type: 'error' });
      }
    } finally {
      setSaving(false);
      setTimeout(() => setJustToggled(false), 600);
    }
  };

  // Add to Cart button click handler
  const handleAddToCartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (addingToCart || stock <= 0) return;

    if (cartItem && stock !== undefined && cartItem.quantity >= stock) {
      addToast({ message: `Max stock reached for "${name}" (${stock})`, type: 'error' });
      return;
    }

    setAddingToCart(true);
    const res = await addProductToCart(_id);
    setAddingToCart(false);

    if (res.success) {
      addToast({
        message: isInCart ? `Added another unit of "${name}" to Bag! 🛒` : `Added "${name}" to Bag! 🛒`,
        type: 'cart'
      });
    } else {
      if (res.status === 401) {
        addToast({ message: 'Please login to add items to cart', type: 'error' });
      } else {
        addToast({ message: res.message || 'Could not add to cart', type: 'error' });
      }
    }
  };

  return (
    <div className="bg-white/95 dark:bg-[#141C26] backdrop-blur-md rounded-2xl border border-[#E8E2D8] dark:border-white/10 hover:border-[#16806A]/50 dark:hover:border-emerald-500/40 shadow-xs hover:shadow-xl hover:shadow-[#16806A]/10 dark:hover:shadow-black/60 transition-all duration-300 flex flex-col group overflow-hidden relative">
      
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-[#F7F5F0] dark:bg-[#0E151E] overflow-hidden flex items-center justify-center">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
          }}
        />
        
        {/* Category Pill with Icon */}
        <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#16806A] dark:text-emerald-400 bg-white/95 dark:bg-[#141C26]/95 backdrop-blur-md rounded-lg border border-[#16806A]/20 dark:border-emerald-500/20 shadow-xs flex items-center gap-1 z-10">
          <span>{getCategoryIcon(category)}</span>
          <span>{category}</span>
        </span>

        {/* Quick Heart Icon Button on Image (Top Right) */}
        <button
          onClick={handleWishlistToggle}
          disabled={saving}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          aria-label="Wishlist toggle"
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md cursor-pointer active:scale-90 ${
            isWishlisted
              ? 'bg-rose-500 text-white shadow-rose-500/30 ring-2 ring-rose-400/30'
              : 'bg-white/90 dark:bg-black/60 text-[#1F2E29]/70 dark:text-white/80 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-black/80'
          } ${saving ? 'opacity-70 cursor-not-allowed' : ''} ${justToggled ? 'animate-heartBurst' : ''}`}
        >
          {saving ? (
            <span className="text-xs animate-spin">⏳</span>
          ) : isWishlisted ? (
            <span className="text-base text-white">♥</span>
          ) : (
            <span className="text-base">♡</span>
          )}
        </button>
      </div>

      {/* Product Details Section */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 
            className="text-sm sm:text-base font-bold text-[#1F2E29] dark:text-slate-100 line-clamp-2 group-hover:text-[#16806A] dark:group-hover:text-emerald-400 transition-colors leading-snug" 
            title={name}
          >
            {name}
          </h3>
          <span className="inline-block text-[11px] font-medium text-[#1F2E29]/60 dark:text-slate-400 mt-1">
            {category} Collection
          </span>
        </div>

        <div className="pt-3 border-t border-[#E8E2D8]/70 dark:border-white/10">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#1F2E29]/50 dark:text-slate-400 block">Price</span>
              <span className="text-xl font-extrabold text-[#1F2E29] dark:text-slate-100">
                ₹{Number(price).toLocaleString('en-IN')}
              </span>
            </div>
            
            {/* Amazon-style Stock Status */}
            {stock > 5 ? (
              <span className="text-[11px] font-bold text-[#007600] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-500/20 px-2 py-0.5 rounded-md">
                In Stock
              </span>
            ) : stock > 0 ? (
              <span className="text-[11px] font-bold text-[#B12704] dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-500/20 px-2 py-0.5 rounded-md">
                Only {stock} left
              </span>
            ) : (
              <span className="text-[11px] font-bold text-[#B12704] dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/20 px-2 py-0.5 rounded-md">
                Unavailable
              </span>
            )}
          </div>

          {/* Action Buttons: [ View Details ] and [ Add to Cart ] */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/products/${_id}`}
              className="py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold border border-[#E8E2D8] dark:border-white/10 hover:border-[#16806A] dark:hover:border-emerald-400 text-[#1F2E29] dark:text-slate-200 hover:text-[#16806A] dark:hover:text-emerald-400 bg-white dark:bg-slate-800/80 active:scale-[0.98] transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer text-center"
            >
              <span>Details</span>
            </Link>

            <button
              type="button"
              id={`add-to-cart-${_id}`}
              onClick={handleAddToCartClick}
              disabled={addingToCart || stock <= 0}
              className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1 active:scale-[0.98] cursor-pointer shadow-xs ${
                stock <= 0
                  ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500 border border-gray-200 dark:border-white/5 cursor-not-allowed text-[11px]'
                  : isInCart
                  ? 'bg-[#E3F6EF] dark:bg-emerald-950/60 text-[#16806A] dark:text-emerald-300 border border-[#16806A]/30 dark:border-emerald-500/30 hover:bg-[#16806A] dark:hover:bg-emerald-600 hover:text-white'
                  : 'bg-[#16806A] hover:bg-[#126A57] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-[#16806A]/20'
              } ${addingToCart ? 'opacity-75 cursor-wait' : ''}`}
            >
              {addingToCart ? (
                <span>Adding...</span>
              ) : stock <= 0 ? (
                <span>Unavailable</span>
              ) : isInCart ? (
                <span>Add More</span>
              ) : (
                <span>Add to Cart</span>
              )}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductCard;
