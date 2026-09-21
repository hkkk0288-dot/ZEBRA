import React, { useState } from 'react';
import {
  Store,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  UploadCloud,
  Image,
  DollarSign,
  MapPin,
  Utensils,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INITIAL_MERCHANTS, AdminMerchant } from './adminMockData';
import { MenuItem } from '../../types';
import { formatPrice } from '../../utils/formatters';

interface AdminMerchantsViewProps {
  isDark: boolean;
}

export const AdminMerchantsView: React.FC<AdminMerchantsViewProps> = () => {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, currency } = useApp();
  const [merchants, setMerchants] = useState<AdminMerchant[]>(INITIAL_MERCHANTS);
  const [activeSubTab, setActiveSubTab] = useState<'branches' | 'menu'>('branches');
  const [search, setSearch] = useState('');
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);

  // New Dish Form
  const [dishName, setDishName] = useState('');
  const [dishCategory, setDishCategory] = useState('pizza');
  const [dishPriceUSD, setDishPriceUSD] = useState('12.50');
  const [dishPriceTZS, setDishPriceTZS] = useState('32000');
  const [dishDescription, setDishDescription] = useState('');
  const [dishImage, setDishImage] = useState(
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80'
  );

  const toggleMerchantStatus = (id: string) => {
    setMerchants(prev =>
      prev.map(m => (m.id === id ? { ...m, status: m.status === 'open' ? 'closed' : 'open' } : m))
    );
  };

  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName) return;

    if (editingDish) {
      updateMenuItem(editingDish.id, {
        name: dishName,
        category: dishCategory,
        price: parseFloat(dishPriceUSD) || 10,
        priceTZS: parseInt(dishPriceTZS) || 25000,
        description: dishDescription,
        image: dishImage
      });
      setEditingDish(null);
    } else {
      addMenuItem({
        name: dishName,
        category: dishCategory,
        price: parseFloat(dishPriceUSD) || 10,
        priceTZS: parseInt(dishPriceTZS) || 25000,
        description: dishDescription,
        image: dishImage,
        rating: 4.8,
        reviewsCount: '24',
        calories: 520,
        prepTimeMinutes: 20,
        restaurantName: 'Zebra Central Kitchen',
        isAvailable: true,
        sizes: [
          { id: 's1', name: 'Regular', label: 'Regular', price: 0 },
          { id: 's2', name: 'Large', label: 'Large (+5k)', price: 2 }
        ],
        ingredients: [
          { id: 'i1', name: 'Extra Mozzarella', weight: '50g', price: 2, defaultChecked: true },
          { id: 'i2', name: 'Garlic Butter Dip', weight: '30g', price: 1 }
        ]
      });
    }

    setShowAddDishModal(false);
    setDishName('');
    setDishDescription('');
  };

  const openEditDish = (dish: MenuItem) => {
    setEditingDish(dish);
    setDishName(dish.name);
    setDishCategory(dish.category);
    setDishPriceUSD(String(dish.price));
    setDishPriceTZS(String(dish.priceTZS));
    setDishDescription(dish.description);
    setDishImage(dish.image);
    setShowAddDishModal(true);
  };

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
        <div>
          <h2 className="text-base font-bold font-display text-neutral-900 dark:text-white flex items-center space-x-2">
            <span>Kitchen Branches & Dishes</span>
            <span className="text-xs bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold px-2.5 py-0.5 rounded-full">
              {activeSubTab === 'branches' ? `${merchants.length} Hubs` : `${menuItems.length} Dishes`}
            </span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Configure restaurant kitchens, opening hours, Cloudinary dishes, and menu items
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Subtab Toggle */}
          <div className="flex bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveSubTab('branches')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'branches'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Kitchen Hubs
            </button>
            <button
              onClick={() => setActiveSubTab('menu')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'menu'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Menu Dishes
            </button>
          </div>

          {activeSubTab === 'menu' && (
            <button
              onClick={() => {
                setEditingDish(null);
                setDishName('');
                setDishDescription('');
                setShowAddDishModal(true);
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Dish</span>
            </button>
          )}
        </div>
      </div>

      {/* Subtab 1: Kitchen Hubs / Branches */}
      {activeSubTab === 'branches' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {merchants.map(merchant => (
            <div
              key={merchant.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={merchant.image}
                    alt={merchant.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-neutral-100 dark:border-neutral-800"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white">{merchant.name}</h3>
                    <p className="text-xs text-neutral-400">{merchant.branch}</p>
                    <p className="text-[11px] text-neutral-500">Manager: {merchant.manager}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleMerchantStatus(merchant.id)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize transition-all cursor-pointer ${
                    merchant.status === 'open'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  }`}
                >
                  ● {merchant.status === 'open' ? 'Accepting Orders' : 'Kitchen Closed'}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 text-center text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 block">Total Orders</span>
                  <span className="font-bold font-mono text-neutral-900 dark:text-white">
                    {merchant.totalOrders.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">Rating</span>
                  <span className="font-bold text-amber-500">★ {merchant.rating}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block">Unsettled Payout</span>
                  <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {formatPrice(merchant.payoutBalance, currency)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-neutral-500 truncate max-w-[200px]">{merchant.address}</span>
                <button
                  onClick={() => toggleMerchantStatus(merchant.id)}
                  className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold"
                >
                  {merchant.status === 'open' ? 'Pause Kitchen' : 'Open Kitchen'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subtab 2: Menu Dishes Catalog */}
      {activeSubTab === 'menu' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map(item => (
            <div
              key={item.id}
              className="p-4 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-3"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs uppercase">
                  {item.category}
                </span>
              </div>

              <div>
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-white leading-tight">
                    {item.name}
                  </h4>
                  <span className="font-mono font-bold text-sm text-orange-600 dark:text-orange-400">
                    {formatPrice(item.priceTZS, currency)}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                <span className="text-[11px] text-amber-500 font-bold">★ {item.rating}</span>

                <div className="flex space-x-1.5">
                  <button
                    onClick={() => openEditDish(item)}
                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                    title="Edit Dish"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete dish "${item.name}"?`)) {
                        deleteMenuItem(item.id);
                      }
                    }}
                    className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400"
                    title="Delete Dish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Dish Modal */}
      {showAddDishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#18181b] rounded-3xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                {editingDish ? 'Edit Dish Catalog Item' : 'Add New Dish to Catalog'}
              </h3>
              <button onClick={() => setShowAddDishModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDish} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-500 dark:text-neutral-400 mb-1 font-semibold">Dish Name</label>
                <input
                  type="text"
                  required
                  value={dishName}
                  onChange={e => setDishName(e.target.value)}
                  placeholder="e.g. Swahili Coconut Prawns Curry"
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-500 dark:text-neutral-400 mb-1 font-semibold">Category</label>
                  <select
                    value={dishCategory}
                    onChange={e => setDishCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none"
                  >
                    <option value="pizza">Pizza</option>
                    <option value="burger">Burgers</option>
                    <option value="swahili">Swahili Dishes</option>
                    <option value="drinks">Beverages</option>
                    <option value="dessert">Desserts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-500 dark:text-neutral-400 mb-1 font-semibold">Price (TZS)</label>
                  <input
                    type="number"
                    required
                    value={dishPriceTZS}
                    onChange={e => setDishPriceTZS(e.target.value)}
                    placeholder="25000"
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-500 dark:text-neutral-400 mb-1 font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={dishDescription}
                  onChange={e => setDishDescription(e.target.value)}
                  placeholder="Fresh tiger prawns simmered in thick Zanzibar coconut milk..."
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-500 dark:text-neutral-400 mb-1 font-semibold">
                  Dish Image URL (Cloudinary / Unsplash)
                </label>
                <input
                  type="text"
                  value={dishImage}
                  onChange={e => setDishImage(e.target.value)}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none font-mono text-[11px]"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-colors"
                >
                  {editingDish ? 'Update Dish' : 'Publish Dish'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddDishModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-semibold text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
