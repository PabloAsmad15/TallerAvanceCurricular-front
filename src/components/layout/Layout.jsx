import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, Home, BookOpen, History, Sparkles, Shield, Menu, X, Layers } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Seleccionar Cursos', href: '/select-courses', icon: BookOpen },
    { name: 'Multi-malla', href: '/select-courses-multi', icon: Layers },
    { name: 'Recomendaciones', href: '/recommendations', icon: Sparkles },
    { name: 'Historial', href: '/history', icon: History },
  ];

  // Agregar Dashboard Admin solo si es administrador
  const adminNavigation = user?.is_admin ? [
    { name: 'Dashboard Admin', href: '/admin', icon: Shield }
  ] : [];

  const allNavigation = [...navigation, ...adminNavigation];

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-primary-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-primary-600 mr-2"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
              <h1 className="text-lg sm:text-xl font-bold text-white">Sistema UPAO</h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-white text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
                {user?.nombre} {user?.apellido}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 text-white hover:text-primary-100"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        ></div>
      )}

      {/* Sidebar + Content */}
      <div className="flex relative">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white shadow-md 
          transform transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          min-h-[calc(100vh-4rem)] mt-0 lg:mt-0
        `}>
          <nav className="p-4 space-y-2 mt-16 lg:mt-0">
            {allNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
