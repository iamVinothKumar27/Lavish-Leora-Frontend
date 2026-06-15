import { useState, useEffect } from 'react';
import api from '../../utils/api';

const GENDERS = ['Women', 'Men'];
const EMPTY_FORM = { gender: 'Women', name: '', children: [] };

// Editor for children (2nd level) and grandchildren (3rd level)
function ChildrenEditor({ children, onChange }) {
  const [childInput, setChildInput] = useState('');
  const [gcInputs, setGcInputs] = useState({});

  const addChild = () => {
    const v = childInput.trim();
    if (v && !children.find((c) => c.name === v)) {
      onChange([...children, { name: v, children: [] }]);
    }
    setChildInput('');
  };

  const removeChild = (idx) => onChange(children.filter((_, i) => i !== idx));

  const addGrandchild = (childIdx) => {
    const v = (gcInputs[childIdx] || '').trim();
    if (!v) return;
    const child = children[childIdx];
    if (child.children.find((gc) => gc.name === v)) return;
    const updated = [...children];
    updated[childIdx] = { ...child, children: [...child.children, { name: v }] };
    onChange(updated);
    setGcInputs((p) => ({ ...p, [childIdx]: '' }));
  };

  const removeGrandchild = (childIdx, gcIdx) => {
    const updated = [...children];
    updated[childIdx] = {
      ...updated[childIdx],
      children: updated[childIdx].children.filter((_, i) => i !== gcIdx),
    };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700 block">
        Sub-categories <span className="text-gray-400 font-normal">(e.g. Korean, Kurti, Inner Wears)</span>
      </label>

      {children.map((child, ci) => (
        <div key={ci} className="border border-gray-100 rounded-xl p-3 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm text-gray-800">{child.name}</span>
            <button
              type="button"
              onClick={() => removeChild(ci)}
              className="text-xs text-red-400 hover:text-red-600 transition-colors px-2 py-0.5 rounded bg-red-50 hover:bg-red-100"
            >
              Remove
            </button>
          </div>

          {/* Grandchildren */}
          {child.children.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {child.children.map((gc, gi) => (
                <span
                  key={gi}
                  className="inline-flex items-center gap-1 text-xs bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full"
                >
                  {gc.name}
                  <button
                    type="button"
                    onClick={() => removeGrandchild(ci, gi)}
                    className="text-gray-400 hover:text-red-500 leading-none ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              value={gcInputs[ci] || ''}
              onChange={(e) => setGcInputs((p) => ({ ...p, [ci]: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); addGrandchild(ci); }
              }}
              placeholder="Add child item (e.g. Single Piece Kurti)..."
              className="input-field text-xs py-1.5 flex-1"
            />
            <button
              type="button"
              onClick={() => addGrandchild(ci)}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs hover:bg-gray-300 transition-colors"
            >
              +
            </button>
          </div>
        </div>
      ))}

      <div className="flex gap-2">
        <input
          value={childInput}
          onChange={(e) => setChildInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addChild(); } }}
          placeholder="Add sub-category (e.g. Coords, Kurti)..."
          className="input-field flex-1 text-sm"
        />
        <button
          type="button"
          onClick={addChild}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm hover:bg-gray-200 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function CategoryTreeView({ cat }) {
  return (
    <div>
      <h3 className="font-semibold text-gray-900 text-base mb-2">{cat.name}</h3>
      {cat.children?.length > 0 && (
        <div className="pl-4 space-y-1.5">
          {cat.children.map((child) => (
            <div key={child.name}>
              <span className="text-sm text-gray-600">• {child.name}</span>
              {child.children?.length > 0 && (
                <div className="pl-4 flex flex-wrap gap-1.5 mt-1">
                  {child.children.map((gc) => (
                    <span
                      key={gc.name}
                      className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full"
                    >
                      {gc.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_FORM);
  const [adding, setAdding] = useState(false);

  const [editing, setEditing] = useState(null); // { id, gender, name, children }
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/api/categories')
      .then((res) => setCategories(res.data || []))
      .catch(() => setError('Failed to load categories'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const { gender, name, children } = addForm;
    if (!gender.trim() || !name.trim()) return;
    setAdding(true);
    try {
      await api.post('/api/categories', {
        gender: gender.trim(),
        name: name.trim(),
        children,
      });
      setAddForm(EMPTY_FORM);
      setShowAdd(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add category');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? Existing products won't be deleted.`)) return;
    try {
      await api.delete(`/api/categories/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete');
    }
  };

  const startEdit = (cat) => {
    setEditing({
      id: cat._id,
      gender: cat.gender || 'Women',
      name: cat.name || '',
      children: JSON.parse(JSON.stringify(cat.children || [])),
    });
    setError('');
  };

  const handleSave = async () => {
    if (!editing.name.trim()) return;
    setSaving(true);
    try {
      await api.put(`/api/categories/${editing.id}`, {
        gender: editing.gender.trim(),
        name: editing.name.trim(),
        children: editing.children,
      });
      setEditing(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // Group by gender for display
  const grouped = {};
  categories.forEach((cat) => {
    const g = cat.gender || 'Uncategorized';
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push(cat);
  });

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-400">Manage the product category hierarchy</p>
        </div>
        <button
          onClick={() => { setShowAdd(!showAdd); setError(''); }}
          className="btn-primary text-sm py-2.5 px-5"
        >
          {showAdd ? '× Cancel' : '+ Add Category'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 ml-2">×</button>
        </div>
      )}

      {/* Add form */}
      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl shadow-card p-6 mb-5 space-y-4">
          <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">New Category</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Gender *</label>
              <select
                value={addForm.gender}
                onChange={(e) => setAddForm((p) => ({ ...p, gender: e.target.value }))}
                className="input-field"
              >
                {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Category Name *</label>
              <input
                value={addForm.name}
                onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Korean, Ethnic"
                required
                className="input-field"
              />
            </div>
          </div>

          <ChildrenEditor
            children={addForm.children}
            onChange={(ch) => setAddForm((p) => ({ ...p, children: ch }))}
          />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setShowAdd(false); setAddForm(EMPTY_FORM); }}
              className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={adding}
              className="flex-1 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
            >
              {adding ? 'Adding...' : 'Add Category'}
            </button>
          </div>
        </form>
      )}

      {/* Category tree */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card p-16 text-center text-gray-400">
          <p className="mb-2">No categories found.</p>
          <p className="text-xs">Click "Add Category" to create one, or restart the backend to auto-seed defaults.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([gender, cats]) => (
            <div key={gender} className="bg-white rounded-2xl shadow-card overflow-hidden">
              {/* Gender header */}
              <div className="bg-primary-50 px-6 py-3 border-b border-primary-100">
                <h2 className="font-semibold text-primary-800 text-sm tracking-wide uppercase">
                  {gender}
                </h2>
              </div>

              <div className="divide-y divide-gray-50">
                {cats.map((cat) => (
                  <div key={cat._id} className="p-5">
                    {editing?.id === cat._id ? (
                      /* Edit mode */
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Gender</label>
                            <select
                              value={editing.gender}
                              onChange={(e) => setEditing((p) => ({ ...p, gender: e.target.value }))}
                              className="input-field"
                            >
                              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Name</label>
                            <input
                              value={editing.name}
                              onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value }))}
                              className="input-field"
                            />
                          </div>
                        </div>
                        <ChildrenEditor
                          children={editing.children}
                          onChange={(ch) => setEditing((p) => ({ ...p, children: ch }))}
                        />
                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setEditing(null)}
                            className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 disabled:opacity-50"
                          >
                            {saving ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* View mode */
                      <div className="flex items-start justify-between gap-4">
                        <CategoryTreeView cat={cat} />
                        <div className="flex gap-2 flex-shrink-0 mt-0.5">
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
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hierarchy hint */}
      <div className="mt-6 bg-beige border border-primary-100 rounded-2xl p-5">
        <p className="text-xs font-semibold text-gray-600 mb-2">Current Hierarchy</p>
        <pre className="text-xs text-gray-500 leading-relaxed font-mono">
{`Women
  ├─ Korean → Coords / Pants / Bamboo
  └─ Ethnic → Kurti → Single Piece / 2 PC / 3 PC

Men
  └─ Inner Wears`}
        </pre>
      </div>
    </div>
  );
}
