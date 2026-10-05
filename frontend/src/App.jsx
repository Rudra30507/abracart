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
import { CartProvider } from './context/CartContext';
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
    <BrowserRouter>
      <CartProvider user={user}>
        <div className="min-h-screen flex flex-col bg-[#F7FCFA] text-[#1F2E29]">
          {/* Top Navigation Bar with Logo and Dynamic Cart Count */}
          <Navbar user={user} setUser={setUser} />

          {/* Main Routed Content */}
          <main className="flex-1">
            <Routes>
              {/* Root Route: Redirect to /login or /home */}
              <Route
                path="/"
                element={user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />}
              />

              {/* Login Route (Task 2) */}
              <Route
                path="/login"
                element={user ? <Navigate to="/home" replace /> : <Login setUser={setUser} />}
              />

              {/* Register Route (Task 1) */}
              <Route
                path="/register"
                element={user ? <Navigate to="/home" replace /> : <Register />}
              />

              {/* Protected Home Route (Task 3) */}
              <Route
                path="/home"
                element={<Home user={user} setUser={setUser} />}
              />

              {/* Product Catalog Route (Lab 03 Task 6) */}
              <Route
                path="/products"
                element={<Products />}
              />

              {/* Single Product Details Route (Lab 03 Task 8) */}
              <Route
                path="/products/:id"
                element={<ProductDetails />}
              />

              {/* Wishlist Route (Lab 04 Task 6) */}
              <Route
                path="/wishlist"
                element={<Wishlist user={user} />}
              />

              {/* Cart Route (Lab 05 Task 8 & 13) */}
              <Route
                path="/cart"
                element={<Cart user={user} />}
              />

              {/* Fallback for undefined routes */}
              <Route
                path="*"
                element={<Navigate to="/products" replace />}
              />
            </Routes>
          </main>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
