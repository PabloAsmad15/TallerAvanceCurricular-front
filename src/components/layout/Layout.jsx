import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LogOut, Home, BookOpen, History, Sparkles, Shield } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const navigation = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Seleccionar Cursos', href: '/select-courses', icon: BookOpen },
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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-primary-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">Sistema UPAO</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-white">
                {user?.nombre} {user?.apellido}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-white hover:text-primary-100"
              >
                <LogOut className="w-5 h-5" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar + Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            {allNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
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
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
