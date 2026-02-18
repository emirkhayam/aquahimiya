import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Package, Tag, Settings, LogOut, ExternalLink } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  const menuItems = [
    { path: '/admin/products', icon: Package, label: 'Товары' },
    { path: '/admin/categories', icon: Tag, label: 'Категории' },
    { path: '/admin/settings', icon: Settings, label: 'Настройки' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Темная боковая панель */}
      <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
        {/* Заголовок */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">AQUAHIMIYA</h1>
          <p className="text-sm text-gray-400 mt-1">Админ-панель</p>
        </div>

        {/* Навигация */}
        <nav className="flex-1 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-700 text-white border-l-4 border-cyan-400'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Нижние действия */}
        <div className="border-t border-gray-700">
          <Link
            to="/"
            className="flex items-center px-6 py-4 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
          >
            <ExternalLink className="w-5 h-5 mr-3" />
            На сайт
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-4 text-sm text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Выход
          </button>
        </div>
      </aside>

      {/* Основной контент */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
