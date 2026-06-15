import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';

const ITEMS_PER_PAGE = 20;

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const category = searchParams.get('category') || '';
  const subcategory = searchParams.get('subcategory') || '';
  const subCategory = searchParams.get('subCategory') || '';
  const childCategory = searchParams.get('childCategory') || '';
  const search = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      limit: String(ITEMS_PER_PAGE),
      page: String(currentPage),
      sort,
    });
    if (category) params.append('category', category);
    if (subcategory) params.append('subcategory', subcategory);
    if (subCategory) params.append('subCategory', subCategory);
    if (childCategory) params.append('childCategory', childCategory);
    if (search) params.append('search', search);
    api.get(`/api/products?${params}`)
      .then((res) => {
        setProducts(res.data.products || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalProducts(res.data.totalProducts || 0);
      })
      .catch(() => {
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      })
      .finally(() => setLoading(false));
  }, [category, subcategory, subCategory, childCategory, search, sort, currentPage]);

  const handleCategoryChange = (cat) => {
    setSearchParams(cat ? { category: cat } : {});
    setCurrentPage(1);
  };

  const handleSort = (s) => {
    setSort(s);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(searchInput ? { search: searchInput } : {});
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  // Build a human-readable page title
  const pageTitle = childCategory || subCategory || subcategory
    ? (childCategory || subCategory || subcategory)
    : category
    ? `${category}'s Collection`
    : search
    ? `Results for "${search}"`
    : 'All Products';

  const pageSubtitle = [category, subcategory, subCategory, childCategory].filter(Boolean).join(' › ');

  return (
    <div className="pt-16 md:pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-serif text-4xl font-bold mb-2">{pageTitle}</h1>
          {pageSubtitle && pageSubtitle !== pageTitle && (
            <p className="text-primary-300 text-sm mt-1">{pageSubtitle}</p>
          )}
          <p className="text-primary-200 font-light mt-1">Discover our premium fashion collection</p>
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
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  category === cat && !subcategory && !subCategory && !childCategory
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
            onChange={(e) => handleSort(e.target.value)}
            className="input-field w-auto text-sm py-2"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
          </select>
        </div>

        <p className="text-sm text-gray-400 mb-6">
          {loading ? 'Loading...' : `${totalProducts} products found`}
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
        ) : products.length === 0 ? (
          <div className="py-24 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-serif text-2xl text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-400 mb-6">Try a different search or browse all categories.</p>
            <button
              onClick={() => { setSearchInput(''); setSearchParams({}); setCurrentPage(1); }}
              className="btn-primary"
            >
              Browse All Products
            </button>
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
