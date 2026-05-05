import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function AdminContacts() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    api.get('/api/contacts')
      .then((res) => setMessages(res.data || []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    try {
      await api.put(`/api/contacts/${id}/read`);
      setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, read: true } : m)));
    } catch {}
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await api.delete(`/api/contacts/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (expanded === id) setExpanded(null);
    } catch {
      alert('Failed to delete message');
    } finally {
      setDeleting(null);
    }
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-2xl font-bold text-gray-900">Contact Messages</h1>
          {unread > 0 && (
            <span className="bg-primary-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">{unread} new</span>
          )}
        </div>
        <p className="text-sm text-gray-400">{messages.length} total messages</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-card p-12 text-center text-gray-400">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-16 text-center">
          <div className="text-5xl mb-3">✉️</div>
          <h3 className="font-serif text-xl text-gray-700 mb-1">No messages yet</h3>
          <p className="text-gray-400 text-sm">Contact form submissions will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`bg-white rounded-2xl shadow-card overflow-hidden transition-all ${!msg.read ? 'border-l-4 border-primary-500' : ''}`}
            >
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50/60"
                onClick={() => {
                  setExpanded(expanded === msg._id ? null : msg._id);
                  if (!msg.read) markRead(msg._id);
                }}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${!msg.read ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500'}`}>
                    {msg.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold ${!msg.read ? 'text-gray-900' : 'text-gray-700'}`}>{msg.name}</p>
                      {!msg.read && <span className="w-2 h-2 bg-primary-500 rounded-full" />}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{msg.email} {msg.phone ? `· ${msg.phone}` : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                  <p className="text-xs text-gray-400 hidden sm:block">
                    {new Date(msg.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <span className="text-gray-300 text-lg">{expanded === msg._id ? '▲' : '▼'}</span>
                </div>
              </div>

              {expanded === msg._id && (
                <div className="border-t border-gray-50 px-5 pb-5 pt-4">
                  <div className="flex flex-wrap gap-4 text-sm mb-4">
                    <a href={`mailto:${msg.email}`} className="flex items-center gap-1.5 text-primary-600 hover:underline">
                      ✉️ {msg.email}
                    </a>
                    {msg.phone && (
                      <a href={`tel:${msg.phone}`} className="flex items-center gap-1.5 text-primary-600 hover:underline">
                        📞 {msg.phone}
                      </a>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <a
                      href={`mailto:${msg.email}?subject=Re: Your enquiry at Lavish Leora`}
                      className="text-xs px-4 py-2 bg-primary-50 text-primary-700 rounded-xl hover:bg-primary-100 transition-colors font-medium"
                    >
                      Reply via Email
                    </a>
                    <button
                      onClick={() => handleDelete(msg._id)}
                      disabled={deleting === msg._id}
                      className="text-xs px-4 py-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      {deleting === msg._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
