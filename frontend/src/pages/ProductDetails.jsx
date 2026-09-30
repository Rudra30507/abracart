import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/api';

const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case 'electronics':
      return '💻';
    case 'fashion':
      return '👗';
    case 'books':
      return '📚';
    case 'home':
      return '🏠';
    default:
      return '🛒';
  }
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cartSuccess, setCartSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');

        // Task 8: Fetch product using GET /products/:id
        const data = await getProductById(id);

        if (isMounted) {
          if (data && data.success && data.product) {
            setProduct(data.product);
          } else {
            setError('Product not found.');
          }
        }
      } catch (err) {
        if (isMounted) {
          const msg = err.response?.data?.message || 'Something went wrong while loading products.';
          setError(msg);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchProduct();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAddToCart = () => {
    setCartSuccess(true);
    setTimeout(() => {
      setCartSuccess(false);
    }, 2500);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] pt-24 pb-16 px-4 sm:px-8 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#E3F6EF] border-t-[#16806A] animate-spin"></div>
        <p className="text-base font-bold text-[#16806A] animate-pulse">
          Loading product details...
        </p>
      </div>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] pt-28 pb-16 px-4 sm:px-8">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-rose-50 border border-rose-200 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-2xl">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-rose-900">
            {error || 'Product Not Found'}
          </h2>
          <p className="text-xs sm:text-sm text-rose-700">
            The requested product could not be retrieved from the catalog.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16806A] hover:bg-[#126A57] text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
            >
              <span>← Return to Products</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { name, description, price, category, image, stock } = product;

  return (
    <div className="min-h-screen bg-[#F9F8F6] pt-20 sm:pt-24 pb-16 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Breadcrumb Navigation (Flipkart / Amazon Style) */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#1F2E29]/60">
          <Link to="/products" className="hover:text-[#16806A] transition-colors">
            Catalog
          </Link>
          <span>/</span>
          <span className="text-[#16806A] font-bold flex items-center gap-1">
            <span>{getCategoryIcon(category)}</span>
            <span>{category}</span>
          </span>
          <span>/</span>
          <span className="text-[#1F2E29] truncate max-w-xs">{name}</span>
        </div>

        {/* Back Link Button */}
        <div>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#16806A] hover:text-[#126A57] transition-colors cursor-pointer group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Products</span>
          </button>
        </div>

        {/* Product Details Container (Frosted Glass E-commerce Layout) */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-[#E8E2D8] overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-10">

          {/* Left Column: Large Product Image */}
          <div className="flex flex-col justify-center">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#F7F5F0] border border-[#E8E2D8] shadow-xs">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';
                }}
              />
              <span className="absolute top-4 left-4 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#16806A] bg-white/95 backdrop-blur-md rounded-xl border border-[#16806A]/20 shadow-xs flex items-center gap-1.5">
                <span>{getCategoryIcon(category)}</span>
                <span>{category}</span>
              </span>
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="flex flex-col justify-between space-y-6">

            <div className="space-y-4">
              {/* Category & Stock Pill */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#16806A] bg-[#E3F6EF] px-3 py-1 rounded-full border border-[#16806A]/20">
                  {category}
                </span>

                {stock > 0 ? (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{stock} units left in stock</span>
                  </span>
                ) : (
                  <span className="text-xs font-bold text-rose-800 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                    Currently Out of Stock
                  </span>
                )}
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2E29] tracking-tight leading-snug">
                {name}
              </h1>

              {/* Price Tag (Clean, No Fake Offers) */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl sm:text-4xl font-black text-[#1F2E29]">
                  ₹{Number(price).toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-[#16806A] bg-[#E3F6EF] px-2.5 py-1 rounded-md">
                  Inclusive of all taxes
                </span>
              </div>

              {/* Description */}
              <div className="pt-4 border-t border-[#E8E2D8]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1F2E29]/60 mb-2">
                  Product Details
                </h3>
                <p className="text-sm sm:text-base text-[#1F2E29]/80 leading-relaxed font-normal">
                  {description}
                </p>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#E8E2D8] text-xs">
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] flex items-center gap-2.5">
                  <span className="text-xl">⚡</span>
                  <div>
                    <span className="font-bold text-[#1F2E29] block">Doorstep Delivery</span>
                    <span className="text-[#1F2E29]/60 text-[11px]">Dispatches in 24 hours</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] flex items-center gap-2.5">
                  <span className="text-xl">🛡️</span>
                  <div>
                    <span className="font-bold text-[#1F2E29] block">Genuine Guarantee</span>
                    <span className="text-[#1F2E29]/60 text-[11px]">100% authentic product</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: Quantity Selector & Add to Cart */}
            <div className="pt-6 border-t border-[#E8E2D8] space-y-4">
              {cartSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fadeIn">
                  <span>✓</span>
                  <span>{quantity} item(s) added to Cart! (Cart functionality coming in Lab-04)</span>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#1F2E29]">Quantity:</span>
                <div className="inline-flex items-center border border-[#E2DAD0] rounded-xl bg-[#FAF8F5] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-1.5 text-sm font-black text-[#1F2E29] hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3.5 py-1.5 text-xs font-extrabold text-[#1F2E29] min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(stock || 10, q + 1))}
                    className="px-3.5 py-1.5 text-sm font-black text-[#1F2E29] hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={stock === 0}
                className="w-full py-4 px-6 rounded-2xl text-white font-bold bg-[#16806A] hover:bg-[#126A57] active:scale-[0.99] transition-all duration-200 shadow-md shadow-[#16806A]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>{stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
