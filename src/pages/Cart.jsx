import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { resolveImageUrl } from '../utils/imageUrl';

const WA_NUMBER = '916369931994';
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=70';

function buildWhatsAppMessage(items, user) {
  const lines = [
    '🛍️ *New Order — Lavish Leora*',
    '',
    `👤 *Customer Name:* ${user.name}`,
    `📧 *Email:* ${user.email}`,
    '',
    '📦 *Items Ordered:*',
    '--------------------------',
  ];

  items.forEach((item, i) => {
    const lineTotal = item.price * item.quantity;
    lines.push(`${i + 1}. 👗 *${item.name}*`);
    if (item.category) lines.push(`   Category: ${item.category}${item.subcategory ? ` > ${item.subcategory}` : ''}`);
    if (item.size) lines.push(`   📏 Size: ${item.size}`);
    lines.push(`   🔢 Qty: ${item.quantity} x Rs.${item.price.toLocaleString('en-IN')} = Rs.${lineTotal.toLocaleString('en-IN')}`);
    lines.push('');
  });

  const total = items.reduce((s, item) => s + item.price * item.quantity, 0);
  lines.push('--------------------------');
  lines.push(`💰 *Grand Total: Rs.${total.toLocaleString('en-IN')}*`);
  lines.push('');
  lines.push('📍 *Delivery Address:* (Please share your full address after this message)');
  lines.push('');
  lines.push('Thank you for shopping at Lavish Leora!');
  lines.push('We will confirm availability and delivery details shortly.');
  return lines.join('\n');
}

/* ─── Not signed in ──────────────────────────────────────────────────── */
function SignInPrompt() {
  return (
    <div className="pt-24 min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-soft p-10 max-w-sm w-full text-center">
        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <BagIcon className="w-10 h-10 text-primary-400" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Sign in to view your cart</h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Please sign in to add products to your cart and place orders via WhatsApp.
        </p>
        <Link to="/login" className="btn-primary w-full text-center block">
          Sign In
        </Link>
        <Link to="/signup" className="btn-outline w-full text-center block mt-3">
          Create Account
        </Link>
      </div>
    </div>
  );
}

/* ─── Loading skeleton ───────────────────────────────────────────────── */
function CartSkeleton() {
  return (
    <div className="pt-24 min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="shimmer h-8 w-44 rounded-xl mb-2" />
        <div className="shimmer h-4 w-24 rounded mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 flex gap-4">
                <div className="shimmer w-28 h-36 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-3 pt-1">
                  <div className="shimmer h-3 w-20 rounded" />
                  <div className="shimmer h-5 w-48 rounded" />
                  <div className="shimmer h-3 w-16 rounded" />
                  <div className="shimmer h-3 w-12 rounded" />
                  <div className="shimmer h-8 w-28 rounded-full mt-4" />
                </div>
              </div>
            ))}
          </div>
          <div className="shimmer h-72 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

/* ─── Empty cart ─────────────────────────────────────────────────────── */
function EmptyCart() {
  return (
    <div className="pt-24 min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-soft p-12 max-w-sm w-full text-center">
        <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <BagIcon className="w-12 h-12 text-primary-300" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          You haven't added anything yet.<br />Explore our collections and find your style.
        </p>
        <div className="space-y-3">
          <Link to="/women" className="btn-primary w-full text-center block">
            Shop Women's Collection
          </Link>
          <Link to="/men" className="btn-outline w-full text-center block">
            Shop Men's Collection
          </Link>
        </div>
        <Link to="/products" className="text-xs text-gray-400 hover:text-primary-500 mt-5 block transition-colors">
          Browse all products →
        </Link>
      </div>
    </div>
  );
}

/* ─── Main cart page ─────────────────────────────────────────────────── */
export default function Cart() {
  const { user } = useAuth();
  const { items, loading, updateQuantity, removeItem, clearCart, cartTotal } = useCart();
  const [actionLoading, setActionLoading] = useState(null);
  const [clearConfirm, setClearConfirm] = useState(false);

  if (!user) return <SignInPrompt />;
  if (loading) return <CartSkeleton />;
  if (items.length === 0) return <EmptyCart />;

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  const handleQtyChange = async (item, delta) => {
    const key = `${item.product}-${item.size}`;
    setActionLoading(key);
    try {
      await updateQuantity(item.product.toString?.() || item.product, item.size, item.quantity + delta);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemove = async (item) => {
    const key = `${item.product}-${item.size}`;
    setActionLoading(key);
    try {
      await removeItem(item.product.toString?.() || item.product, item.size);
    } finally {
      setActionLoading(null);
    }
  };

  const handleClear = async () => {
    if (!clearConfirm) { setClearConfirm(true); return; }
    await clearCart();
    setClearConfirm(false);
  };

  const handleWhatsAppOrder = () => {
    const message = buildWhatsAppMessage(items, user);
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  };

  return (
    <div className="pt-20 min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Page header ── */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">Your Cart</h1>
            <p className="text-gray-400 text-sm mt-1">
              {totalItems} item{totalItems !== 1 ? 's' : ''} · ₹{cartTotal.toLocaleString('en-IN')} total
            </p>
          </div>
          <button
            onClick={handleClear}
            className={`text-xs font-medium transition-colors px-3 py-1.5 rounded-full border ${
              clearConfirm
                ? 'border-red-400 text-red-500 bg-red-50 hover:bg-red-100'
                : 'border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-300'
            }`}
          >
            {clearConfirm ? 'Tap again to clear all' : 'Clear cart'}
          </button>
        </div>

        {/* ── Grid ── */}
        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* ── Items list — 3 columns ── */}
          <div className="lg:col-span-3 space-y-4">
            {items.map((item) => {
              const key = `${item.product}-${item.size}`;
              const busy = actionLoading === key;
              const lineTotal = item.price * item.quantity;

              return (
                <div
                  key={key}
                  className={`bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden transition-all duration-200 ${
                    busy ? 'opacity-60 pointer-events-none' : 'hover:shadow-hover'
                  }`}
                >
                  <div className="flex gap-0">
                    {/* Product image */}
                    <Link
                      to={`/products/${item.product}`}
                      className="flex-shrink-0 block w-32 sm:w-36"
                    >
                      <img
                        src={resolveImageUrl(item.image) || FALLBACK_IMG}
                        alt={item.name}
                        className="w-full h-40 sm:h-44 object-cover"
                        onError={(e) => { e.target.src = FALLBACK_IMG; }}
                      />
                    </Link>

                    {/* Product info */}
                    <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
                      {/* Top: badges + name + remove */}
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            {/* Category badge */}
                            {(item.category || item.subcategory) && (
                              <span className="inline-block text-[10px] font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full uppercase tracking-wide mb-1.5">
                                {item.category}{item.subcategory ? ` · ${item.subcategory}` : ''}
                              </span>
                            )}
                            {/* Product name */}
                            <Link
                              to={`/products/${item.product}`}
                              className="block font-serif font-semibold text-gray-900 text-base sm:text-lg leading-snug hover:text-primary-700 transition-colors line-clamp-2"
                            >
                              {item.name}
                            </Link>
                          </div>
                          {/* Remove button */}
                          <button
                            onClick={() => handleRemove(item)}
                            disabled={busy}
                            title="Remove item"
                            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                          >
                            <TrashIcon />
                          </button>
                        </div>

                        {/* Unit price */}
                        <p className="text-sm text-gray-400 mt-1">
                          ₹{item.price.toLocaleString('en-IN')} each
                        </p>

                        {/* Size badge */}
                        {item.size && (
                          <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                            <RulerIcon /> Size: {item.size}
                          </span>
                        )}
                      </div>

                      {/* Bottom: qty controls + line total */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                        {/* Qty controls */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleQtyChange(item, -1)}
                            disabled={busy || item.quantity <= 1}
                            className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-semibold text-base leading-none select-none"
                          >
                            −
                          </button>
                          <span className="w-10 text-center font-bold text-gray-900 text-base tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQtyChange(item, 1)}
                            disabled={busy}
                            className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-all font-semibold text-base leading-none select-none"
                          >
                            +
                          </button>
                        </div>

                        {/* Line total */}
                        <div className="text-right">
                          <p className="font-serif font-bold text-gray-900 text-xl tabular-nums">
                            ₹{lineTotal.toLocaleString('en-IN')}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-400">
                              {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Continue shopping */}
            <div className="pt-2">
              <Link to="/products" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline transition-colors">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* ── Order summary — 2 columns ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6 sticky top-24">

              {/* Summary heading */}
              <h2 className="font-serif text-xl font-bold text-gray-900 mb-5 pb-4 border-b border-gray-100">
                Order Summary
              </h2>

              {/* Line items */}
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={`${item.product}-${item.size}`} className="flex gap-3 items-start">
                    <img
                      src={resolveImageUrl(item.image) || FALLBACK_IMG}
                      alt={item.name}
                      className="w-10 h-12 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => { e.target.src = FALLBACK_IMG; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 font-medium leading-snug line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.size ? `Size: ${item.size} · ` : ''}Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 flex-shrink-0 tabular-nums">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                  <span className="font-medium text-gray-700">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Calculated on order</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-gray-100">
                <span className="font-bold text-gray-900 text-lg">Total</span>
                <span className="font-serif font-bold text-primary-700 text-2xl tabular-nums">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>

              {/* WhatsApp CTA */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full mt-6 py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
              >
                <WhatsAppIcon className="w-5 h-5 flex-shrink-0" />
                Proceed to Buy on WhatsApp
              </button>

              {/* No payment note */}
              <div className="mt-4 bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-center">
                <p className="text-xs text-green-700 font-medium leading-relaxed">
                  No online payment required.<br />Order will be confirmed on WhatsApp.
                </p>
              </div>

              {/* Trust bullets */}
              <div className="mt-4 space-y-2">
                {[
                  'Order details sent directly to our team',
                  'We confirm stock & delivery within 24 hrs',
                  'Pay only on delivery or as agreed',
                ].map((t) => (
                  <p key={t} className="text-xs text-gray-500 flex items-start gap-2">
                    <span className="text-green-500 mt-px flex-shrink-0">✓</span>
                    {t}
                  </p>
                ))}
              </div>

              {/* Store contact */}
              <a
                href="https://wa.me/916369931994"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-green-600 transition-colors"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                Questions? Chat with us · 6369931994
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ─── Icon components ─────────────────────────────────────────────────── */

function BagIcon({ className = 'w-6 h-6' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
  );
}

function RulerIcon() {
  return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
    </svg>
  );
}

function WhatsAppIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
