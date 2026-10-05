import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { addToWishlist, removeFromWishlist } from '../services/api';
import { useCart } from '../context/CartContext';

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

const ProductCard = ({ product, initialWishlisted = false, onWishlistChange }) => {
  const { _id, name, price, category, image, stock } = product;

  // Global Cart State (Lab 05 Task 7)
  const { cart, addToCart: addProductToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMsg, setCartMsg] = useState('');

  const cartItem = cart?.find(
    (item) => (item.product?._id || item.product) === _id
  );
  const isInCart = Boolean(cartItem);

  // Task 5: Wishlist Interaction States
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent duplicate clicks while saving
    if (saving) return;

    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isWishlisted) {
        await removeFromWishlist(_id);
        setIsWishlisted(false);
        setSuccessMsg('Removed from Wishlist');
      } else {
        await addToWishlist(_id);
        setIsWishlisted(true);
        setSuccessMsg('♥ Added to Wishlist');
      }

      if (onWishlistChange) {
        onWishlistChange(_id, !isWishlisted);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setIsWishlisted(true);
        setSuccessMsg('♥ Already in Wishlist');
      } else if (err.response?.status === 401) {
        setErrorMsg('Please login to save products');
      } else {
        setErrorMsg('Unable to save product. Please try again.');
      }
    } finally {
      setSaving(false);
      setTimeout(() => {
        setSuccessMsg('');
        setErrorMsg('');
      }, 3000);
    }
  };

  // Task 7: Add to Cart button click handler
  const handleAddToCartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (addingToCart || stock <= 0) return;

    if (cartItem && stock !== undefined && cartItem.quantity >= stock) {
      setCartMsg(`Max stock reached (${stock})`);
      setTimeout(() => setCartMsg(''), 2500);
      return;
    }

    setAddingToCart(true);
    setCartMsg('');
    const res = await addProductToCart(_id);
    setAddingToCart(false);

    if (res.success) {
      setCartMsg(isInCart ? 'Added another unit!' : 'Added to cart!');
    } else {
      if (res.status === 401) {
        setCartMsg('Please login to add items to cart');
      } else {
        setCartMsg(res.message);
      }
    }
    setTimeout(() => setCartMsg(''), 2500);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[#E8E2D8] hover:border-[#16806A]/40 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group overflow-hidden relative">
      
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-[#F7F5F0] overflow-hidden flex items-center justify-center">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
          }}
        />
        
        {/* Category Pill with Icon */}
        <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#16806A] bg-white/95 backdrop-blur-md rounded-lg border border-[#16806A]/20 shadow-xs flex items-center gap-1 z-10">
          <span>{getCategoryIcon(category)}</span>
          <span>{category}</span>
        </span>

        {/* Quick Heart Icon Button on Image (Top Right) */}
        <button
          onClick={handleWishlistToggle}
          disabled={saving}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          aria-label="Wishlist toggle"
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-xs cursor-pointer active:scale-90 ${
            isWishlisted
              ? 'bg-rose-500 text-white shadow-rose-200'
              : 'bg-white/90 text-[#1F2E29]/70 hover:text-rose-500 hover:bg-white'
          } ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
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
            className="text-sm sm:text-base font-bold text-[#1F2E29] line-clamp-2 group-hover:text-[#16806A] transition-colors leading-snug" 
            title={name}
          >
            {name}
          </h3>
          <span className="inline-block text-[11px] font-medium text-[#1F2E29]/60 mt-1">
            {category} Collection
          </span>
        </div>

        <div className="pt-3 border-t border-[#E8E2D8]/70">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#1F2E29]/50 block">Price</span>
              <span className="text-xl font-extrabold text-[#1F2E29]">
                ₹{Number(price).toLocaleString('en-IN')}
              </span>
            </div>
            
            {/* Amazon-style Stock Status */}
            {stock > 5 ? (
              <span className="text-[11px] font-bold text-[#007600] bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                In Stock
              </span>
            ) : stock > 0 ? (
              <span className="text-[11px] font-bold text-[#B12704] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                Only {stock} left in stock - order soon
              </span>
            ) : (
              <span className="text-[11px] font-bold text-[#B12704] bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                Currently unavailable
              </span>
            )}
          </div>

          {/* Action Feedback Messages */}
          {cartMsg && (
            <div className={`mb-2 p-2 text-[11px] font-medium rounded-lg animate-fadeIn text-center ${
              cartMsg.includes('Added') || cartMsg.includes('✓')
                ? 'text-emerald-800 bg-emerald-50 border border-emerald-200'
                : 'text-amber-800 bg-amber-50 border border-amber-200'
            }`}>
              {cartMsg}
            </div>
          )}
          {errorMsg && (
            <div className="mb-2 p-2 text-[11px] font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg animate-fadeIn text-center">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-2 p-2 text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg animate-fadeIn text-center">
              {successMsg}
            </div>
          )}

          {/* Action Buttons: [ View Details ] and [ Add to Cart ] */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/products/${_id}`}
              className="py-2.5 px-2 rounded-xl text-xs sm:text-sm font-bold border border-[#E8E2D8] hover:border-[#16806A] text-[#1F2E29] hover:text-[#16806A] bg-white active:scale-[0.98] transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer text-center"
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
                  ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed text-[11px]'
                  : isInCart
                  ? 'bg-[#E3F6EF] text-[#16806A] border border-[#16806A]/30 hover:bg-[#16806A] hover:text-white'
                  : 'bg-[#16806A] hover:bg-[#126A57] text-white'
              } ${addingToCart ? 'opacity-75 cursor-wait' : ''}`}
            >
              {addingToCart ? (
                <span>Adding...</span>
              ) : stock <= 0 ? (
                <span>Unavailable</span>
              ) : isInCart ? (
                <span>Add Another</span>
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
