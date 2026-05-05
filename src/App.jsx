import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Men from './pages/Men';
import Women from './pages/Women';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminProducts from './admin/pages/AdminProducts';
import AdminAddProduct from './admin/pages/AdminAddProduct';
import AdminEditProduct from './admin/pages/AdminEditProduct';
import AdminOrders from './admin/pages/AdminOrders';
import AdminContacts from './admin/pages/AdminContacts';

const ADMIN_EMAIL = 'santhoshmass54@gmail.com';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-sans">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream">
        <div className="text-center p-10 bg-white rounded-2xl shadow-soft max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="font-serif text-3xl font-bold text-red-600 mb-3">Access Denied</h1>
          <p className="text-gray-500 mb-6">
            You don't have permission to access the admin panel. This area is restricted to authorized administrators only.
          </p>
          <a href="/" className="btn-primary">Go to Home</a>
        </div>
      </div>
    );
  }

  return children;
}

function UserLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<UserLayout><Home /></UserLayout>} />
              <Route path="/men" element={<UserLayout><Men /></UserLayout>} />
              <Route path="/women" element={<UserLayout><Women /></UserLayout>} />
              <Route path="/about" element={<UserLayout><About /></UserLayout>} />
              <Route path="/contact" element={<UserLayout><Contact /></UserLayout>} />
              <Route path="/products" element={<UserLayout><ProductListing /></UserLayout>} />
              <Route path="/products/:id" element={<UserLayout><ProductDetail /></UserLayout>} />
              <Route path="/cart" element={<UserLayout><Cart /></UserLayout>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/add" element={<AdminAddProduct />} />
                <Route path="products/edit/:id" element={<AdminEditProduct />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="contacts" element={<AdminContacts />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
