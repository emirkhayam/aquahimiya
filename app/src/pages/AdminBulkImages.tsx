import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import type { Product } from '../data/products';
import { products as initialProducts } from '../data/products';
import { Upload, Check, X, Image as ImageIcon } from 'lucide-react';

const AdminBulkImages = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [uploadedImages, setUploadedImages] = useState<{ [key: string]: string }>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth) {
      navigate('/admin');
      return;
    }

    // Загружаем товары
    const savedProducts = localStorage.getItem('adminProducts');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialProducts);
    }
  }, [navigate]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(prev => [...prev, ...files]);
  };

  const handleImageSelect = (file: File) => {
    if (!selectedProduct) {
      alert('Сначала выберите товар!');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result as string;

      // Обновляем картинку у выбранного товара
      const updatedProducts = products.map(p =>
        p.id === selectedProduct.id
          ? { ...p, images: [imageData] }
          : p
      );

      setProducts(updatedProducts);
      setUploadedImages(prev => ({
        ...prev,
        [selectedProduct.id]: imageData
      }));

      // Удаляем использованную картинку из списка
      setImageFiles(prev => prev.filter(f => f !== file));

      // Сбрасываем выбранный товар
      setSelectedProduct(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAll = () => {
    localStorage.setItem('adminProducts', JSON.stringify(products));
    alert(`Успешно сохранено! Обновлено ${Object.keys(uploadedImages).length} товаров с картинками.`);
    navigate('/admin/products');
  };

  const handleRemoveImage = (productId: number) => {
    const updatedProducts = products.map(p =>
      p.id === productId
        ? { ...p, images: ['/products/placeholder.jpg'] }
        : p
    );
    setProducts(updatedProducts);

    const newUploadedImages = { ...uploadedImages };
    delete newUploadedImages[productId];
    setUploadedImages(newUploadedImages);
  };

  const productsWithNewImages = products.filter(p => uploadedImages[p.id]);
  const productsWithoutImages = products.filter(p => !uploadedImages[p.id]);

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Массовая загрузка картинок</h1>
              <p className="text-sm text-gray-600 mt-1">
                Загружено картинок: {imageFiles.length} | Назначено товарам: {Object.keys(uploadedImages).length}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/admin/products')}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleSaveAll}
                disabled={Object.keys(uploadedImages).length === 0}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Сохранить все ({Object.keys(uploadedImages).length})
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Как использовать:</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Загрузите все картинки товаров (кнопка ниже)</li>
              <li>Кликните на товар в списке слева</li>
              <li>Кликните на нужную картинку справа - она автоматически назначится товару</li>
              <li>Повторите для всех товаров</li>
              <li>Нажмите "Сохранить все"</li>
            </ol>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mb-6">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Нажмите для загрузки</span> или перетащите файлы
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, JPEG (можно загрузить сразу много)</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
            />
          </label>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Products List */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Товары ({products.length})
            </h2>

            {/* Products with images */}
            {productsWithNewImages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-green-600 mb-3 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  С картинками ({productsWithNewImages.length})
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {productsWithNewImages.map(product => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-3 border border-green-200 bg-green-50 rounded-lg"
                    >
                      <img
                        src={uploadedImages[product.id]}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded border"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-500">{product.article}</div>
                      </div>
                      <button
                        onClick={() => handleRemoveImage(product.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                        title="Удалить картинку"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Products without images */}
            {productsWithoutImages.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-3">
                  Без картинок ({productsWithoutImages.length})
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {productsWithoutImages.map(product => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`w-full text-left p-3 border rounded-lg transition-all ${
                        selectedProduct?.id === product.id
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.article}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Images Grid */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Загруженные картинки ({imageFiles.length})
            </h2>

            {selectedProduct && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Выбран товар:</strong> {selectedProduct.name}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Кликните на картинку ниже чтобы назначить её этому товару
                </p>
              </div>
            )}

            {imageFiles.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <ImageIcon className="w-16 h-16 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Загрузите картинки используя область выше</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3 max-h-[600px] overflow-y-auto">
                {imageFiles.map((file, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageSelect(file)}
                    className={`relative aspect-square border-2 rounded-lg overflow-hidden transition-all ${
                      selectedProduct
                        ? 'border-blue-500 hover:scale-105 cursor-pointer'
                        : 'border-gray-200 opacity-50 cursor-not-allowed'
                    }`}
                    disabled={!selectedProduct}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    {selectedProduct && (
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                        <Check className="w-8 h-8 text-white opacity-0 hover:opacity-100" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBulkImages;
