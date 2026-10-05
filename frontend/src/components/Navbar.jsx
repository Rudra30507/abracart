import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logoutUser, getWishlist } from '../services/api';
import { useCart } from '../context/CartContext';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalUnits } = useCart();

  const isLogin = location.pathname === '/login' || location.pathname === '/';
  const isRegister = location.pathname === '/register';
  const isProducts = location.pathname === '/products' || location.pathname.startsWith('/products/');
  const isHome = location.pathname === '/home';
  const isWishlist = location.pathname === '/wishlist';
  const isCart = location.pathname === '/cart';

  // Bonus: Wishlist Count (+5 Marks) fetched dynamically from backend
  const [wishlistCount, setWishlistCount] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (user) {
      getWishlist()
        .then((data) => {
          if (isMounted) {
            setWishlistCount(data.count !== undefined ? data.count : (data.wishlist?.length || 0));
          }
        })
        .catch(() => {
          if (isMounted) setWishlistCount(null);
        });
    } else {
      setWishlistCount(null);
    }
    return () => {
      isMounted = false;
    };
  }, [user, location.pathname]);

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
    <header className="sticky top-0 z-50 bg-[#FEF8EB]/80 backdrop-blur-xl border-b border-[#EADBBE]/60 shadow-xs shadow-amber-950/[0.03] px-4 sm:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Brand / Logo + Navigation Links */}
        <div className="flex items-center gap-4 sm:gap-8">
          <Link to={user ? "/home" : "/login"} className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="abracart logo"
              className="h-9 w-auto object-contain transition-transform group-hover:scale-102"
            />
            <div className="hidden sm:block">
              <span className="text-[11px] font-bold text-[#16806A] tracking-wider uppercase bg-[#E4F3ED] px-2.5 py-1 rounded-full border border-[#16806A]/15">
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
                    : 'text-[#1F2E29]/75 hover:text-[#16806A] hover:bg-[#FFFDF7]'
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
                  : 'text-[#1F2E29]/75 hover:text-[#16806A] hover:bg-[#FFFDF7]'
              }`}
            >
              Products
            </Link>

            {/* Task 8: Wishlist link with bonus count */}
            <Link
              to="/wishlist"
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                isWishlist
                  ? 'bg-[#16806A] text-white shadow-xs'
                  : 'text-[#1F2E29]/75 hover:text-[#16806A] hover:bg-[#FFFDF7]'
              }`}
            >
              <span>Wishlist</span>
              {wishlistCount !== null && (
                <span className={`text-[11px] font-extrabold px-1.5 py-0.2 rounded-full ${
                  isWishlist ? 'bg-white text-[#16806A]' : 'bg-rose-100 text-rose-600'
                }`}>
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Task 16: Dynamic Cart Link with derived count */}
            <Link
              to="/cart"
              id="navbar-cart-link"
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                isCart
                  ? 'bg-[#16806A] text-white shadow-xs'
                  : 'text-[#1F2E29]/75 hover:text-[#16806A] hover:bg-[#FFFDF7]'
              }`}
            >
              <span>Cart</span>
              <span
                id="navbar-cart-count"
                className={`text-[11px] font-extrabold px-1.5 py-0.2 rounded-full ${
                  isCart ? 'bg-white text-[#16806A]' : 'bg-[#16806A] text-white'
                }`}
              >
                {totalUnits}
              </span>
            </Link>
          </nav>
        </div>

        {/* User actions */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Mobile Quick Links */}
          <div className="flex sm:hidden items-center gap-1">
            <Link
              to="/products"
              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                isProducts ? 'bg-[#16806A] text-white' : 'text-[#1F2E29]/80 bg-[#E4F3ED]'
              }`}
            >
              Catalog
            </Link>
            <Link
              to="/wishlist"
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                isWishlist ? 'bg-[#16806A] text-white' : 'text-[#1F2E29]/80 bg-[#E4F3ED]'
              }`}
            >
              <span>♡</span>
              {wishlistCount !== null && <span>({wishlistCount})</span>}
            </Link>
            <Link
              to="/cart"
              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                isCart ? 'bg-[#16806A] text-white' : 'text-[#1F2E29]/80 bg-[#E4F3ED]'
              }`}
            >
              <span>🛒</span>
              <span>({totalUnits})</span>
            </Link>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 bg-[#E4F3ED]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#16806A]/20">
                <span className="w-2 h-2 rounded-full bg-[#16806A] animate-pulse"></span>
                <span className="text-xs font-bold text-[#1F2E29]">
                  Hi, {user.fullName ? user.fullName.split(' ')[0] : 'Customer'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#16806A] hover:bg-[#126A57] active:scale-95 transition-all rounded-xl shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          ) : (
            /* Frosted Glass Segmented Swiper Toggle in Top Navbar: Active Page is Green */
            <div className="inline-flex items-center p-1 bg-[#F5EAD4]/70 backdrop-blur-md rounded-2xl border border-white/60 shadow-xs">
              <Link
                to="/login"
                className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  isLogin
                    ? 'bg-[#16806A] text-white shadow-xs'
                    : 'text-[#1F2E29]/75 hover:text-[#16806A]'
                }`}
              >
                Log In
              </Link>
              <Link
                to="/register"
                className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  isRegister
                    ? 'bg-[#16806A] text-white shadow-xs'
                    : 'text-[#1F2E29]/75 hover:text-[#16806A]'
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
