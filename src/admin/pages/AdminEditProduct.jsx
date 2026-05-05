import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';

const SIZES_MEN = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const SIZES_WOMEN = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
const SUBCATS = {
  Men: ['Shirts', 'T-Shirts', 'Jeans', 'Pants', 'Ethnic Wear', 'Co-ords'],
  Women: ['Kurtis', 'Co-ords', 'Korean Dresses', 'Tops', 'Western Dresses', 'Sarees', 'Gowns', 'Lehengas', 'Skirts'],
};

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(null);
  const [urlInputs, setUrlInputs] = useState([]); // existing + typed URLs
  const [imageFiles, setImageFiles] = useState([]);  // new File objects
  const [filePreviews, setFilePreviews] = useState([]); // object URLs
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    api.get(`/api/products/${id}`)
      .then((res) => {
        const p = res.data;
        setForm({
          name: p.name || '',
          description: p.description || '',
          price: p.price ?? '',
          category: p.category || 'Women',
          subcategory: p.subcategory || '',
          stock: p.stock ?? '',
          sizes: p.sizes || [],
          featured: p.featured || false,
          newArrival: p.newArrival || false,
          koreanStyle: p.koreanStyle || false,
        });
        setUrlInputs(p.images?.length ? p.images : ['']);
      })
      .catch(() => setError('Failed to load product'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleSize = (sz) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(sz) ? prev.sizes.filter((s) => s !== sz) : [...prev.sizes, sz],
    }));
  };

  // URL inputs
  const handleUrlChange = (i, val) => {
    const updated = [...urlInputs];
    updated[i] = val;
    setUrlInputs(updated);
  };
  const addUrlField = () => setUrlInputs((prev) => [...prev, '']);
  const removeUrlField = (i) => setUrlInputs((prev) => prev.filter((_, idx) => idx !== i));

  // File inputs
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImageFiles((prev) => [...prev, ...files]);
    setFilePreviews((prev) => [...prev, ...previews]);
    e.target.value = '';
  };
  const removeFile = (i) => {
    URL.revokeObjectURL(filePreviews[i]);
    setImageFiles((prev) => prev.filter((_, idx) => idx !== i));
    setFilePreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validUrls = urlInputs.filter((u) => u.trim() !== '');
    if (validUrls.length === 0 && imageFiles.length === 0) {
      setError('Please add at least one image URL or upload an image file.');
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('price', form.price);
      fd.append('category', form.category);
      fd.append('subcategory', form.subcategory);
      fd.append('stock', form.stock);
      fd.append('featured', form.featured);
      fd.append('newArrival', form.newArrival);
      fd.append('koreanStyle', form.koreanStyle);
      form.sizes.forEach((s) => fd.append('sizes', s));
      validUrls.forEach((u) => fd.append('imageUrls', u));
      imageFiles.forEach((f) => fd.append('imageFiles', f));

      await api.put(`/api/products/${id}`, fd);
      setSuccess('Product updated successfully!');
      setTimeout(() => navigate('/admin/products'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading product...</div>;
  if (!form) return <div className="text-center py-20 text-red-500">{error || 'Product not found'}</div>;

  const sizes = form.category === 'Men' ? SIZES_MEN : SIZES_WOMEN;
  const subcats = SUBCATS[form.category] || [];

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/products" className="text-gray-400 hover:text-primary-600 transition-colors text-sm">
          ← Products
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="font-serif text-2xl font-bold text-gray-900">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic info */}
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
          <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-3">Basic Information</h2>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Product Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={4} className="input-field resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Price (₹) *</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} required min="0" className="input-field" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Stock</label>
              <input name="stock" type="number" value={form.stock} onChange={handleChange} min="0" className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Category *</label>
              <select name="category" value={form.category} onChange={(e) => { handleChange(e); setForm((p) => ({ ...p, subcategory: '' })); }} required className="input-field">
                <option value="Women">Women</option>
                <option value="Men">Men</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Subcategory</label>
              <select name="subcategory" value={form.subcategory} onChange={handleChange} className="input-field">
                <option value="">Select subcategory</option>
                {subcats.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-3 mb-4">Available Sizes</h2>
          <div className="flex flex-wrap gap-2">
            {sizes.map((sz) => (
              <button key={sz} type="button" onClick={() => toggleSize(sz)}
                className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                  form.sizes.includes(sz) ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-200 text-gray-600 hover:border-primary-400'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-3 mb-4">Product Images</h2>

          {/* URL inputs — initialized with existing images */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">Image URLs</p>
              <button type="button" onClick={addUrlField} className="text-xs text-primary-600 font-medium hover:underline">
                + Add URL
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-3">Edit or remove existing URLs, or add new ones.</p>
            <div className="space-y-3">
              {urlInputs.map((url, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <input
                      value={url}
                      onChange={(e) => handleUrlChange(i, e.target.value)}
                      placeholder="https://..."
                      className="input-field text-xs"
                    />
                    {url.trim() && (
                      <img
                        src={url}
                        alt="preview"
                        className="mt-2 w-20 h-20 object-cover rounded-xl border border-gray-100"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                  </div>
                  {urlInputs.length > 1 && (
                    <button type="button" onClick={() => removeUrlField(i)} className="mt-2 text-red-400 hover:text-red-600 text-lg leading-none">×</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* File upload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">Upload New Images</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs bg-primary-50 text-primary-600 border border-primary-200 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors font-medium"
              >
                Choose Files
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-3">Uploaded files will be added alongside existing images.</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
            {filePreviews.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {filePreviews.map((src, i) => (
                  <div key={i} className="relative group">
                    <img src={src} alt="upload preview" className="w-20 h-20 object-cover rounded-xl border border-gray-200" />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                    <p className="text-xs text-gray-400 mt-1 max-w-[80px] truncate">{imageFiles[i]?.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Flags */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-semibold text-gray-800 border-b border-gray-100 pb-3 mb-4">Product Flags</h2>
          <div className="space-y-3">
            {[
              { name: 'newArrival', label: 'New Arrival' },
              { name: 'featured', label: 'Featured' },
              { name: 'koreanStyle', label: 'Korean Style' },
            ].map(({ name, label }) => (
              <label key={name} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} className="w-4 h-4 accent-primary-600" />
                <span className="text-sm font-medium text-gray-800">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl">{success}</div>}

        <div className="flex gap-3 pb-8">
          <Link to="/admin/products" className="btn-outline flex-1 text-center py-3">Cancel</Link>
          <button
            type="submit" disabled={saving}
            className={`flex-1 py-3 rounded-full font-semibold text-sm transition-all ${
              saving ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 text-white'
            }`}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
