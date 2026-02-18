import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '@/data/products';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import useEmblaCarousel from 'embla-carousel-react';

export default function Catalog() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const { products } = useProducts();
  const storedCategories = useCategories();
  const sectionRef = useRef<HTMLElement>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 640px)': { slidesToScroll: 1 },
      '(min-width: 1024px)': { slidesToScroll: 1 },
    }
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.05, rootMargin: '100px' }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const settings = localStorage.getItem('siteSettings');
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      setWhatsappNumber(parsedSettings.whatsappNumber || '');
    }
  }, []);

  const handleWhatsAppOrder = (e: React.MouseEvent, product: typeof products[0]) => {
    e.stopPropagation();
    if (!whatsappNumber) { alert('Номер WhatsApp не настроен. Обратитесь к администратору.'); return; }
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const message = `Здравствуйте! Интересует:\n\n${product.name}\nАртикул: ${product.article}\nЦена: ${product.price.toLocaleString('ru-RU')} сом`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
  };

  // Динамические категории из localStorage + реальных товаров
  const categories = useMemo(() => {
    const usedIds = new Set(products.map(p => p.category));
    const hasFeatured = products.some(p => p.featured);
    const catMap = new Map(storedCategories.map(c => [c.id, c]));
    const result: { id: string; name: string; icon: string }[] = [];
    // "Все товары" always first
    result.push({ id: 'all', name: 'Все товары', icon: '📦' });
    // "Популярное" if any featured
    if (hasFeatured) result.push({ id: 'featured', name: 'Популярное', icon: '⭐' });
    // Categories from localStorage that have products
    for (const cat of storedCategories) {
      if (cat.id !== 'all' && usedIds.has(cat.id)) {
        result.push({ id: cat.id, name: cat.name, icon: cat.icon });
      }
    }
    // Any product categories not in storedCategories
    for (const id of usedIds) {
      if (!catMap.has(id) && id !== 'all') {
        result.push({ id, name: id, icon: '📦' });
      }
    }
    return result;
  }, [products, storedCategories]);

  const filteredProducts = useMemo(() => {
    let filtered;
    if (activeCategory === 'all') {
      filtered = products;
    } else if (activeCategory === 'featured') {
      filtered = products.filter(p => p.featured);
    } else {
      filtered = products.filter((p) => p.category === activeCategory);
    }
    return filtered.slice(0, 8);
  }, [activeCategory, products]);

  return (
    <section id="catalog" ref={sectionRef} className="relative py-16 sm:py-20 lg:py-28" style={{ zIndex: 10 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 lg:p-10 mb-8 sm:mb-10 border border-aqua-primary/20 shadow-sm"
          style={{ background: 'linear-gradient(135deg, rgba(26, 159, 192, 0.08) 0%, rgba(14, 127, 163, 0.05) 100%)' }}
        >
          <div className={`relative z-10 text-center mb-6 sm:mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="inline-block px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-aqua-primary/10 text-aqua-primary text-xs sm:text-sm font-bold mb-4 sm:mb-6 border border-aqua-primary/25">
              Каталог продукции
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-aqua-deep mb-3 sm:mb-4 px-2 sm:px-0">
              <span className="block mb-2">Кристально чистая вода -</span>
              <span className="text-aqua-primary">это просто!</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-900 max-w-2xl mx-auto px-4 sm:px-0 mb-6">
              Все необходимое для ухода за вашим бассейном в одном месте
            </p>
            <button
              onClick={() => navigate('/catalog')}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-aqua-primary text-white font-bold text-sm sm:text-base rounded-xl hover:bg-aqua-deep hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <span>Смотреть весь каталог</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className={`relative z-10 flex flex-wrap justify-center gap-2 sm:gap-3 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 group min-h-[40px] ${
                  activeCategory === category.id
                    ? 'bg-aqua-primary text-white shadow-md scale-105 border border-aqua-primary'
                    : 'bg-white text-gray-600 hover:bg-aqua-primary/10 hover:text-aqua-primary hover:scale-105 border border-gray-200 hover:border-aqua-primary/40 shadow-sm'
                }`}
              >
                <span className="whitespace-nowrap">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative" style={{ zIndex: 30, position: 'relative' }}>
          <button onClick={scrollPrev} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-xl flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 -translate-x-4 sm:-translate-x-6" aria-label="Previous">
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-aqua-primary" />
          </button>
          <button onClick={scrollNext} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-xl flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 translate-x-4 sm:translate-x-6" aria-label="Next">
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-aqua-primary" />
          </button>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 sm:gap-5 md:gap-6">
              {filteredProducts.map((product, index) => (
                <div key={product.id} className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] xl:flex-[0_0_calc(25%-18px)] min-w-0">
                  <div
                    onClick={() => navigate(`/product/${product.slug}`)}
                    className={`group border border-gray-200 rounded-2xl hover:border-aqua-primary/40 hover:shadow-xl transition-all cursor-pointer overflow-hidden h-full bg-white ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transitionDelay: `${Math.min(index * 50, 400)}ms` }}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" loading="lazy" decoding="async" />
                      {product.inStock ? (
                        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">В наличии</div>
                      ) : (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">Нет в наличии</div>
                      )}
                    </div>
                    <div className="p-4 sm:p-5 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full border text-aqua-primary bg-aqua-pale border-aqua-primary/20">{product.brand}</span>
                        <span className="text-xs text-slate-400">{product.article}</span>
                      </div>
                      <h3 className="text-sm sm:text-[15px] font-semibold leading-normal text-slate-900 line-clamp-2">{product.name}</h3>
                      <p className="text-xs sm:text-sm leading-relaxed text-slate-800 line-clamp-2">{product.specs}</p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl sm:text-2xl font-bold text-aqua-deep">{product.price.toLocaleString('ru-RU')}</span>
                        <span className="text-sm font-medium text-slate-800">сом</span>
                      </div>
                      <div className="flex gap-2" style={{ isolation: 'isolate', position: 'relative', zIndex: 30 }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.slug}`); }}
                          className="flex-1 text-xs font-semibold min-h-[40px] gap-1.5 inline-flex items-center justify-center rounded-lg transition-all hover:bg-teal-50"
                          style={{ backgroundColor: '#FFFFFF', color: '#0D9488', border: '2px solid #0D9488', isolation: 'isolate' }}
                        >
                          <Info className="w-3.5 h-3.5" />
                          <span>Подробнее</span>
                        </button>
                        <button
                          onClick={(e) => handleWhatsAppOrder(e, product)}
                          className="flex-1 text-xs font-semibold min-h-[40px] gap-1.5 inline-flex items-center justify-center rounded-lg transition-all hover:bg-blue-600"
                          style={{ backgroundColor: '#1E88E5', color: '#FFFFFF', isolation: 'isolate' }}
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Заказать
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
