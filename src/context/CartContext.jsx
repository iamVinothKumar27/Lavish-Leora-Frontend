import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setItems([]); return; }
    setLoading(true);
    try {
      const res = await api.get('/api/cart');
      setItems(res.data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, size = '', quantity = 1) => {
    const res = await api.post('/api/cart/add', { productId, size, quantity });
    setItems(res.data);
    return res.data;
  };

  const updateQuantity = async (productId, size, quantity) => {
    const res = await api.put('/api/cart/update', { productId, size, quantity });
    setItems(res.data);
  };

  const removeItem = async (productId, size = '') => {
    const res = await api.delete(`/api/cart/remove/${productId}?size=${encodeURIComponent(size)}`);
    setItems(res.data);
  };

  const clearCart = async () => {
    const res = await api.delete('/api/cart/clear');
    setItems(res.data);
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, loading, addToCart, updateQuantity, removeItem, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
