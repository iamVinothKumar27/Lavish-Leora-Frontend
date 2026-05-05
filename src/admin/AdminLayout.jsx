import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm h-14 flex items-center px-4 gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-5 space-y-1">
              <div className="h-0.5 bg-gray-600 rounded" />
              <div className="h-0.5 bg-gray-600 rounded" />
              <div className="h-0.5 bg-gray-600 rounded" />
            </div>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span className="text-white text-xs font-serif font-bold">LL</span>
            </div>
            <span className="font-serif text-base font-semibold text-gray-800">Admin Panel</span>
          </div>
          <div className="ml-auto">
            <span className="text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full font-medium">
              🛡️ Administrator
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
