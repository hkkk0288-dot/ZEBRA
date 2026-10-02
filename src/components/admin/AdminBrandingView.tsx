import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { SplashMediaItem, SplashMediaType } from '../../types';
import {
  Palette,
  Image as ImageIcon,
  Video,
  Upload,
  Plus,
  Trash2,
  Edit2,
  Eye,
  CheckCircle2,
  Sparkles,
  Save,
  RotateCcw,
  X,
  Play,
  Clock,
  ChevronUp,
  ChevronDown,
  Layers,
  Smartphone,
  ExternalLink,
  Film,
  Store,
  MapPin
} from 'lucide-react';

// Preset Restaurant Logos
const LOGO_PRESETS = [
  {
    name: 'Zebra Safari Badge',
    url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=200&q=80',
    emoji: '🦓',
    description: 'Classic Zebra Emblem'
  },
  {
    name: 'Golden Crown & Grill',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80',
    emoji: '👑',
    description: 'Luxury Dining'
  },
  {
    name: 'Artisan Wood-Fired Flame',
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80',
    emoji: '🔥',
    description: 'Flame & Pizzeria'
  },
  {
    name: 'Gourmet Kitchen Hat',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80',
    emoji: '👨‍🍳',
    description: 'Executive Chef'
  }
];

// High-def Curated Video Presets for Splash Screen
const VIDEO_PRESETS = [
  {
    name: 'Fresh Hot Pizza Slice Pull',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-slice-of-freshly-baked-pizza-42971-large.mp4',
    title: 'Piza Moto & Vyakula vya Kisasa',
    subtitle: 'Zebra Restaurant Masaki - Ladha halisi ya tanuru la kuni'
  },
  {
    name: 'Pouring Refreshing Tropical Drink',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-pouring-a-red-drink-in-a-glass-with-ice-42472-large.mp4',
    title: 'Vinywaji Baridi & Mocktails',
    subtitle: 'Viburudisho vya asili na vinywaji vitamu kwa ajili yako'
  },
  {
    name: 'Gourmet Sizzling Steak & BBQ',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-top-view-of-cooking-a-steak-on-a-grill-42959-large.mp4',
    title: 'Nyama Choma & Mishkaki',
    subtitle: 'Mishkaki ya moto na nyama choma laini popote Dar es Salaam'
  },
  {
    name: 'Chef Sautéing in Sizzling Pan',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-chef-cooking-food-in-a-pan-with-flames-42967-large.mp4',
    title: 'Mapishi Bora ya Kisasa',
    subtitle: 'Wapishi wenye uzoefu wa kimataifa wakitayarisha oda yako'
  }
];

// High-def Curated Picture Presets for Splash Screen
const IMAGE_PRESETS = [
  {
    name: 'Zebra Restaurant Masaki Dining Ambiance',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85',
    title: 'Karibu Zebra Restaurant Masaki',
    subtitle: 'Peninsula Toure Drive - Mazingira tulivu, huduma bora na chakula kitamu'
  },
  {
    name: 'Nyama Choma Platter & Swahili Grill',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=85',
    title: 'Chakula Kinachonukia & Ladha ya Pekee',
    subtitle: 'Mishkaki ya moto, biryani, kuku na mbavu za kuchoma'
  },
  {
    name: 'Artisan Wood-Fired Pizza',
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1600&q=85',
    title: 'Piza Halisi ya Tanuru la Kuni',
    subtitle: 'Imeokwa kwa moto wa asili na viungo safi'
  },
  {
    name: 'Gourmet Double Smash Burger',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=85',
    title: 'Gourmet Smash Burgers',
    subtitle: 'Zinaambatana na chips za moto na sosi maalum ya Zebra'
  }
];

export const AdminBrandingView: React.FC = () => {
  const {
    appBranding,
    updateAppBranding,
    resetAppBranding,
    setShowSplashPreview,
    addSplashSlide,
    updateSplashSlide,
    deleteSplashSlide,
    reorderSplashSlides,
    theme
  } = useApp();

  const isDark = theme === 'dark';
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const mediaFileInputRef = useRef<HTMLInputElement>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Logo form state
  const [logoUrlInput, setLogoUrlInput] = useState(appBranding.logoUrl || '');
  const [logoEmojiInput, setLogoEmojiInput] = useState(appBranding.logoEmoji || '🦓');
  const [appNameInput, setAppNameInput] = useState(appBranding.appName || 'Zebra Restaurant');
  const [taglineInput, setTaglineInput] = useState(appBranding.tagline || 'Masaki Peninsula, Dar es Salaam');

  // Modal for adding or editing splash slide
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<SplashMediaItem | null>(null);

  // Slide form state
  const [slideType, setSlideType] = useState<SplashMediaType>('image');
  const [slideMediaUrl, setSlideMediaUrl] = useState('');
  const [slideTitle, setSlideTitle] = useState('');
  const [slideSubtitle, setSlideSubtitle] = useState('');
  const [slideDuration, setSlideDuration] = useState(5);
  const [slideButtonText, setSlideButtonText] = useState('Anza Sasa ➔');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Logo Upload from device
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      showToast('Ukubwa wa faili usizidi MB 8');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setLogoUrlInput(dataUrl);
      updateAppBranding({ logoUrl: dataUrl });
      showToast('Logo ya App imepakiwa na kuhifadhiwa! ✅');
    };
    reader.readAsDataURL(file);
  };

  // Save Logo & Brand Info
  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateAppBranding({
      logoUrl: logoUrlInput.trim(),
      logoEmoji: logoEmojiInput.trim() || '🦓',
      appName: appNameInput.trim() || 'Zebra Restaurant',
      tagline: taglineInput.trim() || 'Masaki Peninsula, Dar es Salaam'
    });
    showToast('Taarifa za Logo na Brand zimehifadhiwa kikamilifu! ✅');
  };

  // Handle Media File upload for splash screen (Image or Video)
  const handleMediaFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Detect if video or image
    const isVid = file.type.startsWith('video/');
    setSlideType(isVid ? 'video' : 'image');

    if (file.size > 50 * 1024 * 1024) {
      showToast('Ukubwa wa video/picha usizidi MB 50');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setSlideMediaUrl(dataUrl);
      showToast(`Faili la ${isVid ? 'video' : 'picha'} limepakiwa!`);
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAddSlide = () => {
    setEditingSlide(null);
    setSlideType('image');
    setSlideMediaUrl(IMAGE_PRESETS[0].url);
    setSlideTitle('Karibu Zebra Restaurant Masaki');
    setSlideSubtitle('Chakula kitamu, mazingira safi, na uletewe popote Dar es Salaam');
    setSlideDuration(5);
    setSlideButtonText('Anza Sasa ➔');
    setIsSlideModalOpen(true);
  };

  const handleOpenEditSlide = (slide: SplashMediaItem) => {
    setEditingSlide(slide);
    setSlideType(slide.type);
    setSlideMediaUrl(slide.mediaUrl);
    setSlideTitle(slide.title || '');
    setSlideSubtitle(slide.subtitle || '');
    setSlideDuration(slide.durationSeconds || 5);
    setSlideButtonText(slide.buttonText || 'Anza Sasa ➔');
    setIsSlideModalOpen(true);
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideMediaUrl.trim()) {
      showToast('Tafadhali weka picha au video URL!');
      return;
    }

    if (editingSlide) {
      updateSplashSlide(editingSlide.id, {
        type: slideType,
        mediaUrl: slideMediaUrl.trim(),
        title: slideTitle.trim(),
        subtitle: slideSubtitle.trim(),
        durationSeconds: Math.max(2, Number(slideDuration) || 4),
        buttonText: slideButtonText.trim()
      });
      showToast('Slide ya Splash Screen imesasishwa! ✅');
    } else {
      addSplashSlide({
        type: slideType,
        mediaUrl: slideMediaUrl.trim(),
        title: slideTitle.trim(),
        subtitle: slideSubtitle.trim(),
        durationSeconds: Math.max(2, Number(slideDuration) || 4),
        buttonText: slideButtonText.trim(),
        active: true
      });
      showToast('Slide mpya ya Splash Screen imeongezwa! 🎉');
    }

    setIsSlideModalOpen(false);
  };

  const handleSetSinglePizzaVideo = () => {
    const slide: SplashMediaItem = {
      id: `splash-${Date.now()}`,
      orderIndex: 0,
      type: 'video',
      mediaUrl: VIDEO_PRESETS[0].url,
      title: 'Piza Moto & Vyakula vya Kisasa',
      subtitle: 'Zebra Restaurant Masaki - Ladha halisi ya tanuru la kuni na viungo safi',
      durationSeconds: 6,
      buttonText: 'Anza Sasa ➔',
      active: true
    };
    updateAppBranding({ splashSlides: [slide], splashEnabled: true });
    showToast('Imewekwa: Slide 1 ya Video ya Piza Moto! 🍕🎬');
  };

  const handleSetSingleDrinkVideo = () => {
    const slide: SplashMediaItem = {
      id: `splash-${Date.now()}`,
      orderIndex: 0,
      type: 'video',
      mediaUrl: VIDEO_PRESETS[1].url,
      title: 'Vinywaji Baridi & Mocktails',
      subtitle: 'Viburudisho vya asili na juisi freshi kwa ajili yako',
      durationSeconds: 5,
      buttonText: 'Agiza Vinywaji ➔',
      active: true
    };
    updateAppBranding({ splashSlides: [slide], splashEnabled: true });
    showToast('Imewekwa: Slide 1 ya Video ya Kinywaji! 🍹🎬');
  };

  const handleSetSingleImage = () => {
    const slide: SplashMediaItem = {
      id: `splash-${Date.now()}`,
      orderIndex: 0,
      type: 'image',
      mediaUrl: IMAGE_PRESETS[0].url,
      title: 'Karibu Zebra Restaurant Masaki',
      subtitle: 'Peninsula Toure Drive - Mazingira tulivu, huduma bora na chakula kitamu',
      durationSeconds: 5,
      buttonText: 'Fungua Menyu ➔',
      active: true
    };
    updateAppBranding({ splashSlides: [slide], splashEnabled: true });
    showToast('Imewekwa: Slide 1 ya Picha ya Mgahawa! 🖼️');
  };

  const handleSetMultiCombo = () => {
    const slides: SplashMediaItem[] = [
      {
        id: `splash-1-${Date.now()}`,
        orderIndex: 0,
        type: 'video',
        mediaUrl: VIDEO_PRESETS[0].url,
        title: 'Mapishi ya Kisasa & Piza Moto',
        subtitle: 'Ladha halisi inayopikwa papo hapo jikoni kwetu Masaki',
        durationSeconds: 5,
        buttonText: 'Mbele ➔',
        active: true
      },
      {
        id: `splash-2-${Date.now()}`,
        orderIndex: 1,
        type: 'image',
        mediaUrl: IMAGE_PRESETS[1].url,
        title: 'Nyama Choma & Mishkaki Tamu',
        subtitle: 'Imeandaliwa kwa viungo asilia na mboga mboga freshi',
        durationSeconds: 5,
        buttonText: 'Mbele ➔',
        active: true
      },
      {
        id: `splash-3-${Date.now()}`,
        orderIndex: 2,
        type: 'video',
        mediaUrl: VIDEO_PRESETS[1].url,
        title: 'Uletewe Popote Dar es Salaam',
        subtitle: 'Madereva wa boda-boda wapo tayari kufikisha oda yako ya moto',
        durationSeconds: 5,
        buttonText: 'Anza Kuagiza Sasa ➔',
        active: true
      }
    ];
    updateAppBranding({ splashSlides: slides, splashEnabled: true });
    showToast('Zimewekwa: Slides 3 za Picha na Video mseto! ✨🎬');
  };

  const handleSetRestaurantMode = (mode: 'single' | 'multi') => {
    updateAppBranding({ restaurantMode: mode });
    showToast(
      mode === 'single'
        ? 'Imewekwa: Single Restaurant (Mteja anabadilisha location yake tuu ya kuletewa chakula) 🍽️'
        : 'Imewekwa: Multi-Restaurant (Wateja wanaona na kuchagua matawi yote) 🌐'
    );
  };

  const handleResetSplashSeen = () => {
    sessionStorage.removeItem('zebra_splash_seen');
    showToast('Splash Screen imewekwa upya! Itaonekana unapofungua app tena. 🔄');
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...appBranding.splashSlides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSlides.length) return;

    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    reorderSplashSlides(newSlides);
  };

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Toast message alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center space-x-2 px-4 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-xs shadow-xl animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
        <div>
          <h2 className="text-lg font-black font-display text-neutral-900 dark:text-white flex items-center space-x-2">
            <span className="p-2 rounded-2xl bg-orange-500/15 text-orange-500">
              <Palette className="w-5 h-5" />
            </span>
            <span>Logo ya App & Splash Screen (Pictures & Videos)</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Weka nembo rasmi ya restaurant, kisha panga picha au video za splash screen (moja au zaidi) wateja wanapoingia kwenye app
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={handleResetSplashSeen}
            className="px-3.5 py-2.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95 border border-neutral-300 dark:border-neutral-700"
            title="Weka upya ili splash screen icheze tena unapofungua app au kurefresh"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
            <span>Weka Upya (Play on Reload)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSplashPreview(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-neutral-950 font-black text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Eye className="w-4 h-4" />
            <span>Tazama Splash Screen (Preview)</span>
          </button>
        </div>
      </div>

      {/* SECTION: MUUNDO WA MGAHAWA (SINGLE VS MULTI RESTAURANT) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 gap-2">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500">
              <Store className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-neutral-900 dark:text-white">
                Muundo wa Mgahawa (Single Restaurant vs Multi-Branch)
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Kama nisingo restaurant au Maltip. Kama singo basi mteja anaweza kubadilisha location yake tuu ya kuletewa chakula.
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0 w-fit">
            {(appBranding.restaurantMode || 'single') === 'single' ? '🍽️ Single Restaurant (Mgahawa Mmoja)' : '🌐 Multi-Branch (Matawi Mengi)'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Single Restaurant Mode Card */}
          <button
            type="button"
            onClick={() => handleSetRestaurantMode('single')}
            className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
              (appBranding.restaurantMode || 'single') === 'single'
                ? 'border-emerald-500 bg-emerald-500/10 shadow-sm ring-1 ring-emerald-500/40'
                : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 hover:border-neutral-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-neutral-900 dark:text-white flex items-center space-x-2">
                <span>🍽️</span>
                <span>Single Restaurant (Mgahawa Mmoja)</span>
              </span>
              {(appBranding.restaurantMode || 'single') === 'single' && (
                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              )}
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Mteja akibofya ramani au eneo analetewa chakula, anabadilisha <strong>eneo lake tu analoletewa chakula (Delivery Location)</strong>. Hahitaji kuchagua wala kubadilisha mgahawa kwa sababu ni mgahawa mmoja tu.
            </p>
            <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              <span>Chaguo Linalotumika Sasa (Inapendekezwa)</span>
            </span>
          </button>

          {/* Multi-Branch Mode Card */}
          <button
            type="button"
            onClick={() => handleSetRestaurantMode('multi')}
            className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
              appBranding.restaurantMode === 'multi'
                ? 'border-emerald-500 bg-emerald-500/10 shadow-sm ring-1 ring-emerald-500/40'
                : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 hover:border-neutral-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-neutral-900 dark:text-white flex items-center space-x-2">
                <span>🌐</span>
                <span>Multi-Restaurant (Matawi Mengi)</span>
              </span>
              {appBranding.restaurantMode === 'multi' && (
                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              )}
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Matawi mengi (Masaki, Slipway, Kariakoo, n.k.). Wateja wanaona ramani ya matawi yote na wanaweza kubadilisha tawi la mgahawa wanalotaka kuagizia.
            </p>
            <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-neutral-400">
              <span>Mtandao wa matawi na vituo vya jikoni</span>
            </span>
          </button>
        </div>
      </div>

      {/* SECTION 1: LOGO YA APP (APP LOGO) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500">
              <ImageIcon className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-neutral-900 dark:text-white">
                1. Logo ya App (App Brand Icon)
              </h3>
              <p className="text-[11px] text-neutral-400">
                Inaonekana juu kwenye Web Header, Mobile App bar, Footer, Risiti za mezani na Splash Screen
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={resetAppBranding}
            className="text-[11px] font-bold text-neutral-400 hover:text-rose-400 flex items-center space-x-1 py-1 px-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Rudisha nembo ya awali"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Rudisha Awali</span>
          </button>
        </div>

        <form onSubmit={handleSaveBranding} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Live Logo Previews */}
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center text-center space-y-3">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Mwonekano Halisi wa Logo
              </span>

              {/* Large logo preview */}
              <div className="relative group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 to-amber-500 flex items-center justify-center shadow-xl shadow-emerald-500/25 overflow-hidden border-2 border-white/20">
                  {logoUrlInput ? (
                    <img
                      src={logoUrlInput}
                      alt="App Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">{logoEmojiInput || '🦓'}</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => logoFileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg transition-transform active:scale-95 cursor-pointer"
                  title="Pakia picha kutoka simuni au kompyuta"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-neutral-900 dark:text-white">
                  {appNameInput || 'Zebra Restaurant'}
                </h4>
                <p className="text-[11px] text-amber-500 font-medium">
                  {taglineInput || 'Masaki Peninsula, Dar es Salaam'}
                </p>
              </div>

              {/* Header preview pill */}
              <div className="px-3 py-1.5 rounded-full bg-black/60 text-white text-[10px] font-medium flex items-center space-x-1.5 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Inatumika sasa kwenye Header & Splash</span>
              </div>
            </div>

            {/* Inputs: Upload & URL */}
            <div className="md:col-span-2 space-y-3.5 text-xs">
              {/* Direct File Upload button */}
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-bold mb-1.5">
                  Pakia Picha ya Logo Kutoka Kwenye Kifaa Chako (Simu / Kompyuta):
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    ref={logoFileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => logoFileInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Chagua Picha ya Logo (PNG/JPG/WebP)</span>
                  </button>
                  {logoUrlInput && (
                    <button
                      type="button"
                      onClick={() => setLogoUrlInput('')}
                      className="px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 font-bold"
                    >
                      Ondoa Picha (Tumia Emoji)
                    </button>
                  )}
                </div>
              </div>

              {/* Logo URL input */}
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-bold mb-1">
                  Au Weka URL ya Logo (Mtandaoni):
                </label>
                <input
                  type="text"
                  value={logoUrlInput}
                  onChange={e => setLogoUrlInput(e.target.value)}
                  placeholder="https://mfano.com/logo.png"
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono outline-none focus:border-orange-500"
                />
              </div>

              {/* App Name and Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-bold mb-1">
                    Jina la App (App Name):
                  </label>
                  <input
                    type="text"
                    value={appNameInput}
                    onChange={e => setAppNameInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-bold outline-none focus:border-orange-500"
                    placeholder="Zebra Restaurant"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-bold mb-1">
                    Kauli Mbiu / Eneo (Tagline):
                  </label>
                  <input
                    type="text"
                    value={taglineInput}
                    onChange={e => setTaglineInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none focus:border-orange-500"
                    placeholder="Masaki Peninsula, Dar es Salaam"
                  />
                </div>
              </div>

              {/* Presets library */}
              <div>
                <label className="block text-neutral-500 dark:text-neutral-400 font-semibold mb-1">
                  Au chagua nembo zilizotayarishwa (Presets):
                </label>
                <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
                  {LOGO_PRESETS.map(preset => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setLogoUrlInput(preset.url);
                        setLogoEmojiInput(preset.emoji);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-orange-500 flex items-center space-x-1.5 text-[11px] font-bold whitespace-nowrap bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors"
                    >
                      <span>{preset.emoji}</span>
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Hifadhi Mabadiliko ya Logo</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* SECTION 2: SPLASH SCREEN (PICHA AU VIDEO - MOJA AU ZAIDI) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-orange-500/15 text-orange-500">
              <Film className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-sm sm:text-base text-neutral-900 dark:text-white">
                  2. Splash Screen (Picha au Video - Moja au Zaidi)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-extrabold text-[10px]">
                  {appBranding.splashSlides.length} Slide{appBranding.splashSlides.length === 1 ? '' : 's'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Picha au video zinazocheza mteja anapofungua app. Unaweza kuweka slide moja au zaidi zenye video au picha zenye mwonekano wa kisasa.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Enable/Disable Toggle */}
            <button
              type="button"
              onClick={() => {
                updateAppBranding({ splashEnabled: !appBranding.splashEnabled });
                showToast(
                  appBranding.splashEnabled
                    ? 'Splash Screen Imezimwa!'
                    : 'Splash Screen Imewashwa! Wateja wataiona.'
                );
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                appBranding.splashEnabled
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {appBranding.splashEnabled ? '✓ Splash Imewashwa' : '✗ Splash Imezimwa'}
            </button>

            {/* Add Slide Button */}
            <button
              type="button"
              onClick={handleOpenAddSlide}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-orange-600/20 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Ongeza Slide Mpya (Picha/Video)</span>
            </button>
          </div>
        </div>

        {/* Quick Setup Presets Bar: Moja au Zaidi */}
        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-black text-neutral-900 dark:text-white flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>Mipangilio ya Haraka (Chagua Moja au Zaidi ya Moja):</span>
              </span>
              <p className="text-[11px] text-neutral-400">
                Weka video/picha moja pekee, au weka slides mseto (video na picha zaidi ya moja)
              </p>
            </div>
            <div className="flex items-center space-x-1.5 text-[11px] font-bold">
              <span className="px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20">
                Hali ya Sasa: {appBranding.splashSlides.length === 1 ? 'Slide 1 Pekee' : `${appBranding.splashSlides.length} Slides (Zaidi ya Moja)`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={handleSetSinglePizzaVideo}
              className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-orange-500 hover:bg-orange-500/5 bg-white dark:bg-neutral-800 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-1 text-[11px] font-bold text-neutral-900 dark:text-white group-hover:text-orange-500">
                <Video className="w-3.5 h-3.5 text-orange-500" />
                <span className="truncate">Slide 1: Video ya Piza</span>
              </div>
              <p className="text-[10px] text-neutral-400 truncate mt-0.5">Video 1 ya pizza moto</p>
            </button>

            <button
              type="button"
              onClick={handleSetSingleDrinkVideo}
              className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-emerald-500 hover:bg-emerald-500/5 bg-white dark:bg-neutral-800 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-1 text-[11px] font-bold text-neutral-900 dark:text-white group-hover:text-emerald-500">
                <Video className="w-3.5 h-3.5 text-emerald-500" />
                <span className="truncate">Slide 1: Video Kinywaji</span>
              </div>
              <p className="text-[10px] text-neutral-400 truncate mt-0.5">Video 1 ya mocktail</p>
            </button>

            <button
              type="button"
              onClick={handleSetSingleImage}
              className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-teal-500 hover:bg-teal-500/5 bg-white dark:bg-neutral-800 text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-1 text-[11px] font-bold text-neutral-900 dark:text-white group-hover:text-teal-500">
                <ImageIcon className="w-3.5 h-3.5 text-teal-500" />
                <span className="truncate">Slide 1: Picha Mgahawa</span>
              </div>
              <p className="text-[10px] text-neutral-400 truncate mt-0.5">Picha 1 ya Masaki</p>
            </button>

            <button
              type="button"
              onClick={handleSetMultiCombo}
              className="p-2.5 rounded-xl border border-orange-500/40 bg-orange-500/10 text-left transition-all cursor-pointer group hover:bg-orange-500/15"
            >
              <div className="flex items-center space-x-1 text-[11px] font-black text-orange-500">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="truncate">Slides 3: Picha & Video</span>
              </div>
              <p className="text-[10px] text-neutral-400 truncate mt-0.5">Combo (Zaidi ya Moja)</p>
            </button>
          </div>
        </div>

        {/* Splash Screen Slide List */}
        <div className="space-y-3">
          {appBranding.splashSlides.length === 0 ? (
            <div className="p-8 rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-800 text-center space-y-2">
              <span className="text-3xl">🎬</span>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                Bado haujaongeza Slide ya Splash Screen
              </h4>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Bofya kitufe cha "Ongeza Slide Mpya" hapo juu kuweka picha au video itakayoonekana wateja wanapofungua app.
              </p>
              <button
                type="button"
                onClick={handleOpenAddSlide}
                className="mt-2 px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs"
              >
                Ongeza Sasa
              </button>
            </div>
          ) : (
            appBranding.splashSlides.map((slide, idx) => (
              <div
                key={slide.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  slide.active
                    ? 'bg-neutral-50 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800'
                    : 'bg-neutral-100/50 dark:bg-neutral-900/20 border-neutral-200/50 dark:border-neutral-800/40 opacity-60'
                }`}
              >
                {/* Media Preview + Info */}
                <div className="flex items-center space-x-3.5 min-w-0">
                  {/* Order Index badge */}
                  <span className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center text-xs font-black shrink-0">
                    {idx + 1}
                  </span>

                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-neutral-950 shrink-0 border border-neutral-300 dark:border-neutral-700">
                    {slide.type === 'video' ? (
                      <>
                        <video
                          src={slide.mediaUrl}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className="w-5 h-5 text-white fill-white" />
                        </div>
                      </>
                    ) : (
                      <img
                        src={slide.mediaUrl}
                        alt={slide.title || 'Slide'}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[9px] font-bold text-white">
                      {slide.type === 'video' ? 'VIDEO' : 'PICHA'}
                    </span>
                  </div>

                  {/* Content details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-xs sm:text-sm text-neutral-900 dark:text-white truncate">
                        {slide.title || '(Bila Kichwa cha Habari)'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-500/15 text-orange-500 border border-orange-500/20 shrink-0">
                        ⏱️ {slide.durationSeconds}s
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                      {slide.subtitle || slide.mediaUrl}
                    </p>

                    <div className="flex items-center space-x-2 text-[10px] text-neutral-400 mt-1">
                      <span className="truncate max-w-[200px] sm:max-w-xs font-mono">
                        {slide.mediaUrl}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions & Ordering */}
                <div className="flex items-center space-x-1.5 shrink-0 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-200 dark:border-neutral-800">
                  {/* Up / Down Order */}
                  <button
                    type="button"
                    onClick={() => handleMoveSlide(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title="Sogeza Juu"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMoveSlide(idx, 'down')}
                    disabled={idx === appBranding.splashSlides.length - 1}
                    className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                    title="Sogeza Chini"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Active Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      updateSplashSlide(slide.id, { active: !slide.active });
                      showToast(slide.active ? 'Slide imezimwa' : 'Slide imewashwa');
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                      slide.active
                        ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                        : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                    }`}
                  >
                    {slide.active ? 'Active' : 'Hidden'}
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditSlide(slide)}
                    className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 cursor-pointer"
                    title="Hariri Slide"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Je, una uhakika unataka kufuta slide hii?')) {
                        deleteSplashSlide(slide.id);
                        showToast('Slide imefutwa');
                      }
                    }}
                    className="p-1.5 rounded-lg border border-rose-300 dark:border-rose-900/50 hover:bg-rose-500/10 text-rose-500 cursor-pointer"
                    title="Futa Slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL: ADD / EDIT SPLASH SLIDE */}
      {isSlideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
          <div
            className={`w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
              isDark ? 'bg-[#151518] border-neutral-800 text-white' : 'bg-white border-neutral-200 text-neutral-900'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
              <div className="flex items-center space-x-2">
                <span className="p-2 rounded-xl bg-orange-500/15 text-orange-500">
                  {slideType === 'video' ? <Video className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                </span>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">
                    {editingSlide ? 'Hariri Slide ya Splash Screen' : 'Ongeza Slide Mpya (Picha au Video)'}
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Chagua kama unataka kuweka Picha au Video, kisha jaza maelezo
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSlideModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveSlide} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Type Switcher: Picha vs Video */}
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-bold mb-1.5">
                  Aina ya Media (Media Type):
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSlideType('image');
                      if (slideType !== 'image') setSlideMediaUrl(IMAGE_PRESETS[0].url);
                    }}
                    className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      slideType === 'image'
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                        : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>🖼️ Picha (Image)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSlideType('video');
                      if (slideType !== 'video') setSlideMediaUrl(VIDEO_PRESETS[0].url);
                    }}
                    className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      slideType === 'video'
                        ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-600/20'
                        : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>🎬 Video (MP4 / WebM)</span>
                  </button>
                </div>
              </div>

              {/* Upload File Button */}
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-bold mb-1">
                  Pakia Kutoka Kwenye Simu / Kompyuta:
                </label>
                <input
                  type="file"
                  ref={mediaFileInputRef}
                  onChange={handleMediaFileUpload}
                  accept={slideType === 'video' ? 'video/mp4,video/webm' : 'image/*'}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => mediaFileInputRef.current?.click()}
                  className="w-full py-2.5 px-4 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-orange-500 bg-neutral-50 dark:bg-neutral-800/60 font-bold text-neutral-700 dark:text-neutral-200 flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-orange-500" />
                  <span>
                    Chagua faili la {slideType === 'video' ? 'Video (MP4)' : 'Picha (JPG/PNG)'} kutoka simuni
                  </span>
                </button>
              </div>

              {/* Media URL Input */}
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-bold mb-1">
                  Au Weka URL ya {slideType === 'video' ? 'Video' : 'Picha'}:
                </label>
                <input
                  type="text"
                  value={slideMediaUrl}
                  onChange={e => setSlideMediaUrl(e.target.value)}
                  placeholder={
                    slideType === 'video'
                      ? 'https://mfano.com/video.mp4'
                      : 'https://images.unsplash.com/...'
                  }
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono outline-none focus:border-orange-500"
                  required
                />
              </div>

              {/* Preset selector */}
              <div>
                <label className="block text-neutral-500 dark:text-neutral-400 font-semibold mb-1">
                  Mifano Tayari ya {slideType === 'video' ? 'Video' : 'Picha'} (Presets):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(slideType === 'video' ? VIDEO_PRESETS : IMAGE_PRESETS).map(preset => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setSlideMediaUrl(preset.url);
                        setSlideTitle(preset.title);
                        setSlideSubtitle(preset.subtitle);
                      }}
                      className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-orange-500 bg-neutral-50 dark:bg-neutral-800/60 text-left transition-colors"
                    >
                      <p className="font-bold text-neutral-900 dark:text-white truncate">
                        {preset.name}
                      </p>
                      <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                        {preset.title}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-bold mb-1">
                    Kichwa cha Habari (Title):
                  </label>
                  <input
                    type="text"
                    value={slideTitle}
                    onChange={e => setSlideTitle(e.target.value)}
                    placeholder="Mfano: Karibu Zebra Restaurant Masaki"
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-bold outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-bold mb-1">
                    Maelezo Mafupi (Subtitle):
                  </label>
                  <textarea
                    rows={2}
                    value={slideSubtitle}
                    onChange={e => setSlideSubtitle(e.target.value)}
                    placeholder="Mfano: Chakula bora cha kisasa na vinywaji vitamu, kinaletwa haraka popote Dar es Salaam"
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Duration & Button Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-bold mb-1">
                    Muda wa Kucheza (Sekunde):
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={20}
                    value={slideDuration}
                    onChange={e => setSlideDuration(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono font-bold outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-bold mb-1">
                    Maandishi ya Kitufe (Button Text):
                  </label>
                  <input
                    type="text"
                    value={slideButtonText}
                    onChange={e => setSlideButtonText(e.target.value)}
                    placeholder="Anza Sasa ➔"
                    className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-bold outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Live Preview Box inside form */}
              {slideMediaUrl && (
                <div className="pt-2">
                  <label className="block text-neutral-500 font-semibold mb-1">
                    Hakiki Media (Preview):
                  </label>
                  <div className="w-full h-32 rounded-2xl overflow-hidden bg-black relative border border-neutral-300 dark:border-neutral-700">
                    {slideType === 'video' ? (
                      <video
                        src={slideMediaUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={slideMediaUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
                      <p className="font-extrabold text-white text-xs truncate">
                        {slideTitle || 'Preview Title'}
                      </p>
                      <p className="text-[10px] text-neutral-300 truncate">
                        {slideSubtitle || 'Preview Subtitle'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit / Cancel */}
              <div className="flex items-center space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsSlideModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black shadow-md shadow-orange-600/20 active:scale-95 transition-all"
                >
                  {editingSlide ? 'Hifadhi Mabadiliko' : 'Ongeza Slide Hii'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
