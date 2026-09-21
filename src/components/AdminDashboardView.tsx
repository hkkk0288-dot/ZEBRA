import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../utils/formatters';
import {
  ShieldCheck,
  TrendingUp,
  ShoppingBag,
  UtensilsCrossed,
  Users,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Bike,
  X,
  Store,
  Tag,
  ArrowLeft,
  Smartphone
} from 'lucide-react';
import { OrderStatus, MenuItem } from '../types';
import { CATEGORIES } from '../data/mockData';

export const AdminDashboardView: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    menuItems,
    addMenuItem,
    deleteMenuItem,
    toggleItemAvailability,
    appliedPromo,
    currency,
    theme,
    setActiveTab
  } = useApp();

  const isDark = theme === 'dark';
  const [adminTab, setAdminTab] = useState<'orders' | 'menu' | 'restaurants' | 'promos'>('orders');
  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'delivered'>('all');

  // New Dish Modal State
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [dishName, setDishName] = useState('');
  const [dishSwahiliName, setDishSwahiliName] = useState('');
  const [dishCategory, setDishCategory] = useState('pizza');
  const [dishPrice, setDishPrice] = useState('8.99');
  const [dishCalories, setDishCalories] = useState('45');
  const [dishPrepTime, setDishPrepTime] = useState('18');
  const [dishImageUrl, setDishImageUrl] = useState('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=700&q=80');
  const [dishRestaurant, setDishRestaurant] = useState('Zebra Central Kitchen');

  // Metrics
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'paid' || o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0);

  const activeOrdersCount = orders.filter(
    o => o.status !== 'delivered' && o.status !== 'cancelled'
  ).length;

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'active') return o.status !== 'delivered' && o.status !== 'cancelled';
    if (orderFilter === 'delivered') return o.status === 'delivered';
    return true;
  });

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim()) return;

    const priceNum = parseFloat(dishPrice) || 9.99;
    const newDish: Omit<MenuItem, 'id'> = {
      name: dishName,
      swahiliName: dishSwahiliName || undefined,
      description: 'Freshly handcrafted dish made with locally sourced Tanzanian ingredients.',
      price: priceNum,
      priceTZS: Math.round(priceNum * 2600),
      category: dishCategory,
      image: dishImageUrl,
      rating: 5.0,
      reviewsCount: 'New',
      calories: parseInt(dishCalories) || 40,
      prepTimeMinutes: parseInt(dishPrepTime) || 20,
      restaurantName: dishRestaurant,
      isAvailable: true,
      sizes: [
        { id: 'std', name: 'Regular Size', price: priceNum, label: 'Regular' },
        { id: 'large', name: 'Large Size', price: priceNum + 3.0, label: 'Large' }
      ],
      ingredients: [
        { id: 'extra-1', name: 'Extra Mozzarella & Herb', weight: '50 gm', price: 1.0, defaultChecked: false },
        { id: 'extra-2', name: 'Spicy Kachumbari Dip', weight: '40 gm', price: 0.5, defaultChecked: true }
      ]
    };

    addMenuItem(newDish);
    setShowAddDishModal(false);
    setDishName('');
    setDishSwahiliName('');
  };

  return (
    <div className="flex flex-col min-h-screen pb-32">
      {/* Admin Top Bar */}
      <div
        className={`sticky top-0 z-20 flex items-center justify-between px-5 py-4 transition-colors ${
          isDark ? 'bg-[#0f0f11]/90 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md'
        }`}
      >
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setActiveTab('home')}
            className="p-1.5 rounded-full hover:bg-neutral-800 text-neutral-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold font-display text-neutral-900 dark:text-white flex items-center space-x-1.5">
              <span>Admin Management</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold">
                PRO
              </span>
            </h1>
            <p className="text-[11px] text-neutral-400">Zebra Restaurant by AmourCodes</p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('home')}
          className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full"
        >
          Customer App View
        </button>
      </div>

      <div className="px-5 space-y-5">
        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center justify-between text-emerald-500 mb-1">
              <span className="text-xs font-bold">Total Sales</span>
              <TrendingUp className="w-4 h-4" />
            </div>
            <p className="text-lg font-black font-display text-white">
              {formatPrice(totalRevenue, currency)}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-center justify-between text-amber-500 mb-1">
              <span className="text-xs font-bold">Active Orders</span>
              <ShoppingBag className="w-4 h-4" />
            </div>
            <p className="text-lg font-black font-display text-white">
              {activeOrdersCount}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center justify-between text-blue-500 mb-1">
              <span className="text-xs font-bold">Dishes</span>
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <p className="text-lg font-black font-display text-white">
              {menuItems.length}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20">
            <div className="flex items-center justify-between text-purple-500 mb-1">
              <span className="text-xs font-bold">Customers</span>
              <Users className="w-4 h-4" />
            </div>
            <p className="text-lg font-black font-display text-white">
              1,420+
            </p>
          </div>
        </div>

        {/* Admin Navigation Pills */}
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'orders', label: 'Orders & Deliveries', icon: ShoppingBag },
            { id: 'menu', label: 'Menu Catalog', icon: UtensilsCrossed },
            { id: 'restaurants', label: 'Kitchen Branches', icon: Store },
            { id: 'promos', label: 'USSD & Promos', icon: Smartphone }
          ].map(tab => {
            const isSelected = adminTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                    : isDark
                    ? 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                    : 'bg-neutral-100 border border-neutral-200 text-neutral-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ORDERS MANAGEMENT */}
        {adminTab === 'orders' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Live Orders ({filteredOrders.length})
              </h3>

              <div className="flex space-x-1">
                {(['all', 'active', 'delivered'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setOrderFilter(f)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg capitalize font-medium ${
                      orderFilter === f
                        ? 'bg-emerald-500 text-white'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredOrders.map(ord => (
                <div
                  key={ord.id}
                  className={`p-4 rounded-3xl border space-y-3 ${
                    isDark ? 'bg-neutral-900/90 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-sm text-emerald-500">
                        {ord.orderNumber}
                      </span>
                      <p className="text-[11px] text-neutral-400">
                        {ord.customer.name} • {ord.customer.phone}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-neutral-900 dark:text-white">
                        {formatPrice(ord.total, currency)}
                      </span>
                      <div className="text-[10px] font-semibold text-neutral-400">
                        {ord.paymentMethod === 'ussd_mpesa' ? 'M-Pesa USSD' : ord.paymentMethod}
                      </div>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="text-xs text-neutral-300 bg-neutral-800/40 p-2.5 rounded-xl">
                    <p className="font-medium text-neutral-400 text-[11px]">Delivery to:</p>
                    <p className="truncate">{ord.customer.address}</p>
                    <p className="font-medium text-neutral-400 text-[11px] mt-1">Items:</p>
                    <p className="truncate">
                      {ord.items.map(i => `${i.quantity}x ${i.menuItem.name}`).join(', ')}
                    </p>
                  </div>

                  {/* Status update buttons */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-semibold text-neutral-400">Update Status:</span>
                    <select
                      value={ord.status}
                      onChange={e => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className="bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs font-bold rounded-xl px-2.5 py-1.5 outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing in Kitchen</option>
                      <option value="on_the_way">Out for Delivery (Rider)</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: MENU CATALOG MANAGEMENT */}
        {adminTab === 'menu' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Restaurant Dishes ({menuItems.length})
              </h3>
              <button
                onClick={() => setShowAddDishModal(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-1.5 px-3 rounded-xl flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Dish</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {menuItems.map(dish => (
                <div
                  key={dish.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1 mr-3">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-12 h-12 rounded-xl object-cover border border-neutral-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="truncate">
                      <h4 className="font-bold text-xs text-white truncate">{dish.name}</h4>
                      <p className="text-[11px] text-emerald-400 font-medium">
                        {formatPrice(dish.price, currency)} • {dish.category}
                      </p>
                      <p className="text-[10px] text-neutral-400">{dish.restaurantName}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => toggleItemAvailability(dish.id)}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                        dish.isAvailable
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {dish.isAvailable ? 'In Stock' : 'Out of Stock'}
                    </button>

                    <button
                      onClick={() => deleteMenuItem(dish.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-500 transition-colors"
                      title="Delete dish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: KITCHEN BRANCHES */}
        {adminTab === 'restaurants' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Zebra Kitchen Hubs (Dar es Salaam)
            </h3>

            {[
              { name: 'Zebra Masaki Main Kitchen', area: 'Masaki Peninsula, Toure Dr', status: 'Open Now', time: '10:00 AM - 11:30 PM', phone: '+255 712 345 678' },
              { name: 'Zebra Oysterbay Branch', area: 'Haile Selassie Rd, Oysterbay', status: 'Open Now', time: '10:00 AM - 11:00 PM', phone: '+255 744 883 291' },
              { name: 'Zebra BBQ & Mishkaki Hub', area: 'Kariakoo Market Square', status: 'Open Now', time: '11:00 AM - 1:00 AM', phone: '+255 682 994 002' },
              { name: 'Zebra Slipway Ocean Grill', area: 'Msasani Slipway Waterfront', status: 'Open Now', time: '12:00 PM - 12:00 AM', phone: '+255 754 112 334' }
            ].map((branch, i) => (
              <div key={i} className="p-4 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-white">{branch.name}</h4>
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                    {branch.status}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">{branch.area}</p>
                <p className="text-[11px] text-neutral-500">Hours: {branch.time} • Tel: {branch.phone}</p>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: USSD & PROMOS */}
        {adminTab === 'promos' && (
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-2">
              <h4 className="font-bold text-sm text-white flex items-center space-x-1.5">
                <Smartphone className="w-4 h-4 text-emerald-500" />
                <span>USSD Mobile Money Integration Settings</span>
              </h4>
              <p className="text-xs text-neutral-400">
                Lipa Namba (Till): <strong className="text-emerald-400 font-mono">445566</strong>
                <br />
                Business Name: <strong className="text-white">ZEBRA RESTAURANT (AMOURCODES)</strong>
              </p>
              <div className="text-[11px] text-neutral-400 pt-2 space-y-1">
                <p>• Vodacom M-Pesa: *150*00*1*445566*AMOUNT#</p>
                <p>• Tigo Pesa: *150*01*1*445566*AMOUNT#</p>
                <p>• Airtel Money: *150*60*1*445566*AMOUNT#</p>
                <p>• HaloPesa: *150*88*1*445566*AMOUNT#</p>
              </div>
            </div>

            <div className="p-4 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-2">
              <h4 className="font-bold text-sm text-white flex items-center space-x-1.5">
                <Tag className="w-4 h-4 text-amber-500" />
                <span>Active Promotional Coupons</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-neutral-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-emerald-400 font-mono">ZEBRA30</span>
                    <p className="text-[11px] text-neutral-400">30% OFF New Year Festival</p>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400">Active</span>
                </div>

                <div className="p-2.5 rounded-xl bg-neutral-800 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-emerald-400 font-mono">AMOUR20</span>
                    <p className="text-[11px] text-neutral-400">20% OFF AmourCodes Special</p>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400">Active</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Dish Modal */}
      {showAddDishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-[#18181b] border border-neutral-700 rounded-3xl p-5 shadow-2xl text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base font-display">Add New Dish to Zebra Menu</h3>
              <button onClick={() => setShowAddDishModal(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDish} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Dish Name (English)</label>
                <input
                  type="text"
                  required
                  value={dishName}
                  onChange={e => setDishName(e.target.value)}
                  placeholder="e.g. Seafood Paella, Peri-Peri Wings"
                  className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Swahili Name (Optional)</label>
                <input
                  type="text"
                  value={dishSwahiliName}
                  onChange={e => setDishSwahiliName(e.target.value)}
                  placeholder="e.g. Mabawa ya Kuku wa Pilipili"
                  className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-400 mb-1">Category</label>
                  <select
                    value={dishCategory}
                    onChange={e => setDishCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 outline-none"
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={dishPrice}
                    onChange={e => setDishPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-400 mb-1">Calories</label>
                  <input
                    type="number"
                    value={dishCalories}
                    onChange={e => setDishCalories(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Prep Time (min)</label>
                  <input
                    type="number"
                    value={dishPrepTime}
                    onChange={e => setDishPrepTime(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Photo URL</label>
                <input
                  type="url"
                  value={dishImageUrl}
                  onChange={e => setDishImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-2xl shadow-lg shadow-emerald-500/30"
                >
                  Publish Dish to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
