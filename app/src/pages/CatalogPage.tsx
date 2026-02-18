import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingCart, Info, Package, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';

const ITEMS_PER_PAGE = 12;

export default function CatalogPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(() => {
    const cat = searchParams.get('category');
    return cat && cat !== '' ? cat : 'all';
  });
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { products } = useProducts();
  const storedCategories = useCategories();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    setActiveCategory(cat && cat !== '' ? cat : 'all');
    setCurrentPage(1);
  }, [searchParams]);

  useEffect(() => {
    const settings = localStorage.getItem('siteSettings');
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      setWhatsappNumber(parsedSettings.whatsappNumber || '');
    }
  }, []);

  const handleWhatsAppOrder = (e: React.MouseEvent, product: typeof products[0]) => {
    e.stopPropagation();
    if (!whatsappNumber) {
      alert('Номер WhatsApp не настроен. Обратитесь к администратору.');
      return;
    }
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const message = `Здравствуйте! Интересует:\n\n${product.name}\nАртикул: ${product.article}\nЦена: ${product.price.toLocaleString('ru-RU')} сом`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
  };

  // Динамические категории из localStorage + реальных товаров
  const categories = useMemo(() => {
    const usedIds = new Set(products.map(p => p.category));
    const catMap = new Map(storedCategories.map(c => [c.id, c]));
    const result: { id: string; name: string; icon: string }[] = [];
    result.push({ id: 'all', name: 'Все товары', icon: '📦' });
    for (const cat of storedCategories) {
      if (cat.id !== 'all' && usedIds.has(cat.id)) {
        result.push({ id: cat.id, name: cat.name, icon: cat.icon });
      }
    }
    for (const id of usedIds) {
      if (!catMap.has(id) && id !== 'all') {
        result.push({ id, name: id, icon: '📦' });
      }
    }
    return result;
  }, [products, storedCategories]);

  const filteredProducts = useMemo(() => {
    let filtered = activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.article.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [activeCategory, searchQuery, products]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return products.length;
    return products.filter(p => p.category === categoryId).length;
  };

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <Button
            variant="outline"
            className="gap-2 mb-4 sm:mb-6 border-slate-300 hover:border-aqua-primary hover:text-aqua-primary transition-colors min-h-[44px]"
            onClick={() => navigate('/')}
          >
            <ChevronLeft className="w-4 h-4" />
            Назад
          </Button>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
            Каталог продукции
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8">
            Профессиональное оборудование и химия от ведущих производителей
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mb-6 sm:mb-8">
            <div className="relative bg-white rounded-lg shadow-sm border border-slate-200 focus-within:border-aqua-primary focus-within:ring-1 focus-within:ring-aqua-primary transition-all">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Поиск по названию, артикулу, бренду..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 rounded-lg focus:outline-none text-sm sm:text-base text-slate-900 placeholder:text-slate-400 bg-transparent min-h-[44px]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors min-h-[44px] px-2"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all min-h-[40px] ${
                activeCategory === category.id
                  ? 'bg-aqua-primary text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-aqua-primary hover:text-aqua-primary'
              }`}
            >
              <span className="whitespace-nowrap">{category.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                activeCategory === category.id
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {getCategoryCount(category.id)}
              </span>
            </button>
          ))}
        </div>

        {/* Products Count */}
        <div className="mb-6">
          <p className="text-sm text-slate-600">
            Найдено товаров: <span className="font-semibold text-slate-900">{filteredProducts.length}</span>
            {totalPages > 1 && (
              <span className="ml-2 text-slate-400">· Страница {currentPage} из {totalPages}</span>
            )}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {paginatedProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.slug}`)}
              className="group border border-gray-200 rounded-2xl hover:border-aqua-primary/40 hover:shadow-xl transition-all cursor-pointer overflow-hidden bg-white"
            >
              {/* Product Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  loading="lazy"
                  decoding="async"
                />
                {product.inStock ? (
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    В наличии
                  </div>
                ) : (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    Нет в наличии
                  </div>
                )}
              </div>

              {/* Product Content */}
              <div className="p-4 sm:p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full border text-aqua-primary bg-aqua-pale border-aqua-primary/20">
                    {product.brand}
                  </span>
                  <span className="text-xs text-slate-400">{product.article}</span>
                </div>

                <h3 className="text-sm sm:text-[15px] font-semibold leading-normal text-slate-900 line-clamp-2">
                  {product.name}
                </h3>

                <p className="text-xs sm:text-sm leading-relaxed text-slate-800 line-clamp-2">
                  {product.specs}
                </p>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-bold text-aqua-deep">{product.price.toLocaleString('ru-RU')}</span>
                  <span className="text-sm font-medium text-slate-800">сом</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${product.slug}`);
                    }}
                    className="flex-1 text-xs font-semibold min-h-[40px] gap-1.5 inline-flex items-center justify-center rounded-lg transition-all hover:bg-teal-50"
                    style={{ backgroundColor: '#FFFFFF', color: '#0D9488', border: '2px solid #0D9488' }}
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Подробнее</span>
                  </button>

                  <button
                    onClick={(e) => handleWhatsAppOrder(e, product)}
                    className="flex-1 text-xs font-semibold min-h-[40px] gap-1.5 inline-flex items-center justify-center rounded-lg transition-all hover:bg-blue-600"
                    style={{ backgroundColor: '#1E88E5', color: '#FFFFFF' }}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Заказать
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto bg-white rounded-lg p-10 border border-slate-200">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Товары не найдены</h3>
              <p className="text-slate-600 mb-4">Попробуйте изменить поисковый запрос или выбрать другую категорию</p>
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery('')}
                  className="bg-aqua-primary text-white hover:bg-aqua-deep"
                >
                  Очистить поиск
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10 sm:mt-12">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:border-aqua-primary hover:text-aqua-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                  currentPage === page
                    ? 'bg-aqua-primary text-white shadow-md'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-aqua-primary hover:text-aqua-primary'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center hover:border-aqua-primary hover:text-aqua-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
