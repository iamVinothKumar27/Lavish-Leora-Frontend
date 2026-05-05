import { Link } from 'react-router-dom';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80';

export default function ProductCard({ product }) {
  const { _id, name, price, category, images, newArrival, featured, subcategory } = product;
  const img = images?.[0] || FALLBACK_IMG;

  return (
    <Link
      to={`/products/${_id}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-card card-hover"
    >
      <div className="relative overflow-hidden aspect-[3/4] bg-beige">
        <img
          src={img}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.src = FALLBACK_IMG; }}
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {newArrival && (
            <span className="tag bg-primary-600 text-white shadow-sm">New</span>
          )}
          {featured && (
            <span className="tag bg-gold text-white shadow-sm">Featured</span>
          )}
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-white text-gray-900 text-xs font-semibold px-4 py-2 rounded-full shadow-md translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            View Details
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-primary-500 font-medium mb-0.5 uppercase tracking-wide">
              {category}{subcategory ? ` · ${subcategory}` : ''}
            </p>
            <h3 className="font-serif text-gray-900 font-semibold text-base leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors">
              {name}
            </h3>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-serif text-xl font-bold text-gray-900">
            ₹{price?.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
            Shop Now →
          </span>
        </div>
      </div>
    </Link>
  );
}
