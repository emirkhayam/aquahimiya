import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    tag: 'Лучшее качество',
    title: 'Профессиональная химия\nдля бассейнов',
    subtitle: 'Сертифицированные препараты от ведущих мировых производителей. Кристально чистая вода — легко!',
    cta: 'Перейти в каталог',
    ctaHref: '/catalog',
    bg: 'linear-gradient(135deg, #0a6a8a 0%, #1a9fc0 50%, #0e7fa3 100%)',
    accent: '#66D4FF',
    image: null,
    pattern: 'bubbles',
  },
  {
    id: 2,
    tag: 'Новинки сезона',
    title: 'Фильтрационное\nоборудование',
    subtitle: 'Насосы, фильтры, автоматика — всё для идеальной работы бассейна круглый год',
    cta: 'Смотреть фильтрацию',
    ctaHref: '/catalog?category=filtration',
    bg: 'linear-gradient(135deg, #004d7a 0%, #008793 50%, #00bf72 100%)',
    accent: '#00E5B4',
    image: null,
    pattern: 'waves',
  },
  {
    id: 3,
    tag: 'Выгодные цены',
    title: 'Комплексный уход\nза бассейном',
    subtitle: 'От химии до оборудования — всё в одном месте. Консультация специалиста бесплатно!',
    cta: 'Получить консультацию',
    ctaHref: '/#footer',
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    accent: '#e94560',
    image: null,
    pattern: 'grid',
  },
];

export default function SliderBanner() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback((index: number) => {
    if (animating) return;
    setAnimating(true);
    setCurrent(index);
    setTimeout(() => setAnimating(false), 600);
  }, [animating]);

  const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);
  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const handleCta = (href: string) => {
    if (href.startsWith('/#')) {
      const el = document.getElementById(href.substring(2));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(href);
    }
  };

  const slide = slides[current];

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 'clamp(280px, 45vw, 500px)' }}>
      {/* Slide background */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background: s.bg,
            opacity: i === current ? 1 : 0,
            zIndex: i === current ? 1 : 0,
          }}
        >
          {/* Pattern overlay */}
          {s.pattern === 'bubbles' && (
            <>
              {[...Array(8)].map((_, bi) => (
                <div key={bi} className="absolute rounded-full animate-float-up pointer-events-none"
                  style={{
                    width: [20,14,28,10,18,12,22,16][bi],
                    height: [20,14,28,10,18,12,22,16][bi],
                    left: `${[8,18,32,50,62,75,85,42][bi]}%`,
                    bottom: 0,
                    animationDelay: `${[0,2,1,4,1.5,3,0.5,5][bi]}s`,
                    animationDuration: `${[12,16,14,18,13,17,15,20][bi]}s`,
                    background: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                />
              ))}
              <div className="absolute inset-0 opacity-[0.05]" style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }} />
            </>
          )}
          {s.pattern === 'waves' && (
            <div className="absolute inset-0 opacity-[0.07]" style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.5) 20px, rgba(255,255,255,0.5) 21px)`,
            }} />
          )}
          {s.pattern === 'grid' && (
            <div className="absolute inset-0 opacity-[0.06]" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }} />
          )}
          {/* Big glow */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[60%] h-[200%] pointer-events-none opacity-20"
            style={{ background: `radial-gradient(ellipse, ${s.accent}, transparent 60%)` }} />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div
          key={current}
          className="max-w-xl"
          style={{ animation: 'slideIn 0.6s ease-out forwards' }}
        >
          {/* Tag */}
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 sm:mb-4"
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
            {slide.tag}
          </span>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3 sm:mb-4" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
            {slide.title.split('\n').map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-white/85 mb-5 sm:mb-7 max-w-md leading-relaxed hidden sm:block">
            {slide.subtitle}
          </p>

          {/* CTA */}
          <button
            onClick={() => handleCta(slide.ctaHref)}
            className="inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all hover:scale-105 active:scale-95"
            style={{ background: 'white', color: '#0e7fa3', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
          >
            {slide.cta}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 24 : 8,
              height: 8,
              background: i === current ? 'white' : 'rgba(255,255,255,0.45)',
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
