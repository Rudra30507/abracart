import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search, filter, and sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('');

  // Fetch products dynamically from backend whenever search, category, or sort changes
  useEffect(() => {
    let isMounted = true;
    const delayTimer = setTimeout(() => {
      fetchFilteredProducts();
    }, 250);

    const fetchFilteredProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const params = {};
        if (searchTerm.trim()) {
          params.search = searchTerm.trim();
        }
        if (selectedCategory && selectedCategory !== 'All Categories') {
          params.category = selectedCategory;
        }
        if (sortBy) {
          params.sort = sortBy;
        }

        // Call backend API: GET /products?search=...&category=...&sort=...
        const data = await getProducts(params);

        if (isMounted) {
          if (data && data.success) {
            setProducts(data.products || []);
          } else {
            setProducts([]);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching products:', err);
          setError('Something went wrong while loading products.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    return () => {
      isMounted = false;
      clearTimeout(delayTimer);
    };
  }, [searchTerm, selectedCategory, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setSortBy('');
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] dark:bg-[#0B0F14] pt-20 sm:pt-24 pb-16 px-4 sm:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Amazon / Flipkart Style Category Hero Banner */}
        <div className="bg-gradient-to-r from-[#16806A] via-[#1B8E77] to-[#126A57] dark:from-[#064E3B] dark:via-[#047857] dark:to-[#065F46] text-white rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-emerald-950/40 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-72 h-72 bg-emerald-300/10 dark:bg-emerald-400/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md border border-white/20 text-[#E3F6EF] mb-3">
                <span>🛒</span>
                <span>Official abracart Store</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Discover Electronics, Fashion & Daily Essentials
              </h1>
              <p className="text-xs sm:text-sm text-[#E3F6EF]/90 mt-1.5 leading-relaxed">
                Explore genuine electronics, books, apparel, and daily pantry staples delivered with care.
              </p>
            </div>

            {/* Quick Category Shortcuts */}
            <div className="flex flex-wrap gap-2 shrink-0">
              <button
                onClick={() => setSelectedCategory('Electronics')}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>💻</span>
                <span>Electronics</span>
              </button>
              <button
                onClick={() => setSelectedCategory('Home')}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>🏠</span>
                <span>Home Essentials</span>
              </button>
              <button
                onClick={() => setSelectedCategory('Fashion')}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>👗</span>
                <span>Fashion</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Section */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalResults={products.length}
        />

        {/* State Handling: Loading, Error, Empty, or Products Grid */}

        {/* 1. Loading State */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-[#E3F6EF] border-t-[#16806A] animate-spin"></div>
            <p className="text-base font-bold text-[#16806A] animate-pulse">
              Loading products...
            </p>
            <span className="text-xs text-[#1F2E29]/50">
              Fetching items dynamically from ShopKart API
            </span>
          </div>
        )}

        {/* 2. Error State */}
        {!loading && error && (
          <div className="p-8 rounded-2xl bg-rose-50 border border-rose-200 text-center max-w-lg mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-rose-900">
              Something went wrong while loading products.
            </h3>
            <p className="text-xs text-rose-700">
              Please check your connection or ensure the backend server is running.
            </p>
            <button
              onClick={() => setSearchTerm((prev) => prev + ' ')}
              className="mt-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* 3. Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="py-16 px-4 text-center max-w-md mx-auto space-y-4 bg-white/90 backdrop-blur-md rounded-3xl border border-[#E8E2D8] p-8 shadow-xs">
            <div className="text-5xl mb-2">🔍</div>
            <h3 className="text-xl font-extrabold text-[#1F2E29]">
              No products found.
            </h3>
            <p className="text-xs sm:text-sm text-[#1F2E29]/70 leading-relaxed">
              We couldn't find any products matching{' '}
              {searchTerm && <strong>"{searchTerm}"</strong>}
              {searchTerm && selectedCategory !== 'All Categories' && ' in '}
              {selectedCategory !== 'All Categories' && <strong>{selectedCategory}</strong>}.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-[#16806A] hover:bg-[#126A57] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

        {/* 4. Dynamic Products Grid (.map() rendering) */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Products;
