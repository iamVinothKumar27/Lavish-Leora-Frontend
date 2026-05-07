import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: '◈', end: true },
  { to: '/admin/products', label: 'Products', icon: '👗', end: false },
  { to: '/admin/products/add', label: 'Add Product', icon: '+', end: false },
  { to: '/admin/categories', label: 'Categories', icon: '🏷️', end: false },
  { to: '/admin/orders', label: 'Orders', icon: '📦', end: false },
  { to: '/admin/contacts', label: 'Messages', icon: '✉️', end: false },
];

export default function AdminSidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-gray-900 text-white w-64">
      {/* Brand */}
      <div className="p-5 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-2.5 group" onClick={onClose}>
          <img
            src="/roundedlogo.png"
            alt="Lavish Leora"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-serif text-base font-semibold leading-none">Lavish Leora</p>
            <p className="text-xs text-gray-400 tracking-widest mt-0.5">ADMIN PANEL</p>
          </div>
        </Link>
      </div>

      {/* User info */}
      {user && (
        <div className="px-5 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            {user.picture ? (
              <img src={user.picture} alt="" className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-600" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary-700 flex items-center justify-center">
                <span className="text-white font-semibold">{user.name?.[0]}</span>
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider px-3 mb-2">Menu</p>
        {NAV_ITEMS.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`
            }
          >
            <span className="text-base w-5 text-center">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
        >
          <span>🏠</span> View Website
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-white hover:bg-red-900/40 transition-all"
        >
          <span>↩️</span> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 bottom-0 z-40 w-64">
        {sidebarContent}
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          <div className="relative z-50 w-64 flex-shrink-0">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
