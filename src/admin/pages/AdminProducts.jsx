import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const FALLBACK = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=80&q=60';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: 100 });
    if (search) params.append('search', search);
    if (catFilter) params.append('category', catFilter);
    api.get(`/api/products?${params}`)
      .then((res) => setProducts(res.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [search, catFilter]);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await api.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-400">{products.length} total products</p>
        </div>
        <Link to="/admin/products/add" className="btn-primary text-sm py-2.5 px-5">
          + Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-card p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field flex-1"
        />
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="input-field w-auto"
        >
          <option value="">All Categories</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-5xl mb-3">👗</div>
            <p className="font-serif text-xl text-gray-700 mb-2">No products found</p>
            <Link to="/admin/products/add" className="text-primary-600 text-sm font-medium hover:underline">
              Add your first product →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Flags</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-beige flex-shrink-0">
                          <img
                            src={p.images?.[0] || FALLBACK}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = FALLBACK; }}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 truncate max-w-[180px]">{p.name}</p>
                          {p.subcategory && <p className="text-xs text-gray-400">{p.subcategory}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`tag ${p.category === 'Women' ? 'bg-pink-50 text-pink-600' : 'bg-blue-50 text-blue-600'}`}>
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      ₹{p.price?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`tag ${p.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-400'}`}>
                        {p.stock > 0 ? p.stock : 'Out'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1 flex-wrap">
                        {p.newArrival && <span className="tag bg-primary-50 text-primary-600">New</span>}
                        {p.featured && <span className="tag bg-amber-50 text-amber-600">Featured</span>}
                        {p.koreanStyle && <span className="tag bg-rose-50 text-rose-600">Korean</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/products/${p._id}`}
                          target="_blank"
                          className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          View
                        </Link>
                        <Link
                          to={`/admin/products/edit/${p._id}`}
                          className="text-xs px-3 py-1.5 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-700 transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setConfirmDelete(p._id)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-7 max-w-sm w-full shadow-hover">
            <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">Delete Product?</h3>
            <p className="text-gray-500 text-sm mb-6">
              This action cannot be undone. The product will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deleting === confirmDelete}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
              >
                {deleting === confirmDelete ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
