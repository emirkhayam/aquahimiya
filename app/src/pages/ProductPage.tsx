import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products as initialProducts } from '@/data/products';
import type { Product } from '@/data/products';
import { Button } from '@/components/ui/button';
import {
  ShoppingCart,
  ChevronLeft,
  Check,
  Package,
  Truck,
  ChevronRight,
} from 'lucide-react';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    // Прокрутка наверх при открытии страницы товара
    window.scrollTo(0, 0);

    // Загружаем товары из localStorage или используем начальные
    const savedProducts = localStorage.getItem('adminProducts');
    const loadedProducts = savedProducts ? JSON.parse(savedProducts) : initialProducts;

    // Находим текущий товар
    const foundProduct = loadedProducts.find((p: Product) => p.slug === slug);
    setProduct(foundProduct || null);
  }, [slug]);

  useEffect(() => {
    // Загружаем номер WhatsApp из настроек
    const settings = localStorage.getItem('siteSettings');
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      setWhatsappNumber(parsedSettings.whatsappNumber || '');
    }
  }, []);

  const handleWhatsAppOrder = () => {
    if (!product) return;
    if (!whatsappNumber) {
      alert('Номер WhatsApp не настроен. Обратитесь к администратору.');
      return;
    }
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const message = `Здравствуйте! Хочу заказать:\n\n${product.name}\nАртикул: ${product.article}\nКоличество: ${quantity} шт.\nЦена: ${product.price.toLocaleString('ru-RU')} сом`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Товар не найден</h1>
          <Button onClick={() => navigate('/')}>Вернуться на главную</Button>
        </div>
      </div>
    );
  }

  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-600 mb-8">
          <Link to="/" className="hover:text-aqua-primary transition-colors">
            Главная
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/catalog" className="hover:text-aqua-primary transition-colors">
            Каталог
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium">{product.name}</span>
        </nav>

        {/* Product Content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-slate-100 relative">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover will-change-transform"
                loading="eager"
                decoding="async"
              />
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                  -{discount}%
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all will-change-transform ${
                      selectedImage === index
                        ? 'border-aqua-primary scale-105'
                        : 'border-slate-200 hover:border-aqua-primary/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full bg-aqua-pale text-aqua-primary text-sm font-medium">
                  {product.brand}
                </span>
                {product.inStock ? (
                  <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <Check className="w-4 h-4" />
                    В наличии
                  </span>
                ) : (
                  <span className="text-red-600 text-sm font-medium">Под заказ</span>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                {product.name}
              </h1>
              <p className="text-slate-600">Артикул: {product.article}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <div className="text-4xl lg:text-5xl font-bold text-aqua-primary">
                {product.price.toLocaleString('ru-RU')} сом
              </div>
              {product.oldPrice && (
                <div className="text-2xl text-slate-400 line-through">
                  {product.oldPrice.toLocaleString('ru-RU')} сом
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-slate-700 leading-relaxed">{product.fullDescription}</p>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-slate-700 font-medium">Количество:</span>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 p-0"
                >
                  -
                </Button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 p-0"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleWhatsAppOrder}
                className="flex-1 gap-2 bg-[#0E76BC] hover:bg-[#0A5A91] text-white shadow-lg hover:shadow-xl font-bold h-10 px-6 rounded-md inline-flex items-center justify-center transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                Заказать товар
              </button>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t">
              <div className="text-center p-4 rounded-xl bg-slate-50">
                <Package className="w-6 h-6 text-aqua-primary mx-auto mb-2" />
                <p className="text-xs text-slate-600">Гарантия качества</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-50">
                <Truck className="w-6 h-6 text-aqua-primary mx-auto mb-2" />
                <p className="text-xs text-slate-600">Быстрая доставка</p>
              </div>
            </div>
          </div>
        </div>

        {/* Characteristics */}
        <div className="bg-slate-50 rounded-3xl p-8 lg:p-12 mb-16">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-8">Характеристики</h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
            {Object.entries(product.characteristics).map(([key, value]) => (
              <div key={key} className="flex justify-between items-start gap-4 py-3 border-b border-slate-200">
                <span className="text-slate-600 whitespace-nowrap">{key}</span>
                <span className="font-medium text-slate-900 text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>


        {/* Back Button */}
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={() => navigate('/catalog')}
          >
            <ChevronLeft className="w-5 h-5" />
            Вернуться в каталог
          </Button>
        </div>
      </div>
    </div>
  );
}
