import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { Edit, Trash2, Plus, Check, X } from 'lucide-react';
import { getStoredCategories, saveCategories } from '../hooks/useCategories';
import type { Category } from '../hooks/useCategories';

const EMOJI_OPTIONS = ['📦','⚗️','🧹','🔵','⚙️','🛠️','💨','🔥','🧪','☀️','💡','🌊','📋','🔧','🏊','🧴','💧','🌿','⭐','🔩'];

const AdminCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('📦');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth) navigate('/admin');
    setCategories(getStoredCategories());
  }, [navigate]);

  const getProductCount = (categoryId: string) => {
    const saved = localStorage.getItem('adminProducts');
    if (!saved) return 0;
    return JSON.parse(saved).filter((p: any) => p.category === categoryId).length;
  };

  const generateId = (name: string) =>
    name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `cat-${Date.now()}`;

  const handleAdd = () => {
    if (!newName.trim()) return;
    const id = generateId(newName);
    if (categories.find(c => c.id === id)) {
      alert('Категория с таким ID уже существует. Измените название.');
      return;
    }
    const updated = [...categories, { id, name: newName.trim(), icon: newIcon }];
    setCategories(updated);
    saveCategories(updated);
    setNewName('');
    setNewIcon('📦');
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    // Move products in this category to 'all' (no category = show in all)
    // Actually products with unknown category just appear in "all" tab automatically
    // We just remove the category, products keep their category id but won't match any filter
    // Better: reassign products to first available category or keep as-is (they'll appear in "Все")
    const saved = localStorage.getItem('adminProducts');
    if (saved) {
      const products = JSON.parse(saved);
      const updated = products.map((p: any) =>
        p.category === id ? { ...p, category: 'uncategorized' } : p
      );
      localStorage.setItem('adminProducts', JSON.stringify(updated));
    }
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    saveCategories(updated);
    setConfirmDelete(null);
  };

  const handleEditSave = (id: string) => {
    if (!editName.trim()) return;
    const updated = categories.map(c =>
      c.id === id ? { ...c, name: editName.trim(), icon: editIcon } : c
    );
    setCategories(updated);
    saveCategories(updated);
    setEditId(null);
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Категории</h1>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Добавить категорию
          </button>
        </div>

        {/* Add form */}
        {showAdd && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Новая категория</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Например: Водопады"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-cyan-500"
                  onKeyDown={e => e.key === 'Enter' && handleAdd()}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Иконка</label>
                <div className="flex flex-wrap gap-2">
                  {EMOJI_OPTIONS.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setNewIcon(emoji)}
                      className={`w-10 h-10 text-xl rounded-lg border-2 transition-all ${newIcon === emoji ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200 hover:border-gray-400'}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAdd}
                  className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Сохранить
                </button>
                <button
                  onClick={() => { setShowAdd(false); setNewName(''); setNewIcon('📦'); }}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
                >
                  <X className="w-4 h-4" /> Отмена
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Товаров</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* "Все товары" — always shown, cannot delete */}
              <tr className="bg-gray-50">
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-500">📦 Все товары</span>
                  <span className="ml-2 text-xs text-gray-400">(системная)</span>
                </td>
                <td className="px-6 py-4"><span className="text-sm text-gray-400 font-mono">all</span></td>
                <td className="px-6 py-4"><span className="text-sm text-gray-500 font-semibold">{getProductCount('all') || (() => { const s = localStorage.getItem('adminProducts'); return s ? JSON.parse(s).length : 0; })()}</span></td>
                <td className="px-6 py-4 text-right"><span className="text-xs text-gray-400">нельзя удалить</span></td>
              </tr>

              {categories.filter(c => c.id !== 'all').map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    {editId === category.id ? (
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-cyan-500 w-48"
                          onKeyDown={e => e.key === 'Enter' && handleEditSave(category.id)}
                          autoFocus
                        />
                        <div className="flex flex-wrap gap-1">
                          {EMOJI_OPTIONS.map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => setEditIcon(emoji)}
                              className={`w-8 h-8 text-base rounded border transition-all ${editIcon === emoji ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200 hover:border-gray-400'}`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm font-medium text-gray-900">
                        {category.icon} {category.name}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 font-mono">{category.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 font-semibold">{getProductCount(category.id)}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editId === category.id ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditSave(category.id)}
                          className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded transition-colors"
                          title="Сохранить"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-50 rounded transition-colors"
                          title="Отмена"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : confirmDelete === category.id ? (
                      <div className="flex justify-end items-center gap-2">
                        <span className="text-xs text-red-600">Удалить?</span>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-50 rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => { setEditId(category.id); setEditName(category.name); setEditIcon(category.icon); }}
                          className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                          title="Редактировать"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(category.id)}
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Всего категорий: {categories.filter(c => c.id !== 'all').length}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
