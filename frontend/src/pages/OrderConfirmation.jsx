import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/api';

const OrderConfirmation = ({ user }) => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getOrderById(id);
        if (isMounted) {
          if (data && data.success && data.order) {
            setOrder(data.order);
          } else {
            setError('Order details could not be retrieved.');
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Fetch order error:', err);
          setError(err.response?.data?.message || 'Failed to load order confirmation details.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] dark:bg-[#0B0F14] pt-24 pb-16 px-4 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#E3F6EF] dark:border-emerald-950 border-t-[#16806A] dark:border-t-emerald-400 animate-spin"></div>
        <p className="text-sm font-bold text-[#16806A] dark:text-emerald-400">Loading your order confirmation...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] dark:bg-[#0B0F14] pt-24 pb-16 px-4">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center text-3xl">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-rose-900 dark:text-rose-200">Order Notice</h2>
          <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-300">{error || 'Order not found'}</p>
          <div className="pt-2">
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-[#16806A] hover:bg-[#126A57] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-xs sm:text-sm shadow-md"
            >
              <span>View My Orders</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const addr = order.shippingAddress || {};

  return (
    <div className="min-h-screen bg-[#F9F8F6] dark:bg-[#0B0F14] text-slate-800 dark:text-slate-100 pt-20 sm:pt-24 pb-16 px-4 sm:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Success Card Header */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#141C26] border border-[#E8E2D8] dark:border-white/10 text-center space-y-4 shadow-xl">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#E4F3ED] dark:bg-emerald-950/60 text-[#16806A] dark:text-emerald-400 flex items-center justify-center text-4xl shadow-md border border-emerald-200/50 dark:border-emerald-800/40 animate-badgeBounce">
            ✓
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#16806A] dark:text-emerald-400 bg-[#E3F6EF] dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-[#16806A]/20 dark:border-emerald-500/30">
              Payment Verified & Placed
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1F2E29] dark:text-white mt-3">
              Order Placed Successfully!
            </h1>
            <p className="text-xs sm:text-sm text-[#1F2E29]/70 dark:text-slate-300 mt-1 max-w-md mx-auto">
              Thank you for shopping with abracart. Your order has been registered and is being prepared for shipping.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-[#F9F8F6] dark:bg-[#0E151E] px-4 py-2 rounded-xl border border-[#E8E2D8] dark:border-white/10 text-xs font-mono text-[#1F2E29]/80 dark:text-slate-300">
            <span>Order ID:</span>
            <span className="font-bold text-[#16806A] dark:text-emerald-400">{order._id}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/orders"
              id="view-orders-btn"
              className="px-6 py-3 rounded-xl font-bold text-white bg-[#16806A] hover:bg-[#126A57] dark:bg-emerald-600 dark:hover:bg-emerald-500 active:scale-95 transition-all shadow-md text-xs sm:text-sm"
            >
              View My Orders
            </Link>
            <Link
              to="/products"
              id="continue-shopping-btn"
              className="px-6 py-3 rounded-xl font-bold text-[#1F2E29] dark:text-slate-200 bg-[#F5EAD4] hover:bg-[#EADBBE] dark:bg-white/10 dark:hover:bg-white/15 active:scale-95 transition-all text-xs sm:text-sm border border-[#EADBBE] dark:border-white/10"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#141C26] border border-[#E8E2D8] dark:border-white/10 shadow-xl space-y-6">
          <h2 className="text-lg font-black text-[#1F2E29] dark:text-white border-b border-[#E8E2D8] dark:border-white/10 pb-3">
            Order Receipt & Snapshot
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#F9F8F6] dark:bg-[#0E151E] border border-[#E8E2D8] dark:border-white/10">
              <span className="text-[#1F2E29]/60 dark:text-slate-400 block mb-1">Status</span>
              <span className="font-extrabold text-[#16806A] dark:text-emerald-400 text-sm uppercase">
                {order.status || 'PLACED'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F9F8F6] dark:bg-[#0E151E] border border-[#E8E2D8] dark:border-white/10">
              <span className="text-[#1F2E29]/60 dark:text-slate-400 block mb-1">Payment Status</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                {order.paymentStatus || 'PAID'}
              </span>
              {order.razorpayPaymentId && (
                <span className="block text-[10px] text-gray-500 dark:text-slate-400 font-mono mt-0.5 truncate">
                  ID: {order.razorpayPaymentId}
                </span>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-[#F9F8F6] dark:bg-[#0E151E] border border-[#E8E2D8] dark:border-white/10">
              <span className="text-[#1F2E29]/60 dark:text-slate-400 block mb-1">Order Date</span>
              <span className="font-bold text-[#1F2E29] dark:text-white text-sm">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Shipping Address Snapshot */}
          <div className="p-4 rounded-2xl bg-[#F9F8F6] dark:bg-[#0E151E] border border-[#E8E2D8] dark:border-white/10 text-xs space-y-1">
            <span className="font-bold text-[#1F2E29] dark:text-white block mb-1">Delivery Address:</span>
            <p className="font-bold text-[#1F2E29] dark:text-white">{addr.fullName} <span className="text-gray-500 dark:text-slate-400 font-normal">({addr.phone})</span></p>
            <p className="text-[#1F2E29]/75 dark:text-slate-300">{addr.addressLine1}</p>
            <p className="text-[#1F2E29]/75 dark:text-slate-300">{addr.city}, {addr.state} - <span className="font-bold">{addr.pincode}</span></p>
          </div>

          {/* Items Purchased (Historical Snapshot) */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-[#1F2E29] dark:text-white">Items in this Order</h3>
            <div className="divide-y divide-gray-100 dark:divide-white/10">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-200 dark:border-white/10 shrink-0"
                      />
                    )}
                    <div>
                      <p className="text-sm font-bold text-[#1F2E29] dark:text-white">{item.name}</p>
                      <p className="text-xs text-[#1F2E29]/60 dark:text-slate-400">
                        ₹{Number(item.price).toLocaleString('en-IN')} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-[#1F2E29] dark:text-white">
                    ₹{(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Grand Total */}
          <div className="pt-4 border-t border-[#E8E2D8] dark:border-white/10 flex justify-between items-baseline">
            <span className="text-base font-extrabold text-[#1F2E29] dark:text-white">Total Paid</span>
            <span className="text-2xl font-black text-[#16806A] dark:text-emerald-400">
              ₹{Number(order.totalAmount).toLocaleString('en-IN')}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderConfirmation;
