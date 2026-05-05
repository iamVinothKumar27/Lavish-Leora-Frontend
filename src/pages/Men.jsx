import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';

const SUBCATEGORIES = ['All', 'Shirts', 'T-Shirts', 'Jeans', 'Pants', 'Ethnic Wear', 'Co-ords'];

const BANNER_IMG = 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1920&q=80';

export default function Men() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubcat, setActiveSubcat] = useState('All');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ category: 'Men' });
    if (activeSubcat !== 'All') params.append('subcategory', activeSubcat);
    api.get(`/api/products?${params}`)
      .then((res) => setProducts(res.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeSubcat]);

  const sorted = [...products].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="pt-16 md:pt-20">
      {/* Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={BANNER_IMG} alt="Men's Collection" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-700/40 flex items-center">
          <div className="max-w-7xl mx-auto px-6 text-white">
            <p className="text-primary-300 text-sm tracking-[0.3em] uppercase mb-2">For Him</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2">Men's Collection</h1>
            <p className="text-gray-200 font-light">Sharp styles for the modern man</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {SUBCATEGORIES.map((s) => (
              <button
                key={s}
                onClick={() => setActiveSubcat(s)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeSubcat === s
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-700 border border-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-field w-auto text-sm py-2 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        <p className="text-sm text-gray-400 mb-6">{loading ? '...' : `${sorted.length} products`}</p>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i}>
                <div className="shimmer rounded-2xl aspect-[3/4] mb-3" />
                <div className="shimmer h-3 w-16 rounded mb-2" />
                <div className="shimmer h-4 w-28 rounded mb-2" />
                <div className="shimmer h-5 w-12 rounded" />
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="py-24 text-center">
            <div className="text-6xl mb-4">👔</div>
            <h3 className="font-serif text-2xl text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-400">
              {activeSubcat !== 'All' ? `No men's products in "${activeSubcat}" yet.` : 'Products coming soon!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {sorted.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
