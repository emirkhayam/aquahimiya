import { useState, useEffect } from 'react';
import { settingsApi } from '@/lib/api';

export interface Settings {
  siteName?: string;
  whatsappNumber?: string;
  phone?: string;
  email?: string;
  address?: string;
  workingHours?: string;
}

const STORAGE_KEY = 'siteSettings';

// ========================================
// 📝 НАСТРОЙКИ САЙТА ПО УМОЛЧАНИЮ
// ========================================
// Измените эти значения на свои, затем:
// git add src/hooks/useSettings.ts
// git commit -m "Update site settings"
// git push
// ========================================
const DEFAULT_SETTINGS: Settings = {
  siteName: 'AQUAHIMIYA',
  whatsappNumber: '+996555123456',           // ← Ваш WhatsApp номер
  phone: '+996 (555) 12-34-56',             // ← Ваш телефон
  email: 'info@aquachemistry.kg',           // ← Ваш email
  address: 'г. Бишкек, ул. Примерная 123',   // ← Ваш адрес
  workingHours: 'Пн-Пт: 9:00-18:00',        // ← Часы работы
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Сначала пробуем загрузить из localStorage (быстрый старт)
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsedSettings = JSON.parse(cached);
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      } catch (e) {
        console.error('Failed to parse cached settings:', e);
      }
    }

    // Затем загружаем с сервера (свежие данные)
    // Если API недоступен, используются DEFAULT_SETTINGS
    settingsApi.get()
      .then((data: any) => {
        if (data) {
          const mergedSettings = { ...DEFAULT_SETTINGS, ...data };
          setSettings(mergedSettings);
          // Обновляем кеш
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedSettings));
        }
      })
      .catch(() => {
        console.log('API unavailable, using default settings');
        // API недоступен - ничего страшного, используем DEFAULT_SETTINGS
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { settings, loading };
}
