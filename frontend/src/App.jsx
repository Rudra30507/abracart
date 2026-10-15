import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderConfirmation from './pages/OrderConfirmation';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { getProfile } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check auth session on initial load
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const userData = await getProfile();
        if (userData && userData._id) {
          setUser(userData);
        }
      } catch (err) {
        // Not logged in or expired cookie
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkUserSession();
  }, []);

  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <CartProvider user={user}>
            <WishlistProvider user={user}>
              <div className="min-h-screen flex flex-col bg-[#F7FCFA] dark:bg-[#0B0F14] text-[#1F2E29] dark:text-[#F1F5F9] transition-colors duration-300">
                {/* Top Navigation Bar with Logo, Cart Count & Theme Switcher */}
                <Navbar user={user} setUser={setUser} />

          {/* Main Routed Content */}
          <main className="flex-1">
            <Routes>
              {/* Root Route: Redirect to /login or /home */}
              <Route
                path="/"
                element={user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />}
              />

              {/* Login Route */}
              <Route
                path="/login"
                element={user ? <Navigate to="/home" replace /> : <Login setUser={setUser} />}
              />

              {/* Register Route */}
              <Route
                path="/register"
                element={user ? <Navigate to="/home" replace /> : <Register />}
              />

              {/* Protected Home Route */}
              <Route
                path="/home"
                element={<Home user={user} setUser={setUser} />}
              />

              {/* Product Catalog Route */}
              <Route
                path="/products"
                element={<Products />}
              />

              {/* Single Product Details Route */}
              <Route
                path="/products/:id"
                element={<ProductDetails />}
              />

              {/* Wishlist Route */}
              <Route
                path="/wishlist"
                element={<Wishlist user={user} />}
              />

              {/* Cart Route */}
              <Route
                path="/cart"
                element={<Cart user={user} />}
              />

              {/* Checkout Route */}
              <Route
                path="/checkout"
                element={<Checkout user={user} />}
              />

              {/* My Orders Route */}
              <Route
                path="/orders"
                element={<Orders user={user} />}
              />

              {/* Order Confirmation / Details Routes */}
              <Route
                path="/order-success/:id"
                element={<OrderConfirmation user={user} />}
              />
              <Route
                path="/orders/:id"
                element={<OrderConfirmation user={user} />}
              />

              {/* Fallback for undefined routes */}
              <Route
                path="*"
                element={<Navigate to="/products" replace />}
              />
            </Routes>
          </main>
        </div>
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  </ToastProvider>
</ThemeProvider>
);
}

export default App;
