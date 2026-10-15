import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getCart, addToCart, updateCartQty, removeFromCart } from '../services/api';

const CartContext = createContext(null);

export const CartProvider = ({ children, user }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Cart from server
  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getCart();
      if (data && data.success) {
        setCart(data.cart || []);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
      if (err.response?.status !== 401) {
        setError(err.response?.data?.message || 'Unable to load your cart.');
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load cart on initial user mount or login state change
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Derived Totals (calculated from current cart state)
  const totalUnits = useMemo(() => {
    return cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const price = Number(item.product?.price) || 0;
      const qty = Number(item.quantity) || 0;
      return total + price * qty;
    }, 0);
  }, [cart]);

  const cartItemCount = cart.length;

  // Add to Cart
  const handleAddToCart = async (productId) => {
    try {
      setError(null);
      const data = await addToCart(productId);
      if (data && data.cart) {
        setCart(data.cart);
      } else {
        await fetchCart();
      }
      return { success: true, message: data?.message || 'Added to cart' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to add product to cart';
      return { success: false, message: msg, status: err.response?.status };
    }
  };

  // Update Quantity
  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      setError(null);
      const data = await updateCartQty(productId, newQuantity);
      if (data && data.cart) {
        setCart(data.cart);
      } else {
        await fetchCart();
      }
      return { success: true, message: data?.message || 'Quantity updated' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to update quantity';
      return { success: false, message: msg, status: err.response?.status };
    }
  };

  // Remove from Cart
  const handleRemoveFromCart = async (productId) => {
    try {
      setError(null);
      const data = await removeFromCart(productId);
      if (data && data.cart) {
        setCart(data.cart);
      } else {
        setCart((prev) =>
          prev.filter((item) => (item.product?._id || item.product) !== productId)
        );
      }
      return { success: true, message: data?.message || 'Item removed from cart' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to remove item from cart';
      return { success: false, message: msg, status: err.response?.status };
    }
  };

  // Clear Cart action upon successful order payment
  const handleClearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems: cart,
        loading,
        error,
        totalUnits,
        subtotal,
        cartItemCount,
        addToCart: handleAddToCart,
        updateQuantity: handleUpdateQuantity,
        removeFromCart: handleRemoveFromCart,
        clearCart: handleClearCart,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
