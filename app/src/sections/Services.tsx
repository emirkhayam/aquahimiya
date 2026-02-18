import { useEffect, useRef, useState } from 'react';
import {
  Wrench,
  ClipboardList,
  PenTool,
  Settings,
  Waves,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';

const services = [
  {
    icon: ClipboardList,
    title: 'Подбор оборудования',
    description:
      'Бесплатная консультация по подбору оптимального оборудования под ваши задачи и бюджет',
    features: [
      'Анализ требований',
      'Расчёт производительности',
      'Подбор компонентов',
      'Составление спецификации',
    ],
  },
  {
    icon: PenTool,
    title: 'Проектирование систем',
    description:
      'Разработка проектной документации для систем водоподготовки любой сложности',
    features: [
      'Технические схемы',
      'Планировка оборудования',
      'Расчёт гидравлики',
      'Спецификации материалов',
    ],
  },
  {
    icon: Wrench,
    title: 'Монтаж и пусконаладка',
    description:
      'Профессиональный монтаж оборудования с гарантией и обучением персонала',
    features: [
      'Доставка на объект',
      'Установка оборудования',
      'Подключение коммуникаций',
      'Пусконаладочные работы',
    ],
  },
  {
    icon: Settings,
    title: 'Сервисное обслуживание',
    description:
      'Регулярное техническое обслуживание для бесперебойной работы системы',
    features: [
      'Плановые осмотры',
      'Замена расходников',
      'Ремонт оборудования',
      'Аварийный выезд',
    ],
  },
  {
    icon: Waves,
    title: 'Обслуживание вашего бассейна',
    description:
      'Профессиональный уход за бассейном на всех этапах — от запуска до консервации',
    features: [
      'Мойка бассейна',
      'Пусконаладка',
      'Еженедельное обслуживание',
      'Анализ воды, коррект-ка хим. состава',
      'Консервирование бассейна на зимний период',
    ],
  },
];

export default function Services() {
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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Здравствуйте! Хочу получить консультацию по аква-химии');
    const saved = localStorage.getItem('siteSettings');
    const phoneNumber = saved ? JSON.parse(saved).whatsappNumber?.replace(/\D/g, '') : '';
    if (!phoneNumber) return;
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-10 sm:py-20 lg:py-28 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #005A9C 0%, #0088CC 50%, #00B3E6 100%)',
      }}
    >
      {/* Gradient Transition Overlay at Top */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-t from-transparent via-white/60 to-white pointer-events-none z-10" />

      {/* Premium Background decoration with depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Multiple soft light spots for depth */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-aqua-light/20 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-white/15 via-transparent to-transparent blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-aqua-bright/10 via-transparent to-transparent blur-3xl" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Main heading with dramatic styling */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 relative inline-block px-4 sm:px-0">
            {/* Shadow backdrop behind text */}
            <div
              className="absolute inset-0 -z-10 rounded-2xl blur-2xl"
              style={{ background: 'rgba(0, 30, 60, 0.45)' }}
            />
            {/* Gradient text with shadow */}
            <span
              className="relative z-10 block"
              style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #66D4FF 50%, #FFFFFF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))',
              }}
            >
              Комплексное
            </span>
            <span
              className="relative z-10 block mt-2"
              style={{
                color: '#FFFFFF',
                textShadow: '0 2px 12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(102, 212, 255, 0.4)',
              }}
            >
              обслуживание
            </span>

            {/* Decorative underline */}
            <div
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-1.5 rounded-full animate-gradient-shift"
              style={{
                width: '60%',
                background: 'linear-gradient(90deg, transparent, #FFFFFF, #66D4FF, #FFFFFF, transparent)',
                backgroundSize: '200% 100%',
                boxShadow: '0 0 30px rgba(255, 255, 255, 0.7), 0 2px 8px rgba(0, 0, 0, 0.4)',
              }}
            />
          </h2>

          {/* Enhanced subtitle with better contrast */}
          <div className="relative max-w-3xl mx-auto">
            <p
              className="text-lg sm:text-xl font-semibold leading-relaxed relative z-10"
              style={{
                color: '#FFFFFF',
                textShadow: '0 2px 12px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 0, 0, 0.3)',
              }}
            >
              Полный спектр услуг —{' '}
              <span
                className="font-bold"
                style={{
                  color: '#FFFFFF',
                }}
              >
                от консультации до сервисного обслуживания
              </span>
            </p>

            {/* Subtle background glow for subtitle */}
            <div
              className="absolute inset-0 blur-xl -z-10 opacity-50"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(102, 212, 255, 0.2), transparent)',
              }}
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
          {services.map((service, index) => {
            // Alternating style for visual contrast
            const isEven = index % 2 === 0;
            const isLastOdd = services.length % 2 !== 0 && index === services.length - 1;

            return (
              <div
                key={index}
                className={`relative p-4 sm:p-8 rounded-2xl sm:rounded-3xl transition-opacity duration-500 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                } ${isLastOdd ? 'md:col-span-2 md:max-w-xl md:mx-auto md:w-full' : ''}`}
                style={{
                  transitionDelay: `${index * 100 + 200}ms`,
                  background: isEven
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                {/* Accent color indicator */}
                <div
                  className="absolute top-0 left-8 w-16 h-1 rounded-b-full"
                  style={{
                    background: isEven
                      ? 'linear-gradient(90deg, #66D4FF, #00B3E6)'
                      : 'linear-gradient(90deg, #00B3E6, #0088CC)',
                  }}
                />

                {/* Icon */}
                <div
                  className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-6"
                  style={{
                    background: isEven
                      ? 'rgba(102, 212, 255, 0.2)'
                      : 'rgba(0, 179, 230, 0.2)',
                  }}
                >
                  <service.icon className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3">
                  {service.title}
                </h3>
                <p className="text-sm sm:text-base text-white/80 mb-4 sm:mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-3">
                  {service.features.map((feature, fIndex) => (
                    <li
                      key={fIndex}
                      className="flex items-center gap-3 text-sm text-white/70"
                    >
                      <CheckCircle2
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: isEven ? '#66D4FF' : '#00B3E6' }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div
          className={`mt-12 sm:mt-16 text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <div
            className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-6 sm:p-8 rounded-2xl sm:rounded-3xl group transition-all duration-500"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: `
                0 8px 32px rgba(0, 0, 0, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `,
            }}
          >
            <div className="text-center sm:text-left">
              <p className="text-white font-bold text-lg sm:text-xl mb-1 sm:mb-2">
                Нужна консультация?
              </p>
              <p className="text-white/90 text-sm sm:text-base">
                Напишите нам в WhatsApp — ответим за 5 минут
              </p>
            </div>
            <button
              onClick={handleWhatsAppClick}
              className="group/btn relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-100 whitespace-nowrap min-h-[48px] w-full sm:w-auto"
              style={{
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                boxShadow: '0 8px 24px rgba(37, 211, 102, 0.35)',
              }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  style={{
                    transform: 'translateX(-100%)',
                    animation: 'shine 1.5s infinite',
                  }}
                />
              </div>

              <div className="relative flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span>Написать в WhatsApp</span>
              </div>
            </button>
          </div>
        </div>

        {/* Animation for shine effect */}
        <style>{`
          @keyframes shine {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(200%); }
          }
        `}</style>
      </div>

      {/* Gradient Transition Overlay at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-white pointer-events-none z-10" />
    </section>
  );
}
