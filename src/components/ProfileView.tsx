import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  LogOut,
  Edit2,
  Plus,
  Check,
  ReceiptText,
  Camera,
  Upload,
  Trash2,
  Headphones,
  MessageSquare,
  ChevronRight,
  Award,
  Calendar,
  Sparkles
} from 'lucide-react';
import { formatPrice } from '../utils/formatters';
import { MapLocationPickerModal } from './MapLocationPickerModal';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
];

export const ProfileView: React.FC = () => {
  const {
    user,
    updateUser,
    orders,
    theme,
    currency,
    setActiveTab,
    setActiveOrder,
    isLoggedIn,
    logout,
    setAuthMode,
    reservations,
    setShowReservationModal,
    loyaltyPoints
  } = useApp();

  const isDark = theme === 'dark';

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || 'David Michael Johnson');
  const [phoneInput, setPhoneInput] = useState(user?.phone || '+255 754 123 456');
  const [emailInput, setEmailInput] = useState(user?.email || 'customer@zebradsm.com');
  const [avatarInput, setAvatarInput] = useState(user?.avatar || '');
  const [avatarError, setAvatarError] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showAddressMapPicker, setShowAddressMapPicker] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState('Nyumbani');
  const [newAddressStreet, setNewAddressStreet] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getInitials = (name: string) => {
    if (!name) return 'ZR';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Picha isizidi ukubwa wa MB 5');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      setAvatarInput(base64Url);
      setAvatarError(false);
      updateUser({ avatar: base64Url });
      showToast('Picha ya profile imesasishwa kikamilifu! ✨');
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPresetAvatar = (url: string) => {
    setAvatarInput(url);
    setAvatarError(false);
    updateUser({ avatar: url });
    showToast('Picha ya profile imebadilishwa! ✨');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      showToast('Tafadhali weka jina lako');
      return;
    }

    updateUser({
      name: nameInput.trim(),
      phone: phoneInput.trim(),
      email: emailInput.trim(),
      avatar: avatarInput || user.avatar
    });
    setIsEditingProfile(false);
    showToast('Taarifa za wasifu zimehifadhiwa! ✅');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressStreet.trim()) return;

    const newAddr = {
      id: `addr-${Date.now()}`,
      label: newAddressLabel,
      street: newAddressStreet.trim(),
      city: 'Dar es Salaam',
      isDefault: user.addresses.length === 0
    };

    updateUser({
      addresses: [...user.addresses, newAddr]
    });
    setNewAddressStreet('');
    setShowAddAddress(false);
    showToast('Anwani mpya imeongezwa! 📍');
  };

  const handleDeleteAddress = (id: string) => {
    updateUser({
      addresses: user.addresses.filter(a => a.id !== id)
    });
    showToast('Anwani imeondolewa');
  };

  const handleToggleAdmin = () => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin';
    updateUser({ role: newRole });
    if (newRole === 'admin') {
      setActiveTab('admin');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] px-4 py-12 text-center">
        <div className="w-20 h-20 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 text-3xl shadow-inner">
          <User className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold font-display text-neutral-900 dark:text-white mb-2">
          Akaunti Yako (My Account)
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-6 leading-relaxed">
          Ili kutazama taarifa zako, anwani za kuletewa chakula, na oda ulizoagiza, tafadhali ingia kwenye akaunti yako.
        </p>
        <button
          onClick={() => {
            setAuthMode('login');
            setActiveTab('auth');
          }}
          className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-neutral-950 font-bold py-3 px-8 rounded-full shadow-lg shadow-amber-500/25 text-sm flex items-center space-x-2 transition-transform"
        >
          <span>Ingia au Jisajili Sasa</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-5 pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-neutral-900/95 text-white border border-emerald-500/40 text-xs sm:text-sm font-semibold shadow-xl flex items-center space-x-2 animate-fadeIn backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden file input for photo upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleAvatarFileUpload}
        className="hidden"
      />

      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-neutral-900 dark:text-white tracking-tight">
            Akaunti Yangu
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Dhibiti wasifu wako, anwani za usafirishaji na oda zako
          </p>
        </div>

        {/* Small Admin Dashboard Switch */}
        <button
          onClick={handleToggleAdmin}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full flex items-center space-x-1.5 transition-all ${
            user.role === 'admin'
              ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
              : 'bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-700'
          }`}
          title="Fungua dashibodi ya Admin"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{user.role === 'admin' ? 'Admin Dashboard' : 'Admin'}</span>
        </button>
      </div>

      {/* 1. Main Profile Card */}
      <div
        className={`p-5 rounded-3xl border transition-all ${
          isDark ? 'bg-neutral-900/80 border-neutral-800 shadow-lg shadow-black/20' : 'bg-white border-neutral-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Clickable Profile Avatar with Camera Badge */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer shrink-0"
              title="Gusa kupakia picha kutoka simuni"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-emerald-500 shadow-md bg-neutral-800 flex items-center justify-center">
                {user.avatar && !avatarError ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    onError={() => setAvatarError(true)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white font-black text-lg sm:text-xl">
                    {getInitials(user.name)}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 hover:bg-emerald-400 text-white p-1.5 rounded-full border-2 border-neutral-900 shadow-md transition-transform active:scale-90 flex items-center justify-center">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* User Meta */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white truncate">
                  {user.name}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 shrink-0">
                  {user.role === 'admin' ? 'Admin' : 'Mteja'}
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5 flex items-center space-x-1">
                <Mail className="w-3 h-3 shrink-0" />
                <span className="truncate">{user.email}</span>
              </p>
              <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 mt-1 flex items-center space-x-1">
                <Phone className="w-3 h-3 shrink-0" />
                <span>{user.phone}</span>
              </p>
            </div>
          </div>

          {/* Action Buttons: Edit / Change Picture */}
          <div className="flex items-center space-x-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800/50">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-initial text-xs font-semibold py-2 px-3.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Badili Picha</span>
            </button>
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="flex-1 sm:flex-initial text-xs font-semibold py-2 px-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditingProfile ? 'Funga' : 'Hariri'}</span>
            </button>
          </div>
        </div>

        {/* Edit Profile Form Drawer */}
        {isEditingProfile && (
          <form onSubmit={handleSaveProfile} className="mt-5 pt-5 border-t border-neutral-800 space-y-4 animate-fadeIn">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              Hariri Taarifa Zako
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                  Jina Kamili
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  className="w-full p-2.5 text-xs bg-neutral-800/90 border border-neutral-700 rounded-xl text-white outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                  Nambari ya Simu
                </label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={e => setPhoneInput(e.target.value)}
                  className="w-full p-2.5 text-xs bg-neutral-800/90 border border-neutral-700 rounded-xl text-white outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                  Barua Pepe (Email)
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  className="w-full p-2.5 text-xs bg-neutral-800/90 border border-neutral-700 rounded-xl text-white outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            {/* Quick Avatar Choices */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] text-neutral-400 block">
                Au chagua moja ya picha za haraka:
              </span>
              <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                {AVATAR_PRESETS.map((presetUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPresetAvatar(presetUrl)}
                    className={`relative w-9 h-9 rounded-full overflow-hidden shrink-0 border-2 transition-all ${
                      user.avatar === presetUrl
                        ? 'border-emerald-500 scale-110 shadow-md shadow-emerald-500/30'
                        : 'border-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    <img src={presetUrl} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="submit"
                className="flex-1 sm:flex-initial bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md shadow-emerald-500/20"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Hifadhi Mabadiliko</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white text-xs"
              >
                Ghairi
              </button>
            </div>
          </form>
        )}
      </div>

      {/* VIP Loyalty Rewards Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-600/20 via-neutral-900 to-emerald-950 border border-amber-500/30 relative overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400">
                <Award className="w-5 h-5" />
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                Zebra VIP Club • {user.loyaltyTier || 'Gold'} Tier
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-display">
              {loyaltyPoints} Pointi za Uaminifu
            </h3>
            <p className="text-xs text-neutral-300">
              Thamani halisi ya punguzo: <span className="text-emerald-400 font-bold font-mono">{formatPrice((loyaltyPoints / 100) * 1000, 'TZS')}</span>. Unapata pointi 10 kwa kila TZS 1,000 unayotumia!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowReservationModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Weka Nafasi ya Meza</span>
            </button>
          </div>
        </div>

        {/* Reservations preview if any */}
        {reservations && reservations.length > 0 && (
          <div className="mt-4 pt-4 border-t border-amber-500/20">
            <div className="text-[11px] font-bold text-neutral-300 mb-2 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Nafasi Zako za Meza Zilizothibitishwa (Reservations):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {reservations.map(res => (
                <div key={res.id} className="p-2.5 rounded-xl bg-black/40 border border-neutral-700/60 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white flex items-center space-x-1">
                      <span>{res.tablePreference || res.section}</span>
                      <span className="text-neutral-400">({res.guestCount} wageni)</span>
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {res.date} • {res.timeSlot}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    res.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {res.status === 'confirmed' ? 'Imethibitishwa' : res.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2-Column Grid on Tablet/Desktop for Clean Hierarchy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Left Column: Saved Addresses & Recent Orders */}
        <div className="space-y-5">
          {/* Saved Delivery Addresses */}
          <div
            className={`p-5 rounded-3xl border space-y-3.5 ${
              isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider">
                  Anwani za Kuletewa Chakula
                </h3>
              </div>
              <button
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 flex items-center space-x-1 py-1 px-2.5 rounded-lg hover:bg-emerald-500/10 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Weka Mpya</span>
              </button>
            </div>

            {showAddAddress && (
              <form onSubmit={handleAddAddress} className="p-3.5 rounded-2xl bg-neutral-800/80 border border-neutral-700 space-y-3 animate-fadeIn">
                <div className="flex space-x-2">
                  {['Nyumbani', 'Ofisini', 'Nyingine'].map(lbl => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setNewAddressLabel(lbl)}
                      className={`text-xs px-3 py-1 rounded-lg border font-medium transition-colors ${
                        newAddressLabel === lbl
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-neutral-700 text-neutral-300 hover:border-neutral-600'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddressMapPicker(true)}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <span>🗺️ Chagua Eneo kwenye Ramani (Dar es Salaam)</span>
                </button>

                <input
                  type="text"
                  value={newAddressStreet}
                  onChange={e => setNewAddressStreet(e.target.value)}
                  placeholder="Mtaa, Eneo maarufu, jengo mfano: Toure Drive, Masaki..."
                  className="w-full p-2.5 text-xs bg-neutral-900 border border-neutral-700 rounded-xl text-white outline-none focus:border-emerald-500"
                  required
                />
                <div className="flex items-center space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 text-xs rounded-xl transition-colors shadow-sm"
                  >
                    Hifadhi Anwani
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(false)}
                    className="px-3 py-2 text-xs text-neutral-400 hover:text-white rounded-xl bg-neutral-700"
                  >
                    Ghairi
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {user.addresses.length === 0 ? (
                <p className="text-xs text-neutral-500 py-2">Bado haujaweka anwani ya kuletewa chakula.</p>
              ) : (
                user.addresses.map(addr => (
                  <div
                    key={addr.id}
                    className="flex items-start justify-between p-3 rounded-2xl bg-neutral-800/40 border border-neutral-800 hover:border-neutral-700/80 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-500 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-neutral-200">{addr.label}</span>
                        <p className="text-xs text-neutral-400 mt-0.5">{addr.street}, {addr.city}</p>
                      </div>
                    </div>
                    {user.addresses.length > 1 && (
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-neutral-500 hover:text-rose-400 p-1 rounded-lg transition-colors"
                        title="Ondoa anwani"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Orders Card */}
          <div
            className={`p-5 rounded-3xl border space-y-3.5 ${
              isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                  <ReceiptText className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider">
                  Oda za Hivi Karibuni ({orders.length})
                </h3>
              </div>
              {orders.length > 0 && (
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-emerald-500 hover:underline"
                >
                  Tazama Zote
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {orders.length === 0 ? (
                <div className="text-center py-6 text-neutral-500 space-y-2">
                  <p className="text-xs">Hujafanya oda yoyote bado.</p>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="text-xs text-amber-400 font-semibold hover:underline"
                  >
                    Agiza chakula sasa →
                  </button>
                </div>
              ) : (
                orders.slice(0, 3).map(ord => (
                  <div
                    key={ord.id}
                    onClick={() => {
                      setActiveOrder(ord);
                      setActiveTab('orders');
                    }}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-800/40 border border-neutral-800 hover:border-neutral-700 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <ReceiptText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-neutral-200 truncate">{ord.orderNumber}</h4>
                        <p className="text-[11px] text-neutral-500 truncate">{ord.date} • {ord.items.length} vyakula</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-2">
                      <span className="text-xs font-bold text-emerald-500 block">
                        {formatPrice(ord.total, currency)}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-amber-400">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Customer Support & Account Actions */}
        <div className="space-y-5">
          {/* Customer Support & Contact */}
          <div
            className={`p-5 rounded-3xl border space-y-3.5 ${
              isDark ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white border-neutral-200 shadow-sm'
            }`}
          >
            <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-wider">
              Msaada & Huduma kwa Wateja
            </h3>

            <div className="space-y-2">
              <a
                href="tel:+255712345678"
                className="flex items-center justify-between p-3 rounded-2xl bg-neutral-800/40 border border-neutral-800 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-neutral-200 block">Simu ya Msaada (Hotline)</span>
                    <span className="text-[11px] font-mono text-neutral-400">+255 712 345 678</span>
                  </div>
                </div>
                <span className="text-xs text-emerald-400 font-semibold">Piga Simu →</span>
              </a>

              <a
                href="https://wa.me/255744883291?text=Habari%20Zebra%20Restaurant,%20naomba%20msaada%20kuhusu%20oda%20yangu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl bg-neutral-800/40 border border-neutral-800 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-neutral-200 block">WhatsApp Support</span>
                    <span className="text-[11px] text-neutral-400">Jibu la haraka ndani ya dakika 5</span>
                  </div>
                </div>
                <span className="text-xs text-emerald-400 font-semibold">Chat Nasi →</span>
              </a>
            </div>
          </div>

          {/* Clean Log Out Button */}
          <button
            onClick={() => {
              if (window.confirm('Je, una uhakika unataka kutoka kwenye akaunti yako?')) {
                logout();
              }
            }}
            className="w-full py-3.5 px-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 active:scale-98 text-rose-400 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Toka Kwenye Akaunti (Log Out)</span>
          </button>
        </div>
      </div>

      {/* Map Location Picker Modal */}
      <MapLocationPickerModal
        isOpen={showAddressMapPicker}
        onClose={() => setShowAddressMapPicker(false)}
        onSelectLocation={result => {
          setNewAddressStreet(result.address);
        }}
        initialAddress={newAddressStreet}
        isDark={isDark}
      />
    </div>
  );
};
