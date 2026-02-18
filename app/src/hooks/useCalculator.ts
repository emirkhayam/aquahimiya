import { useState, useCallback, useMemo } from 'react';
import type { SelectedService, EstimateResult } from '@/types';
import { serviceCategories } from '@/data/services';

export function useCalculator() {
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [customDiscount, setCustomDiscount] = useState<number | null>(null);

  const isServiceSelected = useCallback((categoryId: string, serviceId: string): boolean => {
    return selectedServices.some(
      (s) => s.categoryId === categoryId && s.serviceId === serviceId
    );
  }, [selectedServices]);

  const toggleService = useCallback((categoryId: string, serviceId: string) => {
    setSelectedServices((prev) => {
      const exists = prev.some(
        (s) => s.categoryId === categoryId && s.serviceId === serviceId
      );
      
      if (exists) {
        return prev.filter(
          (s) => !(s.categoryId === categoryId && s.serviceId === serviceId)
        );
      }
      
      return [...prev, { categoryId, serviceId, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((categoryId: string, serviceId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setSelectedServices((prev) =>
      prev.map((s) =>
        s.categoryId === categoryId && s.serviceId === serviceId
          ? { ...s, quantity }
          : s
      )
    );
  }, []);

  const clearAll = useCallback(() => {
    setSelectedServices([]);
    setDiscount(0);
    setCustomDiscount(null);
  }, []);

  const effectiveDiscount = customDiscount !== null ? customDiscount : discount;

  const estimate: EstimateResult = useMemo(() => {
    const items = selectedServices.map((selected) => {
      const category = serviceCategories.find((c) => c.id === selected.categoryId);
      const service = category?.services.find((s) => s.id === selected.serviceId);
      
      if (!category || !service) {
        return null;
      }
      
      const price = service.price;
      const total = service.unit === 'hour' 
        ? price * selected.quantity 
        : price;
      
      return {
        name: service.name,
        category: category.name,
        price,
        quantity: selected.quantity,
        total,
      };
    }).filter(Boolean) as EstimateResult['items'];

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const discountAmount = subtotal * (effectiveDiscount / 100);
    const total = subtotal - discountAmount;

    return {
      subtotal,
      discountAmount,
      total,
      items,
    };
  }, [selectedServices, effectiveDiscount]);

  const selectedCount = selectedServices.length;

  return {
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
  };
}
