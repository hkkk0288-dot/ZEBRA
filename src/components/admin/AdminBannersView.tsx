import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SlideBanner } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Save,
  X,
  Palette,
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  ExternalLink,
  RotateCcw
} from 'lucide-react';

const GRADIENT_PRESETS = [
  {
    name: 'Emerald Forest (Default)',
    value: 'from-emerald-950 via-neutral-900 to-amber-950',
    accent: '#10b981'
  },
  {
    name: 'Fiery BBQ & Flame',
    value: 'from-orange-950 via-neutral-900 to-rose-950',
    accent: '#f97316'
  },
  {
    name: 'Golden Safari & Biryani',
    value: 'from-amber-950 via-neutral-900 to-emerald-950',
    accent: '#f59e0b'
  },
  {
    name: 'Ruby Velvet Burger',
    value: 'from-red-950 via-neutral-900 to-amber-950',
    accent: '#ef4444'
  },
  {
    name: 'Royal Midnight Lounge',
    value: 'from-indigo-950 via-neutral-900 to-purple-950',
    accent: '#8b5cf6'
  },
  {
    name: 'Ocean Breeze & Seafood',
    value: 'from-cyan-950 via-neutral-900 to-blue-950',
    accent: '#06b6d4'
  }
];

const FOOD_IMAGE_PRESETS = [
  {
    label: 'Wood-fired Pizza',
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
    emoji: '🍕'
  },
  {
    label: 'Nyama Choma & BBQ',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    emoji: '🥩'
  },
  {
    label: 'Zanzibar Biryani & Pilau',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
    emoji: '🍗'
  },
  {
    label: 'Smash Gourmet Burger',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
    emoji: '🍔'
  },
  {
    label: 'Tropical Cocktail / Drink',
    url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80',
    emoji: '🍹'
  }
];

const EMOJI_OPTIONS = ['🍕', '🍔', '🥩', '🍗', '🍣', '🍹', '🍰', '🔥', '🎉', '🌟', '🌶️', '☕'];

export const AdminBannersView: React.FC = () => {
  const { banners, addBanner, updateBanner, deleteBanner, theme } = useApp();
  const isDark = theme === 'dark';

  const [editingBanner, setEditingBanner] = useState<SlideBanner | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [tag, setTag] = useState('Festive Offer • Zebra Restaurant');
  const [title, setTitle] = useState('30% OFF');
  const [titleHighlight, setTitleHighlight] = useState('Everything');
  const [description, setDescription] = useState(
    'Authentic wood-fired pizzas, gourmet smash burgers, and fresh Swahili mishkaki & biryani delivered hot across Dar es Salaam.'
  );
  const [ctaText, setCtaText] = useState('Claim 30% Off');
  const [promoCode, setPromoCode] = useState('ZEBRA30');
  const [ussdNumber, setUssdNumber] = useState('*150*00#');
  const [bgGradient, setBgGradient] = useState(GRADIENT_PRESETS[0].value);
  const [accentColor, setAccentColor] = useState(GRADIENT_PRESETS[0].accent);
  const [imageUrl, setImageUrl] = useState(FOOD_IMAGE_PRESETS[0].url);
  const [decorativeEmoji, setDecorativeEmoji] = useState('🍕');
  const [targetCategory, setTargetCategory] = useState('all');
  const [active, setActive] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const startEdit = (banner: SlideBanner) => {
    setEditingBanner(banner);
    setIsCreatingNew(false);
    setTag(banner.tag);
    setTitle(banner.title);
    setTitleHighlight(banner.titleHighlight || '');
    setDescription(banner.description);
    setCtaText(banner.ctaText);
    setPromoCode(banner.promoCode || '');
    setUssdNumber(banner.ussdNumber || '*150*00#');
    setBgGradient(banner.bgGradient);
    setAccentColor(banner.accentColor);
    setImageUrl(banner.imageUrl || '');
    setDecorativeEmoji(banner.decorativeEmoji || '🍕');
    setTargetCategory(banner.targetCategory || 'all');
    setActive(banner.active !== false);
  };

  const startCreate = () => {
    setEditingBanner(null);
    setIsCreatingNew(true);
    setTag('Ofa Maalumu • Zebra Restaurant');
    setTitle('20% PUNGUZO');
    setTitleHighlight('Vyakula Vyote');
    setDescription('Onja vyakula vitamu kutoka jiko la kisasa la Zebra Restaurant Masaki & Slipway.');
    setCtaText('Agiza Sasa');
    setPromoCode('ZEBRA20');
    setUssdNumber('*150*00#');
    setBgGradient(GRADIENT_PRESETS[1].value);
    setAccentColor(GRADIENT_PRESETS[1].accent);
    setImageUrl(FOOD_IMAGE_PRESETS[1].url);
    setDecorativeEmoji('🥩');
    setTargetCategory('meat');
    setActive(true);
  };

  const cancelForm = () => {
    setEditingBanner(null);
    setIsCreatingNew(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingBanner) {
      const updated: SlideBanner = {
        ...editingBanner,
        tag,
        title,
        titleHighlight,
        description,
        ctaText,
        promoCode,
        ussdNumber,
        bgGradient,
        accentColor,
        imageUrl,
        decorativeEmoji,
        targetCategory,
        active
      };
      await updateBanner(updated);
      showToast('Bango la slaidi limesasishwa kikamilifu! ✨');
    } else {
      await addBanner({
        tag,
        title,
        titleHighlight,
        description,
        ctaText,
        promoCode,
        ussdNumber,
        bgGradient,
        accentColor,
        imageUrl,
        decorativeEmoji,
        targetCategory,
        active,
        orderIndex: banners.length
      });
      showToast('Bango jipya limeongezwa kwenye slaidi! 🎉');
    }
    cancelForm();
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Una uhakika unataka kufuta bango "${name}"?`)) {
      await deleteBanner(id);
      showToast('Bango limefutwa kikamilifu!');
      if (editingBanner?.id === id) cancelForm();
    }
  };

  const toggleActive = async (banner: SlideBanner) => {
    const updated = { ...banner, active: !banner.active };
    await updateBanner(updated);
    showToast(updated.active ? 'Bango limewashwa!' : 'Bango limefichwa!');
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const current = banners[index];
    const target = banners[targetIndex];

    await updateBanner({ ...current, orderIndex: targetIndex });
    await updateBanner({ ...target, orderIndex: index });
    showToast('Mpangilio wa slaidi umebadilishwa!');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-xl font-bold text-xs flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
            <span>Mabango ya Slaidi (Slide Banners)</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              {banners.length} Yaliyopo
            </span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Dhibiti mabango ya matangazo na punguzo (Hero Slide Banners) yanayoonekana juu ya tovuti na app.
          </p>
        </div>

        {!isCreatingNew && !editingBanner && (
          <button
            onClick={startCreate}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Ongeza Bango Jipya</span>
          </button>
        )}
      </div>

      {/* Create / Edit Form Drawer */}
      {(isCreatingNew || editingBanner) && (
        <div
          className={`p-5 sm:p-6 rounded-3xl border transition-colors space-y-6 ${
            isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200 shadow-md'
          }`}
        >
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                {editingBanner ? 'Hariri Bango la Slaidi' : 'Unda Bango Jipya la Slaidi'}
              </h3>
            </div>
            <button
              onClick={cancelForm}
              className="p-1 rounded-lg text-neutral-400 hover:text-neutral-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* LIVE PREVIEW OF THE BANNER BEING EDITED */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Hakikisho la Moja kwa Moja (Live Preview)
              </span>
              <span className="text-[11px] text-amber-400 font-medium">
                Jinsi litakavyoonekana kwa wateja
              </span>
            </div>

            <div
              className={`relative w-full rounded-2xl overflow-hidden p-5 sm:p-6 text-white bg-gradient-to-r ${bgGradient} border border-white/10 shadow-lg`}
            >
              {imageUrl && (
                <div
                  className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-25 pointer-events-none"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                />
              )}

              <div className="relative z-10 max-w-lg">
                <div className="inline-flex items-center space-x-1.5 bg-black/40 border border-white/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-300 mb-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{tag || 'Festive Offer'}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white leading-tight">
                  <span>{title} </span>
                  {titleHighlight && <span className="text-amber-400">{titleHighlight}</span>}
                </h3>

                <p className="text-xs text-neutral-300 mt-1 line-clamp-2 max-w-md">
                  {description}
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="bg-emerald-500 text-white font-bold text-xs py-1.5 px-3.5 rounded-full shadow-md flex items-center space-x-1">
                    <span>{ctaText || 'Agiza Sasa'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>

                  {promoCode && (
                    <span className="px-2.5 py-1 rounded-xl bg-black/60 border border-emerald-500/30 text-[10px] font-mono font-bold text-amber-300">
                      Code: <strong className="text-white">{promoCode}</strong>
                    </span>
                  )}

                  {ussdNumber && (
                    <span className="bg-white/10 text-white font-semibold text-[10px] py-1 px-2.5 rounded-xl backdrop-blur-sm flex items-center space-x-1">
                      <Smartphone className="w-3 h-3 text-amber-400" />
                      <span>{ussdNumber}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none hidden sm:block">
                <span className="text-6xl">{decorativeEmoji || '🍕'}</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-400 block mb-1">
                  Kichwa Kidogo / Lebo ya Bango (Tag)
                </label>
                <input
                  type="text"
                  value={tag}
                  onChange={e => setTag(e.target.value)}
                  placeholder="e.g. Festive Offer • Zebra Restaurant"
                  className="w-full p-2.5 text-xs rounded-xl bg-neutral-800 border border-neutral-700 text-white outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-400 block mb-1">
                  Kichwa Kikuu (Title)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. 30% OFF au Nyama Choma"
                  className="w-full p-2.5 text-xs rounded-xl bg-neutral-800 border border-neutral-700 text-white outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-400 block mb-1">
                  Neno Lililokolezwa / Manjano (Highlight)
                </label>
                <input
                  type="text"
                  value={titleHighlight}
                  onChange={e => setTitleHighlight(e.target.value)}
                  placeholder="e.g. Everything au Bure"
                  className="w-full p-2.5 text-xs rounded-xl bg-neutral-800 border border-neutral-700 text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-400 block mb-1">
                Maelezo Mafupi (Description)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Elezea ofa au chakula hiki kwa wateja..."
                className="w-full p-2.5 text-xs rounded-xl bg-neutral-800 border border-neutral-700 text-white outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-400 block mb-1">
                  Maneno ya Kitufe (CTA Button)
                </label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={e => setCtaText(e.target.value)}
                  placeholder="e.g. Claim 30% Off au Agiza Sasa"
                  className="w-full p-2.5 text-xs rounded-xl bg-neutral-800 border border-neutral-700 text-white outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-400 block mb-1">
                  Kodi ya Punguzo (Promo Code)
                </label>
                <input
                  type="text"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="e.g. ZEBRA30"
                  className="w-full p-2.5 text-xs rounded-xl bg-neutral-800 border border-neutral-700 text-white font-mono uppercase outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-400 block mb-1">
                  Namba ya USSD
                </label>
                <input
                  type="text"
                  value={ussdNumber}
                  onChange={e => setUssdNumber(e.target.value)}
                  placeholder="e.g. *150*00#"
                  className="w-full p-2.5 text-xs rounded-xl bg-neutral-800 border border-neutral-700 text-white font-mono outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Gradient Theme Preset Selector */}
            <div>
              <label className="text-xs font-semibold text-neutral-400 block mb-1.5 flex items-center space-x-1.5">
                <Palette className="w-3.5 h-3.5 text-emerald-400" />
                <span>Chagua Mandhari ya Rangi (Gradient Color Theme)</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {GRADIENT_PRESETS.map(preset => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => {
                      setBgGradient(preset.value);
                      setAccentColor(preset.accent);
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                      bgGradient === preset.value
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-neutral-800'
                        : 'border-neutral-700 hover:border-neutral-600 bg-neutral-800/60'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg bg-gradient-to-r ${preset.value} shrink-0 border border-white/20`}
                    />
                    <span className="text-[11px] font-bold text-neutral-200 truncate">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Food Image Presets & URL */}
            <div>
              <label className="text-xs font-semibold text-neutral-400 block mb-1.5 flex items-center space-x-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Picha ya Mandharinyuma (Food Background Image)</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {FOOD_IMAGE_PRESETS.map(preset => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => {
                      setImageUrl(preset.url);
                      setDecorativeEmoji(preset.emoji);
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                      imageUrl === preset.url
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                        : 'border-neutral-700 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    <span>{preset.emoji}</span>
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
              <input
                type="url"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="Au weka kiungo (URL) ya picha nyingine..."
                className="w-full p-2.5 text-xs rounded-xl bg-neutral-800 border border-neutral-700 text-white outline-none focus:border-emerald-500"
              />
            </div>

            {/* Decorative Emoji & Active Switch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-neutral-400 block mb-1">
                  Emoji ya Pembeni (Decorative Icon)
                </label>
                <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
                  {EMOJI_OPTIONS.map(em => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setDecorativeEmoji(em)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                        decorativeEmoji === em
                          ? 'bg-emerald-500/30 border border-emerald-500 scale-110'
                          : 'bg-neutral-800 hover:bg-neutral-700 border border-neutral-700'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-800/80 border border-neutral-700">
                <div>
                  <span className="text-xs font-bold text-neutral-200 block">
                    Hali ya Bango (Active Status)
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Onyesha bango hili kwa wateja kwenye slaidi
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActive(!active)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    active
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-neutral-700 text-neutral-400'
                  }`}
                >
                  {active ? 'Linaonekana' : 'Limefichwa'}
                </button>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={cancelForm}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
              >
                Ghairi
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20"
              >
                <Save className="w-4 h-4" />
                <span>{editingBanner ? 'Hifadhi Mabadiliko' : 'Chapisha Bango Kwenye Slaidi'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Existing Slide Banners List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
          Mabango Yanayozunguka Kwenye Slaidi ({banners.length})
        </h3>

        {banners.length === 0 ? (
          <div className="text-center py-12 rounded-3xl border border-dashed border-neutral-800 text-neutral-500 space-y-3">
            <Sparkles className="w-8 h-8 mx-auto text-neutral-600" />
            <p className="text-xs">Hakuna mabango ya slaidi kwa sasa.</p>
            <button
              onClick={startCreate}
              className="text-xs text-emerald-400 font-semibold hover:underline"
            >
              + Unda bango la kwanza sasa
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {banners.map((banner, idx) => (
              <div
                key={banner.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isDark ? 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700' : 'bg-white border-neutral-200 shadow-sm'
                }`}
              >
                {/* Mini Visual Strip Preview */}
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${banner.bgGradient} flex items-center justify-center text-2xl shrink-0 border border-white/10 shadow-sm relative overflow-hidden`}
                  >
                    {banner.imageUrl && (
                      <div
                        className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30"
                        style={{ backgroundImage: `url(${banner.imageUrl})` }}
                      />
                    )}
                    <span className="relative z-10">{banner.decorativeEmoji || '🍕'}</span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                        {banner.tag}
                      </span>
                      {banner.active ? (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>Linaonekana</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-neutral-500 flex items-center space-x-1">
                          <EyeOff className="w-3 h-3" />
                          <span>Limefichwa</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white mt-1 truncate">
                      {banner.title} {banner.titleHighlight && <span className="text-amber-400">{banner.titleHighlight}</span>}
                    </h4>

                    <p className="text-xs text-neutral-400 truncate max-w-lg mt-0.5">
                      {banner.description}
                    </p>

                    <div className="flex items-center space-x-3 text-[11px] font-mono text-neutral-500 mt-1">
                      {banner.promoCode && (
                        <span>Kodi: <strong className="text-amber-400">{banner.promoCode}</strong></span>
                      )}
                      <span>Kitufe: <em>{banner.ctaText}</em></span>
                    </div>
                  </div>
                </div>

                {/* Operations & Ordering Controls */}
                <div className="flex items-center space-x-2 self-end md:self-auto shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-neutral-800">
                  {/* Order adjustment buttons */}
                  <div className="flex items-center space-x-1 mr-2">
                    <button
                      disabled={idx === 0}
                      onClick={() => moveOrder(idx, 'up')}
                      title="Sogeza Juu Kwenye Slaidi"
                      className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-neutral-300 transition-colors"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={idx === banners.length - 1}
                      onClick={() => moveOrder(idx, 'down')}
                      title="Sogeza Chini Kwenye Slaidi"
                      className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-neutral-300 transition-colors"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Toggle Active Button */}
                  <button
                    onClick={() => toggleActive(banner)}
                    title={banner.active ? 'Ficha Bango' : 'Onyesha Bango'}
                    className={`p-2 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors ${
                      banner.active
                        ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
                        : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                    }`}
                  >
                    {banner.active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>

                  {/* Edit button */}
                  <button
                    onClick={() => startEdit(banner)}
                    title="Hariri Bango"
                    className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-xs flex items-center space-x-1 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Hariri</span>
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(banner.id, banner.title)}
                    title="Futa Bango"
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs flex items-center space-x-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
