import { useState, useEffect } from 'react';
import api from '../../utils/api';

const STATUS_COLORS = {
  pending: 'bg-yellow-50 text-yellow-600',
  processing: 'bg-blue-50 text-blue-600',
  shipped: 'bg-purple-50 text-purple-600',
  delivered: 'bg-green-50 text-green-600',
  cancelled: 'bg-red-50 text-red-400',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    api.get('/api/orders')
      .then((res) => setOrders(res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, status) => {
    setUpdating(orderId);
    try {
      const res = await api.put(`/api/orders/${orderId}/status`, { status });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: res.data.status } : o)));
    } catch {
      alert('Failed to update order status');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-400">{orders.length} total orders</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center text-gray-400">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-16 text-center">
          <div className="text-5xl mb-3">📦</div>
          <h3 className="font-serif text-xl text-gray-700 mb-1">No orders yet</h3>
          <p className="text-gray-400 text-sm">Orders placed by customers will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900 text-sm">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <span className={`tag ${STATUS_COLORS[order.status] || 'bg-gray-50 text-gray-500'}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {order.user?.name} · {order.user?.email} · {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-gray-900">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    disabled={updating === order._id}
                    className="input-field text-xs py-1.5 w-auto cursor-pointer"
                  >
                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Order items */}
              <div className="border-t border-gray-50 pt-4">
                <div className="space-y-2">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      {item.image && (
                        <img src={item.image} alt="" className="w-10 h-10 object-cover rounded-lg bg-beige flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">Size: {item.size || 'N/A'} · Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-700 flex-shrink-0">₹{(item.price * item.quantity)?.toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping */}
              {order.shippingAddress?.address && (
                <div className="mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400">
                  📍 {order.shippingAddress.name} — {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.pincode} · 📞 {order.shippingAddress.phone}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
