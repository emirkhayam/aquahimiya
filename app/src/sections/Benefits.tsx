import { useEffect, useRef, useState, memo } from 'react';
import { Award, Droplets, HeadphonesIcon, ShieldCheck, Package } from 'lucide-react';

const benefits = [
  {
    icon: Award,
    title: 'Официальные поставщики',
    description:
      'Прямые контракты с ведущими мировыми производителями оборудования и химии для бассейнов',
  },
  {
    icon: ShieldCheck,
    title: 'Сертифицированная продукция',
    description:
      'Вся продукция имеет необходимые сертификаты соответствия и декларации безопасности',
  },
  {
    icon: Droplets,
    title: 'Доставка по всей стране',
    description:
      'Предоставляем услуги по уходу за вашим бассейном',
  },
  {
    icon: HeadphonesIcon,
    title: 'Техническая поддержка',
    description:
      'Круглосуточная консультация по подбору, установке и эксплуатации оборудования',
  },
];

const mobileBenefits = [
  {
    icon: ShieldCheck,
    title: 'Гарантия',
    description: 'Возврат в случае брака',
  },
  {
    icon: Droplets,
    title: 'Доставка',
    description: 'По городу Бишкек и регионам',
  },
  {
    icon: HeadphonesIcon,
    title: 'Поддержка',
    description: 'Мы ответим на все Ваши вопросы',
  },
  {
    icon: Award,
    title: 'Выгода',
    description: 'Оптимальное соотношение цены и качества',
  },
  {
    icon: Package,
    title: 'Ассортимент',
    description: 'Широкий ассортимент товаров',
  },
];

const BenefitCard = memo(({ benefit, index, isVisible }: { benefit: typeof benefits[0], index: number, isVisible: boolean }) => (
  <div
    className={`group relative overflow-hidden p-6 sm:p-7 rounded-2xl sm:rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
    }`}
    style={{
      transitionDelay: `${index * 80 + 150}ms`,
      background: 'linear-gradient(145deg, #1a9fc0 0%, #0e7fa3 60%, #0a6a8a 100%)',
      boxShadow: '0 8px 30px rgba(26, 159, 192, 0.35)',
    }}
  >
    {/* Decorative circle top-right */}
    <div
      className="absolute top-4 right-4 w-6 h-6 rounded-full opacity-40"
      style={{ background: 'rgba(255,255,255,0.5)' }}
    />

    {/* Icon */}
    <div className="relative mb-5 z-10">
      <div
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center"
        style={{
          background: 'rgba(255,255,255,0.18)',
          border: '1.5px solid rgba(255,255,255,0.35)',
        }}
      >
        <benefit.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
      </div>
    </div>

    {/* Content */}
    <h3 className="relative z-10 text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 leading-snug">
      {benefit.title}
    </h3>
    <p className="relative z-10 text-sm text-white/85 leading-relaxed">
      {benefit.description}
    </p>
  </div>
));

BenefitCard.displayName = 'BenefitCard';

const MobileBenefitCard = memo(({ benefit, index, isVisible }: { benefit: typeof mobileBenefits[0], index: number, isVisible: boolean }) => (
  <div
    className={`group relative overflow-hidden p-4 rounded-2xl transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}
    style={{
      transitionDelay: `${index * 60}ms`,
      background: 'linear-gradient(145deg, #1a9fc0 0%, #0e7fa3 60%, #0a6a8a 100%)',
      boxShadow: '0 4px 20px rgba(26, 159, 192, 0.3)',
    }}
  >
    <div className="flex items-center gap-4">
      <div
        className="w-11 h-11 flex-shrink-0 rounded-xl flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.35)' }}
      >
        <benefit.icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex flex-col gap-0.5">
        <h3 className="text-sm font-bold text-white">{benefit.title}</h3>
        <p className="text-xs text-white/80 leading-snug">{benefit.description}</p>
      </div>
    </div>
  </div>
));

MobileBenefitCard.displayName = 'MobileBenefitCard';

function Benefits() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="benefits"
      ref={sectionRef}
      className="relative py-16 sm:py-20 lg:py-28"
      style={{ zIndex: 10 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 lg:p-10 mb-8 sm:mb-10 border border-aqua-primary/20 shadow-sm text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ background: 'linear-gradient(135deg, rgba(26, 159, 192, 0.08) 0%, rgba(14, 127, 163, 0.05) 100%)' }}
        >
          <span className="inline-block px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-aqua-primary/10 text-aqua-primary text-xs sm:text-sm font-bold mb-4 sm:mb-6 border border-aqua-primary/25">
            Наши преимущества
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-aqua-deep mb-3 sm:mb-4 px-2 sm:px-0">
            Почему выбирают <span className="text-aqua-primary">Аква Химия</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto px-4 sm:px-0">
            Мы предлагаем полный комплекс услуг — от поставки оборудования до
            сервисного обслуживания
          </p>
        </div>

        {/* Desktop Benefits Grid */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} benefit={benefit} index={index} isVisible={isVisible} />
          ))}
        </div>

        {/* Mobile Benefits List */}
        <div className="flex md:hidden flex-col gap-3">
          {mobileBenefits.map((benefit, index) => (
            <MobileBenefitCard key={index} benefit={benefit} index={index} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(Benefits);
