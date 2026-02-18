import { useEffect, useState, useCallback } from 'react';
import { ArrowRight, ChevronDown, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { products as staticProducts } from '@/data/products';
import type { Product } from '@/data/products';

export default function Hero() {
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(0);
  const [fade, setFade] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    const settings = localStorage.getItem('siteSettings');
    if (settings) {
      const p = JSON.parse(settings);
      setWhatsappNumber(p.whatsappNumber || '');
    }
    // Загружаем featured товары из adminProducts
    const saved = localStorage.getItem('adminProducts');
    const allProducts: Product[] = saved ? JSON.parse(saved) : staticProducts;
    const featured = allProducts.filter(p => p.featured);
    setPopularProducts(featured.length > 0 ? featured : allProducts.slice(0, 6));
  }, []);

  useEffect(() => {
    if (popularProducts.length <= 1) return;
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentProduct(i => (i + 1) % popularProducts.length);
        setFade(true);
      }, 400);
    }, 3500);
    return () => clearInterval(timer);
  }, [popularProducts.length]);

  const scrollToSection = useCallback((href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    const product = popularProducts[currentProduct];
    if (!product) return;
    if (!whatsappNumber) { alert('Номер WhatsApp не настроен.'); return; }
    const clean = whatsappNumber.replace(/\D/g, '');
    const msg = encodeURIComponent(`Здравствуйте! Интересует:\n\n${product.name}\nАртикул: ${product.article}\nЦена: ${product.price.toLocaleString('ru-RU')} сом`);
    window.open(`https://wa.me/${clean}?text=${msg}`, '_blank');
  };

  const product = popularProducts[currentProduct] ?? null;

  return (
    <div className="relative">
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden" style={{ zIndex: 1 }}>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

            {/* LEFT — Popular product card */}
            {product && <div className={`hidden lg:block w-full lg:w-[380px] flex-shrink-0 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`} style={{ transitionDelay: '0.3s' }}>
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-aqua-primary/15"
                style={{ boxShadow: '0 20px 60px rgba(26,159,192,0.15)' }}>
                {/* Badge */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #FF6B00, #FF9A00)', boxShadow: '0 4px 14px rgba(255,107,0,0.45)' }}>
                  <Star className="w-3 h-3 fill-white" />
                  Популярное
                </div>
                {/* Dot indicators */}
                <div className="absolute top-4 right-4 z-10 flex gap-1">
                  {popularProducts.map((_, i) => (
                    <button key={i} onClick={() => { setFade(false); setTimeout(() => { setCurrentProduct(i); setFade(true); }, 300); }}
                      className="w-2 h-2 rounded-full transition-all duration-300"
                      style={{ background: i === currentProduct ? '#1a9fc0' : 'rgba(26,159,192,0.3)' }}
                    />
                  ))}
                </div>

                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-400"
                    style={{ opacity: fade ? 1 : 0, transform: fade ? 'scale(1)' : 'scale(1.04)' }}
                  />
                  {product.inStock && (
                    <div className="absolute bottom-3 right-3 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                      В наличии
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5" style={{ opacity: fade ? 1 : 0, transition: 'opacity 0.4s' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-aqua-primary bg-aqua-pale px-2.5 py-1 rounded-full border border-aqua-primary/20">
                      {product.brand}
                    </span>
                    <span className="text-xs text-slate-400">{product.article}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1 line-clamp-2 leading-snug">{product.name}</h3>
                  <p className="text-xs text-slate-600 mb-3 line-clamp-1">{product.specs}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-aqua-deep">{product.price.toLocaleString('ru-RU')} <span className="text-sm font-medium text-slate-500">сом</span></span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/product/${product.slug}`)}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold border-2 border-aqua-primary text-aqua-primary hover:bg-aqua-primary/10 transition-all"
                    >
                      Подробнее
                    </button>
                    <button
                      onClick={handleOrder}
                      className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-all hover:opacity-90"
                      style={{ background: '#1E88E5' }}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Заказать
                    </button>
                  </div>
                </div>
              </div>
            </div>}

            {/* RIGHT — Text content */}
            <div className={`flex-1 text-center lg:text-left transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`} style={{ transitionDelay: '0.5s' }}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aqua-primary/10 border border-aqua-primary/25 mb-6 hover:bg-aqua-primary/20 transition-all duration-300">
                <span className="w-2 h-2 rounded-full bg-aqua-primary animate-pulse-glow" />
                <span className="text-aqua-deep text-xs sm:text-sm font-medium">Профессиональные решения для бассейнов</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-aqua-deep leading-tight mb-5">
                Профессиональная химия
                <br />
                <span className="text-aqua-primary">и оборудование</span>
                <br />
                для бассейнов
              </h1>

              <p className="text-base sm:text-lg text-slate-700 mb-8 max-w-xl mx-auto lg:mx-0">
                Предоставляем услуги по уходу за вашим бассейном
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center lg:justify-start">
                <Button size="lg" onClick={() => navigate('/catalog')}
                  className="gap-2 bg-aqua-primary text-white hover:bg-aqua-deep px-8 py-6 text-base font-semibold rounded-xl shadow-md transition-all hover:scale-105">
                  Перейти в каталог
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => {
                  const clean = whatsappNumber.replace(/\D/g, '');
                  if (!clean) return;
                  const msg = encodeURIComponent('Здравствуйте! Хочу получить консультацию.');
                  window.open(`https://wa.me/${clean}?text=${msg}`, '_blank');
                }}
                  className="gap-2 bg-white text-aqua-primary border-aqua-primary/40 hover:bg-aqua-primary/10 px-8 py-6 text-base font-semibold rounded-xl transition-all hover:scale-105">
                  Получить консультацию
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto lg:mx-0">
                {[
                  { value: '15+', label: 'лет на рынке' },
                  { value: '5000+', label: 'клиентов' },
                  { value: '50+', label: 'брендов' },
                  { value: '24/7', label: 'поддержка' },
                ].map((stat, index) => (
                  <div key={index} className="text-center p-3 rounded-xl bg-aqua-primary/8 border border-aqua-primary/20 hover:bg-aqua-primary/15 hover:scale-105 transition-all duration-300 cursor-default group">
                    <div className="text-xl sm:text-2xl font-bold text-aqua-deep mb-1 group-hover:text-aqua-primary transition-colors">{stat.value}</div>
                    <div className="text-xs text-slate-900 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <button onClick={() => scrollToSection('#benefits')}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-aqua-primary transition-colors">
            <span className="text-xs">Листайте вниз</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>
      </section>
    </div>
  );
}
