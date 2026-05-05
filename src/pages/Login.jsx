import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

const LOGIN_BG = 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80';
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const ADMIN_EMAIL = 'santhoshmass54@gmail.com';

export default function Login() {
  const { user, loginWithGoogle, loginWithPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(user.email === ADMIN_EMAIL ? '/admin' : '/', { replace: true });
    }
  }, [user, navigate]);

  const redirectAfterLogin = (loggedUser) => {
    navigate(loggedUser.email === ADMIN_EMAIL ? '/admin' : '/', { replace: true });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedUser = await loginWithPassword(email.trim(), password);
      redirectAfterLogin(loggedUser);
    } catch (err) {
      const backendMsg = err?.response?.data?.message;
      const networkErr = err?.code === 'ERR_NETWORK' || err?.message === 'Network Error';
      setError(
        networkErr
          ? 'Cannot reach the backend. Make sure it is running on port 5000.'
          : backendMsg || err?.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    try {
      const loggedUser = await loginWithGoogle(credentialResponse.credential);
      redirectAfterLogin(loggedUser);
    } catch (err) {
      const backendMsg = err?.response?.data?.message;
      const networkErr = err?.code === 'ERR_NETWORK' || err?.message === 'Network Error';
      setError(
        networkErr
          ? 'Cannot reach the backend. Make sure it is running on port 5000.'
          : backendMsg || err?.message || 'Google login failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError(
      CLIENT_ID
        ? 'Google sign-in was cancelled or blocked. Check that http://localhost:5173 is an Authorized JavaScript Origin in Google Cloud Console.'
        : 'VITE_GOOGLE_CLIENT_ID is not set. Copy frontend/.env.example to frontend/.env and add your Google Client ID.'
    );
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel — fashion image ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={LOGIN_BG}
          alt="Lavish Leora fashion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/85 to-primary-700/60 flex flex-col items-center justify-center p-12 text-white text-center">
          <img
            src="/roundedlogo.png"
            alt="Lavish Leora"
            className="h-24 w-auto object-contain mb-6 drop-shadow-lg hover:scale-105 transition-transform duration-200"
          />
          <h2 className="font-serif text-4xl font-bold mb-4 leading-tight">Lavish Leora</h2>
          <p className="text-primary-100 font-light text-lg leading-relaxed max-w-sm">
            Discover premium Korean-style dresses and fashion collections crafted for those who dare to be elegant.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            {['Korean Style', 'Premium Quality', 'Exclusive Designs'].map((t) => (
              <span key={t} className="text-xs bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-10 pt-8 border-t border-white/20 w-full text-center">
            <p className="text-primary-200 text-sm font-light">
              230 Kongu Main Road, Tirupur — 641607
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-cream min-h-screen">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-10">
            <img
              src="/roundedlogo.png"
              alt="Lavish Leora"
              className="h-14 w-auto object-contain hover:scale-105 transition-transform duration-200"
            />
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-soft px-8 py-10 md:px-10">

            {/* Heading */}
            <div className="text-center mb-8">
              <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-400 text-sm">Sign in to continue your fashion journey</p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-5 bg-red-50 border border-red-200 rounded-2xl px-4 py-3.5 text-sm text-red-700">
                <p className="font-semibold mb-0.5">Sign in failed</p>
                <p className="leading-relaxed text-red-600">{error}</p>
              </div>
            )}

            {/* ── Email / Password form ── */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Your password"
                    className="input-field pr-14"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-primary-500 hover:text-primary-700 transition-colors"
                  >
                    {showPass ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-full font-semibold text-sm transition-all duration-300 mt-1 ${
                  loading
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-hover hover:-translate-y-0.5'
                }`}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            {/* ── OR divider ── */}
            <div className="relative flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 font-medium tracking-widest uppercase bg-white px-2">
                OR
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* ── Google button ── */}
            <div className={`flex justify-center ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="continue_with"
                shape="rectangular"
                size="large"
                theme="outline"
                width="400"
                logo_alignment="left"
              />
            </div>

            {!CLIENT_ID && (
              <p className="mt-3 text-xs text-amber-600 text-center bg-amber-50 rounded-xl px-3 py-2">
                Google Client ID not set — add <code className="font-mono">VITE_GOOGLE_CLIENT_ID</code> to frontend .env
              </p>
            )}

            {/* ── Sign up link ── */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-semibold hover:underline transition-colors">
                Create one
              </Link>
            </p>

            {/* Terms */}
            <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
              By signing in you agree to our{' '}
              <Link to="/about" className="text-primary-500 hover:underline">Terms</Link>
              {' '}and{' '}
              <Link to="/about" className="text-primary-500 hover:underline">Privacy Policy</Link>.
            </p>
          </div>

          {/* Browse link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            <Link to="/" className="text-primary-600 hover:text-primary-700 hover:underline font-medium transition-colors">
              ← Continue browsing without signing in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
