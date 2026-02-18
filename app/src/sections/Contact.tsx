import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { MarineBackground, FloatingElements } from '@/components/ui/marine-background';

const Contact = () => {
  const [settings, setSettings] = useState({
    phone: '',
    email: '',
    address: '',
    workingHours: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('siteSettings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings({
        phone: parsed.phone || '',
        email: parsed.email || '',
        address: parsed.address || '',
        workingHours: parsed.workingHours || '',
      });
    }
  }, []);

  const contactInfo = [
    {
      icon: Phone,
      title: 'Телефон',
      content: settings.phone || '+7 (800) 555-35-35',
      subContent: 'Звонок',
    },
    {
      icon: Mail,
      title: 'Email',
      content: settings.email || 'info@aquapool.ru',
      subContent: 'Круглосуточно',
    },
    {
      icon: MapPin,
      title: 'Адрес',
      content: settings.address || 'г. Бишкек',
      subContent: '',
    },
    {
      icon: Clock,
      title: 'Режим работы',
      content: settings.workingHours || 'Пн-Пт: 9:00 - 18:00',
      subContent: '',
    },
  ];

  return (
    <section id="contact" className="relative py-20 lg:py-28 bg-gradient-to-br from-white via-[#F5F8FA] to-white overflow-hidden">
      {/* Marine Background Patterns */}
      <MarineBackground variant="combined" opacity={0.12} animated />
      <FloatingElements count={6} />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#294D61]/10 text-[#294D61] text-sm font-medium mb-4">
            Контакты
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#294D61] mb-4">
            Свяжитесь с нами
          </h2>
          <p className="text-lg text-[#6B7B8A] max-w-2xl mx-auto">
            Оставьте заявку или свяжитесь с нами удобным способом.
            Мы ответим на все ваши вопросы.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="flex items-start gap-5 p-5 rounded-xl bg-white border border-[#E5E7EB] hover:border-[#294D61]/30 hover:shadow-aqua transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#294D61]/10 to-[#3a6a82]/10 flex items-center justify-center flex-shrink-0">
                  <info.icon className="w-6 h-6 text-[#294D61]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#6B7B8A] mb-1">
                    {info.title}
                  </h4>
                  <p className="text-lg font-semibold text-[#1E2A3A]">
                    {info.content}
                  </p>
                  {info.subContent && (
                    <p className="text-sm text-[#6B7B8A]">
                      {info.subContent}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Map 2GIS */}
          <div className="rounded-xl overflow-hidden border border-[#E5E7EB] min-h-[400px]">
            <iframe
              src="https://widgets.2gis.com/widget?type=firmsonmap&options=%7B%22pos%22%3A%7B%22lat%22%3A42.819932%2C%22lon%22%3A74.611839%2C%22zoom%22%3A16%7D%2C%22opt%22%3A%7B%22city%22%3A%22bishkek%22%7D%2C%22org%22%3A%2270000001111676634%22%7D"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '400px' }}
              allowFullScreen
              loading="lazy"
              title="Аква Химия на карте 2GIS"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
