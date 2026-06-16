import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';
import { useActiveCategories } from '../hooks/useActiveCategories';

const HERO_IMG = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1920&q=85';

const KOREAN_IMG_1 = 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&w=800&q=80';
const KOREAN_IMG_2 = 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80';

// Image map for known category names — fallback for unknown ones
const CAT_IMAGES = {
  Korean:       'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&w=800&q=80',
  Ethnic:       'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?auto=format&fit=crop&w=800&q=80',
  'Inner Wears':'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80',
  Casual:       'https://images.unsplash.com/photo-1552374196-1ab2a1c389c8?auto=format&fit=crop&w=800&q=80',
  Formal:       'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  Western:      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80',
};
const FALLBACK_CAT_IMG = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80';

// Dedicated page routes for known categories; others fall back to filtered listing
const CAT_ROUTES = {
  Korean: '/korean',
  Ethnic: '/ethnic',
};
function getCatLink(gender, name) {
  if (CAT_ROUTES[name]) return CAT_ROUTES[name];
  if (gender === 'Women') return `/women?mainCat=${encodeURIComponent(name)}`;
  return `/products?category=${encodeURIComponent(gender)}&subcategory=${encodeURIComponent(name)}`;
}

const MARQUEE_ITEMS = [
  '🆕 New products launched every Thursday',
  '✨ Korean style dresses now available',
  '🌸 Fresh arrivals every week',
  '💎 Premium quality collections',
  '🛍️ Visit Lavish Leora for latest trends',
  '📍 Store: 230 Kongu Main Road, Tirupur',
  '📲 Order via WhatsApp: 6369931994',
  '🎀 Exclusive K-Fashion designs',
];

const WHY_ITEMS = [
  { icon: '✦', title: 'Korean Style', desc: 'Curated Korean fashion trends brought to your doorstep.' },
  { icon: '♛', title: 'Premium Quality', desc: 'Every piece crafted with the finest materials for lasting elegance.' },
  { icon: '◈', title: 'Unique Designs', desc: "Exclusive designs you won't find anywhere else in Tirupur." },
  { icon: '◯', title: 'WhatsApp Orders', desc: 'Order instantly via WhatsApp — simple, fast, and personal.' },
];

function CategoryCard({ gender, cat }) {
  const img = CAT_IMAGES[cat.name] || FALLBACK_CAT_IMG;
  const subText = (cat.children || []).map((c) => c.name).join(' · ');
  return (
    <Link
      to={getCatLink(gender, cat.name)}
      className="group relative overflow-hidden rounded-2xl aspect-[3/4] block shadow-card hover:shadow-hover transition-all duration-300"
    >
      <img
        src={img}
        alt={cat.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        onError={(e) => { e.target.src = FALLBACK_CAT_IMG; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <p className="font-serif text-xl font-bold leading-tight">{cat.name}</p>
        {subText && <p className="text-xs text-gray-300 mt-0.5 line-clamp-1">{subText}</p>}
        <p className="text-xs text-primary-300 mt-1.5 font-medium">Shop Now →</p>
      </div>
    </Link>
  );
}

export default function Home() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loadingArrivals, setLoadingArrivals] = useState(true);
  const [categories, setCategories] = useState([]);
  const activeCategories = useActiveCategories();

  const hasMen    = activeCategories?.some((c) => c.toLowerCase() === 'men');
  const hasWomen  = activeCategories === null || activeCategories?.some((c) => c.toLowerCase() === 'women');

  const womenCats = categories.filter((c) => c.gender === 'Women');
  const menCats   = categories.filter((c) => c.gender === 'Men');

  useEffect(() => {
    api.get('/api/products?newArrival=true&limit=4')
      .then((res) => setNewArrivals(res.data.products || []))
      .catch(() => setNewArrivals([]))
      .finally(() => setLoadingArrivals(false));

    api.get('/api/categories')
      .then((res) => setCategories(res.data || []))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${HERO_IMG})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/85 via-gray-900/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-xl animate-fade-up">
            <p className="text-primary-300 text-sm font-medium tracking-[0.3em] uppercase mb-4">
              Korean Fashion · New Collection 2025
            </p>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              Where Style<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-lavender">
                Meets Grace
              </span>
            </h1>
            <p className="text-gray-300 text-lg font-light leading-relaxed mb-8 max-w-md">
              Discover premium Korean-style dresses and women's fashion collections crafted for those who dare to be elegant.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/women" className="btn-primary text-base px-8 py-3.5">Shop Women →</Link>
              {hasMen && (
                <Link to="/men" className="btn-outline border-white text-white hover:bg-white hover:text-gray-900 text-base px-8 py-3.5">
                  Shop Men
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-0.5 h-8 bg-white/30 rounded-full animate-pulse" />
          <p className="text-white/50 text-xs tracking-widest">SCROLL</p>
        </div>
      </section>

      {/* ── Marquee ── */}
      <section className="bg-primary-900 text-white py-3 overflow-hidden">
        <div className="marquee-track flex gap-0 whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-primary-100 text-sm font-light px-8">
              {item}
              <span className="text-gold text-xs">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-primary-500 text-sm font-medium tracking-[0.25em] uppercase mb-2">Just In</p>
          <h2 className="section-title">New Arrivals</h2>
          <p className="section-subtitle">Fresh styles added every week — be the first to wear the latest looks</p>
        </div>
        {loadingArrivals ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="shimmer aspect-[3/4] w-full rounded-2xl" />
                <div className="p-4 space-y-2">
                  <div className="shimmer h-3 w-20 rounded" />
                  <div className="shimmer h-4 w-36 rounded" />
                  <div className="shimmer h-5 w-16 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {newArrivals.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-4">Products coming soon. Check back later!</p>
            <p className="text-xs text-gray-300">Add products via Admin Panel to see them here.</p>
          </div>
        )}
        <div className="text-center mt-10">
          <Link to="/products" className="btn-outline">View All Products</Link>
        </div>
      </section>

      {/* ── Korean Style Promo ── */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img src={KOREAN_IMG_1} alt="Korean style dress" className="rounded-2xl w-full h-64 object-cover shadow-hover" onError={(e) => { e.target.src = KOREAN_IMG_2; }} />
                <img src={KOREAN_IMG_2} alt="Korean fashion" className="rounded-2xl w-full h-64 object-cover shadow-hover mt-8" onError={(e) => { e.target.src = KOREAN_IMG_1; }} />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gold text-white px-5 py-3 rounded-2xl shadow-lg">
                <p className="font-serif text-lg font-bold">Korean Style</p>
                <p className="text-xs font-light">Exclusive Collection</p>
              </div>
            </div>
            <div className="text-white">
              <p className="text-primary-300 text-sm font-medium tracking-[0.25em] uppercase mb-3">Signature Collection</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Korean Style<br /><span className="text-primary-300">Redefined</span>
              </h2>
              <p className="text-gray-300 font-light leading-relaxed mb-6">
                We bring you authentic Korean fashion straight from Seoul's trending streets. Each piece combines modern Korean aesthetics with premium comfort — flowing silhouettes, delicate details, and effortless elegance.
              </p>
              <ul className="space-y-2 mb-8">
                {['Authentic K-Fashion designs', 'Premium breathable fabrics', 'Sizes for all body types', 'New styles every Thursday'].map((i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                    <span className="text-gold">✓</span> {i}
                  </li>
                ))}
              </ul>
              <Link to="/korean" className="btn-gold">Explore Korean Dresses</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Women's Collections (dynamic from backend) ── */}
      {hasWomen && (
        <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-primary-500 text-sm font-medium tracking-[0.25em] uppercase mb-1">For Her</p>
              <h2 className="section-title mb-1">Women's Collections</h2>
              <p className="text-gray-400 text-sm">Curated styles for every occasion</p>
            </div>
            <Link to="/women" className="btn-outline text-sm py-2.5 px-6 self-start sm:self-auto">
              View All Women →
            </Link>
          </div>
          {womenCats.length > 0 ? (
            <div className={`grid gap-6 ${womenCats.length === 1 ? 'grid-cols-1 max-w-xs' : womenCats.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
              {womenCats.map((cat) => (
                <CategoryCard key={cat._id} gender="Women" cat={cat} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 text-sm">
              Add categories in the Admin Panel to show them here.
            </div>
          )}
        </section>
      )}

      {/* ── Men's Collection (dynamic from backend) ── */}
      {hasMen && (
        <section className="py-8 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-primary-500 text-sm font-medium tracking-[0.25em] uppercase mb-1">For Him</p>
              <h2 className="section-title mb-1">Men's Collection</h2>
              <p className="text-gray-400 text-sm">Sharp styles for the modern man</p>
            </div>
            <Link to="/men" className="btn-outline text-sm py-2.5 px-6 self-start sm:self-auto">
              View All Men →
            </Link>
          </div>
          {menCats.length > 0 ? (
            <div className={`grid gap-6 ${menCats.length === 1 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl' : menCats.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
              {menCats.map((cat) => (
                <CategoryCard key={cat._id} gender="Men" cat={cat} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 text-sm">
              Add men's categories in the Admin Panel to show them here.
            </div>
          )}
        </section>
      )}

      {/* ── Why Choose Us ── */}
      <section className="bg-beige py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary-500 text-sm font-medium tracking-[0.25em] uppercase mb-2">Our Promise</p>
            <h2 className="section-title">Why Choose Lavish Leora</h2>
            <p className="section-subtitle">We believe premium fashion should be accessible, elegant, and timeless</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_ITEMS.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white p-7 rounded-2xl shadow-card text-center group hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary-100 transition-colors">
                  <span className="text-primary-600 text-2xl">{icon}</span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-r from-primary-700 to-primary-900 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Ready to Elevate Your Style?</h2>
          <p className="text-primary-200 text-lg font-light mb-8">
            Visit our store in Tirupur or browse our collection online. Premium Korean fashion awaits.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/products" className="bg-white text-primary-700 hover:bg-primary-50 px-8 py-3.5 rounded-full font-semibold transition-all hover:shadow-hover">
              Shop Now
            </Link>
            <a
              href="https://wa.me/916369931994"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-white/50 hover:border-white text-white px-8 py-3.5 rounded-full font-medium transition-all flex items-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Order on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
