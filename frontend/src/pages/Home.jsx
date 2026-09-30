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
      <div className="min-h-[calc(100vh-65px)] flex flex-col items-center justify-center p-4 bg-[#F7FCFA]">
        <div className="w-12 h-12 rounded-full border-4 border-[#E3F6EF] border-t-[#16806A] animate-spin mb-4"></div>
        <p className="text-sm font-semibold text-[#16806A]">Loading your customer dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-65px)] flex flex-col items-center justify-center p-4 bg-[#F7FCFA]">
        <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-sm font-semibold">
          {error}
        </div>
      </div>
    );
  }

  const categories = [
    { title: 'Electronics & Gadgets', items: 'Keyboards, Audio & Smartwatches', icon: '💻', color: 'bg-blue-50 text-blue-800 border-blue-200' },
    { title: 'Home & Kitchen', items: 'Artisanal Coffee, Oils & Candles', icon: '🏠', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { title: 'Fashion & Apparel', items: 'Denim, Bags & Essentials', icon: '👗', color: 'bg-purple-50 text-purple-800 border-purple-200' },
    { title: 'Books & Learning', items: 'Programming & Personal Growth', icon: '📚', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  ];

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#F7FCFA] py-6 sm:py-10 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Welcome Banner Card (Task 3 Core Requirement) */}
        <div className="bg-gradient-to-r from-[#16806A] via-[#1A9078] to-[#16806A] text-white rounded-3xl p-6 sm:p-10 shadow-lg shadow-[#16806A]/15 relative overflow-hidden">
          {/* Subtle background decoration */}
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#16806A] font-bold text-sm hover:bg-[#E3F6EF] transition-all shadow-sm active:scale-95"
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

        {/* Customer Information Block (Protected Profile Data Display) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E3F6EF] shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E3F6EF] pb-4 mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1F2E29]">
                Customer Profile Details
              </h2>
              <p className="text-xs sm:text-sm text-[#1F2E29]/60">
                Fetched live from protected backend route <code className="text-[#16806A] font-semibold bg-[#E3F6EF] px-1.5 py-0.5 rounded">GET /customers/me</code>
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#E3F6EF] text-[#16806A]">
              Protected
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-4 rounded-2xl bg-[#F7FCFA] border border-[#E3F6EF]">
              <span className="text-xs font-semibold text-[#1F2E29]/60 uppercase tracking-wider block mb-1">
                Full Name
              </span>
              <p className="text-base sm:text-lg font-bold text-[#1F2E29]">
                {profile?.fullName}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7FCFA] border border-[#E3F6EF]">
              <span className="text-xs font-semibold text-[#1F2E29]/60 uppercase tracking-wider block mb-1">
                Email Address
              </span>
              <p className="text-base sm:text-lg font-bold text-[#16806A] break-all">
                {profile?.email}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7FCFA] border border-[#E3F6EF]">
              <span className="text-xs font-semibold text-[#1F2E29]/60 uppercase tracking-wider block mb-1">
                Phone Number
              </span>
              <p className="text-base sm:text-lg font-bold text-[#1F2E29]">
                {profile?.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Featured Household Shopping Essentials */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-[#1F2E29]">
                Shop By Category
              </h3>
              <p className="text-xs sm:text-sm text-[#1F2E29]/60">
                Daily family essentials delivered directly to your doorstep.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                to="/products"
                className="bg-white p-5 rounded-2xl border border-[#E3F6EF] hover:border-[#16806A]/30 hover:shadow-md transition-all group cursor-pointer block"
              >
                <div className="text-3xl mb-3">{cat.icon}</div>
                <h4 className="font-bold text-[#1F2E29] group-hover:text-[#16806A] transition-colors">
                  {cat.title}
                </h4>
                <p className="text-xs text-[#1F2E29]/60 mt-0.5">
                  {cat.items}
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${cat.color}`}>
                    In Stock
                  </span>
                  <span className="text-xs font-semibold text-[#16806A] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
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
