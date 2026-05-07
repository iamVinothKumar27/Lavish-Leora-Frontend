import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // New category form
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);

  // Editing state: { id, name, subcategories }
  const [editing, setEditing] = useState(null);
  const [subcatInput, setSubcatInput] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/api/categories')
      .then((res) => setCategories(res.data))
      .catch(() => setError('Failed to load categories'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setAdding(true);
    try {
      await api.post('/api/categories', { name });
      setNewName('');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add category');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete category "${name}"? This won't delete existing products.`)) return;
    try {
      await api.delete(`/api/categories/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete');
    }
  };

  const startEdit = (cat) => {
    setEditing({ id: cat._id, name: cat.name, subcategories: [...cat.subcategories] });
    setSubcatInput('');
    setError('');
  };

  const addSubcat = () => {
    const v = subcatInput.trim();
    if (v && !editing.subcategories.includes(v)) {
      setEditing((prev) => ({ ...prev, subcategories: [...prev.subcategories, v] }));
    }
    setSubcatInput('');
  };

  const removeSubcat = (s) => {
    setEditing((prev) => ({ ...prev, subcategories: prev.subcategories.filter((x) => x !== s) }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/api/categories/${editing.id}`, {
        name: editing.name.trim(),
        subcategories: editing.subcategories,
      });
      setEditing(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-gray-900">Categories</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
          {error}
          <button onClick={() => setError('')} className="ml-2 text-red-400 hover:text-red-600">×</button>
        </div>
      )}

      {/* Add category */}
      <form onSubmit={handleAdd} className="bg-white rounded-2xl shadow-card p-6 mb-5">
        <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-3 mb-4">Add New Category</h2>
        <div className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Kids, Accessories"
            className="input-field flex-1"
            required
          />
          <button
            type="submit"
            disabled={adding}
            className="px-5 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {adding ? 'Adding...' : 'Add Category'}
          </button>
        </div>
      </form>

      {/* Category list */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-gray-400">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No categories yet.</div>
        ) : (
          categories.map((cat) => (
            <div key={cat._id} className="bg-white rounded-2xl shadow-card p-6">
              {editing?.id === cat._id ? (
                /* Edit mode */
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Category Name</label>
                    <input
                      value={editing.name}
                      onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value }))}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Subcategories</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        value={subcatInput}
                        onChange={(e) => setSubcatInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSubcat(); } }}
                        placeholder="e.g. Kurtas, Blazers"
                        className="input-field flex-1"
                      />
                      <button
                        type="button"
                        onClick={addSubcat}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap"
                      >
                        Add
                      </button>
                    </div>
                    {editing.subcategories.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {editing.subcategories.map((s) => (
                          <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm">
                            {s}
                            <button type="button" onClick={() => removeSubcat(s)} className="text-primary-400 hover:text-red-500 transition-colors leading-none text-base">×</button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400">No subcategories yet.</p>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditing(null)}
                      className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              ) : (
                /* View mode */
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{cat.name}</h3>
                      <p className="text-xs text-gray-400">{cat.subcategories.length} subcategories</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => startEdit(cat)}
                        className="px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id, cat.name)}
                        className="px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  {cat.subcategories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {cat.subcategories.map((s) => (
                        <span key={s} className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
