import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

const Cart = ({ user }) => {
  const { cart, loading, error, totalUnits, subtotal, fetchCart } = useCart();

  // 1. Auth Guard State: If not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] pt-24 pb-16 px-4 sm:px-8">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#E8E2D8] text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-3xl border border-amber-200">
            🔒
          </div>
          <h2 className="text-2xl font-black text-[#1F2E29]">
            Login Required
          </h2>
          <p className="text-xs sm:text-sm text-[#1F2E29]/70 leading-relaxed">
            Please log in to your abracart account to view your cart and proceed to checkout.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-[#16806A] hover:bg-[#126A57] active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <span>Log In to View Cart</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Loading State (Task 17)
  if (loading && cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] pt-24 pb-16 px-4 sm:px-8 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#E3F6EF] border-t-[#16806A] animate-spin"></div>
        <h2 className="text-lg font-bold text-[#16806A] animate-pulse">
          Loading your cart...
        </h2>
        <p className="text-xs text-[#1F2E29]/60">
          Retrieving your saved bag items from server
        </p>
      </div>
    );
  }

  // 3. Error State (Task 17)
  if (error && cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] pt-24 pb-16 px-4 sm:px-8">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-rose-50 border border-rose-200 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-2xl">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-rose-900">
            Unable to load your cart.
          </h2>
          <p className="text-xs sm:text-sm text-rose-700">
            {error || 'Something went wrong while fetching cart data.'}
          </p>
          <button
            onClick={fetchCart}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-[#16806A] hover:bg-[#126A57] active:scale-95 transition-all shadow-xs cursor-pointer text-xs sm:text-sm"
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

  // 4. Empty State (Task 17)
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] pt-24 pb-16 px-4 sm:px-8">
        <div className="max-w-md mx-auto p-10 rounded-3xl bg-white/90 backdrop-blur-md border border-[#E8E2D8] text-center space-y-4 shadow-sm">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#E4F3ED] text-[#16806A] flex items-center justify-center text-4xl">
            🛒
          </div>
          <h2 className="text-2xl font-black text-[#1F2E29]">
            Your cart is empty 🛒
          </h2>
          <p className="text-xs sm:text-sm text-[#1F2E29]/70 leading-relaxed">
            Looks like you haven't added anything yet. Discover our latest electronics, fashion, and home essentials.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              id="browse-products-btn"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-white bg-[#16806A] hover:bg-[#126A57] active:scale-95 transition-all shadow-md cursor-pointer text-sm"
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

  // 5. Normal Populated Cart with Order Summary
  return (
    <div className="min-h-screen bg-[#F9F8F6] pt-20 sm:pt-24 pb-16 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E2D8]">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-[#1F2E29] tracking-tight">
                My Cart
              </h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-black bg-[#E3F6EF] text-[#16806A] border border-[#16806A]/20">
                {totalUnits} {totalUnits === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#1F2E29]/60 mt-1">
              Review your items and proceed to checkout
            </p>
          </div>

          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-[#16806A] hover:text-[#126A57] hover:underline inline-flex items-center gap-1.5"
          >
            <span>← Continue Shopping</span>
          </Link>
        </div>

        {/* Cart Layout: Two Columns (Items List + Order Summary) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Cart Items List (Tasks 8, 13, 14) */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <CartItem
                key={item.product?._id || item._id}
                item={item}
              />
            ))}
          </div>

          {/* Right Column: Order Summary (Task 13 & 15 Derived Totals) */}
          <div className="lg:col-span-4">
            <div className="p-6 rounded-3xl bg-white border border-[#E8E2D8] shadow-xs space-y-5 sticky top-24">
              <h2 className="text-lg font-black text-[#1F2E29] border-b border-[#E8E2D8] pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#1F2E29]/70">
                  <span>Total Items</span>
                  <span className="font-bold text-[#1F2E29]">{totalUnits} units</span>
                </div>

                <div className="flex justify-between text-[#1F2E29]/70">
                  <span>Unique Products</span>
                  <span className="font-bold text-[#1F2E29]">{cart.length}</span>
                </div>

                <div className="flex justify-between text-[#1F2E29]/70">
                  <span>Delivery Charges</span>
                  <span className="font-bold text-[#16806A]">FREE</span>
                </div>

                <div className="pt-3 border-t border-[#E8E2D8] flex justify-between items-baseline">
                  <div>
                    <span className="text-base font-extrabold text-[#1F2E29] block">Subtotal</span>
                    <span className="text-[11px] text-[#1F2E29]/50">Inclusive of all taxes</span>
                  </div>
                  <span className="text-2xl font-black text-[#16806A]" id="cart-subtotal">
                    ₹{Number(subtotal).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout Action (Task 13 / Prep for Lab 06) */}
              <div className="pt-2">
                <button
                  type="button"
                  id="checkout-btn"
                  onClick={() => alert(`Order Subtotal: ₹${Number(subtotal).toLocaleString('en-IN')}. Checkout and Order creation flow is coming in Lab-06!`)}
                  className="w-full py-4 px-6 rounded-2xl text-white font-bold bg-[#16806A] hover:bg-[#126A57] active:scale-[0.99] transition-all shadow-md shadow-[#16806A]/20 flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
                >
                  <span>Proceed to Checkout</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>

              <div className="text-center">
                <span className="text-[11px] text-[#1F2E29]/60 flex items-center justify-center gap-1.5">
                  <span>🛡️</span>
                  <span>100% Secure Checkout Guarantee</span>
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Cart;
