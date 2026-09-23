import React, { useState, useRef } from 'react';
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
  Layers,
  Image as ImageIcon,
  FolderPlus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MenuItem } from '../../types';
import { formatPrice } from '../../utils/formatters';

const PRESET_FOOD_IMAGES = [
  { label: 'Woodfired Pizza', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80' },
  { label: 'Gourmet Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' },
  { label: 'Crispy Fried Chicken', url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80' },
  { label: 'Tender Steak / Meat', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80' },
  { label: 'Swahili Pilau & BBQ', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80' },
  { label: 'Fresh Salad & Greens', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' },
  { label: 'Cold Mocktail Drink', url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
  { label: 'Chocolate Fudge Cake', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80' }
];

const EMOJI_OPTIONS = ['🍽️', '🍔', '🍕', '🥩', '🍣', '🥗', '🍲', '🍗', '🥐', '🥪', '🍰', '🍹', '☕', '🍤', '🍜', '🌮', '🥞', '🥤'];

export const AdminProductsView: React.FC = () => {
  const {
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleItemAvailability,
    currency,
    categories,
    addCategory
  } = useApp();

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
  const [images, setImages] = useState<string[]>([]);
  const [newCustomUrl, setNewCustomUrl] = useState('');
  const [prepTime, setPrepTime] = useState('20');
  const [calories, setCalories] = useState('520');
  const [restaurantName, setRestaurantName] = useState('Zebra Central Kitchen');
  const [isAvailable, setIsAvailable] = useState(true);

  // Dynamic Category Creation Modal State
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSwahili, setNewCatSwahili] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🥗');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Success notice
  const [notice, setNotice] = useState<string | null>(null);

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
    const defaultCat = categories[1]?.id || 'pizza';
    setCategory(defaultCat);
    setPriceTZS('28000');
    setPriceUSD('10.50');
    setDescription('');
    setImageUrl(PRESET_FOOD_IMAGES[0].url);
    setImages([PRESET_FOOD_IMAGES[0].url]);
    setNewCustomUrl('');
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
    // Load item images or default to primary image
    const itemImgs = item.images && item.images.length > 0 ? [...item.images] : [item.image];
    setImages(itemImgs);
    setNewCustomUrl('');
    setPrepTime(String(item.prepTimeMinutes || 20));
    setCalories(String(item.calories || 450));
    setRestaurantName(item.restaurantName || 'Zebra Central Kitchen');
    setIsAvailable(item.isAvailable);
    setShowModal(true);
  };

  // Handle uploading multiple image files directly from device (phone/computer)
  const handleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    filesArray.forEach(file => {
      const reader = new FileReader();
      reader.onload = event => {
        const result = event.target?.result as string;
        if (result) {
          setImages(prev => [...prev, result]);
          setImageUrl(current => current ? current : result);
        }
      };
      reader.readAsDataURL(file);
    });

    setNotice(`Picha ${filesArray.length} zimepakiwa kikamilifu!`);
    setTimeout(() => setNotice(null), 3000);
    e.target.value = '';
  };

  const handleAddUrlImage = () => {
    if (!newCustomUrl.trim()) return;
    const url = newCustomUrl.trim();
    setImages(prev => [...prev, url]);
    if (!imageUrl) setImageUrl(url);
    setNewCustomUrl('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const targetImg = images[indexToRemove];
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    setImages(updated);
    if (imageUrl === targetImg) {
      setImageUrl(updated[0] || '');
    }
  };

  const handleSetCoverImage = (img: string) => {
    setImageUrl(img);
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const trimmed = newCatName.trim();
    const swahili = newCatSwahili.trim() || trimmed;
    addCategory({
      name: trimmed,
      swahiliName: swahili,
      icon: newCatIcon || '🍽️'
    });
    const generatedId = trimmed.toLowerCase().replace(/[^a-z0-9]/g, '_');
    setCategory(generatedId);
    setShowAddCategoryModal(false);
    setNewCatName('');
    setNewCatSwahili('');
    setNotice(`Kategori mpya "${trimmed}" imeundwa na kuchaguliwa!`);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedTZS = parseInt(priceTZS) || 25000;
    const parsedUSD = parseFloat(priceUSD) || parsedTZS / 2600;
    const primaryImg = imageUrl || images[0] || PRESET_FOOD_IMAGES[0].url;
    const allImages = images.length > 0 ? images : [primaryImg];

    if (editingItem) {
      updateMenuItem(editingItem.id, {
        name,
        swahiliName: swahiliName.trim() || undefined,
        category,
        price: parsedUSD,
        priceTZS: parsedTZS,
        description: description || 'Freshly prepared meal from Zebra Kitchen.',
        image: primaryImg,
        images: allImages,
        prepTimeMinutes: parseInt(prepTime) || 20,
        calories: parseInt(calories) || 450,
        restaurantName,
        isAvailable
      });
      setNotice(`Product "${name}" updated successfully with ${allImages.length} images!`);
    } else {
      addMenuItem({
        name,
        swahiliName: swahiliName.trim() || undefined,
        category,
        price: parsedUSD,
        priceTZS: parsedTZS,
        description: description || 'Freshly prepared meal from Zebra Kitchen.',
        image: primaryImg,
        images: allImages,
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
      setNotice(`New product "${name}" added to menu with ${allImages.length} images!`);
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
            Upload multiple photos, add new categories, manage TZS/USD prices, and control stock availability.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick Add Category Button */}
          <button
            onClick={() => setShowAddCategoryModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold text-xs transition-all active:scale-95 cursor-pointer border border-neutral-300 dark:border-neutral-700"
            title="Ongeza Jamii Mpya ya Chakula"
          >
            <FolderPlus className="w-4 h-4 text-emerald-500" />
            <span>+ Add Category</span>
          </button>

          {/* Add New Product Button */}
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
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.name}</span>
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
        {filteredItems.map(item => {
          const imageCount = item.images?.length || 1;
          return (
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
                  {imageCount > 1 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-neutral-950 shadow-xs flex items-center space-x-1">
                      <ImageIcon className="w-3 h-3" />
                      <span>{imageCount} Picha</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => toggleItemAvailability(item.id)}
                  className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center space-x-1 backdrop-blur-md shadow-xs transition-colors ${
                    item.isAvailable
                      ? 'bg-emerald-500/90 text-white'
                      : 'bg-rose-500/90 text-white'
                  }`}
                >
                  {item.isAvailable ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>In Stock</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3" />
                      <span>Sold Out</span>
                    </>
                  )}
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-bold text-sm text-neutral-900 dark:text-white leading-tight">
                      {item.name}
                    </h3>
                  </div>
                  {item.swahiliName && (
                    <p className="text-xs text-orange-500 font-medium mt-0.5">
                      {item.swahiliName}
                    </p>
                  )}
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                      {formatPrice(item.price, currency)}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      TZS {Number(item.priceTZS || Math.round(item.price * 2600)).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
                      title="Edit Product Details & Images"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* PRODUCT CREATE / EDIT MODAL WITH MULTI-IMAGE UPLOAD & CATEGORY SELECTION  */}
      {/* ========================================================================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-[#151518] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-5 sm:p-6 my-6 max-h-[92vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center space-x-2">
                <UtensilsCrossed className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold font-display text-base text-neutral-900 dark:text-white">
                  {editingItem ? 'Edit Product & Multi-Photos' : 'Add New Product to Menu'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4 text-xs">
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
                    placeholder="e.g. Smash Truffle Burger"
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none focus:border-orange-500"
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
                    placeholder="e.g. Baga Tamu ya Nyama"
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Category selector with dynamic Add Category button */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-neutral-600 dark:text-neutral-300 font-semibold">
                      Category *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddCategoryModal(true)}
                      className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 hover:underline flex items-center space-x-0.5"
                      title="Ongeza Kategori Mpya"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Category</span>
                    </button>
                  </div>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-semibold outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name} ({cat.swahiliName})
                      </option>
                    ))}
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

              {/* ========================================================= */}
              {/* MULTI-IMAGE UPLOAD & GALLERY SECTION (REQUESTED BY USER)  */}
              {/* ========================================================= */}
              <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="font-bold text-xs text-neutral-900 dark:text-white flex items-center space-x-1.5">
                      <ImageIcon className="w-4 h-4 text-orange-500" />
                      <span>Product Images Gallery (Picha Nyingi za Chakula)</span>
                    </span>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Pakia picha nyingi unazozitaka kutoka simu/PC au weka link. Bofya picha kuifanya Cover Photo.
                    </p>
                  </div>

                  {/* Hidden File Input for Multi-upload */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFilesUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Picha (Files)</span>
                  </button>
                </div>

                {/* Multi-image Thumbnail Gallery Preview */}
                {images.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold text-neutral-400">
                      Picha Zilizopo ({images.length}) - Bofya kuweka kama Picha Kuu:
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2">
                      {images.map((img, idx) => {
                        const isCover = (imageUrl === img) || (!imageUrl && idx === 0);
                        return (
                          <div
                            key={idx}
                            onClick={() => handleSetCoverImage(img)}
                            className={`relative group rounded-xl overflow-hidden aspect-square border-2 cursor-pointer transition-all ${
                              isCover
                                ? 'border-orange-500 ring-2 ring-orange-500/50 scale-102'
                                : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                            }`}
                          >
                            <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                            {isCover && (
                              <div className="absolute top-1 left-1 bg-orange-500 text-neutral-950 font-extrabold text-[8px] px-1.5 py-0.5 rounded shadow-xs uppercase">
                                ★ Cover
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(idx);
                              }}
                              className="absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-rose-600 text-white rounded-full flex items-center justify-center transition-colors"
                              title="Ondoa Picha Hii"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Add Custom Image URL */}
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="text"
                    value={newCustomUrl}
                    onChange={e => setNewCustomUrl(e.target.value)}
                    placeholder="Weka URL ya picha (https://...)"
                    className="flex-1 p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrlImage}
                    className="px-3 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 font-bold text-[11px] text-neutral-800 dark:text-neutral-200 shrink-0"
                  >
                    + Ongeza URL
                  </button>
                </div>

                {/* Instant Preset Food Images */}
                <div className="pt-1">
                  <span className="text-[10px] font-semibold text-neutral-400 block mb-1">
                    Au chagua haraka kutoka picha za mfano (Presets):
                  </span>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {PRESET_FOOD_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (!images.includes(preset.url)) {
                            setImages(prev => [...prev, preset.url]);
                          }
                          setImageUrl(preset.url);
                        }}
                        className={`relative rounded-xl overflow-hidden h-12 border-2 transition-transform hover:scale-105 ${
                          imageUrl === preset.url ? 'border-orange-500 ring-2 ring-orange-500/40' : 'border-neutral-700/50'
                        }`}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Prep time, Calories, Stock */}
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

      {/* ========================================================================= */}
      {/* SUB-MODAL: ADD NEW CATEGORY (REQUESTED BY USER: "aweze kuad kategori")     */}
      {/* ========================================================================= */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#18181c] rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center space-x-2">
                <FolderPlus className="w-5 h-5 text-emerald-500" />
                <h4 className="font-bold font-display text-sm text-neutral-900 dark:text-white">
                  Add New Category (Unda Kategori Mpya)
                </h4>
              </div>
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategorySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-600 dark:text-neutral-300 font-semibold mb-1">
                  Category Name (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Seafood, Indian, Bakery, Grill"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-300 font-semibold mb-1">
                  Swahili Name (Jina la Kiswahili)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dagaa na Samaki, Vitafunwa"
                  value={newCatSwahili}
                  onChange={e => setNewCatSwahili(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-neutral-600 dark:text-neutral-300 font-semibold mb-1">
                  Choose Emoji Icon:
                </label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 max-h-28 overflow-y-auto no-scrollbar">
                  {EMOJI_OPTIONS.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewCatIcon(emoji)}
                      className={`text-lg p-1.5 rounded-lg transition-transform hover:scale-125 ${
                        newCatIcon === emoji ? 'bg-emerald-500 text-white ring-2 ring-emerald-400' : 'hover:bg-neutral-200 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  Hifadhi Kategori
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-semibold text-xs cursor-pointer"
                >
                  Ghairi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
