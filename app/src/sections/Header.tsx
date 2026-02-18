import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Phone, Home, Package, Info, Wrench, Mail, Search, AlignJustify, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { products } from '@/data/products';
import type { Product } from '@/data/products';
import { useCategories } from '@/hooks/useCategories';

const navLinks = [
  { name: 'Главная',    href: '/',          icon: Home    },
  { name: 'Каталог',   href: '/catalog',   icon: Package },
  { name: 'О компании', href: '/#about',    icon: Info    },
  { name: 'Услуги',    href: '/#services', icon: Wrench  },
  { name: 'Контакты',  href: '/#footer',   icon: Mail    },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const categories = useCategories();
  const [catOpen, setCatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);
  const mobileSearchWrapRef = useRef<HTMLDivElement>(null);
  const desktopSearchWrapRef = useRef<HTMLDivElement>(null);

  // Close category dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !mobileSearchWrapRef.current?.contains(target) &&
        !desktopSearchWrapRef.current?.contains(target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Filter suggestions
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const filtered = products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.article.toLowerCase().includes(q)
      )
      .slice(0, 6);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [searchQuery]);

  // Close on route change
  useEffect(() => {
    setCatOpen(false);
    setShowSuggestions(false);
  }, [location]);

  const handleNavClick = (href: string) => {
    if (href === '/') {
      navigate('/');
      return;
    }
    if (href.startsWith('/#')) {
      const sectionId = href.substring(2);
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (slug: string) => {
    navigate(`/product/${slug}`);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleShowAll = () => {
    navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  // Reusable suggestions dropdown
  const SuggestionsDropdown = () =>
    showSuggestions && suggestions.length > 0 ? (
      <div
        className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
        style={{ zIndex: 200 }}
      >
        {suggestions.map((p) => (
          <button
            key={p.id}
            type="button"
            onMouseDown={() => handleSuggestionClick(p.slug)}
            className="flex items-center gap-3 w-full px-4 py-3 hover:bg-sky-50 transition-all text-left border-b border-gray-50 last:border-0"
          >
            <img
              src={p.images[0]}
              alt={p.name}
              className="w-11 h-11 object-cover rounded-lg flex-shrink-0 bg-slate-100"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-900 truncate">{p.name}</div>
              <div className="text-xs text-slate-500">{p.brand} · {p.article}</div>
            </div>
            <div className="text-sm font-bold text-aqua-primary flex-shrink-0 ml-2">
              {p.price.toLocaleString('ru-RU')} сом
            </div>
          </button>
        ))}
        <button
          type="button"
          onMouseDown={handleShowAll}
          className="flex items-center justify-center gap-1.5 w-full px-4 py-3 text-sm font-semibold text-aqua-primary hover:bg-sky-50 transition-all"
          style={{ borderTop: '1px solid #e0f2fe' }}
        >
          <Search className="w-3.5 h-3.5" />
          Показать все результаты
        </button>
      </div>
    ) : null;

  return (
    <>
      {/* ── MOBILE HEADER (< lg) ── */}
      <header className="lg:hidden relative z-50">
        <div
          className="relative px-4 pt-6 pb-4"
          style={{ background: 'linear-gradient(135deg, #1a9fc0 0%, #0e7fa3 100%)' }}
        >
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(135deg, #ffffff 0px, #ffffff 1px, transparent 1px, transparent 28px)',
            }}
          />
          {/* Floating bubbles */}
          {[
            { size: 8,  left: '5%',  bottom: '10%', delay: '0s',   dur: '8s'  },
            { size: 5,  left: '15%', bottom: '5%',  delay: '2s',   dur: '11s' },
            { size: 10, left: '70%', bottom: '8%',  delay: '1s',   dur: '9s'  },
            { size: 6,  left: '85%', bottom: '15%', delay: '3.5s', dur: '12s' },
            { size: 7,  left: '45%', bottom: '5%',  delay: '1.5s', dur: '10s' },
          ].map((b, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float-up"
              style={{
                width: b.size, height: b.size,
                left: b.left, bottom: b.bottom,
                animationDelay: b.delay, animationDuration: b.dur,
                background: 'rgba(255,255,255,0.25)',
                border: '1px solid rgba(255,255,255,0.4)',
              }}
            />
          ))}

          {/* Logo */}
          <button
            onClick={() => handleNavClick('/')}
            className="relative flex items-center justify-center w-full mb-4"
          >
            <img
              src="/logo.png"
              alt="AQUA ХИМИЯ"
              className="h-24"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </button>

          {/* Search bar */}
          <div ref={mobileSearchWrapRef} className="relative">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Поиск товара..."
                className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-white text-gray-800 placeholder-gray-400 outline-none border-0 shadow-inner"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-white/20 text-white font-bold text-sm border border-white/40 hover:bg-white/30 transition-colors flex items-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                Найти
              </button>
            </form>
            <SuggestionsDropdown />
          </div>
        </div>

        {/* Categories bar */}
        <div ref={catRef} style={{ background: '#0a6a8a' }}>
          <button
            onClick={() => setCatOpen((o) => !o)}
            className="flex items-center gap-2 px-4 py-2.5 text-white font-bold text-sm tracking-wide w-full"
          >
            <AlignJustify className="w-5 h-5" />
            КАТЕГОРИИ
            <ChevronDown
              className={`w-4 h-4 ml-auto transition-transform duration-300 ${
                catOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {catOpen && (
            <div className="px-3 pb-3 flex flex-col gap-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    navigate(`/catalog?category=${cat.id}`);
                    setCatOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-white/20 transition-all text-sm font-semibold text-left w-full"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ── DESKTOP HEADER (≥ lg) ── */}
      <header className="hidden lg:block relative z-50">
        {/* Blue top bar */}
        <div
          className="relative"
          style={{ background: 'linear-gradient(135deg, #1a9fc0 0%, #0e7fa3 100%)' }}
        >
          <div
            className="absolute -top-10 -right-10 w-64 h-64 rounded-full opacity-15 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #ffffff, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #66D4FF, transparent 70%)' }}
          />
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(135deg, #ffffff 0px, #ffffff 1px, transparent 1px, transparent 28px)',
            }}
          />

          <div className="max-w-7xl mx-auto px-8 py-6 flex items-center gap-8">
            {/* Logo */}
            <button
              onClick={() => handleNavClick('/')}
              className="flex-shrink-0 hover:scale-105 transition-transform"
            >
              <img
                src="/logo.png"
                alt="AQUA ХИМИЯ"
                className="h-24"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </button>

            {/* Search */}
            <div ref={desktopSearchWrapRef} className="relative flex-1 max-w-xl">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="Поиск товара..."
                  className="flex-1 px-5 py-2.5 rounded-xl text-sm bg-white text-gray-800 placeholder-gray-400 outline-none shadow-inner"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-white/20 text-white font-bold text-sm border border-white/40 hover:bg-white/30 transition-colors flex items-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  Найти
                </button>
              </form>
              <SuggestionsDropdown />
            </div>
          </div>
        </div>

        {/* Categories + Nav bar */}
        <div ref={catRef} className="relative" style={{ background: '#0a6a8a' }}>
          <div className="max-w-7xl mx-auto px-8 flex items-center gap-2">
            {/* Categories dropdown trigger */}
            <div className="relative self-stretch flex items-stretch">
              <button
                onClick={() => setCatOpen((o) => !o)}
                className="flex items-center gap-2 px-4 py-4 text-white font-bold text-sm tracking-wide border-r border-white/20 pr-6 mr-2"
              >
                <AlignJustify className="w-5 h-5" />
                КАТЕГОРИИ
                <ChevronDown
                  className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                    catOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {catOpen && (
                <div
                  className="absolute left-0 z-50 flex flex-col min-w-[220px] py-2 shadow-xl rounded-b-xl"
                  style={{ background: '#0a6a8a', top: '100%', left: '-28px' }}
                >
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        navigate(`/catalog?category=${cat.id}`);
                        setCatOpen(false);
                      }}
                      className="flex items-center gap-3 px-6 py-3 text-white/90 hover:bg-white/15 hover:text-white transition-all text-sm font-semibold text-left"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Nav links */}
            <nav className="flex items-center gap-1 flex-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.href)}
                  className="px-4 py-4 text-sm font-semibold text-white/90 hover:text-white hover:bg-white/15 transition-all"
                >
                  {link.name}
                </button>
              ))}
            </nav>

            {/* CTA */}
            <Button
              onClick={() => handleNavClick('/#footer')}
              className="flex-shrink-0 gap-2 bg-white text-aqua-primary hover:bg-white/90 hover:scale-105 transition-all font-bold text-sm rounded-xl shadow-md my-2"
            >
              <Phone className="w-3.5 h-3.5" />
              Заказать звонок
            </Button>
          </div>

        </div>
      </header>
    </>
  );
}
