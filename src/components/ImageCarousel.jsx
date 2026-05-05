import { useState } from 'react';

const FALLBACK = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80';

export default function ImageCarousel({ images = [] }) {
  const imgs = images.length ? images : [FALLBACK];
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a - 1 + imgs.length) % imgs.length);
  const next = () => setActive((a) => (a + 1) % imgs.length);

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative overflow-hidden rounded-2xl aspect-[3/4] bg-beige shadow-soft">
        <img
          src={imgs[active]}
          alt="Product"
          className="w-full h-full object-cover transition-opacity duration-300"
          onError={(e) => { e.target.src = FALLBACK; }}
        />
        {imgs.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-soft flex items-center justify-center transition-all"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-soft flex items-center justify-center transition-all"
              aria-label="Next"
            >
              ›
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {imgs.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === active ? 'bg-white w-5' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {imgs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {imgs.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all ${
                i === active ? 'ring-2 ring-primary-500 ring-offset-1' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = FALLBACK; }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
