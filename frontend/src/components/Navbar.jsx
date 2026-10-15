import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalUnits } = useCart();
  const { wishlistCount } = useWishlist();
  const { isDark, toggleTheme } = useTheme();

  const isLogin = location.pathname === '/login' || location.pathname === '/';
  const isRegister = location.pathname === '/register';
  const isProducts = location.pathname === '/products' || location.pathname.startsWith('/products/');
  const isHome = location.pathname === '/home';
  const isWishlist = location.pathname === '/wishlist';
  const isCart = location.pathname === '/cart';
  const isOrders = location.pathname === '/orders' || location.pathname.startsWith('/order');

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      if (setUser) setUser(null);
      navigate('/login');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FEF8EB]/85 dark:bg-[#0B0F14]/90 backdrop-blur-xl border-b border-[#EADBBE]/60 dark:border-white/10 shadow-xs shadow-amber-950/[0.03] dark:shadow-black/40 px-4 sm:px-8 py-3 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Brand / Logo + Navigation Links */}
        <div className="flex items-center gap-4 sm:gap-8">
          <Link to={user ? "/home" : "/login"} className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="abracart logo"
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <span className="text-[11px] font-bold text-[#16806A] dark:text-emerald-400 tracking-wider uppercase bg-[#E4F3ED] dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-[#16806A]/15 dark:border-emerald-500/20">
                Daily Essentials
              </span>
            </div>
          </Link>

          {/* Navigation Links (Home | Products | Wishlist) */}
          <nav className="hidden sm:flex items-center gap-2">
            {user && (
              <Link
                to="/home"
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isHome
                    ? 'bg-[#16806A] text-white shadow-xs'
                    : 'text-[#1F2E29]/75 dark:text-slate-300 hover:text-[#16806A] dark:hover:text-emerald-400 hover:bg-[#FFFDF7] dark:hover:bg-white/5'
                }`}
              >
                Home
              </Link>
            )}

            <Link
              to="/products"
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isProducts
                  ? 'bg-[#16806A] text-white shadow-xs'
                  : 'text-[#1F2E29]/75 dark:text-slate-300 hover:text-[#16806A] dark:hover:text-emerald-400 hover:bg-[#FFFDF7] dark:hover:bg-white/5'
              }`}
            >
              Products
            </Link>

            {/* Wishlist link with animated badge count */}
            <Link
              to="/wishlist"
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                isWishlist
                  ? 'bg-[#16806A] text-white shadow-xs'
                  : 'text-[#1F2E29]/75 dark:text-slate-300 hover:text-[#16806A] dark:hover:text-emerald-400 hover:bg-[#FFFDF7] dark:hover:bg-white/5'
              }`}
            >
              <span>Wishlist</span>
              {wishlistCount !== null && (
                <span
                  key={wishlistCount}
                  className={`text-[11px] font-extrabold px-1.5 py-0.2 rounded-full transition-transform ${
                    wishlistCount > 0 ? 'animate-badgeBounce' : ''
                  } ${
                    isWishlist
                      ? 'bg-white text-[#16806A]'
                      : 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link with spring animated count */}
            <Link
              to="/cart"
              id="navbar-cart-link"
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                isCart
                  ? 'bg-[#16806A] text-white shadow-xs'
                  : 'text-[#1F2E29]/75 dark:text-slate-300 hover:text-[#16806A] dark:hover:text-emerald-400 hover:bg-[#FFFDF7] dark:hover:bg-white/5'
              }`}
            >
              <span>Cart</span>
              <span
                key={totalUnits}
                id="navbar-cart-count"
                className={`text-[11px] font-extrabold px-1.5 py-0.2 rounded-full transition-transform ${
                  totalUnits > 0 ? 'animate-badgeBounce' : ''
                } ${
                  isCart ? 'bg-white text-[#16806A]' : 'bg-[#16806A] text-white'
                }`}
              >
                {totalUnits}
              </span>
            </Link>

            {/* Orders Link for authenticated user */}
            {user && (
              <Link
                to="/orders"
                id="navbar-orders-link"
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                  isOrders
                    ? 'bg-[#16806A] text-white shadow-xs'
                    : 'text-[#1F2E29]/75 dark:text-slate-300 hover:text-[#16806A] dark:hover:text-emerald-400 hover:bg-[#FFFDF7] dark:hover:bg-white/5'
                }`}
              >
                <span>Orders</span>
              </Link>
            )}
          </nav>
        </div>

        {/* User actions + Theme Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Luxury Dark/Light Theme Toggle Switch */}
          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Dark Mode"
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#F5EAD4]/80 dark:bg-white/10 text-[#1F2E29] dark:text-amber-300 hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer border border-white/60 dark:border-white/10"
            id="theme-toggle-btn"
          >
            {isDark ? (
              <span className="text-base transition-transform duration-300 hover:rotate-45">☀️</span>
            ) : (
              <span className="text-base transition-transform duration-300 hover:-rotate-12">🌙</span>
            )}
          </button>

          {/* Mobile Quick Links */}
          <div className="flex sm:hidden items-center gap-1">
            <Link
              to="/products"
              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                isProducts ? 'bg-[#16806A] text-white' : 'text-[#1F2E29]/80 dark:text-slate-200 bg-[#E4F3ED] dark:bg-slate-800'
              }`}
            >
              Catalog
            </Link>
            <Link
              to="/wishlist"
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                isWishlist ? 'bg-[#16806A] text-white' : 'text-[#1F2E29]/80 dark:text-slate-200 bg-[#E4F3ED] dark:bg-slate-800'
              }`}
            >
              <span>♡</span>
              {wishlistCount !== null && <span>({wishlistCount})</span>}
            </Link>
            <Link
              to="/cart"
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                isCart ? 'bg-[#16806A] text-white' : 'text-[#1F2E29]/80 dark:text-slate-200 bg-[#E4F3ED] dark:bg-slate-800'
              }`}
            >
              <span>🛒</span>
              <span>({totalUnits})</span>
            </Link>
          </div>

          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden md:flex items-center gap-2 bg-[#E4F3ED]/90 dark:bg-slate-800/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#16806A]/20 dark:border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-[#16806A] dark:bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold text-[#1F2E29] dark:text-slate-200">
                  Hi, {user.fullName ? user.fullName.split(' ')[0] : 'Customer'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#16806A] hover:bg-[#126A57] active:scale-95 transition-all rounded-xl shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="inline-flex items-center p-1 bg-[#F5EAD4]/70 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl border border-white/60 dark:border-white/10 shadow-xs">
              <Link
                to="/login"
                className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  isLogin
                    ? 'bg-[#16806A] text-white shadow-xs'
                    : 'text-[#1F2E29]/75 dark:text-slate-300 hover:text-[#16806A] dark:hover:text-emerald-400'
                }`}
              >
                Log In
              </Link>
              <Link
                to="/register"
                className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  isRegister
                    ? 'bg-[#16806A] text-white shadow-xs'
                    : 'text-[#1F2E29]/75 dark:text-slate-300 hover:text-[#16806A] dark:hover:text-emerald-400'
                }`}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
