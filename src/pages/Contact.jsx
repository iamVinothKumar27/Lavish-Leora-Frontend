import { useState } from 'react';
import api from '../utils/api';

const CONTACT_INFO = [
  {
    icon: '📍',
    title: 'Visit Our Store',
    lines: ['230 Kongu Main Road, 1st Floor,', 'Near Old ESI Hospital,', 'Tirupur — 641607, Tamil Nadu'],
  },
  {
    icon: '📞',
    title: 'Call Us',
    lines: ['6369931994 (Main)', '9363004914', '8668046050'],
    isPhone: true,
  },
  {
    icon: '✉️',
    title: 'Email Us',
    lines: ['lavishleora@gmail.com'],
    isEmail: true,
  },
  {
    icon: '🕐',
    title: 'Store Hours',
    lines: ['Mon – Sat: 10:00 AM – 8:00 PM', 'Sunday: 11:00 AM – 6:00 PM'],
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      await api.post('/api/contacts', form);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 to-gray-900 text-white py-16 px-4 text-center">
        <p className="text-primary-300 text-sm tracking-[0.3em] uppercase mb-2">Get In Touch</p>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">Contact Us</h1>
        <p className="text-gray-300 font-light max-w-md mx-auto">
          Have a question, want to place a custom order, or just want to say hi? We'd love to hear from you.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-14">
          {/* Contact Info */}
          <div>
            <h2 className="font-serif text-3xl font-semibold text-gray-900 mb-8">We're Here for You</h2>
            <div className="space-y-6">
              {CONTACT_INFO.map(({ icon, title, lines, isPhone, isEmail }) => (
                <div key={title} className="flex gap-4 p-5 bg-white rounded-2xl shadow-card hover:shadow-soft transition-shadow">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
                    {icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">{title}</p>
                    {lines.map((line, i) =>
                      isPhone ? (
                        <a key={i} href={`tel:${line.split(' ')[0]}`} className="block text-sm text-primary-600 hover:underline">
                          {line}
                        </a>
                      ) : isEmail ? (
                        <a key={i} href={`mailto:${line}`} className="block text-sm text-primary-600 hover:underline break-all">
                          {line}
                        </a>
                      ) : (
                        <p key={i} className="text-sm text-gray-500">{line}</p>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map embed */}
            <div className="mt-8 rounded-2xl overflow-hidden shadow-soft">
              <iframe
                title="Lavish Leora Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.1234567890!2d77.3410534!3d11.1085242!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba907a0a0a0a0a0%3A0x0!2s230%20Kongu%20Main%20Road%2C%20Tirupur%2C%20Tamil%20Nadu%20641607!5e0!3m2!1sen!2sin!4v1000000000000!5m2!1sen!2sin"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="bg-primary-50 px-4 py-3 flex items-center gap-2">
                <span className="text-primary-500 text-sm">📍</span>
                <span className="text-xs text-gray-500">230 Kongu Main Road, Tirupur - 641607</span>
                <a
                  href="https://maps.google.com/?q=230+Kongu+Main+Road+Tirupur+641607"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-xs text-primary-600 hover:underline font-medium"
                >
                  Open in Maps →
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-3xl shadow-soft p-8 md:p-10">
              <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-2">Send Us a Message</h2>
              <p className="text-gray-400 text-sm mb-8">We'll get back to you within 24 hours.</p>

              {status === 'success' ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="font-serif text-2xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500 mb-6">
                    Thank you for reaching out. We'll contact you at <span className="text-primary-600 font-medium">{form.email || 'your email'}</span> shortly.
                  </p>
                  <button onClick={() => setStatus('idle')} className="btn-primary">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone Number</label>
                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Your phone number"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell us about your enquiry, custom order, or feedback..."
                      className="input-field resize-none"
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className={`w-full py-4 rounded-full font-semibold text-base transition-all ${
                      status === 'loading'
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-hover hover:-translate-y-0.5'
                    }`}
                  >
                    {status === 'loading' ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      'Send Message →'
                    )}
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    Your message will be saved and forwarded to{' '}
                    <span className="text-primary-500">lavishleora@gmail.com</span>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
