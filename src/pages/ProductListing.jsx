import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const [sort, setSort] = useState('newest');
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    api.get(`/api/products?${params}`)
      .then((res) => setProducts(res.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, search]);

  const sorted = [...products].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(searchInput ? { search: searchInput } : {});
  };

  return (
    <div className="pt-16 md:pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-serif text-4xl font-bold mb-2">
            {category ? `${category}'s Collection` : search ? `Results for "${search}"` : 'All Products'}
          </h1>
          <p className="text-primary-200 font-light">Discover our premium fashion collection</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Search + Sort bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Search dresses, styles..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary py-2.5 px-5 text-sm">
              Search
            </button>
          </form>
          <div className="flex gap-2">
            {['', 'Men', 'Women'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSearchParams(cat ? { category: cat } : {})}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  category === cat
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-primary-400'
                }`}
              >
                {cat || 'All'}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input-field w-auto text-sm py-2"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
          </select>
        </div>

        <p className="text-sm text-gray-400 mb-6">
          {loading ? 'Loading...' : `${sorted.length} products found`}
        </p>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i}>
                <div className="shimmer rounded-2xl aspect-[3/4] mb-3" />
                <div className="shimmer h-3 w-16 rounded mb-2" />
                <div className="shimmer h-4 w-28 rounded" />
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="py-24 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-serif text-2xl text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-400 mb-6">Try a different search or browse all categories.</p>
            <button onClick={() => { setSearchInput(''); setSearchParams({}); }} className="btn-primary">
              Browse All Products
            </button>
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
