import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, updateOrderStatus } from '../services/api';

const statusColors = {
  PENDING_PAYMENT: 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700/50',
  PLACED: 'bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700/50',
  CONFIRMED: 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700/50',
  SHIPPED: 'bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700/50',
  DELIVERED: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/50',
  FAILED: 'bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700/50'
};

const nextStatusMap = {
  PLACED: 'CONFIRMED',
  CONFIRMED: 'SHIPPED',
  SHIPPED: 'DELIVERED'
};

const Orders = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrdersList = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrders();
      if (data && data.success) {
        setOrders(data.orders || []);
      } else {
        setError('Unable to load orders list.');
      }
    } catch (err) {
      console.error('Fetch orders error:', err);
      if (err.response?.status !== 401) {
        setError(err.response?.data?.message || 'Error connecting to server. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrdersList();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Advance status handler
  const handleAdvanceStatus = async (orderId, currentStatus) => {
    const nextStatus = nextStatusMap[currentStatus];
    if (!nextStatus) return;

    try {
      setUpdatingId(orderId);
      const res = await updateOrderStatus(orderId, nextStatus);
      if (res && res.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: nextStatus } : o))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Could not update status: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingId(null);
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
            Please log in to your account to view your past orders and receipts.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-[#16806A] hover:bg-[#126A57] dark:bg-emerald-600 dark:hover:bg-emerald-500 active:scale-95 transition-all shadow-md text-xs sm:text-sm cursor-pointer"
            >
              <span>Log In</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] dark:bg-[#0B0F14] pt-24 pb-16 px-4 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#E3F6EF] dark:border-emerald-950 border-t-[#16806A] dark:border-t-emerald-400 animate-spin"></div>
        <h2 className="text-lg font-bold text-[#16806A] dark:text-emerald-400 animate-pulse">Loading your orders...</h2>
        <p className="text-xs text-[#1F2E29]/60 dark:text-slate-400">Fetching your purchase history</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] dark:bg-[#0B0F14] pt-24 pb-16 px-4">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto text-2xl">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-rose-900 dark:text-rose-200">Failed to load orders</h2>
          <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-300">{error}</p>
          <button
            onClick={fetchOrdersList}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-[#16806A] hover:bg-[#126A57] dark:bg-emerald-600 dark:hover:bg-emerald-500 active:scale-95 transition-all text-xs sm:text-sm cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty State
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] dark:bg-[#0B0F14] text-slate-800 dark:text-slate-100 pt-24 pb-16 px-4 sm:px-8">
        <div className="max-w-md mx-auto p-10 rounded-3xl bg-white/90 dark:bg-[#141C26]/90 backdrop-blur-md border border-[#E8E2D8] dark:border-white/10 text-center space-y-4 shadow-xl">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#E4F3ED] dark:bg-emerald-950/50 text-[#16806A] dark:text-emerald-400 flex items-center justify-center text-4xl">
            📦
          </div>
          <h2 className="text-2xl font-black text-[#1F2E29] dark:text-white">No orders placed yet</h2>
          <p className="text-xs sm:text-sm text-[#1F2E29]/70 dark:text-slate-300 leading-relaxed">
            You have not placed any orders yet. Discover our latest collection and start shopping today!
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              id="start-shopping-btn"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-white bg-[#16806A] hover:bg-[#126A57] dark:bg-emerald-600 dark:hover:bg-emerald-500 active:scale-95 transition-all shadow-lg shadow-[#16806A]/20 text-sm cursor-pointer"
            >
              <span>Start Shopping</span>
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
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E2D8] dark:border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-[#1F2E29] dark:text-white tracking-tight">
                My Orders
              </h1>
              <span className="px-3 py-0.5 rounded-full text-xs font-black bg-[#E3F6EF] dark:bg-emerald-950/60 text-[#16806A] dark:text-emerald-400 border border-[#16806A]/20 dark:border-emerald-500/30">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#1F2E29]/60 dark:text-slate-400 mt-1">
              Review your purchase history and tracking details
            </p>
          </div>

          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-[#16806A] dark:text-emerald-400 hover:text-[#126A57] dark:hover:text-emerald-300 hover:underline inline-flex items-center gap-1.5"
          >
            <span>+ Continue Shopping</span>
          </Link>
        </div>

        {/* Orders List */}
        <div className="space-y-6" id="orders-list">
          {orders.map((order) => {
            const statusClass = statusColors[order.status] || 'bg-gray-100 text-gray-800 border-gray-300';
            const nextPossibleStatus = nextStatusMap[order.status];

            return (
              <div
                key={order._id}
                className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#141C26] border border-[#E8E2D8] dark:border-white/10 shadow-xl space-y-5 transition-all hover:shadow-2xl"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-white/10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#1F2E29]/60 dark:text-slate-400 font-medium">Order</span>
                      <span className="text-sm font-mono font-black text-[#1F2E29] dark:text-white">
                        #{order._id}
                      </span>
                    </div>
                    <p className="text-xs text-[#1F2E29]/60 dark:text-slate-400">
                      Placed on{' '}
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full border uppercase tracking-wider ${statusClass}`}
                    >
                      {order.status}
                    </span>

                    {/* Progression Button */}
                    {nextPossibleStatus && (
                      <button
                        onClick={() => handleAdvanceStatus(order._id, order.status)}
                        disabled={updatingId === order._id}
                        title={`Click to advance order status to ${nextPossibleStatus}`}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/40 transition-colors cursor-pointer"
                      >
                        {updatingId === order._id ? 'Updating...' : `Advance → ${nextPossibleStatus}`}
                      </button>
                    )}
                  </div>
                </div>

                {/* Items Summary */}
                <div className="space-y-3">
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover border border-gray-200 dark:border-white/10 shrink-0"
                          />
                        )}
                        <div className="truncate">
                          <p className="font-bold text-[#1F2E29] dark:text-white truncate">{item.name}</p>
                          <p className="text-xs text-[#1F2E29]/60 dark:text-slate-400">
                            ₹{Number(item.price).toLocaleString('en-IN')} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-[#1F2E29] dark:text-white shrink-0">
                        ₹{(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Card Footer: Delivery + Total + Actions */}
                <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-[#1F2E29]/70 dark:text-slate-300">
                    <span className="font-semibold">Ship to: </span>
                    <span>{order.shippingAddress?.fullName}, {order.shippingAddress?.city}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[11px] text-[#1F2E29]/60 dark:text-slate-400 block">Total</span>
                      <span className="text-lg font-black text-[#16806A] dark:text-emerald-400">
                        ₹{Number(order.totalAmount).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <Link
                      to={`/order-success/${order._id}`}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-[#E3F6EF] dark:bg-emerald-950/60 text-[#16806A] dark:text-emerald-400 hover:bg-[#16806A] dark:hover:bg-emerald-600 hover:text-white dark:hover:text-white transition-all border border-[#16806A]/20 dark:border-emerald-500/30"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Orders;
