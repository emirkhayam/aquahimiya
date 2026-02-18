import { useState, useEffect } from 'react';
import { Droplets, Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const footerLinks = {
  catalog: [
    { name: 'Химия для бассейнов', href: '#catalog' },
    { name: 'Системы фильтрации', href: '#catalog' },
    { name: 'Насосное оборудование', href: '#catalog' },
    { name: 'Автоматика', href: '#catalog' },
    { name: 'Аксессуары', href: '#catalog' },
  ],
  company: [
    { name: 'О компании', href: '#about' },
    { name: 'Услуги', href: '#services' },
    { name: 'Доставка и оплата', href: '#' },
    { name: 'Гарантия', href: '#' },
    { name: 'Контакты', href: '#footer' },
  ],
};

export default function Footer() {
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

  const contacts = [
    { icon: Phone, text: settings.phone || '+7 (800) 555-35-35', href: settings.phone ? `tel:${settings.phone.replace(/\s/g, '')}` : '#' },
    { icon: Mail, text: settings.email || 'info@aquahim.ru', href: settings.email ? `mailto:${settings.email}` : '#' },
    { icon: MapPin, text: settings.address || 'г. Бишкек', href: '#' },
    { icon: Clock, text: settings.workingHours || 'Пн-Пт: 9:00 - 18:00', href: '#' },
  ];

  const scrollToSection = (href: string) => {
    if (href === '#') return;
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="footer" className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <a href="#hero" className="flex items-center mb-6">
              <img
                src="/logo.png"
                alt="AQUA ХИМИЯ"
                className="h-16"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </a>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Поставка химии и оборудования для бассейнов. Комплексные решения
              для чистоты и безопасности воды с 2009 года.
            </p>

            {/* Newsletter */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-white">Подпишитесь на новости</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Ваш email"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-aqua-primary"
                />
                <Button
                  size="icon"
                  className="bg-aqua-primary hover:bg-aqua-deep flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Catalog Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Каталог</h3>
            <ul className="space-y-3">
              {footerLinks.catalog.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-slate-400 hover:text-aqua-light transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Компания</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-slate-400 hover:text-aqua-light transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-white font-semibold mb-6">Контакты</h3>
            <ul className="space-y-4">
              {contacts.map((contact, index) => (
                <li key={index}>
                  <a
                    href={contact.href}
                    className="flex items-start gap-3 text-slate-400 hover:text-aqua-light transition-colors group"
                  >
                    <contact.icon className="w-5 h-5 flex-shrink-0 mt-0.5 group-hover:text-aqua-light" />
                    <span className="text-sm">{contact.text}</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div className="mt-6">
              <p className="text-sm font-medium text-white mb-3">Мы в соцсетях</p>
              <div className="flex gap-3">
                {['VK', 'TG', 'WA'].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-aqua-primary hover:text-white transition-all"
                  >
                    <span className="text-xs font-bold">{social}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2024 Аква Химия. Все права защищены.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-500 hover:text-aqua-light text-sm transition-colors">
                Политика конфиденциальности
              </a>
              <a href="#" className="text-slate-500 hover:text-aqua-light text-sm transition-colors">
                Пользовательское соглашение
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
