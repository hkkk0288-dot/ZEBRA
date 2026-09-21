import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Moon,
  Sun,
  Smartphone,
  Info,
  LogOut,
  Edit2,
  Plus,
  Check,
  ReceiptText,
  Cloud,
  ExternalLink,
  LogIn
} from 'lucide-react';
import { formatPrice } from '../utils/formatters';
import { CloudinaryUploader } from './CloudinaryUploader';

export const ProfileView: React.FC = () => {
  const {
    user,
    updateUser,
    orders,
    theme,
    toggleTheme,
    currency,
    setCurrency,
    androidFrame,
    setAndroidFrame,
    setActiveTab,
    setActiveOrder,
    isLoggedIn,
    logout,
    setAuthMode
  } = useApp();

  const isDark = theme === 'dark';

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const [phoneInput, setPhoneInput] = useState(user.phone);
  const [emailInput, setEmailInput] = useState(user.email);
  const [avatarInput, setAvatarInput] = useState(user.avatar || '');

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState('Home');
  const [newAddressStreet, setNewAddressStreet] = useState('');

  const handleSaveProfile = () => {
    updateUser({
      name: nameInput,
      phone: phoneInput,
      email: emailInput,
      avatar: avatarInput || user.avatar
    });
    setIsEditingProfile(false);
  };

  const handleAddAddress = () => {
    if (!newAddressStreet.trim()) return;
    const newAddr = {
      id: `addr-${Date.now()}`,
      label: newAddressLabel,
      street: newAddressStreet,
      city: 'Dar es Salaam',
      isDefault: user.addresses.length === 0
    };
    updateUser({
      addresses: [...user.addresses, newAddr]
    });
    setNewAddressStreet('');
    setShowAddAddress(false);
  };

  const handleToggleAdmin = () => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin';
    updateUser({ role: newRole });
    if (newRole === 'admin') {
      setActiveTab('admin');
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-32">
      {/* Mobile Header (only in phone frame mode) */}
      {androidFrame && (
        <div
          className={`sticky top-0 z-20 flex items-center justify-between px-5 py-4 transition-colors ${
            isDark ? 'bg-[#0f0f11]/90 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md'
          }`}
        >
          <h1 className="text-lg font-bold font-display text-neutral-900 dark:text-white">
            My Account
          </h1>

          <button
            onClick={handleToggleAdmin}
            className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1.5 transition-colors ${
              user.role === 'admin'
                ? 'bg-amber-500 text-neutral-900 shadow-md shadow-amber-500/30'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
            title="Switch between Customer & Admin Mode"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{user.role === 'admin' ? 'Admin Active' : 'Switch to Admin'}</span>
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className={`w-full ${androidFrame ? 'px-5 space-y-5' : 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6'}`}>
        
        {/* Full Web Breadcrumbs & Switch to Admin button */}
        {!androidFrame && (
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold font-display text-neutral-900 dark:text-white tracking-tight">
                Profile & Settings
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Manage your personal info, saved delivery addresses, and food preferences
              </p>
            </div>

            <button
              onClick={handleToggleAdmin}
              className={`text-xs font-bold px-4 py-2 rounded-2xl flex items-center space-x-2 transition-all shadow-md ${
                user.role === 'admin'
                  ? 'bg-amber-500 text-neutral-950 font-black shadow-amber-500/20'
                  : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{user.role === 'admin' ? 'Active: Admin Dashboard' : 'Open Admin Dashboard'}</span>
            </button>
          </div>
        )}

        {/* 2-Column Responsive Layout for Desktop, 1-Column for Phone Frame */}
        <div className={androidFrame ? 'space-y-5' : 'lg:grid lg:grid-cols-12 lg:gap-8 items-start'}>
          
          {/* Left Column: User Profile Card & Saved Addresses */}
          <div className={androidFrame ? 'space-y-4' : 'lg:col-span-6 space-y-5'}>
            
            {/* User Profile Card */}
            <div
              className={`p-5 rounded-3xl border ${
                isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-emerald-500 shrink-0">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-neutral-900 dark:text-white truncate">
                      {user.name}
                    </h2>
                    <button
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                      className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                      title="Edit Profile"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-neutral-400 truncate mt-0.5">{user.email}</p>
                  <p className="text-xs font-mono text-emerald-500 mt-1">{user.phone}</p>
                </div>
              </div>

              {/* Profile Edit Form */}
              {isEditingProfile && (
                <div className="mt-4 pt-4 border-t border-neutral-800 space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={e => setNameInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                      Phone Number (USSD Delivery Contact)
                    </label>
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={e => setPhoneInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-neutral-300 flex items-center justify-between">
                      <span>Profile Avatar (Cloudinary CDN)</span>
                      <span className="text-[10px] text-emerald-400 font-mono">cy4pidvh</span>
                    </label>
                    <CloudinaryUploader
                      currentImageUrl={avatarInput}
                      onImageUploaded={(url) => setAvatarInput(url)}
                      label="Pakia picha ya profile moja kwa moja Cloudinary"
                      folder="zebra_restaurant/avatars"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Authentication & Security (Login / Regista) Card */}
            <div
              className={`p-5 rounded-3xl border space-y-3.5 ${
                isDark
                  ? 'bg-[#121215] border-amber-500/20'
                  : 'bg-white border-amber-300/80 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                    <LogIn className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                    Ukurasa wa Login & Regista
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                  {isLoggedIn ? 'Umeingia (Active)' : 'Mgeni'}
                </span>
              </div>

              <p className="text-xs text-neutral-400">
                Tazama na utumie kurasa zilizoundwa kulingana na picha ya mfano (Screenshot 1 & 2):
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setActiveTab('auth');
                  }}
                  className="py-2.5 px-3 rounded-2xl bg-[#1a1a1e] hover:bg-neutral-800 border border-neutral-700 text-xs font-bold text-white flex items-center justify-center space-x-1.5 transition-all shadow-sm active:scale-95"
                >
                  <span>🔑 Ukurasa wa Log In</span>
                </button>

                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setActiveTab('auth');
                  }}
                  className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-xs font-bold text-neutral-950 flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-amber-500/20 active:scale-95"
                >
                  <span>📝 Ukurasa wa Regista</span>
                </button>
              </div>

              {isLoggedIn && (
                <div className="pt-1 flex items-center justify-between border-t border-neutral-800/60">
                  <span className="text-[11px] text-neutral-400">
                    Akaunti: <strong className="text-white">{user.email}</strong>
                  </span>
                  <button
                    onClick={logout}
                    className="text-[11px] font-bold text-red-400 hover:text-red-300 transition-colors"
                  >
                    Toka (Log Out)
                  </button>
                </div>
              )}
            </div>

            {/* Saved Delivery Addresses */}
            <div
              className={`p-5 rounded-3xl border space-y-3.5 ${
                isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Saved Addresses (Dar es Salaam)
                </h3>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              </div>

              {showAddAddress && (
                <div className="p-3 rounded-2xl bg-neutral-800/80 border border-neutral-700 space-y-2.5">
                  <div className="flex space-x-2">
                    {['Home', 'Office', 'Other'].map(lbl => (
                      <button
                        key={lbl}
                        onClick={() => setNewAddressLabel(lbl)}
                        className={`text-xs px-3 py-1 rounded-lg border font-medium ${
                          newAddressLabel === lbl
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-neutral-700 text-neutral-300'
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={newAddressStreet}
                    onChange={e => setNewAddressStreet(e.target.value)}
                    placeholder="Street name, landmark in Dar es Salaam..."
                    className="w-full p-2.5 text-xs bg-neutral-900 border border-neutral-700 rounded-xl text-white outline-none"
                  />
                  <button
                    onClick={handleAddAddress}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 text-xs rounded-xl"
                  >
                    Save Address
                  </button>
                </div>
              )}

              <div className="space-y-2">
                {user.addresses.map(addr => (
                  <div
                    key={addr.id}
                    className="flex items-start space-x-3 p-3 rounded-2xl bg-neutral-800/40 border border-neutral-800"
                  >
                    <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="text-xs font-bold text-neutral-200">{addr.label}</span>
                      <p className="text-xs text-neutral-400 mt-0.5">{addr.street}, {addr.city}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order History & App Preferences & Brand Info */}
          <div className={androidFrame ? 'space-y-4' : 'lg:col-span-6 space-y-5'}>
            
            {/* Order History Summary */}
            <div
              className={`p-5 rounded-3xl border space-y-3 ${
                isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Recent Orders ({orders.length})
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-emerald-500 hover:underline"
                >
                  View Live Tracking
                </button>
              </div>

              <div className="space-y-2.5">
                {orders.slice(0, 3).map(ord => (
                  <div
                    key={ord.id}
                    onClick={() => {
                      setActiveOrder(ord);
                      setActiveTab('orders');
                    }}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-800/40 border border-neutral-800 hover:border-neutral-700 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <ReceiptText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-neutral-200">{ord.orderNumber}</h4>
                        <p className="text-[11px] text-neutral-500">{ord.date} • {ord.items.length} items</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-500 block">
                        {formatPrice(ord.total, currency)}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-amber-400">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* App Settings & Preferences */}
            <div
              className={`p-5 rounded-3xl border space-y-3 ${
                isDark ? 'bg-neutral-900/60 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
              }`}
            >
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Preferences & Device View
              </h3>

              <div className="space-y-2.5">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-800/40 border border-neutral-800">
                  <div className="flex items-center space-x-2.5">
                    {isDark ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                    <span className="text-xs font-semibold text-neutral-200">
                      {isDark ? 'Dark Theme (Foodie Mode)' : 'Light Theme (Clean White)'}
                    </span>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full"
                  >
                    Switch
                  </button>
                </div>

                {/* Currency Switch */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-800/40 border border-neutral-800">
                  <span className="text-xs font-semibold text-neutral-200">
                    Display Currency ({currency})
                  </span>
                  <button
                    onClick={() => setCurrency(currency === 'USD' ? 'TZS' : 'USD')}
                    className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full"
                  >
                    {currency === 'USD' ? 'Switch to TZS' : 'Switch to USD'}
                  </button>
                </div>

                {/* Android Device Frame Toggle */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-800/40 border border-neutral-800">
                  <div className="flex items-center space-x-2.5">
                    <Smartphone className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-semibold text-neutral-200">
                      Android Phone Frame Mockup
                    </span>
                  </div>
                  <button
                    onClick={() => setAndroidFrame(!androidFrame)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                      androidFrame ? 'bg-emerald-500 text-white' : 'bg-neutral-700 text-neutral-300'
                    }`}
                  >
                    {androidFrame ? 'ON' : 'OFF'}
                  </button>
                </div>

                {/* Cloudinary CDN Media Integration Status */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-800/40 border border-neutral-800">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-1.5 rounded-xl bg-[#4863ff]/20 text-[#4863ff]">
                      <Cloud className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-neutral-200 block">
                        Cloudinary CDN Connected
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        Cloud: cy4pidvh (Active)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => {
                        updateUser({ role: 'admin' });
                        setActiveTab('admin');
                      }}
                      className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      Media Hub
                    </button>
                    <a
                      href="https://console.cloudinary.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
                      title="Fungua Console ya Cloudinary (cy4pidvh)"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Brand & Developer Attribution */}
            <div className="p-5 rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent text-center space-y-2">
              <div className="text-2xl">🦓</div>
              <h4 className="text-sm font-bold font-display text-white">
                Zebra Restaurant App
              </h4>
              <p className="text-xs text-neutral-400">
                Jina la App: <strong>Zebra Restaurant</strong>
                <br />
                Mtengenezaji: <strong className="text-amber-400">AmourCodes</strong>
              </p>
              <p className="text-[11px] text-neutral-500 pt-1">
                Lipa kwa USSD *150*00# (Vodacom M-Pesa), Tigo Pesa, Halopesa na Airtel Money kupitia Lipa Namba 445566.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
