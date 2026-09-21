import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  DollarSign,
  Clock,
  Flame,
  Tag,
  Eye,
  Check,
  X,
  Upload,
  Sparkles,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MenuItem } from '../../types';
import { formatPrice } from '../../utils/formatters';

const PRESET_FOOD_IMAGES = [
  { label: 'Woodfired Pizza', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80' },
  { label: 'Gourmet Beef Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' },
  { label: 'Crispy Fried Chicken', url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80' },
  { label: 'Swahili Pilau & Nyama', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Fresh Avocado Salad', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80' },
  { label: 'BBQ Mishkaki Skewers', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80' },
  { label: 'Cold Iced Berry Smoothie', url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80' },
  { label: 'Chocolate Fudge Cake', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80' }
];

export const AdminProductsView: React.FC = () => {
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, toggleItemAvailability, currency } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [swahiliName, setSwahiliName] = useState('');
  const [category, setCategory] = useState('pizza');
  const [priceTZS, setPriceTZS] = useState('28000');
  const [priceUSD, setPriceUSD] = useState('10.50');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_FOOD_IMAGES[0].url);
  const [prepTime, setPrepTime] = useState('20');
  const [calories, setCalories] = useState('520');
  const [restaurantName, setRestaurantName] = useState('Zebra Central Kitchen');
  const [isAvailable, setIsAvailable] = useState(true);

  // Success notice
  const [notice, setNotice] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Dishes' },
    { id: 'pizza', label: 'Pizzas' },
    { id: 'burger', label: 'Burgers' },
    { id: 'swahili', label: 'Swahili & BBQ' },
    { id: 'chicken', label: 'Chicken & Grill' },
    { id: 'drinks', label: 'Beverages' },
    { id: 'desserts', label: 'Desserts' }
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.swahiliName && item.swahiliName.toLowerCase().includes(search.toLowerCase())) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' ? true : item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setName('');
    setSwahiliName('');
    setCategory('pizza');
    setPriceTZS('28000');
    setPriceUSD('10.50');
    setDescription('');
    setImageUrl(PRESET_FOOD_IMAGES[0].url);
    setPrepTime('20');
    setCalories('520');
    setRestaurantName('Zebra Central Kitchen');
    setIsAvailable(true);
    setShowModal(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setName(item.name);
    setSwahiliName(item.swahiliName || '');
    setCategory(item.category);
    setPriceTZS(String(item.priceTZS || Math.round(item.price * 2600)));
    setPriceUSD(String(item.price));
    setDescription(item.description);
    setImageUrl(item.image);
    setPrepTime(String(item.prepTimeMinutes || 20));
    setCalories(String(item.calories || 450));
    setRestaurantName(item.restaurantName || 'Zebra Central Kitchen');
    setIsAvailable(item.isAvailable);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedTZS = parseInt(priceTZS) || 25000;
    const parsedUSD = parseFloat(priceUSD) || parsedTZS / 2600;

    if (editingItem) {
      updateMenuItem(editingItem.id, {
        name,
        swahiliName: swahiliName.trim() || undefined,
        category,
        price: parsedUSD,
        priceTZS: parsedTZS,
        description: description || 'Freshly prepared meal from Zebra Kitchen.',
        image: imageUrl,
        prepTimeMinutes: parseInt(prepTime) || 20,
        calories: parseInt(calories) || 450,
        restaurantName,
        isAvailable
      });
      setNotice(`Product "${name}" updated successfully!`);
    } else {
      addMenuItem({
        name,
        swahiliName: swahiliName.trim() || undefined,
        category,
        price: parsedUSD,
        priceTZS: parsedTZS,
        description: description || 'Freshly prepared meal from Zebra Kitchen.',
        image: imageUrl,
        rating: 5.0,
        reviewsCount: 'New',
        prepTimeMinutes: parseInt(prepTime) || 20,
        calories: parseInt(calories) || 450,
        restaurantName,
        isAvailable,
        sizes: [
          { id: 's-reg', name: 'Regular Size', label: 'Regular', price: 0 },
          { id: 's-lrg', name: 'Large Feast Size', label: 'Large (+5,000 TZS)', price: 2.0 }
        ],
        ingredients: [
          { id: 'ing-1', name: 'Extra Mozzarella & Herbs', weight: '50g', price: 1.5, defaultChecked: false },
          { id: 'ing-2', name: 'Spicy Kachumbari Dip', weight: '40g', price: 0.5, defaultChecked: true }
        ]
      });
      setNotice(`New product "${name}" added to menu!`);
    }

    setShowModal(false);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleDelete = (id: string, itemName: string) => {
    if (window.confirm(`Are you sure you want to delete "${itemName}" from the menu?`)) {
      deleteMenuItem(id);
      setNotice(`Deleted "${itemName}"`);
      setTimeout(() => setNotice(null), 3000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold font-display text-neutral-900 dark:text-white flex items-center space-x-2">
            <span>Product & Menu Catalog</span>
            <span className="text-xs bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold px-2.5 py-0.5 rounded-full">
              {menuItems.length} Products
            </span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Add new food items, update Tanzanian Shillings prices, upload images, and control dish stock availability
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search dish or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs overflow-hidden flex flex-col group hover:border-orange-500/40 transition-all"
          >
            {/* Image Preview with Stock Status */}
            <div className="relative h-44 w-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2.5 left-2.5 flex flex-col space-y-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs uppercase tracking-wider">
                  {item.category}
                </span>
                {item.swahiliName && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-orange-600/90 text-white backdrop-blur-xs">
                    {item.swahiliName}
                  </span>
                )}
              </div>

              <div className="absolute top-2.5 right-2.5">
                <button
                  onClick={() => toggleItemAvailability(item.id)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md border transition-all ${
                    item.isAvailable
                      ? 'bg-emerald-500/90 text-white border-emerald-400'
                      : 'bg-rose-500/90 text-white border-rose-400'
                  }`}
                  title="Click to toggle availability"
                >
                  {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                </button>
              </div>

              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white/90 bg-black/50 backdrop-blur-xs px-2.5 py-1 rounded-xl">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-orange-400" />
                  <span>{item.prepTimeMinutes || 20}m</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span>{item.calories || 450} kcal</span>
                </span>
              </div>
            </div>

            {/* Info Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-[11px] text-neutral-500 line-clamp-2 mt-0.5">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-sm font-black font-display font-mono text-emerald-600 dark:text-emerald-400">
                    {formatPrice(currency === 'TZS' ? item.priceTZS || item.price * 2600 : item.price, currency)}
                  </span>
                  <span className="text-[10px] text-neutral-400 block font-mono">
                    {currency === 'TZS' ? `$${item.price.toFixed(2)} USD` : `${(item.priceTZS || item.price * 2600).toLocaleString()} TZS`}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
                    title="Edit Dish"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-rose-500/10 text-rose-500 transition-colors"
                    title="Delete Dish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Dish Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white dark:bg-[#18181b] rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4 my-8 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center space-x-2">
                <UtensilsCrossed className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                  {editingItem ? 'Edit Product' : 'Add New Product to Menu'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-300 font-semibold mb-1">
                    Dish Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Zebra Fire BBQ Pizza"
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-semibold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-300 font-semibold mb-1">
                    Swahili Name (Jina la Kiswahili)
                  </label>
                  <input
                    type="text"
                    value={swahiliName}
                    onChange={e => setSwahiliName(e.target.value)}
                    placeholder="e.g. Piza ya Nyama Choma"
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-300 font-semibold mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-semibold outline-none"
                  >
                    <option value="pizza">Pizza</option>
                    <option value="burger">Burger</option>
                    <option value="swahili">Swahili & BBQ</option>
                    <option value="chicken">Chicken & Grill</option>
                    <option value="drinks">Beverage / Drink</option>
                    <option value="desserts">Dessert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-300 font-semibold mb-1">
                    Price (TZS) *
                  </label>
                  <input
                    type="number"
                    required
                    value={priceTZS}
                    onChange={e => {
                      const tzs = e.target.value;
                      setPriceTZS(tzs);
                      if (tzs) setPriceUSD((parseInt(tzs) / 2600).toFixed(2));
                    }}
                    placeholder="28000"
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-300 font-semibold mb-1">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={priceUSD}
                    onChange={e => setPriceUSD(e.target.value)}
                    placeholder="10.50"
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-300 font-semibold mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe ingredients, flavor profile, and seasoning..."
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none"
                />
              </div>

              {/* Image URL & Preset Selection */}
              <div>
                <label className="block text-neutral-600 dark:text-neutral-300 font-semibold mb-1">
                  Product Image URL (or pick from instant presets below)
                </label>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none text-[11px]"
                />

                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 mt-2">
                  {PRESET_FOOD_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`relative rounded-xl overflow-hidden h-12 border-2 transition-transform hover:scale-105 ${
                        imageUrl === preset.url ? 'border-orange-500 ring-2 ring-orange-500/40' : 'border-transparent'
                      }`}
                      title={preset.label}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-300 font-semibold mb-1">
                    Prep Time (min)
                  </label>
                  <input
                    type="number"
                    value={prepTime}
                    onChange={e => setPrepTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-300 font-semibold mb-1">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    value={calories}
                    onChange={e => setCalories(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 dark:text-neutral-300 font-semibold mb-1">
                    Status
                  </label>
                  <select
                    value={isAvailable ? 'available' : 'unavailable'}
                    onChange={e => setIsAvailable(e.target.value === 'available')}
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-semibold outline-none"
                  >
                    <option value="available">In Stock</option>
                    <option value="unavailable">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-600/30 transition-all cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-semibold text-xs cursor-pointer"
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
