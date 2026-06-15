import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const ABOUT_IMAGES = ['/about/ab1.jpeg', '/about/ab2.jpeg'];
const STORE_IMG = '/visit/vi.jpeg';

const VALUES = [
  { icon: '✦', title: 'Quality First', desc: 'Every fabric, every stitch — we settle only for premium quality that lasts.' },
  { icon: '♛', title: 'Korean Aesthetics', desc: "Inspired by Seoul's vibrant fashion scene brought to Tirupur." },
  { icon: '◈', title: 'Inclusive Fashion', desc: 'Fashion for everyone — modern silhouettes for all body types.' },
  { icon: '⇄', title: 'Customer Care', desc: "We're always here for you — before, during, and after your purchase." },
];

function AboutCarousel({ images }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const goTo = (idx) => setCurrent((idx + images.length) % images.length);
  const prev = () => goTo(current - 1);
  const next = () => goTo(current + 1);

  useEffect(() => {
    timerRef.current = setInterval(() => goTo(current + 1), 3500);
    return () => clearInterval(timerRef.current);
  }, [current]);

  return (
    <div className="relative rounded-2xl overflow-hidden w-full h-80 md:h-96 shadow-hover group">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`Lavish Leora — ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}

      {/* Prev / Next */}
      <button
        onClick={prev}
        aria-label="Previous"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full shadow flex items-center justify-center text-gray-700 text-lg font-bold transition-all opacity-0 group-hover:opacity-100"
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Next"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full shadow flex items-center justify-center text-gray-700 text-lg font-bold transition-all opacity-0 group-hover:opacity-100"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? 'bg-white w-5 h-2' : 'bg-white/50 w-2 h-2'}`}
          />
        ))}
      </div>

      {/* Badge */}
      <div className="absolute -bottom-5 -right-5 bg-primary-600 text-white p-5 rounded-2xl shadow-xl hidden md:block">
        <p className="font-serif text-2xl font-bold">Korean Style</p>
        <p className="text-primary-200 text-sm">Exclusive Collection</p>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <div className="pt-16 md:pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-gray-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary-300 text-sm tracking-[0.3em] uppercase mb-3">Our Story</p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 leading-tight">
            About{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-lavender">
              Lavish Leora
            </span>
          </h1>
          <p className="text-gray-300 text-lg font-light leading-relaxed max-w-2xl mx-auto">
            A modern dress shop where premium fashion meets Korean elegance — right in the heart of Tirupur.
          </p>
        </div>
      </section>

      {/* Our Story — "Who We Are" with carousel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-primary-500 text-sm font-medium tracking-[0.25em] uppercase mb-3">Who We Are</p>
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6 leading-snug">
              More Than a Dress Shop — We're a Fashion Experience
            </h2>
            <div className="space-y-4 text-gray-500 font-light leading-relaxed">
              <p>
                Lavish Leora is a modern dress shop mainly focused on Korean style dresses. We provide stylish, trendy, and comfortable outfits for customers who love premium fashion.
              </p>
              <p>
                Our shop focuses on quality dress collections, elegant designs, and a smooth shopping experience. From flowing Korean-inspired dresses to sharp men's formal wear, we curate only the best pieces.
              </p>
              <p>
                Located in Tirupur — India's textile capital — we combine local craftsmanship with global fashion trends to deliver pieces that are both beautiful and accessible.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary">Shop Now</Link>
              <Link to="/contact" className="btn-outline">Visit Our Store</Link>
            </div>
          </div>

          {/* Image carousel */}
          <div className="relative pb-6 md:pb-0">
            <AboutCarousel images={ABOUT_IMAGES} />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-beige py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary-500 text-sm tracking-[0.25em] uppercase mb-2">What Drives Us</p>
            <h2 className="section-title">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white p-7 rounded-2xl shadow-card text-center hover:shadow-hover transition-all hover:-translate-y-1">
                <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-5">
                  <span className="text-primary-600 text-2xl">{icon}</span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Our Store */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <img
            src={STORE_IMG}
            alt="Lavish Leora store"
            className="rounded-2xl w-full h-72 md:h-96 object-cover shadow-soft order-2 md:order-1"
            onError={(e) => { e.target.src = ABOUT_IMAGES[0]; }}
          />
          <div className="order-1 md:order-2">
            <p className="text-primary-500 text-sm tracking-[0.25em] uppercase mb-3">Find Us</p>
            <h2 className="font-serif text-4xl font-bold text-gray-900 mb-6">Visit Our Store</h2>
            <div className="space-y-4 text-gray-500">
              <div className="flex gap-3">
                <span className="text-primary-500 text-lg mt-0.5 flex-shrink-0">📍</span>
                <div>
                  <p className="font-medium text-gray-700 mb-0.5">Address</p>
                  <p className="text-sm leading-relaxed">230 Kongu Main Road, 1st Floor,<br />Near Old ESI Hospital,<br />Tirupur — 641607, Tamil Nadu</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-primary-500 text-lg mt-0.5 flex-shrink-0">📞</span>
                <div>
                  <p className="font-medium text-gray-700 mb-0.5">Phone</p>
                  <a href="tel:6369931994" className="text-sm text-primary-600 hover:underline block">6369931994 (Main)</a>
                  <a href="tel:9363004914" className="text-sm text-primary-600 hover:underline block">9363004914</a>
                  <a href="tel:8668046050" className="text-sm text-primary-600 hover:underline block">8668046050</a>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-primary-500 text-lg mt-0.5 flex-shrink-0">✉️</span>
                <div>
                  <p className="font-medium text-gray-700 mb-0.5">Email</p>
                  <a href="mailto:lavishleora@gmail.com" className="text-sm text-primary-600 hover:underline">
                    lavishleora@gmail.com
                  </a>
                </div>
              </div>
            </div>
            <Link to="/contact" className="btn-primary mt-8 inline-block">
              Get in Touch →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white text-center py-16 px-4">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Ready to Discover Your Style?
          </h2>
          <p className="text-primary-200 font-light mb-8">Browse our full collection of premium Korean dresses and fashion.</p>
          <Link to="/products" className="bg-white text-primary-700 hover:bg-primary-50 px-8 py-3.5 rounded-full font-semibold transition-all hover:shadow-hover">
            Explore Collection
          </Link>
        </div>
      </section>
    </div>
  );
}
