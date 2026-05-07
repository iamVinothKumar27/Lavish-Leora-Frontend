import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, messages: 0, users: 0 });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes, contactsRes, usersRes] = await Promise.allSettled([
          api.get('/api/products?limit=5'),
          api.get('/api/orders'),
          api.get('/api/contacts'),
          api.get('/api/users'),
        ]);

        const products = productsRes.status === 'fulfilled' ? productsRes.value.data : { products: [], total: 0 };
        const orders = ordersRes.status === 'fulfilled' ? ordersRes.value.data : [];
        const contacts = contactsRes.status === 'fulfilled' ? contactsRes.value.data : [];
        const users = usersRes.status === 'fulfilled' ? usersRes.value.data : [];

        setStats({
          products: products.total || 0,
          orders: Array.isArray(orders) ? orders.length : 0,
          messages: Array.isArray(contacts) ? contacts.length : 0,
          users: Array.isArray(users) ? users.length : 0,
        });
        setRecentProducts(products.products?.slice(0, 5) || []);
      } catch {
        // Stats will stay at 0 on error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const STAT_CARDS = [
    { label: 'Total Products', value: stats.products, icon: '👗', color: 'bg-purple-50 text-purple-700', link: '/admin/products' },
    { label: 'Total Orders', value: stats.orders, icon: '📦', color: 'bg-blue-50 text-blue-700', link: '/admin/orders' },
    { label: 'Messages', value: stats.messages, icon: '✉️', color: 'bg-green-50 text-green-700', link: '/admin/contacts' },
    { label: 'Registered Users', value: stats.users, icon: '👥', color: 'bg-amber-50 text-amber-700', link: '#' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Welcome back! Here's what's happening at Lavish Leora.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map(({ label, value, icon, color, link }) => (
          <Link
            key={label}
            to={link}
            className="bg-white rounded-2xl p-5 shadow-card hover:shadow-soft transition-all hover:-translate-y-0.5 group"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4 ${color}`}>
              {icon}
            </div>
            <p className="text-2xl font-bold text-gray-900 font-serif">
              {loading ? <span className="shimmer inline-block w-8 h-6 rounded" /> : value}
            </p>
            <p className="text-sm text-gray-400 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white">
          <h3 className="font-serif text-xl font-semibold mb-2">Quick Actions</h3>
          <p className="text-primary-200 text-sm mb-5">Manage your store from here</p>
          <div className="space-y-2.5">
            <Link to="/admin/products/add" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl transition-colors">
              <span>+</span>
              <span className="text-sm font-medium">Add New Product</span>
            </Link>
            <Link to="/admin/products" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl transition-colors">
              <span>👗</span>
              <span className="text-sm font-medium">View All Products</span>
            </Link>
            <Link to="/admin/orders" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl transition-colors">
              <span>📦</span>
              <span className="text-sm font-medium">Manage Orders</span>
            </Link>
            <Link to="/admin/contacts" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl transition-colors">
              <span>✉️</span>
              <span className="text-sm font-medium">View Messages</span>
            </Link>
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-serif text-lg font-semibold text-gray-900">Recent Products</h3>
            <Link to="/admin/products" className="text-xs text-primary-600 hover:underline">View all →</Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="shimmer w-12 h-12 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-1.5 pt-1">
                    <div className="shimmer h-3 w-32 rounded" />
                    <div className="shimmer h-3 w-20 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm mb-3">No products yet</p>
              <Link to="/admin/products/add" className="text-primary-600 text-sm font-medium hover:underline">
                Add your first product →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentProducts.map((p) => (
                <Link
                  key={p._id}
                  to={`/admin/products/edit/${p._id}`}
                  className="flex items-center gap-3 group hover:bg-gray-50 p-2 rounded-xl transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-beige flex-shrink-0">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">👗</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate group-hover:text-primary-700">{p.name}</p>
                    <p className="text-xs text-gray-400">₹{p.price?.toLocaleString('en-IN')} · {p.category}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-400'}`}>
                    {p.stock > 0 ? `${p.stock} in stock` : 'Out'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Store info */}
      <div className="bg-beige rounded-2xl p-6">
        <h3 className="font-medium text-gray-700 mb-3">Store Information</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-sm text-gray-500">
          <div>📍 230 Kongu Main Road, 1st Floor,<br />Near Old ESI Hospital, Tirupur – 641607</div>
          <div>📞 6369931994 (Main)<br />9363004914 / 8668046050</div>
          <div>✉️ lavishleora@gmail.com</div>
        </div>
      </div>
    </div>
  );
}
