import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Droplets, Menu, X, Phone } from 'lucide-react';

const navLinks = [
  { name: 'Главная', href: '#hero' },
  { name: 'Каталог', href: '#catalog' },
  { name: 'О компании', href: '#about' },
  { name: 'Услуги', href: '#services' },
  { name: 'Контакты', href: '#contact' }
];

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-aqua py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="#hero"
              onClick={(e) => { e.preventDefault(); scrollToSection('#hero'); }}
              className="flex items-center gap-3"
            >
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center transition-colors ${
                isScrolled
                  ? 'bg-gradient-to-br from-[#294D61] to-[#3a6a82]'
                  : 'bg-gradient-to-br from-[#3a6a82] to-[#5a8ba8]'
              }`}>
                <Droplets className="w-10 h-10 text-white" />
              </div>
              <div>
                <span className={`text-2xl font-bold transition-colors ${
                  isScrolled ? 'text-[#294D61]' : 'text-white'
                }`}>
                  AquaPool
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                  className={`text-sm font-medium transition-colors hover:text-[#294D61] ${
                    isScrolled ? 'text-[#1E2A3A]' : 'text-white/90'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <a 
                href="tel:+78005553535" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isScrolled ? 'text-[#1E2A3A]' : 'text-white'
                }`}
              >
                <Phone className="w-4 h-4" />
                +7 (800) 555-35-35
              </a>
              <Button
                onClick={() => scrollToSection('#contact')}
                className={`h-10 px-5 text-sm font-medium transition-all ${
                  isScrolled
                    ? 'bg-[#294D61] hover:bg-[#3a6a82] text-white'
                    : 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                }`}
              >
                Заказать звонок
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isScrolled ? 'text-[#1E2A3A]' : 'text-white'
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div
          className={`absolute top-0 right-0 w-full max-w-sm h-full bg-white shadow-2xl transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6 pt-20">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                  className="block py-3 px-4 text-lg font-medium text-[#1E2A3A] hover:bg-[#F5F8FA] hover:text-[#294D61] rounded-lg transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-[#E5E7EB]">
              <a 
                href="tel:+78005553535" 
                className="flex items-center gap-3 py-3 px-4 text-[#1E2A3A]"
              >
                <div className="w-10 h-10 rounded-lg bg-[#294D61]/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[#294D61]" />
                </div>
                <div>
                  <p className="text-sm text-[#6B7B8A]">Бесплатный звонок</p>
                  <p className="font-semibold">+7 (800) 555-35-35</p>
                </div>
              </a>
              
              <Button
                onClick={() => scrollToSection('#contact')}
                className="w-full mt-4 h-12 bg-[#294D61] hover:bg-[#3a6a82] text-white"
              >
                Заказать звонок
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
