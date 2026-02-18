import { useState } from 'react';
import {
  Check,
  ShoppingBag,
  Building2,
  Users,
  Smartphone,
  Bot,
  TrendingUp,
  Code2,
  Layout,
  Minus,
  Plus,
  Trash2,
  FileDown,
  Calculator as CalcIcon
} from 'lucide-react';
import { serviceCategories, discountOptions } from '@/data/services';
import { useCalculator } from '@/hooks/useCalculator';
import { cn } from '@/lib/utils';
import { MarineBackground, FloatingElements } from '@/components/ui/marine-background';

const iconMap: Record<string, React.ElementType> = {
  Layout,
  ShoppingCart: ShoppingBag,
  Building2,
  Users,
  Smartphone,
  Bot,
  TrendingUp,
  Code2,
};

export function Calculator() {
  const [activeCategory, setActiveCategory] = useState(serviceCategories[0].id);
  
  const {
    selectedServices,
    discount,
    customDiscount,
    effectiveDiscount,
    estimate,
    selectedCount,
    isServiceSelected,
    toggleService,
    updateQuantity,
    setDiscount,
    setCustomDiscount,
    clearAll,
  } = useCalculator();

  const currentCategory = serviceCategories.find((c) => c.id === activeCategory);

  const handleDiscountChange = (value: number) => {
    setDiscount(value);
    setCustomDiscount(null);
  };

  const handleCustomDiscountChange = (value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setCustomDiscount(num);
      setDiscount(0);
    } else if (value === '') {
      setCustomDiscount(null);
    }
  };

  return (
    <section id="calculator" className="relative py-20 lg:py-28 bg-gradient-to-br from-[#F8F9FA] via-white to-[#F8F9FA] overflow-hidden">
      {/* Marine Background Patterns */}
      <MarineBackground variant="bubbles" opacity={0.1} animated />
      <FloatingElements count={10} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1F2937] mb-4">
            Калькулятор IT-услуг
          </h2>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
            Выберите необходимые услуги и получите мгновенный расчет стоимости
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Categories and Services */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category Tabs */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-2 overflow-x-auto">
              <div className="flex gap-1 min-w-max">
                {serviceCategories.map((category) => {
                  const Icon = iconMap[category.icon] || Layout;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={cn(
                        'tab-pill flex items-center gap-2',
                        activeCategory === category.id && 'active'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{category.shortName}</span>
                      <span className="sm:hidden">{category.shortName.slice(0, 8)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Services List */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[#1F2937] flex items-center gap-2">
                  {currentCategory?.name}
                </h3>
                <span className="text-sm text-[#6B7280]">
                  {currentCategory?.services.length} услуг
                </span>
              </div>

              <div className="space-y-3">
                {currentCategory?.services.map((service) => {
                  const isSelected = isServiceSelected(currentCategory.id, service.id);
                  
                  return (
                    <div
                      key={service.id}
                      onClick={() => toggleService(currentCategory.id, service.id)}
                      className={cn(
                        'service-card cursor-pointer flex items-center justify-between group',
                        isSelected && 'selected'
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            'checkbox-custom',
                            isSelected && 'checked'
                          )}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <div>
                          <p className="font-medium text-[#1F2937] group-hover:text-[#2563EB] transition-colors">
                            {service.name}
                          </p>
                          {service.description && (
                            <p className="text-sm text-[#6B7280] mt-0.5">
                              {service.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {service.unit === 'hour' && isSelected && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const selected = selectedServices.find(
                                  (s) => s.categoryId === currentCategory.id && s.serviceId === service.id
                                );
                                if (selected) {
                                  updateQuantity(currentCategory.id, service.id, selected.quantity - 1);
                                }
                              }}
                              className="w-7 h-7 rounded-lg border border-[#E5E7EB] flex items-center justify-center hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center font-medium text-[#1F2937]">
                              {selectedServices.find(
                                (s) => s.categoryId === currentCategory.id && s.serviceId === service.id
                              )?.quantity || 1}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const selected = selectedServices.find(
                                  (s) => s.categoryId === currentCategory.id && s.serviceId === service.id
                                );
                                if (selected) {
                                  updateQuantity(currentCategory.id, service.id, selected.quantity + 1);
                                }
                              }}
                              className="w-7 h-7 rounded-lg border border-[#E5E7EB] flex items-center justify-center hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-sm text-[#6B7280] ml-1">час</span>
                          </div>
                        )}
                        <div className="text-right">
                          <p className="font-semibold text-[#1F2937]">
                            ${service.price}
                          </p>
                          <p className="text-xs text-[#6B7280]">
                            {service.unit === 'hour' ? '$/час' : 'фикс'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Discount Section */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Скидка</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {discountOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleDiscountChange(option.value)}
                    className={cn(
                      'discount-btn',
                      discount === option.value && !customDiscount && 'active'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#6B7280]">Или введите вручную:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={customDiscount ?? ''}
                    onChange={(e) => handleCustomDiscountChange(e.target.value)}
                    placeholder="0"
                    className="w-20 input-field text-center"
                  />
                  <span className="text-[#6B7280]">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="summary-card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-[#1F2937]">Итого</h3>
                  {selectedCount > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-sm text-[#6B7280] hover:text-red-500 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Очистить
                    </button>
                  )}
                </div>

                {selectedCount === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-[#F3F4F6] flex items-center justify-center mx-auto mb-4">
                      <CalcIcon className="w-8 h-8 text-[#9CA3AF]" />
                    </div>
                    <p className="text-[#6B7280]">Выберите услуги для расчета</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Selected Items */}
                    <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
                      {estimate.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-start py-2 border-b border-[#F3F4F6] last:border-0"
                        >
                          <div className="flex-1 pr-4">
                            <p className="text-sm font-medium text-[#1F2937]">
                              {item.name}
                            </p>
                            <p className="text-xs text-[#6B7280]">{item.category}</p>
                          </div>
                          <p className="text-sm font-semibold text-[#1F2937]">
                            ${item.total.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-[#E5E7EB] pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#6B7280]">Подытог</span>
                        <span className="font-medium text-[#1F2937]">
                          ${estimate.subtotal.toLocaleString()}
                        </span>
                      </div>
                      
                      {effectiveDiscount > 0 && (
                        <div className="flex justify-between items-center mb-2 text-green-600">
                          <span className="flex items-center gap-1">
                            Скидка ({effectiveDiscount}%)
                          </span>
                          <span className="font-medium">
                            -${estimate.discountAmount.toLocaleString()}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-3 border-t border-[#E5E7EB]">
                        <span className="text-lg font-bold text-[#1F2937]">Всего</span>
                        <span className="text-2xl font-bold text-[#2563EB]">
                          ${estimate.total.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-3 pt-4">
                      <button className="btn-primary w-full flex items-center justify-center gap-2">
                        <FileDown className="w-5 h-5" />
                        Сгенерировать КП
                      </button>
                      <p className="text-xs text-center text-[#6B7280]">
                        PDF, демо-сайт и презентация
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              {selectedCount > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg border border-[#E5E7EB] p-3 text-center">
                    <p className="text-2xl font-bold text-[#2563EB]">{selectedCount}</p>
                    <p className="text-xs text-[#6B7280]">Услуг выбрано</p>
                  </div>
                  <div className="bg-white rounded-lg border border-[#E5E7EB] p-3 text-center">
                    <p className="text-2xl font-bold text-[#059669]">
                      {Math.round(estimate.total / 50)}
                    </p>
                    <p className="text-xs text-[#6B7280]">Часов работы</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
