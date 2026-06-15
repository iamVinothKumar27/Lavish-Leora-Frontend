import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';

const SUBCATEGORIES = ['All', 'Korean', 'Ethnic'];
const BANNER_IMG = 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1920&q=80';
const ITEMS_PER_PAGE = 20;

export default function Women() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubcat, setActiveSubcat] = useState('All');
  const [sort, setSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      category: 'Women',
      limit: String(ITEMS_PER_PAGE),
      page: String(currentPage),
      sort,
    });
    if (activeSubcat !== 'All') params.append('subcategory', activeSubcat);
    api.get(`/api/products?${params}`)
      .then((res) => {
        setProducts(res.data.products || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalProducts(res.data.totalProducts || 0);
        console.log('[Women] total:', res.data.totalProducts, '| page:', currentPage, '| received:', (res.data.products || []).length);
      })
      .catch(() => {
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      })
      .finally(() => setLoading(false));
  }, [activeSubcat, sort, currentPage]);

  const handleSubcat = (s) => {
    setActiveSubcat(s);
    setCurrentPage(1);
  };

  const handleSort = (s) => {
    setSort(s);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="pt-16 md:pt-20">
      {/* Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={BANNER_IMG} alt="Women's Collection" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/75 to-primary-700/40 flex items-center">
          <div className="max-w-7xl mx-auto px-6 text-white">
            <p className="text-primary-200 text-sm tracking-[0.3em] uppercase mb-2">For Her</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2">Women's Collection</h1>
            <p className="text-gray-200 font-light">Elegant pieces for every occasion</p>
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
                onClick={() => handleSubcat(s)}
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
            onChange={(e) => handleSort(e.target.value)}
            className="input-field w-auto text-sm py-2 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        {/* Count */}
        <p className="text-sm text-gray-400 mb-6">
          {loading ? '...' : `${totalProducts} products`}
        </p>

        {/* Grid */}
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
        ) : products.length === 0 ? (
          <div className="py-24 text-center">
            <div className="text-6xl mb-4">👗</div>
            <h3 className="font-serif text-2xl text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-400">
              {activeSubcat !== 'All' ? `No women's products in "${activeSubcat}" yet.` : 'Products coming soon!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-full text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            {getPageNumbers().map((n) => (
              <button
                key={n}
                onClick={() => setCurrentPage(n)}
                className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
                  n === currentPage
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-700 border border-gray-200'
                }`}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-full text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
