import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStoredCategories } from '../hooks/useCategories';
import type { Category } from '../hooks/useCategories';
import type { Product } from '../data/products';
import AdminLayout from '../components/AdminLayout';
import { Upload, X } from 'lucide-react';

interface ProductForm {
  name: string;
  category: string;
  price: string;
  unit: string;
  inStock: boolean;
  specs: string;
  description: string;
  brand: string;
  article: string;
  power?: string;
  voltage?: string;
  performance?: string;
  image?: string;
}

const AdminEditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState<ProductForm>({
    name: '',
    category: '',
    price: '',
    unit: 'шт',
    inStock: true,
    specs: '',
    description: '',
    brand: '',
    article: '',
  });

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth) {
      navigate('/admin');
      return;
    }
    setCategories(getStoredCategories());

    // Загружаем товар для редактирования
    const savedProducts = localStorage.getItem('adminProducts');
    if (savedProducts && id) {
      const products: Product[] = JSON.parse(savedProducts);
      const product = products.find(p => p.id === parseInt(id));

      if (product) {
        setFormData({
          name: product.name,
          category: product.category,
          price: product.price.toString(),
          unit: product.unit || 'шт',
          inStock: product.inStock,
          specs: product.specs || '',
          description: product.description || '',
          brand: product.brand || '',
          article: product.article || '',
          power: product.characteristics?.['Мощность'] || '',
          voltage: product.characteristics?.['Напряжение'] || '',
          performance: product.characteristics?.['Производительность'] || '',
          image: product.images?.[0] || '',
        });
        setImagePreview(product.images?.[0] || '');
      } else {
        alert('Товар не найден');
        navigate('/admin/products');
      }
    }
  }, [navigate, id]);

  const handleCategorySelect = (categoryId: string) => {
    setFormData({ ...formData, category: categoryId });
    setStep(2);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setFormData({ ...formData, image: '' });
  };

  const handleSave = () => {
    if (!id) return;

    // Получаем текущие товары
    const savedProducts = localStorage.getItem('adminProducts');
    const products: Product[] = savedProducts ? JSON.parse(savedProducts) : [];

    // Находим индекс товара
    const index = products.findIndex(p => p.id === parseInt(id));

    if (index === -1) {
      alert('Товар не найден');
      return;
    }

    // Обновляем товар
    products[index] = {
      ...products[index],
      slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
      name: formData.name,
      category: formData.category,
      description: formData.description,
      fullDescription: formData.description,
      price: parseInt(formData.price),
      specs: formData.specs,
      article: formData.article,
      brand: formData.brand,
      unit: formData.unit,
      inStock: formData.inStock,
      characteristics: {
        ...(formData.power && { 'Мощность': formData.power }),
        ...(formData.voltage && { 'Напряжение': formData.voltage }),
        ...(formData.performance && { 'Производительность': formData.performance }),
      },
      images: formData.image ? [formData.image] : products[index].images,
    };

    // Сохраняем обратно
    localStorage.setItem('adminProducts', JSON.stringify(products));

    // Показываем уведомление и переходим
    alert('Товар успешно обновлен!');
    navigate('/admin/products');
  };

  const selectedCategory = categories.find(c => c.id === formData.category);

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Редактирование товара</h1>
            <p className="text-sm text-gray-600 mt-1">Шаг {step} из 5</p>
          </div>
          <button
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center text-sm bg-white rounded-lg border hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Назад к списку
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border p-8">
              {/* Step 1: Category Selection */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Категория товара</h2>
                  <p className="text-gray-600 mb-6">Текущая категория: {selectedCategory?.name}</p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.filter(c => c.id !== 'all').map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`p-6 border-2 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-center ${
                          formData.category === cat.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="text-4xl mb-3">{cat.icon}</div>
                        <div className="text-sm font-medium text-gray-900">{cat.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Image Upload */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Изображение товара</h2>
                  <p className="text-gray-600 mb-6">Загрузите фото товара</p>

                  <div className="space-y-6">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-64 object-contain bg-gray-50 rounded-lg border-2 border-gray-200"
                        />
                        <button
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-12 h-12 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Нажмите для загрузки</span> или перетащите файл
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG или WEBP</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setStep(1)}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      >
                        Назад
                      </button>
                      <button
                        onClick={() => setStep(3)}
                        className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Далее
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Basic Info */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Основная информация</h2>
                  <p className="text-gray-600 mb-6">Заполните базовые данные о товаре</p>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Название товара *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Например: Насос Espa Silen I 33"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Артикул *
                      </label>
                      <input
                        type="text"
                        value={formData.article}
                        onChange={(e) => setFormData({ ...formData, article: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Например: ESPA-SI33"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Производитель *
                      </label>
                      <input
                        type="text"
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Например: Espa"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Цена (сом) *
                        </label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="36500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Единица измерения
                        </label>
                        <select
                          value={formData.unit}
                          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="шт">шт (штука)</option>
                          <option value="м">м (метр)</option>
                          <option value="м²">м² (метр квадратный)</option>
                          <option value="л">л (литр)</option>
                          <option value="кг">кг (килограмм)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.inStock}
                          onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">Товар в наличии</span>
                      </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setStep(2)}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      >
                        Назад
                      </button>
                      <button
                        onClick={() => setStep(4)}
                        disabled={!formData.name || !formData.price || !formData.article || !formData.brand}
                        className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Далее
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Description */}
              {step === 4 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Описание товара</h2>
                  <p className="text-gray-600 mb-6">Добавьте описание и краткие характеристики</p>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Краткое описание *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Например: Высококачественный насос мощностью 0,45 кВт для небольших бассейнов"
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Краткие характеристики
                      </label>
                      <input
                        type="text"
                        value={formData.specs}
                        onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Например: 0,45 кВт, 2-10 м³/ч"
                      />
                      <p className="mt-1 text-xs text-gray-500">Будет отображаться под названием товара</p>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setStep(3)}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      >
                        Назад
                      </button>
                      <button
                        onClick={() => setStep(5)}
                        disabled={!formData.description}
                        className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Далее
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Technical Characteristics (Optional) */}
              {step === 5 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Технические характеристики</h2>
                  <p className="text-gray-600 mb-6">Опционально: укажите основные технические параметры</p>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Мощность
                      </label>
                      <input
                        type="text"
                        value={formData.power || ''}
                        onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Например: 0,45 кВт или 1,5 HP"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Напряжение
                      </label>
                      <input
                        type="text"
                        value={formData.voltage || ''}
                        onChange={(e) => setFormData({ ...formData, voltage: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Например: 220V / 50Hz"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Производительность
                      </label>
                      <input
                        type="text"
                        value={formData.performance || ''}
                        onChange={(e) => setFormData({ ...formData, performance: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Например: 2-10 м³/ч"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setStep(4)}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      >
                        Назад
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Сохранить изменения
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Предпросмотр</h3>
              <div className="text-sm text-gray-600 mb-4">Вот как будет выглядеть товар:</div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-contain bg-gray-50 rounded-lg border border-gray-200"
                  />
                </div>
              )}

              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                {/* Category Badge */}
                {formData.category && (
                  <div className="mb-3">
                    <span className="px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {selectedCategory?.icon} {selectedCategory?.name}
                    </span>
                  </div>
                )}

                {/* Product Name */}
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {formData.name || 'Название товара'}
                </h4>

                {/* Specs */}
                {formData.specs && (
                  <p className="text-sm text-gray-600 mb-2">{formData.specs}</p>
                )}

                {/* Article & Brand */}
                <div className="text-xs text-gray-500 mb-3">
                  {formData.article && <div>Артикул: {formData.article}</div>}
                  {formData.brand && <div>Производитель: {formData.brand}</div>}
                </div>

                {/* Description */}
                {formData.description && (
                  <p className="text-sm text-gray-700 mb-3">{formData.description}</p>
                )}

                {/* Price */}
                {formData.price && (
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-2xl font-bold text-blue-600">
                      {parseInt(formData.price).toLocaleString()} сом
                    </span>
                    {formData.unit && (
                      <span className="text-sm text-gray-500">/ {formData.unit}</span>
                    )}
                  </div>
                )}

                {/* Stock Status */}
                <div>
                  <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                    formData.inStock
                      ? 'bg-green-100 text-green-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {formData.inStock ? '✓ В наличии' : '○ Под заказ'}
                  </span>
                </div>

                {/* Characteristics */}
                {(formData.power || formData.voltage || formData.performance) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-xs font-semibold text-gray-700 mb-2">Характеристики:</div>
                    <div className="space-y-1 text-xs text-gray-600">
                      {formData.power && <div>• Мощность: {formData.power}</div>}
                      {formData.voltage && <div>• Напряжение: {formData.voltage}</div>}
                      {formData.performance && <div>• Производительность: {formData.performance}</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEditProduct;
