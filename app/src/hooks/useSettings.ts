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

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Сначала пробуем загрузить из localStorage (быстрый старт)
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        setSettings(JSON.parse(cached));
      } catch (e) {
        console.error('Failed to parse cached settings:', e);
      }
    }

    // Затем загружаем с сервера (свежие данные)
    settingsApi.get()
      .then((data: any) => {
        if (data) {
          setSettings(data);
          // Обновляем кеш
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
      })
      .catch((err) => {
        console.error('Failed to load settings from server:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { settings, loading };
}
