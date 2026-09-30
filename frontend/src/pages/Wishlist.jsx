import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getWishlist, removeFromWishlist } from '../services/api';
import WishlistCard from '../components/WishlistCard';

const Wishlist = ({ user }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionNotice, setActionNotice] = useState('');

  const fetchWishlistData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWishlist();
      setWishlist(data.wishlist || []);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      if (err.response?.status === 401) {
        setError('unauthorized');
      } else {
        setError(err.response?.data?.message || "We couldn't load your wishlist.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistData();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setWishlist((prev) => prev.filter((item) => (item._id || item) !== productId));
      setActionNotice('Item removed from your wishlist.');
      setTimeout(() => setActionNotice(''), 3000);
    } catch (err) {
      console.error('Error removing item from wishlist:', err);
      alert('Unable to remove product from wishlist. Please try again.');
    }
  };

  if (!loading && error === 'unauthorized') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-3xl border border-amber-200">
          🔒
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1F2E29] mb-3">
          Login Required
        </h2>
        <p className="text-sm sm:text-base text-[#1F2E29]/70 max-w-md mx-auto mb-8">
          Please log in to your abracart account to view and manage your saved wishlist items.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-[#16806A] hover:bg-[#126A57] transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <span>Log In to abracart</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center py-20 space-y-4">
          <div className="inline-block w-12 h-12 border-4 border-[#16806A]/20 border-t-[#16806A] rounded-full animate-spin"></div>
          <h2 className="text-xl font-bold text-[#1F2E29]">
            Loading your wishlist...
          </h2>
          <p className="text-sm text-[#1F2E29]/60">
            Fetching your saved items from abracart
          </p>
        </div>
      </div>
    );
  }

  if (error && error !== 'unauthorized') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-3xl border border-rose-200">
          ⚠️
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1F2E29] mb-2">
          Something went wrong.
        </h2>
        <p className="text-sm sm:text-base text-[#1F2E29]/70 mb-8">
          We couldn't load your wishlist. Please check your connection and try again.
        </p>
        <button
          onClick={fetchWishlistData}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-[#16806A] hover:bg-[#126A57] transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <span>Try Again</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-5xl shadow-sm border border-rose-100 animate-pulse">
          ❤️
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#1F2E29] mb-3">
          Your wishlist is empty
        </h2>
        <p className="text-sm sm:text-base text-[#1F2E29]/70 max-w-md mx-auto mb-8 leading-relaxed">
          Save products you love and find them here later. Tap the heart on any product to save it.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-[#16806A] hover:bg-[#126A57] transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
        >
          <span>Browse Products</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {actionNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#16806A] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fadeIn">
          <span>✓</span>
          <span className="text-sm font-semibold">{actionNotice}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#E8E2D8]">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-[#1F2E29] tracking-tight">
              My Wishlist
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-600 border border-rose-200">
              ❤️ {wishlist.length} saved
            </span>
          </div>
          <p className="text-sm text-[#1F2E29]/70">
            {wishlist.length} {wishlist.length === 1 ? 'product' : 'products'} saved in your account
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#16806A] hover:text-[#126A57] hover:underline"
        >
          <span>← Continue Shopping</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => {
          if (!product || !product._id) return null;
          return (
            <WishlistCard
              key={product._id}
              product={product}
              onRemove={handleRemove}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
