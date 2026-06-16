import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import api from '../utils/api';

const ITEMS_PER_PAGE = 20;

function Chip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 border border-primary-200 text-xs font-medium px-3 py-1.5 rounded-full">
      {label}
      <button onClick={onRemove} className="text-primary-400 hover:text-primary-700 leading-none ml-0.5 text-sm">×</button>
    </span>
  );
}

// banner: { src, title, subtitle, tagline }
export default function FilteredCategoryPage({ gender, fixedMainCat = null, banner }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [available, setAvailable] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Read filter state from URL
  const page        = parseInt(searchParams.get('page') || '1', 10);
  const sort        = searchParams.get('sort') || 'newest';
  const mainCat     = fixedMainCat || searchParams.get('mainCat') || '';
  const subCats     = searchParams.getAll('subCat');
  const childCats   = searchParams.getAll('childCat');
  const minPrice    = searchParams.get('minPrice') || '';
  const maxPrice    = searchParams.get('maxPrice') || '';
  const sizes       = searchParams.getAll('size');
  const colors      = searchParams.getAll('color');

  const filters = {
    mainCat,
    subCategories:  subCats,
    childCategories: childCats,
    minPrice,
    maxPrice,
    sizes,
    colors,
    sort,
  };

  // Fetch available sidebar options whenever gender/mainCat changes
  useEffect(() => {
    const params = new URLSearchParams({ gender });
    if (mainCat) params.append('subcategory', mainCat);
    api.get(`/api/categories/available?${params}`)
      .then((res) => setAvailable(res.data || {}))
      .catch(() => {});
  }, [gender, mainCat]);

  // Fetch products whenever any filter changes
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      category: gender,
      limit:    String(ITEMS_PER_PAGE),
      page:     String(page),
      sort,
    });
    if (mainCat)   params.append('subcategory', mainCat);
    subCats.forEach((sc) => params.append('subCategory', sc));
    childCats.forEach((cc) => params.append('childCategory', cc));
    if (minPrice)  params.append('minPrice', minPrice);
    if (maxPrice)  params.append('maxPrice', maxPrice);
    sizes.forEach((sz) => params.append('size', sz));
    colors.forEach((col) => params.append('color', col));

    api.get(`/api/products?${params}`)
      .then((res) => {
        setProducts(res.data.products || []);
        setTotalProducts(res.data.totalProducts || 0);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch(() => { setProducts([]); setTotalProducts(0); setTotalPages(1); })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gender, mainCat, subCats.join(','), childCats.join(','), minPrice, maxPrice, sizes.join(','), colors.join(','), sort, page]);

  // Update a filter key in the URL
  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    next.delete('page'); // reset pagination on filter change

    switch (key) {
      case 'sort':
        if (value === 'newest') next.delete('sort'); else next.set('sort', value);
        break;
      case 'mainCat':
        next.delete('mainCat'); next.delete('subCat'); next.delete('childCat');
        if (value) next.set('mainCat', value);
        break;
      case 'subCategories':
        next.delete('subCat'); next.delete('childCat');
        value.forEach((v) => next.append('subCat', v));
        break;
      case 'childCategories':
        next.delete('childCat');
        value.forEach((v) => next.append('childCat', v));
        break;
      case 'minPrice':
        if (value) next.set('minPrice', value); else next.delete('minPrice');
        break;
      case 'maxPrice':
        if (value) next.set('maxPrice', value); else next.delete('maxPrice');
        break;
      case 'sizes':
        next.delete('size');
        value.forEach((v) => next.append('size', v));
        break;
      case 'colors':
        next.delete('color');
        value.forEach((v) => next.append('color', v));
        break;
      default:
        break;
    }
    setSearchParams(next);
  };

  const clearAll = () => setSearchParams(new URLSearchParams());

  const goToPage = (p) => {
    const next = new URLSearchParams(searchParams);
    if (p === 1) next.delete('page'); else next.set('page', String(p));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFilterCount = [
    !fixedMainCat && mainCat ? 1 : 0,
    subCats.length,
    childCats.length,
    sizes.length,
    colors.length,
    minPrice ? 1 : 0,
    maxPrice ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const pageNumbers = (() => {
    const nums = [];
    const start = Math.max(1, page - 2);
    const end   = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i++) nums.push(i);
    return nums;
  })();

  return (
    <div className="pt-16 md:pt-20">
      {/* Banner */}
      <div className="relative h-52 md:h-64 overflow-hidden">
        <img src={banner.src} alt={banner.title} className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-primary-700/40 flex items-center">
          <div className="max-w-7xl mx-auto px-6 text-white">
            <p className="text-primary-200 text-xs tracking-[0.35em] uppercase mb-2">{banner.tagline}</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-1">{banner.title}</h1>
            <p className="text-gray-200 font-light text-sm">{banner.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Mobile filter bar — sticky below header */}
      <div className="lg:hidden sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm px-4 py-2.5 flex items-center justify-between">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-primary-400 hover:text-primary-600 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-primary-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{loading ? '…' : `${totalProducts} items`}</span>
          <select
            value={sort}
            onChange={(e) => setFilter('sort', e.target.value)}
            className="border border-gray-200 rounded-xl text-xs py-1.5 px-2 focus:outline-none focus:border-primary-400"
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8 items-start">

          {/* Sidebar */}
          <FilterSidebar
            available={available}
            fixedMainCat={fixedMainCat}
            filters={filters}
            onChange={setFilter}
            onClear={clearAll}
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          />

          {/* Product area */}
          <div className="flex-1 min-w-0">

            {/* Desktop toolbar */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                {loading ? (
                  'Loading…'
                ) : (
                  <>
                    <span className="font-semibold text-gray-800">{totalProducts}</span> products found
                    {activeFilterCount > 0 && (
                      <button onClick={clearAll} className="ml-3 text-xs text-primary-600 hover:underline">
                        Clear all filters ×
                      </button>
                    )}
                  </>
                )}
              </p>
              <select
                value={sort}
                onChange={(e) => setFilter('sort', e.target.value)}
                className="border border-gray-200 rounded-xl text-sm py-2 px-3 focus:outline-none focus:border-primary-400 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {!fixedMainCat && mainCat && (
                  <Chip label={mainCat} onRemove={() => setFilter('mainCat', '')} />
                )}
                {subCats.map((sc) => (
                  <Chip key={sc} label={sc} onRemove={() => setFilter('subCategories', subCats.filter((x) => x !== sc))} />
                ))}
                {childCats.map((cc) => (
                  <Chip key={cc} label={cc} onRemove={() => setFilter('childCategories', childCats.filter((x) => x !== cc))} />
                ))}
                {sizes.map((sz) => (
                  <Chip key={sz} label={`Size: ${sz}`} onRemove={() => setFilter('sizes', sizes.filter((x) => x !== sz))} />
                ))}
                {colors.map((col) => (
                  <Chip key={col} label={col} onRemove={() => setFilter('colors', colors.filter((x) => x !== col))} />
                ))}
                {minPrice && <Chip label={`Min ₹${minPrice}`} onRemove={() => setFilter('minPrice', '')} />}
                {maxPrice && <Chip label={`Max ₹${maxPrice}`} onRemove={() => setFilter('maxPrice', '')} />}
              </div>
            )}

            {/* Product grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
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
              <div className="py-24 text-center bg-white rounded-2xl shadow-card">
                <div className="text-6xl mb-4">👗</div>
                <h3 className="font-serif text-2xl text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-400 mb-6 text-sm">Try removing some filters to see more results.</p>
                <button onClick={clearAll} className="btn-primary text-sm py-2.5 px-6">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-full text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                {pageNumbers.map((n) => (
                  <button
                    key={n}
                    onClick={() => goToPage(n)}
                    className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
                      n === page
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-700 border border-gray-200'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-full text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
