import { useState, useEffect } from 'react';
import { categories as staticCategories } from '@/data/products';

export interface Category {
  id: string;
  name: string;
  icon: string;
}

const STORAGE_KEY = 'adminCategories';

export function getStoredCategories(): Category[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fall through
    }
  }
  // First time — seed from static data
  const seeded = staticCategories.map(c => ({ id: c.id, name: c.name, icon: c.icon || '📦' }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  return seeded;
}

export function saveCategories(cats: Category[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cats));
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setCategories(getStoredCategories());

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setCategories(getStoredCategories());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return categories;
}
