import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getWishlist, addToWishlist, removeFromWishlist, toggleWishlistApi } from '../services/api';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children, user }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getWishlist();
      if (data && data.success) {
        setWishlist(data.wishlist || []);
      }
    } catch (err) {
      if (err.response?.status !== 401) {
        setError(err.response?.data?.message || 'Unable to load wishlist');
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const wishlistCount = wishlist.length;

  const isWishlisted = useCallback((productId) => {
    if (!productId) return false;
    return wishlist.some((item) => {
      const id = item?._id || item;
      return id?.toString() === productId?.toString();
    });
  }, [wishlist]);

  const toggleWishlist = async (productId) => {
    if (!user) {
      throw { response: { status: 401, data: { message: 'Please login to save products' } } };
    }

    const alreadyIn = isWishlisted(productId);

    try {
      if (alreadyIn) {
        // Optimistic remove
        setWishlist((prev) =>
          prev.filter((item) => (item?._id || item)?.toString() !== productId?.toString())
        );
        await removeFromWishlist(productId);
        return { success: true, isWishlisted: false, message: 'Removed from Wishlist' };
      } else {
        await addToWishlist(productId);
        // Refresh wishlist so full populated product object is in state
        const updated = await getWishlist();
        if (updated && updated.wishlist) {
          setWishlist(updated.wishlist);
        }
        return { success: true, isWishlisted: true, message: '♥ Added to Wishlist' };
      }
    } catch (err) {
      // Revert on failure
      await fetchWishlist();
      throw err;
    }
  };

  const handleRemove = async (productId) => {
    try {
      setWishlist((prev) =>
        prev.filter((item) => (item?._id || item)?.toString() !== productId?.toString())
      );
      await removeFromWishlist(productId);
    } catch (err) {
      await fetchWishlist();
      throw err;
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist: handleRemove,
        fetchWishlist,
        loading,
        error
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;
