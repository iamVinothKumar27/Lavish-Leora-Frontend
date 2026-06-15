import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ImageCarousel from '../components/ImageCarousel';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, items, updateQuantity, removeItem } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [cartState, setCartState] = useState('idle'); // 'idle' | 'loading' | 'error'
  const [sizeError, setSizeError] = useState(false);
  const [qtyLoading, setQtyLoading] = useState(false);

  // Cart item matching this product + currently selected size
  const cartItem = items.find(
    (item) => (item.product?.toString?.() ?? item.product) === id && item.size === selectedSize
  );
  const isInCart = !!cartItem;
  const cartItemQty = cartItem?.quantity || 0;
  const addedToCart = cartState === 'idle' && isInCart;

  // Fetch product on id change
  useEffect(() => {
    setLoading(true);
    setCartState('idle');
    setSelectedSize('');
    setSelectedColor('');
    setSizeError(false);
    api.get(`/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setSelectedColor(res.data.colors?.[0] || '');
        return api.get(`/api/products?category=${res.data.category}&limit=5`);
      })
      .then((res) => setRelated((res.data.products || []).filter((p) => p._id !== id).slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  // Auto-restore size from cart when navigating back to this page
  useEffect(() => {
    if (!product || selectedSize) return;
    const existing = items.find((item) => (item.product?.toString?.() ?? item.product) === id);
    if (existing) setSelectedSize(existing.size);
  }, [product, id, items]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }
    if (product.sizes?.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    setCartState('loading');
    try {
      await addToCart(id, selectedSize, 1);
      setCartState('idle');
    } catch {
      setCartState('error');
      setTimeout(() => setCartState('idle'), 2500);
    }
  };

  const handleCartQtyChange = async (delta) => {
    if (qtyLoading) return;
    setQtyLoading(true);
    try {
      const newQty = cartItemQty + delta;
      if (newQty <= 0) await removeItem(id, selectedSize);
      else await updateQuantity(id, selectedSize, newQty);
    } catch {} finally {
      setQtyLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="shimmer rounded-2xl aspect-[3/4]" />
          <div className="space-y-4 pt-4">
            <div className="shimmer h-4 w-24 rounded" />
            <div className="shimmer h-8 w-64 rounded" />
            <div className="shimmer h-6 w-20 rounded" />
            <div className="shimmer h-24 rounded" />
            <div className="shimmer h-12 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-20 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="font-serif text-2xl mb-3">Product not found</h2>
          <Link to="/products" className="btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  const cartBtnText =
    product.stock === 0 ? 'Out of Stock'
    : cartState === 'loading' ? 'Adding...'
    : cartState === 'error' ? 'Failed — Try Again'
    : 'Add to Cart';

  const cartBtnClass =
    product.stock === 0
      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
    : cartState === 'loading'
      ? 'bg-primary-400 text-white cursor-wait'
    : cartState === 'error'
      ? 'bg-red-500 text-white'
    : 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-hover hover:-translate-y-0.5';

  return (
    <div className="pt-16 md:pt-20">
      {/* Breadcrumb */}
      <div className="bg-beige border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-400">
            <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <span>/</span>
            <Link to={`/${product.category.toLowerCase()}`} className="hover:text-primary-600 transition-colors capitalize">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gray-600 font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <ImageCarousel images={product.images} allowDownload productName={product.name} />

          {/* Details */}
          <div className="flex flex-col">
            {/* Category + badges */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-xs text-primary-500 font-medium tracking-wide uppercase">
                {product.category}{product.subcategory ? ` · ${product.subcategory}` : ''}
                {product.subCategory ? ` · ${product.subCategory}` : ''}
                {product.childCategory ? ` · ${product.childCategory}` : ''}
              </span>
              {product.newArrival && (
                <span className="tag bg-primary-100 text-primary-700">New Arrival</span>
              )}
              {product.featured && (
                <span className="tag bg-gold/10 text-gold">Featured</span>
              )}
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>

            <p className="font-serif text-3xl font-bold text-primary-700 mb-6">
              ₹{product.price?.toLocaleString('en-IN')}
            </p>

            <p className="text-gray-500 leading-relaxed mb-8 text-sm">
              {product.description}
            </p>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Color:{' '}
                  {selectedColor && <span className="font-normal text-primary-600">{selectedColor}</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                        selectedColor === c
                          ? 'border-primary-600 bg-primary-600 text-white shadow-md'
                          : 'border-gray-200 text-gray-600 hover:border-primary-400'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Select Size:{' '}
                  {selectedSize && <span className="font-normal text-primary-600">{selectedSize}</span>}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => { setSelectedSize(sz); setSizeError(false); }}
                      className={`w-12 h-12 rounded-xl border-2 text-sm font-semibold transition-all ${
                        selectedSize === sz
                          ? 'border-primary-600 bg-primary-600 text-white shadow-md'
                          : 'border-gray-200 text-gray-600 hover:border-primary-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
                {sizeError && (
                  <p className="text-red-500 text-xs mt-2">Please select a size before adding to cart.</p>
                )}
              </div>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2 mb-8">
              <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Login prompt */}
            {!user && (
              <div className="mb-4 bg-primary-50 border border-primary-200 rounded-xl px-4 py-3 text-sm text-primary-700">
                <Link to="/login" className="font-semibold underline">Sign in</Link> to add products to your cart.
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              {addedToCart ? (
                <div className="flex-1 flex items-center justify-between bg-green-50 border-2 border-green-400 rounded-full px-5 py-2">
                  <span className="text-green-700 font-semibold text-sm">✓ In Cart</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCartQtyChange(-1)}
                      disabled={qtyLoading}
                      className="w-9 h-9 rounded-full border-2 border-green-400 text-green-700 font-bold text-lg flex items-center justify-center hover:bg-green-100 transition-all disabled:opacity-50"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-bold text-green-800 text-base">{cartItemQty}</span>
                    <button
                      onClick={() => handleCartQtyChange(+1)}
                      disabled={qtyLoading}
                      className="w-9 h-9 rounded-full border-2 border-green-400 text-green-700 font-bold text-lg flex items-center justify-center hover:bg-green-100 transition-all disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || cartState === 'loading'}
                  className={`flex-1 py-4 rounded-full font-semibold text-base transition-all ${cartBtnClass}`}
                >
                  {cartBtnText}
                </button>
              )}
              <a
                href={`https://wa.me/916369931994?text=${encodeURIComponent(
                  `Hi! I'm interested in: ${product.name} (Rs.${product.price?.toLocaleString('en-IN')})${selectedColor ? ` — Color: ${selectedColor}` : ''}${selectedSize ? ` — Size: ${selectedSize}` : ''}. Is it available?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-4 rounded-full font-semibold text-base border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white transition-all text-center flex items-center justify-center gap-2"
              >
                Enquire on WhatsApp
              </a>
            </div>

            {/* Cart link after adding */}
            {addedToCart && (
              <Link to="/cart" className="mt-3 text-center text-sm text-primary-600 hover:underline font-medium">
                View Cart →
              </Link>
            )}

            {/* Info */}
            <div className="mt-8 p-4 bg-beige rounded-2xl space-y-2">
              {[
                { icon: '📲', text: 'Order instantly via WhatsApp — no payment needed now' },
                { icon: '✓', text: 'Quality checked & premium packaging' },
                { icon: '📦', text: 'We confirm stock before delivery' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{icon}</span> {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {related.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
