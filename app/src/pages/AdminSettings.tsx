import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { Save } from 'lucide-react';

interface Settings {
  siteName: string;
  whatsappNumber: string;
  phone: string;
  email: string;
  address: string;
  workingHours: string;
}

const AdminSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings>({
    siteName: 'AQUAHIMIYA',
    whatsappNumber: '',
    phone: '',
    email: '',
    address: '',
    workingHours: '',
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth) {
      navigate('/admin');
      return;
    }

    // Загружаем сохраненные настройки
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, [navigate]);

  const handleSave = () => {
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Заголовок */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Настройки сайта</h1>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Сохранить изменения
          </button>
        </div>

        {/* Уведомление об успешном сохранении */}
        {saved && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            ✓ Настройки успешно сохранены!
          </div>
        )}

        {/* Форма настроек */}
        <div className="bg-white rounded-lg shadow-sm border p-8 max-w-3xl">
          <div className="space-y-6">
            {/* Название сайта */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название сайта
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="AQUAHIMIYA"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Номер WhatsApp *
              </label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="+996555123456"
              />
              <p className="mt-1 text-xs text-gray-500">
                Формат: +996555123456 (с кодом страны, без пробелов)
              </p>
            </div>

            {/* Телефон */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Телефон
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="+996 555 123 456"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="info@aquahimiya.kg"
              />
            </div>

            {/* Адрес */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Адрес
              </label>
              <textarea
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="г. Бишкек, ул. Примерная 123"
                rows={2}
              />
            </div>

            {/* Часы работы */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Часы работы
              </label>
              <input
                type="text"
                value={settings.workingHours}
                onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Пн-Пт: 9:00-18:00, Сб-Вс: выходной"
              />
            </div>
          </div>

          <div className="mt-8 p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
            <p className="text-sm text-cyan-800">
              <strong>Важно:</strong> После изменения настроек не забудьте нажать кнопку "Сохранить изменения"
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
