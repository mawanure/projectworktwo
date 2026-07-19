import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState({ items: [], totalItems: 0 });
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const response = await apiClient.get('/api/wishlist');
      setWishlist(response.data);
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist({ items: [], totalItems: 0 });
    }
  }, [isAuthenticated]);

  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to use the wishlist.');
      return false;
    }
    try {
      const response = await apiClient.post('/api/wishlist', { productId });
      setWishlist(response.data);
      toast.success('Added to wishlist!');
      return true;
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error('Product is already in your wishlist.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to add to wishlist');
      }
      return false;
    }
  };

  const removeFromWishlist = async (itemId) => {
    try {
      const response = await apiClient.delete(`/api/wishlist/${itemId}`);
      setWishlist(response.data);
      toast.success('Removed from wishlist');
      return true;
    } catch (error) {
      toast.error('Failed to remove from wishlist');
      return false;
    }
  };

  const clearWishlist = async () => {
    try {
      await apiClient.delete('/api/wishlist');
      setWishlist({ items: [], totalItems: 0 });
      toast.success('Wishlist cleared');
      return true;
    } catch (error) {
      toast.error('Failed to clear wishlist');
      return false;
    }
  };

  const isProductInWishlist = (productId) => {
    return wishlist.items?.some((item) => item.product?.id === productId) || false;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isProductInWishlist,
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
