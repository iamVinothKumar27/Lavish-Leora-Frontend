import { useState } from 'react';
import { resolveImageUrl } from '../utils/imageUrl';
import { downloadImage } from '../utils/download';

const FALLBACK = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80';

export default function ImageCarousel({ images = [], allowDownload = false, productName = 'image' }) {
  const rawImgs = images.length ? images : [FALLBACK];
  const imgs = rawImgs.map((u) => resolveImageUrl(u) || FALLBACK);
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

        {/* Download button */}
        {allowDownload && (
          <button
            onClick={() => downloadImage(imgs[active], productName)}
            title="Download image"
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 hover:bg-white rounded-full shadow-soft flex items-center justify-center transition-all hover:scale-110 z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-gray-600">
              <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
              <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
            </svg>
          </button>
        )}

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
