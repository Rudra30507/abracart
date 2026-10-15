import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProfile } from '../services/api';

const Home = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user || null);
  const [loading, setLoading] = useState(!user);
  const [error, setError] = useState('');

  // Fetch logged in user via GET /customers/me
  useEffect(() => {
    let isMounted = true;

    const fetchCustomerProfile = async () => {
      try {
        setLoading(true);
        // api.get('/customers/me') with withCredentials: true
        const data = await getProfile();

        if (isMounted) {
          setProfile(data);
          if (setUser) setUser(data);
        }
      } catch (err) {
        // If not authenticated or token expired, redirect to /login
        if (isMounted) {
          setError('Unauthorized. Redirecting to login...');
          setTimeout(() => {
            navigate('/login');
          }, 800);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCustomerProfile();

    return () => {
      isMounted = false;
    };
  }, [navigate, setUser]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-65px)] flex flex-col items-center justify-center p-4 bg-[#F7FCFA] dark:bg-[#0B0F14]">
        <div className="w-12 h-12 rounded-full border-4 border-[#E3F6EF] dark:border-emerald-950 border-t-[#16806A] dark:border-t-emerald-400 animate-spin mb-4"></div>
        <p className="text-sm font-semibold text-[#16806A] dark:text-emerald-400">Loading your customer dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-65px)] flex flex-col items-center justify-center p-4 bg-[#F7FCFA] dark:bg-[#0B0F14]">
        <div className="p-4 bg-red-50 dark:bg-rose-950/40 text-red-700 dark:text-rose-300 rounded-2xl border border-red-200 dark:border-rose-900/60 text-sm font-semibold">
          {error}
        </div>
      </div>
    );
  }

  const categories = [
    { title: 'Electronics & Gadgets', items: 'Keyboards, Audio & Smartwatches', icon: '💻', color: 'bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/40' },
    { title: 'Home & Kitchen', items: 'Artisanal Coffee, Oils & Candles', icon: '🏠', color: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40' },
    { title: 'Fashion & Apparel', items: 'Denim, Bags & Essentials', icon: '👗', color: 'bg-purple-50 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/40' },
    { title: 'Books & Learning', items: 'Programming & Personal Growth', icon: '📚', color: 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/40' },
  ];

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#F7FCFA] dark:bg-[#0B0F14] text-slate-800 dark:text-slate-100 py-6 sm:py-10 px-4 sm:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Welcome Banner Card */}
        <div className="bg-gradient-to-r from-[#16806A] via-[#1A9078] to-[#126A57] text-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-[#16806A]/20 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#FFC857] text-[#1F2E29] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                <span>Verified Customer</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Welcome back, {profile?.fullName || 'Customer'}! 👋
              </h1>
              <p className="text-sm sm:text-base text-[#E3F6EF] mt-1.5 max-w-xl">
                Your authenticated session is active. Browse daily household essentials, electronics, books, and fashion.
              </p>
              <div className="mt-5">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#16806A] font-bold text-sm hover:bg-[#E3F6EF] transition-all shadow-md active:scale-95"
                >
                  <span>🛒 Browse Product Catalog</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Quick Status Pill */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shrink-0">
              <span className="text-xs text-white/80 uppercase font-semibold tracking-wider block mb-1">
                Account Status
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFC857] animate-ping"></span>
                <span className="font-bold text-white text-sm">Active & Secure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information Block */}
        <div className="bg-white dark:bg-[#141C26] rounded-3xl p-6 sm:p-8 border border-[#E3F6EF] dark:border-white/10 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#E3F6EF] dark:border-white/10 pb-4 mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1F2E29] dark:text-white">
                Customer Profile Details
              </h2>
              <p className="text-xs sm:text-sm text-[#1F2E29]/60 dark:text-slate-400">
                Fetched live from protected backend route <code className="text-[#16806A] dark:text-emerald-400 font-semibold bg-[#E3F6EF] dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">GET /customers/me</code>
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#E3F6EF] dark:bg-emerald-950/60 text-[#16806A] dark:text-emerald-400 border border-[#16806A]/20 dark:border-emerald-500/30">
              Protected
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-4 rounded-2xl bg-[#F7FCFA] dark:bg-[#0E151E] border border-[#E3F6EF] dark:border-white/10">
              <span className="text-xs font-semibold text-[#1F2E29]/60 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Full Name
              </span>
              <p className="text-base sm:text-lg font-bold text-[#1F2E29] dark:text-white">
                {profile?.fullName}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7FCFA] dark:bg-[#0E151E] border border-[#E3F6EF] dark:border-white/10">
              <span className="text-xs font-semibold text-[#1F2E29]/60 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Email Address
              </span>
              <p className="text-base sm:text-lg font-bold text-[#16806A] dark:text-emerald-400 break-all">
                {profile?.email}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7FCFA] dark:bg-[#0E151E] border border-[#E3F6EF] dark:border-white/10">
              <span className="text-xs font-semibold text-[#1F2E29]/60 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Phone Number
              </span>
              <p className="text-base sm:text-lg font-bold text-[#1F2E29] dark:text-white">
                {profile?.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Featured Categories */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-[#1F2E29] dark:text-white">
                Shop By Category
              </h3>
              <p className="text-xs sm:text-sm text-[#1F2E29]/60 dark:text-slate-400">
                Daily family essentials delivered directly to your doorstep.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                to="/products"
                className="bg-white dark:bg-[#141C26] p-5 rounded-2xl border border-[#E3F6EF] dark:border-white/10 hover:border-[#16806A]/30 dark:hover:border-emerald-500/30 hover:shadow-xl transition-all group cursor-pointer block"
              >
                <div className="text-3xl mb-3">{cat.icon}</div>
                <h4 className="font-bold text-[#1F2E29] dark:text-white group-hover:text-[#16806A] dark:group-hover:text-emerald-400 transition-colors">
                  {cat.title}
                </h4>
                <p className="text-xs text-[#1F2E29]/60 dark:text-slate-400 mt-0.5">
                  {cat.items}
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${cat.color}`}>
                    In Stock
                  </span>
                  <span className="text-xs font-semibold text-[#16806A] dark:text-emerald-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Explore &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
