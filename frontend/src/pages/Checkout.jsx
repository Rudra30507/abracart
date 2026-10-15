import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createPaymentOrder, verifyPayment } from '../services/api';

const Checkout = ({ user }) => {
  const navigate = useNavigate();
  const { cart, totalUnits, subtotal, clearCart, loading: cartLoading } = useCart();

  // Shipping form state
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Sync user details if available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName || '',
        phone: prev.phone || user.phone || ''
      }));
    }
  }, [user]);

  // Load Razorpay Checkout Script helper
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Form field change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-level error on edit
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  // Client-side Shipping Form Validation
  const validateForm = () => {
    const errors = {};

    if (!formData.fullName || !formData.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }

    if (!formData.phone || !formData.phone.trim()) {
      errors.phone = 'Phone Number is required';
    } else {
      const cleanPhone = formData.phone.trim().replace(/\D/g, '');
      if (cleanPhone.length !== 10) {
        errors.phone = 'Please enter a valid 10-digit mobile number';
      }
    }

    if (!formData.addressLine1 || !formData.addressLine1.trim()) {
      errors.addressLine1 = 'Delivery address is required';
    }

    if (!formData.city || !formData.city.trim()) {
      errors.city = 'City is required';
    }

    if (!formData.state || !formData.state.trim()) {
      errors.state = 'State is required';
    }

    if (!formData.pincode || !formData.pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else {
      const cleanPin = formData.pincode.trim();
      if (!/^\d{6}$/.test(cleanPin)) {
        errors.pincode = 'Pincode must contain exactly 6 digits';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Place Order & Trigger Razorpay Checkout
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Client-side validation check
    if (!validateForm()) {
      return;
    }

    if (!cart || cart.length === 0) {
      setErrorMessage('Your cart is empty. Please add items before placing an order.');
      return;
    }

    setSubmitting(true);

    try {
      // 2. Call backend to validate stock, recalculate price & create pending order
      const orderResponse = await createPaymentOrder({
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        addressLine1: formData.addressLine1.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.pincode.trim()
      });

      if (!orderResponse || !orderResponse.success) {
        throw new Error(orderResponse?.message || 'Could not initiate checkout');
      }

      const { shopKartOrderId, razorpayOrderId, amount, currency, key } = orderResponse;

      // 3. Official Razorpay Checkout Flow (Direct Razorpay Modal)
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded || !window.Razorpay) {
        throw new Error('Could not load Razorpay payment gateway script. Please check your internet connection.');
      }

      const cleanContact = (formData.phone || '').replace(/\D/g, '');
      const prefillData = {};
      if (formData.fullName?.trim()) prefillData.name = formData.fullName.trim();
      if (cleanContact.length === 10) prefillData.contact = cleanContact;
      if (user?.email && user.email.includes('@')) prefillData.email = user.email.trim();

      const razorpayOptions = {
        key: key,
        amount: Number(amount),
        currency: currency || 'INR',
        name: 'ShopKart',
        description: `Order #${shopKartOrderId.slice(-6).toUpperCase()}`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            // Verify signature on backend before clearing cart
            const verifyRes = await verifyPayment({
              shopKartOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes && verifyRes.success) {
              // Clear global cart state in frontend
              clearCart();
              // Navigate to order confirmation
              navigate(`/order-success/${shopKartOrderId}`);
            } else {
              setErrorMessage(verifyRes?.message || 'Payment signature verification failed.');
              setSubmitting(false);
            }
          } catch (verErr) {
            console.error('Verification error:', verErr);
            setErrorMessage(verErr.response?.data?.message || verErr.message || 'Payment verification failed.');
            setSubmitting(false);
          }
        },
        prefill: prefillData,
        theme: {
          color: '#16806A'
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
            setErrorMessage('Payment window was closed. Your cart has not been cleared.');
          }
        }
      };

      const paymentInstance = new window.Razorpay(razorpayOptions);

      paymentInstance.on('payment.failed', function (failRes) {
        console.error('Razorpay Payment Failed:', failRes.error);
        setErrorMessage(
          `Payment failed: ${failRes.error?.description || 'Transaction unsuccessful'}. Your cart items have been saved.`
        );
        setSubmitting(false);
      });

      paymentInstance.open();

    } catch (err) {
      console.error('Checkout error:', err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to initialize payment order';
      setErrorMessage(errMsg);
      setSubmitting(false);
    }
  };

  // Auth Guard
  if (!user) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] dark:bg-[#0B0F14] text-slate-800 dark:text-slate-100 pt-24 pb-16 px-4 sm:px-8">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-white/90 dark:bg-[#141C26]/90 backdrop-blur-md border border-[#E8E2D8] dark:border-white/10 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center text-3xl border border-amber-200 dark:border-amber-800/40">
            🔒
          </div>
          <h2 className="text-2xl font-black text-[#1F2E29] dark:text-white">Login Required</h2>
          <p className="text-xs sm:text-sm text-[#1F2E29]/70 dark:text-slate-300 leading-relaxed">
            Please log in to your account to complete checkout and place an order.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-[#16806A] hover:bg-[#126A57] dark:bg-emerald-600 dark:hover:bg-emerald-500 active:scale-95 transition-all shadow-md cursor-pointer text-sm"
            >
              <span>Log In to Proceed</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart guard
  if (!cartLoading && (!cart || cart.length === 0)) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] dark:bg-[#0B0F14] text-slate-800 dark:text-slate-100 pt-24 pb-16 px-4 sm:px-8">
        <div className="max-w-md mx-auto p-10 rounded-3xl bg-white/90 dark:bg-[#141C26]/90 backdrop-blur-md border border-[#E8E2D8] dark:border-white/10 text-center space-y-4 shadow-xl">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#E4F3ED] dark:bg-emerald-950/50 text-[#16806A] dark:text-emerald-400 flex items-center justify-center text-4xl">
            🛒
          </div>
          <h2 className="text-2xl font-black text-[#1F2E29] dark:text-white">Your cart is empty</h2>
          <p className="text-xs sm:text-sm text-[#1F2E29]/70 dark:text-slate-300 leading-relaxed">
            There are no items in your cart to checkout. Please explore products and add items to your cart first.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-white bg-[#16806A] hover:bg-[#126A57] dark:bg-emerald-600 dark:hover:bg-emerald-500 active:scale-95 transition-all shadow-lg shadow-[#16806A]/20 cursor-pointer text-sm"
            >
              <span>Explore Products</span>
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
    <div className="min-h-screen bg-[#F9F8F6] dark:bg-[#0B0F14] text-slate-800 dark:text-slate-100 pt-20 sm:pt-24 pb-16 px-4 sm:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E2D8] dark:border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#16806A] dark:text-emerald-400 mb-1">
              <Link to="/cart" className="hover:underline">Cart</Link>
              <span>›</span>
              <span className="text-[#1F2E29]/60 dark:text-slate-400">Checkout</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1F2E29] dark:text-white tracking-tight">
              Checkout & Payment
            </h1>
          </div>
          <Link
            to="/cart"
            className="text-xs sm:text-sm font-bold text-[#16806A] dark:text-emerald-400 hover:text-[#126A57] dark:hover:text-emerald-300 hover:underline inline-flex items-center gap-1.5"
          >
            <span>← Back to Cart</span>
          </Link>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-sm flex items-start gap-3 shadow-xs">
            <span className="text-xl">⚠️</span>
            <div className="flex-1">
              <span className="font-bold block">Checkout Notice</span>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-300 font-bold text-lg leading-none cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Shipping Address Form */}
          <div className="lg:col-span-7 bg-white dark:bg-[#141C26] rounded-3xl border border-[#E8E2D8] dark:border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#E8E2D8] dark:border-white/10">
              <div className="w-9 h-9 rounded-xl bg-[#E3F6EF] dark:bg-emerald-950/60 text-[#16806A] dark:text-emerald-400 border border-[#16806A]/20 dark:border-emerald-500/30 flex items-center justify-center font-black text-sm">
                1
              </div>
              <div>
                <h2 className="text-lg font-black text-[#1F2E29] dark:text-white">Shipping Details</h2>
                <p className="text-xs text-[#1F2E29]/60 dark:text-slate-400">Where should we deliver your order?</p>
              </div>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4" id="shipping-form">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#1F2E29] dark:text-slate-200 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  id="shipping-fullname"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Aarav Sharma"
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all outline-hidden ${
                    formErrors.fullName
                      ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/30 focus:border-rose-500 ring-2 ring-rose-200'
                      : 'border-[#E8E2D8] dark:border-white/10 bg-[#F9F8F6]/50 dark:bg-[#0E151E] text-slate-800 dark:text-white focus:border-[#16806A] dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-[#0E151E] focus:ring-2 focus:ring-[#16806A]/20'
                  }`}
                />
                {formErrors.fullName && (
                  <p className="text-rose-500 text-xs mt-1 font-semibold">{formErrors.fullName}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-[#1F2E29] dark:text-slate-200 mb-1.5">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-xs font-bold text-[#1F2E29]/50 dark:text-slate-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    id="shipping-phone"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border text-sm font-medium transition-all outline-hidden ${
                      formErrors.phone
                        ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/30 focus:border-rose-500 ring-2 ring-rose-200'
                        : 'border-[#E8E2D8] dark:border-white/10 bg-[#F9F8F6]/50 dark:bg-[#0E151E] text-slate-800 dark:text-white focus:border-[#16806A] dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-[#0E151E] focus:ring-2 focus:ring-[#16806A]/20'
                    }`}
                  />
                </div>
                {formErrors.phone && (
                  <p className="text-rose-500 text-xs mt-1 font-semibold">{formErrors.phone}</p>
                )}
              </div>

              {/* Address Line 1 */}
              <div>
                <label className="block text-xs font-bold text-[#1F2E29] dark:text-slate-200 mb-1.5">
                  Address Line / House & Street <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  id="shipping-address"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  placeholder="e.g. 22 MG Road, Koramangala"
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all outline-hidden ${
                    formErrors.addressLine1
                      ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/30 focus:border-rose-500 ring-2 ring-rose-200'
                      : 'border-[#E8E2D8] dark:border-white/10 bg-[#F9F8F6]/50 dark:bg-[#0E151E] text-slate-800 dark:text-white focus:border-[#16806A] dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-[#0E151E] focus:ring-2 focus:ring-[#16806A]/20'
                  }`}
                />
                {formErrors.addressLine1 && (
                  <p className="text-rose-500 text-xs mt-1 font-semibold">{formErrors.addressLine1}</p>
                )}
              </div>

              {/* City & State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1F2E29] dark:text-slate-200 mb-1.5">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="shipping-city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Bengaluru"
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all outline-hidden ${
                      formErrors.city
                        ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/30 focus:border-rose-500 ring-2 ring-rose-200'
                        : 'border-[#E8E2D8] dark:border-white/10 bg-[#F9F8F6]/50 dark:bg-[#0E151E] text-slate-800 dark:text-white focus:border-[#16806A] dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-[#0E151E] focus:ring-2 focus:ring-[#16806A]/20'
                    }`}
                  />
                  {formErrors.city && (
                    <p className="text-rose-500 text-xs mt-1 font-semibold">{formErrors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1F2E29] dark:text-slate-200 mb-1.5">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    id="shipping-state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="e.g. Karnataka"
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all outline-hidden ${
                      formErrors.state
                        ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/30 focus:border-rose-500 ring-2 ring-rose-200'
                        : 'border-[#E8E2D8] dark:border-white/10 bg-[#F9F8F6]/50 dark:bg-[#0E151E] text-slate-800 dark:text-white focus:border-[#16806A] dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-[#0E151E] focus:ring-2 focus:ring-[#16806A]/20'
                    }`}
                  />
                  {formErrors.state && (
                    <p className="text-rose-500 text-xs mt-1 font-semibold">{formErrors.state}</p>
                  )}
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-xs font-bold text-[#1F2E29] dark:text-slate-200 mb-1.5">
                  Pincode <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  id="shipping-pincode"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="e.g. 560001"
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all outline-hidden ${
                    formErrors.pincode
                      ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/30 focus:border-rose-500 ring-2 ring-rose-200'
                      : 'border-[#E8E2D8] dark:border-white/10 bg-[#F9F8F6]/50 dark:bg-[#0E151E] text-slate-800 dark:text-white focus:border-[#16806A] dark:focus:border-emerald-400 focus:bg-white dark:focus:bg-[#0E151E] focus:ring-2 focus:ring-[#16806A]/20'
                  }`}
                />
                {formErrors.pincode && (
                  <p className="text-rose-500 text-xs mt-1 font-semibold">{formErrors.pincode}</p>
                )}
              </div>

              <div className="pt-2 text-xs text-[#1F2E29]/60 dark:text-slate-400 flex items-center gap-2">
                <span>🔒</span>
                <span>Your address information is safe and securely encrypted.</span>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary & Payment Button */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#141C26] border border-[#E8E2D8] dark:border-white/10 shadow-xl space-y-5 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8] dark:border-white/10">
                <h2 className="text-lg font-black text-[#1F2E29] dark:text-white">Order Summary</h2>
                <span className="text-xs font-bold text-[#16806A] dark:text-emerald-400 bg-[#E3F6EF] dark:bg-emerald-950/60 border border-[#16806A]/20 dark:border-emerald-500/30 px-2.5 py-1 rounded-full">
                  {totalUnits} {totalUnits === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Items Snapshot Preview */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => {
                  const prod = item.product || {};
                  return (
                    <div
                      key={prod._id || item._id}
                      className="flex items-center justify-between gap-3 text-xs py-2 border-b border-gray-100 dark:border-white/5 last:border-0"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {prod.image && (
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-white/10 shrink-0"
                          />
                        )}
                        <div className="truncate">
                          <p className="font-bold text-[#1F2E29] dark:text-white truncate">{prod.name}</p>
                          <p className="text-[#1F2E29]/60 dark:text-slate-400 text-[11px]">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#1F2E29] dark:text-white shrink-0">
                        ₹{((Number(prod.price) || 0) * (Number(item.quantity) || 1)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Cost Calculations */}
              <div className="space-y-2.5 text-xs sm:text-sm pt-2 border-t border-[#E8E2D8] dark:border-white/10">
                <div className="flex justify-between text-[#1F2E29]/70 dark:text-slate-300">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#1F2E29] dark:text-white">
                    ₹{Number(subtotal).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between text-[#1F2E29]/70 dark:text-slate-300">
                  <span>Shipping & Handling</span>
                  <span className="font-bold text-[#16806A] dark:text-emerald-400">FREE</span>
                </div>

                <div className="pt-3 border-t border-[#E8E2D8] dark:border-white/10 flex justify-between items-baseline">
                  <div>
                    <span className="text-base font-extrabold text-[#1F2E29] dark:text-white block">Total Amount</span>
                    <span className="text-[11px] text-[#1F2E29]/50 dark:text-slate-400">Includes all applicable taxes</span>
                  </div>
                  <span className="text-2xl font-black text-[#16806A] dark:text-emerald-400" id="checkout-total">
                    ₹{Number(subtotal).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Place Order / Razorpay Checkout Trigger */}
              <div className="pt-2">
                <button
                  type="button"
                  id="place-order-btn"
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  className={`w-full py-4 px-6 rounded-2xl text-white font-bold transition-all shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer ${
                    submitting
                      ? 'bg-gray-400 dark:bg-slate-700 cursor-not-allowed'
                      : 'bg-[#16806A] hover:bg-[#126A57] dark:bg-emerald-600 dark:hover:bg-emerald-500 active:scale-[0.99] shadow-[#16806A]/20 dark:shadow-emerald-950/40'
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay with Razorpay</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>

              {/* Security Badge */}
              <div className="text-center pt-2">
                <span className="text-[11px] text-[#1F2E29]/60 dark:text-slate-400 flex items-center justify-center gap-1.5">
                  <span>💳</span>
                  <span>Razorpay Test Mode • 100% Secure Checkout</span>
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Checkout;
