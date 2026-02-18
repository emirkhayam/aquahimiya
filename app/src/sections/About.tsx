import { useEffect, useRef, useState } from 'react';
import { Target, Users, Handshake, TrendingUp } from 'lucide-react';
import { MarineBackground, FloatingElements } from '@/components/ui/marine-background';

const stats = [
  { value: 15, suffix: '+', label: 'лет на рынке' },
  { value: 5000, suffix: '+', label: 'клиентов' },
  { value: 50, suffix: '+', label: 'брендов-партнеров' },
  { value: 24, suffix: '/7', label: 'техподдержка' },
];

const values = [
  {
    icon: Target,
    title: 'Миссия',
    description:
      'Обеспечивать чистоту и безопасность воды в каждом бассейне, предлагая только проверенные решения',
  },
  {
    icon: Users,
    title: 'Команда',
    description:
      'Опытные специалисты с техническим образованием и многолетней практикой в сфере водоподготовки',
  },
  {
    icon: Handshake,
    title: 'Партнерство',
    description:
      'Долгосрочное сотрудничество с мировыми лидерами производства оборудования для бассейнов',
  },
  {
    icon: TrendingUp,
    title: 'Развитие',
    description:
      'Постоянное расширение ассортимента и внедрение инновационных технологий очистки воды',
  },
];

function AnimatedCounter({
  value,
  suffix,
  isVisible,
}: {
  value: number;
  suffix: string;
  isVisible: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function About() {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-16 sm:py-20 lg:py-28 bg-gradient-to-br from-white via-slate-50 to-white overflow-hidden"
    >
      {/* Professional Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Sophisticated Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #0088CC 1px, transparent 1px),
              linear-gradient(to bottom, #0088CC 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Diagonal Accent Lines */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 80px,
                #0088CC 80px,
                #0088CC 81px
              )`,
            }}
          />
        </div>

        {/* Radial Gradient Overlays */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-aqua-primary/[0.08] via-transparent to-transparent blur-3xl transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-aqua-bright/[0.06] via-transparent to-transparent blur-3xl transform -translate-x-1/4 translate-y-1/4" />

        {/* Geometric Accent Shapes */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-aqua-primary/20 rounded-full animate-pulse-slow" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-aqua-bright/15 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-aqua-primary/20 rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-aqua-bright/15 rounded-full animate-pulse-slow" style={{ animationDelay: '1.5s' }} />

        {/* Decorative Corner Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 border-l-2 border-t-2 border-aqua-primary/[0.08] rounded-tl-[80px]" />
        <div className="absolute bottom-0 right-0 w-64 h-64 border-r-2 border-b-2 border-aqua-primary/[0.08] rounded-br-[80px]" />
      </div>

      {/* Subtle Marine Elements */}
      <MarineBackground variant="ripples" opacity={0.04} animated />
      <FloatingElements count={6} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-aqua-pale text-aqua-primary text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            О компании
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4 px-4 sm:px-0">
            <span className="text-gradient">Аква Химия</span> — надёжный партнёр
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto px-4 sm:px-0">
            С 2009 года мы специализируемся на поставках химии и оборудования для бассейнов.
            Наша цель — обеспечить клиентов качественной продукцией и профессиональной поддержкой.
          </p>
        </div>

        {/* Stats */}
        <div
          className={`grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-20 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-aqua-pale to-white border border-aqua-primary/10"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient mb-1 sm:mb-2">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  isVisible={isVisible}
                />
              </div>
              <div className="text-xs sm:text-sm lg:text-base text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Image */}
          <div
            className={`relative transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-glow">
              <img
                src="/warehouse.jpg"
                alt="Склад Аква Химия"
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-aqua-deep/40 to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 lg:right-8 bg-white rounded-2xl p-4 shadow-glow">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-aqua-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-aqua-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">98%</div>
                  <div className="text-sm text-slate-600">довольных клиентов</div>
                </div>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="space-y-6">
            {values.map((value, index) => (
              <div
                key={index}
                className={`flex gap-4 p-5 rounded-2xl bg-slate-50 hover:bg-aqua-pale transition-all duration-300 group ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
                style={{ transitionDelay: `${index * 100 + 400}ms` }}
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-aqua-primary/10 flex items-center justify-center group-hover:bg-aqua-primary group-hover:scale-110 transition-all duration-300">
                  <value.icon className="w-6 h-6 text-aqua-primary group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-aqua-primary transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
