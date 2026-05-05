import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

const OLD_KEYS = ['token', 'user', 'google_response', 'products', 'orders'];

function storeSession(token, userData) {
  localStorage.setItem('ll_token', token);
  localStorage.setItem('ll_user', JSON.stringify({
    id: userData.id || userData._id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    picture: userData.picture || '',
  }));
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    OLD_KEYS.forEach((key) => localStorage.removeItem(key));

    const token = localStorage.getItem('ll_token');
    const stored = localStorage.getItem('ll_user');
    if (token && stored) {
      try {
        setUser(JSON.parse(stored));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch {
        localStorage.removeItem('ll_token');
        localStorage.removeItem('ll_user');
      }
    }
    setLoading(false);
  }, []);

  const loginWithGoogle = async (credential) => {
    const res = await api.post('/api/auth/google', { credential });
    const { token, user: userData } = res.data;
    storeSession(token, userData);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await api.post('/api/auth/register', { name, email, password });
    const { token, user: userData } = res.data;
    storeSession(token, userData);
    setUser(userData);
    return userData;
  };

  const loginWithPassword = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    const { token, user: userData } = res.data;
    storeSession(token, userData);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('ll_token');
    localStorage.removeItem('ll_user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithPassword, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
