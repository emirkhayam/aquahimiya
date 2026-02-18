import { useState, useCallback, useEffect } from 'react';
import { products as staticProducts } from '@/data/products';
import type { Product } from '@/data/products';

const STORAGE_KEY = 'adminProducts';

function loadFromStorage(): Product[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveToStorage(products: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function deduplicateById(arr: Product[]): Product[] {
  const seen = new Set<number>();
  return arr.filter(p => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}

async function fetchAllProducts(): Promise<Product[]> {
  const response = await fetch('/all-products.json');
  const allProducts: any[] = await response.json();

  const enriched: Product[] = allProducts.map((p) => ({
    id: p.id,
    slug: String(p.name).toLowerCase().replace(/[^a-zа-яёА-ЯЁ0-9]+/gi, '-'),
    name: p.name,
    category: p.category || 'accessories',
    description: p.name,
    fullDescription: p.name,
    price: p.price ?? 0,
    specs: p.unit || '',
    article: p.article || '',
    brand: p.brand || '',
    unit: p.unit || '',
    inStock: true,
    characteristics: {},
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : ['/products/accessories.jpg'],
  }));

  const staticIds = new Set(staticProducts.map(p => p.id));
  const fromJson = enriched.filter(p => !staticIds.has(p.id));
  return deduplicateById([...staticProducts, ...fromJson]);
}

export function useProducts() {
  const [products, setProductsState] = useState<Product[]>(() => {
    const stored = loadFromStorage();
    // If localStorage is empty, use static products immediately as fallback
    return stored.length > 0 ? stored : staticProducts;
  });
  const [loading, setLoading] = useState(false);

  // Auto-fetch from all-products.json if localStorage was empty (first visit)
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored.length === 0) {
      setLoading(true);
      fetchAllProducts()
        .then(merged => {
          setProductsState(merged);
          saveToStorage(merged);
        })
        .catch(() => {
          // staticProducts already set as initial state, just persist them
          saveToStorage(staticProducts);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const setProducts = (updated: Product[]) => {
    const clean = deduplicateById(updated);
    setProductsState(clean);
    saveToStorage(clean);
  };

  /** Очистить все товары */
  const clearAllProducts = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProductsState([]);
  }, []);

  /** Загрузить все товары из all-products.json (перезаписывает текущие) */
  const resetProducts = useCallback(() => {
    setLoading(true);
    fetchAllProducts()
      .then(merged => {
        setProductsState(merged);
        saveToStorage(merged);
      })
      .catch(() => {
        setProductsState(staticProducts);
        saveToStorage(staticProducts);
      })
      .finally(() => setLoading(false));
  }, []);

  return { products, setProducts, clearAllProducts, resetProducts, loading };
}
