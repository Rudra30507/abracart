import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import WishlistCard from '../components/WishlistCard';

const Wishlist = ({ user }) => {
  const { wishlist, loading, error, removeFromWishlist, fetchWishlist } = useWishlist();
  const toast = useToast();

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      toast.info('Item removed from your wishlist');
    } catch (err) {
      console.error('Error removing item from wishlist:', err);
      toast.error('Unable to remove product from wishlist. Please try again.');
    }
  };

  if (!loading && error === 'unauthorized') {
    return (
      <div className="min-h-screen bg-[#F9F8F6] dark:bg-[#0B0F14] text-slate-800 dark:text-slate-100 pt-24 pb-16 px-4">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-white/90 dark:bg-[#141C26]/90 backdrop-blur-md border border-[#E8E2D8] dark:border-white/10 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center text-3xl border border-amber-200 dark:border-amber-800/40">
            🔒
          </div>
          <h2 className="text-2xl font-black text-[#1F2E29] dark:text-white">
            Login Required
          </h2>
          <p className="text-xs sm:text-sm text-[#1F2E29]/70 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            Please log in to your abracart account to view and manage your saved wishlist items.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-[#16806A] hover:bg-[#126A57] dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>Log In to abracart</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] dark:bg-[#0B0F14] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20 space-y-4">
          <div className="inline-block w-12 h-12 border-4 border-[#16806A]/20 dark:border-emerald-950 border-t-[#16806A] dark:border-t-emerald-400 rounded-full animate-spin"></div>
          <h2 className="text-xl font-bold text-[#1F2E29] dark:text-white">
            Loading your wishlist...
          </h2>
          <p className="text-sm text-[#1F2E29]/60 dark:text-slate-400">
            Fetching your saved items from abracart
          </p>
        </div>
      </div>
    );
  }

  if (error && error !== 'unauthorized') {
    return (
      <div className="min-h-screen bg-[#F9F8F6] dark:bg-[#0B0F14] pt-24 pb-16 px-4">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center text-3xl">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-rose-900 dark:text-rose-200">
            Something went wrong.
          </h2>
          <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-300">
            We couldn't load your wishlist. Please check your connection and try again.
          </p>
          <button
            onClick={fetchWishlist}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-[#16806A] hover:bg-[#126A57] dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-all shadow-md active:scale-95 cursor-pointer text-xs sm:text-sm"
          >
            <span>Try Again</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] dark:bg-[#0B0F14] text-slate-800 dark:text-slate-100 pt-24 pb-16 px-4">
        <div className="max-w-md mx-auto p-10 rounded-3xl bg-white/90 dark:bg-[#141C26]/90 backdrop-blur-md border border-[#E8E2D8] dark:border-white/10 text-center space-y-4 shadow-xl">
          <div className="w-20 h-20 mx-auto rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-500 dark:text-rose-400 flex items-center justify-center text-4xl shadow-sm border border-rose-100 dark:border-rose-900/40 animate-pulse">
            ❤️
          </div>
          <h2 className="text-2xl font-black text-[#1F2E29] dark:text-white">
            Your wishlist is empty
          </h2>
          <p className="text-xs sm:text-sm text-[#1F2E29]/70 dark:text-slate-300 leading-relaxed">
            Save products you love and find them here later. Tap the heart on any product to save it.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-white bg-[#16806A] hover:bg-[#126A57] dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-all shadow-lg shadow-[#16806A]/20 cursor-pointer text-sm"
            >
              <span>Browse Products</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F8F6] dark:bg-[#0B0F14] text-slate-800 dark:text-slate-100 pt-20 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b border-[#E8E2D8] dark:border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-black text-[#1F2E29] dark:text-white tracking-tight">
                My Wishlist
              </h1>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 flex items-center gap-1">
                <span>❤️</span>
                <span>{wishlist.length} saved</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#1F2E29]/70 dark:text-slate-400">
              {wishlist.length} {wishlist.length === 1 ? 'product' : 'products'} saved in your account
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#16806A] dark:text-emerald-400 hover:text-[#126A57] dark:hover:text-emerald-300 hover:underline"
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
    </div>
  );
};

export default Wishlist;
