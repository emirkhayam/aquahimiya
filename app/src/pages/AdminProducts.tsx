import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { products as initialProducts } from '../data/products';
import { getStoredCategories } from '../hooks/useCategories';
import type { Category } from '../hooks/useCategories';
import type { Product } from '../data/products';
import AdminLayout from '../components/AdminLayout';
import { Edit, Trash2, Star } from 'lucide-react';

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth) {
      navigate('/admin');
      return;
    }
    setCategories(getStoredCategories());

    const savedProducts = localStorage.getItem('adminProducts');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialProducts);
      localStorage.setItem('adminProducts', JSON.stringify(initialProducts));
    }
  }, [navigate]);

  const handleToggleStock = (id: number) => {
    const updated = products.map(p =>
      p.id === id ? { ...p, inStock: !p.inStock } : p
    );
    setProducts(updated);
    localStorage.setItem('adminProducts', JSON.stringify(updated));
  };

  const handleToggleFeatured = (id: number) => {
    const updated = products.map(p =>
      p.id === id ? { ...p, featured: !p.featured } : p
    );
    setProducts(updated);
    localStorage.setItem('adminProducts', JSON.stringify(updated));
  };

  const handleDelete = (id: number) => {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem('adminProducts', JSON.stringify(updated));
    }
  };

  const handleImportAll = async () => {
    if (confirm('Загрузить ВСЕ товары из прайс-листа (121 товар)?')) {
      try {
        const response = await fetch('/all-products.json');
        const allProducts = await response.json();

        const enriched = allProducts.map((p: any) => ({
          ...p,
          slug: p.name.toLowerCase().replace(/[^a-zа-я0-9]+/g, '-'),
          description: p.name,
          fullDescription: p.name,
          specs: p.unit,
          inStock: true,
          characteristics: {},
          images: ['/products/placeholder.jpg']
        }));

        const combined = [...products, ...enriched];
        setProducts(combined);
        localStorage.setItem('adminProducts', JSON.stringify(combined));

        alert(`Успешно загружено ${allProducts.length} товаров!`);
      } catch (error) {
        alert('Ошибка загрузки: ' + error);
      }
    }
  };

  const getCategoryName = (catId: string) => {
    return categories.find(c => c.id === catId)?.name || catId;
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Заголовок */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Товары</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/admin/bulk-images')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              Массовая загрузка картинок
            </button>
            <button
              onClick={handleImportAll}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
            >
              Импорт всех товаров
            </button>
            <button
              onClick={() => navigate('/admin/add-product')}
              className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
            >
              Добавить товар
            </button>
          </div>
        </div>

        {/* Таблица товаров */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Фото
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Название
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Цена
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Категория
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Популярное
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={product.images?.[0] || '/products/placeholder.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="%23cbd5e0" stroke-width="2"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"%3E%3C/rect%3E%3Ccircle cx="8.5" cy="8.5" r="1.5"%3E%3C/circle%3E%3Cpolyline points="21 15 16 10 5 21"%3E%3C/polyline%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.article}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {product.price.toLocaleString()} сом
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700">{getCategoryName(product.category)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStock(product.id)}
                      title="Нажмите чтобы изменить статус"
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full transition-colors cursor-pointer ${
                        product.inStock
                          ? 'bg-green-100 text-green-800 hover:bg-red-100 hover:text-red-800'
                          : 'bg-red-100 text-red-800 hover:bg-green-100 hover:text-green-800'
                      }`}
                    >
                      {product.inStock ? '✓ В наличии' : '✗ Нет в наличии'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleFeatured(product.id)}
                      title={product.featured ? 'Убрать из популярных' : 'Добавить в популярные'}
                      className={`p-2 rounded transition-colors ${
                        product.featured
                          ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50'
                          : 'text-gray-300 hover:text-yellow-400 hover:bg-yellow-50'
                      }`}
                    >
                      <Star className="w-5 h-5" fill={product.featured ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => navigate(`/admin/edit-product/${product.id}`)}
                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                        title="Редактировать"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Товары не найдены</p>
            </div>
          )}
        </div>

        {/* Счетчик товаров */}
        <div className="mt-4 text-sm text-gray-600">
          Всего товаров: {products.length}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
