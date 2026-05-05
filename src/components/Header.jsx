import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/men', label: 'Men' },
    { to: '/women', label: 'Women' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">

          {/* ── Left: Logo ── */}
          <div className="flex-1 flex justify-start">
            <Link to="/" className="hover:opacity-85 transition-opacity duration-200">
              <img
                src="/logo.png"
                alt="Lavish Leora"
                className="w-36 sm:w-52 md:w-64 lg:w-72 h-auto object-contain"
              />
            </Link>
          </div>

          {/* ── Center: Desktop nav ── */}
          <nav className="hidden md:flex flex-1 justify-center items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50/60'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* ── Right: Cart + User + Hamburger ── */}
          <div className="flex-1 flex justify-end items-center gap-2">

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full hover:bg-primary-50 transition-colors"
              aria-label="Cart"
            >
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User — desktop */}
            <div className="hidden md:block relative" ref={dropdownRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-primary-50 transition-colors"
                  >
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-200 shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                        <span className="text-primary-700 text-sm font-semibold">{user.name[0]}</span>
                      </div>
                    )}
                    <span className="text-sm font-semibold text-gray-800">{user.name}</span>
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-hover border border-gray-100 py-1 z-50">
                      {user.email === 'santhoshmass54@gmail.com' && (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-primary-700 hover:bg-primary-50 font-medium"
                        >
                          <span>🛡️</span> Admin Panel
                        </Link>
                      )}
                      <Link
                        to="/cart"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <span>🛒</span> My Cart {cartCount > 0 && `(${cartCount})`}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                      >
                        <span>↩️</span> Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link to="/login" className="btn-primary text-sm py-2 px-5">
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-5 flex flex-col gap-1">
                <span className={`block h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-sm">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-xl text-sm font-medium ${
                    isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl"
            >
              <span>🛒</span> Cart{' '}
              {cartCount > 0 && (
                <span className="bg-primary-600 text-white text-xs px-1.5 py-0.5 rounded-full">{cartCount}</span>
              )}
            </Link>
            <div className="pt-2 border-t border-gray-100">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2">
                    {user.picture ? (
                      <img src={user.picture} alt="" className="w-8 h-8 rounded-full shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                        <span className="text-primary-700 text-sm font-semibold">{user.name[0]}</span>
                      </div>
                    )}
                    <span className="text-sm font-semibold text-gray-800">{user.name}</span>
                  </div>
                  {user.email === 'santhoshmass54@gmail.com' && (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-primary-700 font-medium"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2.5 text-sm text-red-500"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-primary-700"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function CartIcon() {
  return (
    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}
