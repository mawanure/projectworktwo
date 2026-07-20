import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], subtotal: 0, deliveryCharge: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const response = await apiClient.get('/api/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart({ items: [], subtotal: 0, deliveryCharge: 0, totalAmount: 0 });
    }
  }, [isAuthenticated]);

  const addItemToCart = async (productId, size, quantity) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to your cart.');
      return false;
    }
    try {
      const response = await apiClient.post('/api/cart', { productId, size, quantity });
      setCart(response.data);
      toast.success('Item added to cart!');
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to add item to cart';
      toast.error(msg);
      return false;
    }
  };

  const updateCartItemQuantity = async (itemId, quantity) => {
    try {
      // The update quantity endpoint expects quantity as a query parameter (from Controller: @RequestParam int quantity)
      const response = await apiClient.put(`/api/cart/${itemId}?quantity=${quantity}`);
      setCart(response.data);
      toast.success('Cart updated');
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update quantity';
      toast.error(msg);
      return false;
    }
  };

  const removeItemFromCart = async (itemId) => {
    try {
      const response = await apiClient.delete(`/api/cart/${itemId}`);
      setCart(response.data);
      toast.success('Item removed from cart');
      return true;
    } catch (error) {
      toast.error('Failed to remove item');
      return false;
    }
  };

  const getCartCount = () => {
    return cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        fetchCart,
        addItemToCart,
        updateCartItemQuantity,
        removeItemFromCart,
        getCartCount,
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
