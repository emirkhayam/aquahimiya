import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredCategories } from '../hooks/useCategories';
import type { Category } from '../hooks/useCategories';
import AdminLayout from '../components/AdminLayout';

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
  imageBase64?: string;
}

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [step, setStep] = useState(1);
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
    }
    setCategories(getStoredCategories());
  }, [navigate]);

  const handleCategorySelect = (categoryId: string) => {
    setFormData({ ...formData, category: categoryId });
    setStep(2);
  };

  const handleSave = () => {
    // Получаем текущие товары
    const savedProducts = localStorage.getItem('adminProducts');
    const products = savedProducts ? JSON.parse(savedProducts) : [];

    // Создаем новый товар
    const newProduct = {
      id: Date.now(),
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
      images: [formData.imageBase64 || '/products/placeholder.jpg'],
    };

    // Добавляем в начало массива
    products.unshift(newProduct);
    localStorage.setItem('adminProducts', JSON.stringify(products));

    // Показываем уведомление и переходим
    alert('Товар успешно добавлен!');
    navigate('/admin/products');
  };

  const selectedCategory = categories.find(c => c.id === formData.category);

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Добавление товара</h1>
            <p className="text-sm text-gray-600 mt-1">Шаг {step} из 4</p>
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
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Выберите категорию товара</h2>
                  <p className="text-gray-600 mb-6">Нажмите на карточку с подходящей категорией</p>

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

              {/* Step 2: Basic Info */}
              {step === 2 && (
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
                        autoFocus
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
                        onClick={() => setStep(1)}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      >
                        Назад
                      </button>
                      <button
                        onClick={() => setStep(3)}
                        disabled={!formData.name || !formData.price || !formData.article || !formData.brand}
                        className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Далее
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Description */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Описание товара</h2>
                  <p className="text-gray-600 mb-6">Добавьте описание, характеристики и фото</p>

                  <div className="space-y-6">
                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Фото товара
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 flex-shrink-0">
                          {formData.imageBase64 ? (
                            <img src={formData.imageBase64} alt="preview" className="w-full h-full object-cover" />
                          ) : (
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <label className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors inline-block">
                            Выбрать файл
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const reader = new FileReader();
                                reader.onload = () => {
                                  setFormData({ ...formData, imageBase64: reader.result as string });
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                          </label>
                          {formData.imageBase64 && (
                            <button
                              onClick={() => setFormData({ ...formData, imageBase64: undefined })}
                              className="ml-2 text-sm text-red-500 hover:text-red-700"
                            >
                              Удалить
                            </button>
                          )}
                          <p className="text-xs text-gray-500 mt-1">JPG, PNG до 5 МБ</p>
                        </div>
                      </div>
                    </div>

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
                        onClick={() => setStep(2)}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      >
                        Назад
                      </button>
                      <button
                        onClick={() => setStep(4)}
                        disabled={!formData.description}
                        className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Далее
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Technical Characteristics (Optional) */}
              {step === 4 && (
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
                        onClick={() => setStep(3)}
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
                        Сохранить товар
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

              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                {/* Image Preview */}
                {formData.imageBase64 && (
                  <div className="mb-3 rounded-lg overflow-hidden aspect-[4/3] bg-white">
                    <img src={formData.imageBase64} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}
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

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-800">
                  💡 <strong>Совет:</strong> Заполните все поля для более информативной карточки товара
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAddProduct;
