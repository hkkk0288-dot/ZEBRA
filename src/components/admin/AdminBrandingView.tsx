import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SplashMediaItem, SplashMediaType, RestaurantBranch } from '../../types';
import { DEFAULT_BRANCHES } from '../../data/mockData';
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
  MapPin,
  Loader2,
  Check,
  AlertCircle
} from 'lucide-react';
import {
  saveMediaToStorage,
  resolveMediaUrl,
  parseVideoSource,
  ParsedVideoInfo
} from '../../services/mediaStorageService';
import { uploadVideoToCloudinary, uploadImageToCloudinary } from '../../services/cloudinaryService';
import { MapLocationPickerModal, LocationPickerResult } from '../MapLocationPickerModal';
import { AdminThemeColorsView } from './AdminThemeColorsView';
import { compressLogoImage } from '../../utils/imageCompressor';

// Thumbnail component for video / image splash slides with IndexedDB and YouTube resolution
const SplashSlideThumbnail: React.FC<{ slide: SplashMediaItem }> = ({ slide }) => {
  const [resolvedUrl, setResolvedUrl] = useState('');
  const [parsed, setParsed] = useState<ParsedVideoInfo>({ type: 'direct', directUrl: '' });

  useEffect(() => {
    let active = true;
    resolveMediaUrl(slide.mediaUrl).then(url => {
      if (active) {
        setResolvedUrl(url);
        setParsed(parseVideoSource(url));
      }
    });
    return () => {
      active = false;
    };
  }, [slide.mediaUrl]);

  return (
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-neutral-950 shrink-0 border border-neutral-300 dark:border-neutral-700">
      {slide.type === 'video' ? (
        parsed.type === 'youtube' ? (
          <img
            src={`https://img.youtube.com/vi/${parsed.videoId}/hqdefault.jpg`}
            alt={slide.title || 'YouTube Video'}
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <video
              src={resolvedUrl || slide.mediaUrl}
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
              <Play className="w-5 h-5 text-white fill-white" />
            </div>
          </>
        )
      ) : (
        <img
          src={resolvedUrl || slide.mediaUrl}
          alt={slide.title || 'Slide'}
          className="w-full h-full object-cover"
        />
      )}
      <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[9px] font-bold text-white">
        {slide.type === 'video' ? (parsed.type === 'youtube' ? 'YOUTUBE' : 'VIDEO') : 'PICHA'}
      </span>
    </div>
  );
};

// Preset Restaurant Logos
const LOGO_PRESETS = [
  {
    name: 'Kookoos Fried Chicken Badge',
    url: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=200&q=80',
    emoji: '🍗',
    description: 'Kookoos Fried Chicken Emblem'
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
    title: 'Kookoos Crispy Chicken & Combos',
    subtitle: 'Kookoos Fried Chicken - Ladha halisi ya kuku wa kukaanga'
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
    name: 'Kookoos Mwenge HQ Dining Ambiance',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85',
    title: 'Karibu Kookoos - Proudly Tanzanian Fried Chicken',
    subtitle: 'Matawi 8 Dar es Salaam - Mazingira safi, kuku motomoto na huduma ya haraka'
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
    subtitle: 'Zinaambatana na chips freshi za viazi na mchuzi maalum wa Kookoos'
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
  const [brandingSubTab, setBrandingSubTab] = useState<'media' | 'themes'>('media');

  // Logo form state
  const [logoUrlInput, setLogoUrlInput] = useState(appBranding.logoUrl || '');
  const [logoEmojiInput, setLogoEmojiInput] = useState(appBranding.logoEmoji || '🍗');
  const [appNameInput, setAppNameInput] = useState(appBranding.appName || 'Kookoos');
  const [taglineInput, setTaglineInput] = useState(appBranding.tagline || 'Proudly Tanzanian Fried Chicken • Dar es Salaam');

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
  const [slideFitMode, setSlideFitMode] = useState<'fit' | 'cover'>('fit');

  // Media upload & preview states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploadingCloudinary, setIsUploadingCloudinary] = useState(false);
  const [cloudinaryProgress, setCloudinaryProgress] = useState(0);
  const [modalResolvedUrl, setModalResolvedUrl] = useState('');
  const [modalVideoDuration, setModalVideoDuration] = useState<number | null>(null);

  // Sync resolved media URL for modal preview
  useEffect(() => {
    let active = true;
    if (slideMediaUrl) {
      resolveMediaUrl(slideMediaUrl).then(url => {
        if (active) setModalResolvedUrl(url);
      });
    } else {
      setModalResolvedUrl('');
    }
    return () => {
      active = false;
    };
  }, [slideMediaUrl]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Logo Upload from device (auto-compressed to lightweight high-res square avatar)
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      showToast('Ukubwa wa faili usizidi MB 15');
      return;
    }

    try {
      showToast('Inaboresha na kubana picha ya logo...');
      const compressedDataUrl = await compressLogoImage(file, 384, 384, 0.88);
      setLogoUrlInput(compressedDataUrl);
      updateAppBranding({ logoUrl: compressedDataUrl });
      showToast('Logo ya App imepakiwa na kuhifadhiwa kikamilifu! ✅');
    } catch (err) {
      console.warn('Compress logo failed, fallback to reader:', err);
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setLogoUrlInput(dataUrl);
        updateAppBranding({ logoUrl: dataUrl });
        showToast('Logo ya App imepakiwa na kuhifadhiwa! ✅');
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Logo & Brand Info
  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalLogo = logoUrlInput.trim();
    if (finalLogo && finalLogo.startsWith('data:image') && finalLogo.length > 150000) {
      try {
        finalLogo = await compressLogoImage(finalLogo, 384, 384, 0.88);
      } catch {}
    }
    updateAppBranding({
      logoUrl: finalLogo,
      logoEmoji: logoEmojiInput.trim() || '🍗',
      appName: appNameInput.trim() || 'Kookoos',
      tagline: taglineInput.trim() || 'Proudly Tanzanian Fried Chicken • Dar es Salaam'
    });
    showToast('Taarifa za Logo na Brand zimehifadhiwa kikamilifu! ✅');
  };

  // Handle Media File upload for splash screen (Image or Video)
  const handleMediaFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Detect if video or image
    const isVid = file.type.startsWith('video/');
    setSlideType(isVid ? 'video' : 'image');
    setUploadedFile(file);

    if (file.size > 80 * 1024 * 1024) {
      showToast('Ukubwa wa video/picha usizidi MB 80');
      return;
    }

    try {
      // 1. Create immediate object URL for live playback in modal preview
      const previewUrl = URL.createObjectURL(file);
      setModalResolvedUrl(previewUrl);

      // 2. Persist blob safely in IndexedDB (prevents localStorage quota errors)
      const mediaId = `splash-media-${Date.now()}`;
      const storageKey = await saveMediaToStorage(mediaId, file);
      setSlideMediaUrl(storageKey);

      showToast(`Faili la ${isVid ? 'video' : 'picha'} limepakiwa na kuhifadhiwa kikamilifu! ✅ (${(file.size / (1024 * 1024)).toFixed(1)} MB)`);
    } catch (err) {
      console.error('Failed to store media file:', err);
      showToast('Hitilafu katika kupakia faili, tafadhali jaribu tena');
    }
  };

  // Optional direct upload to Cloudinary CDN
  const handleUploadToCloudinaryNow = async () => {
    if (!uploadedFile) return;
    setIsUploadingCloudinary(true);
    setCloudinaryProgress(15);
    try {
      if (slideType === 'video') {
        const res = await uploadVideoToCloudinary(uploadedFile, pct => setCloudinaryProgress(pct));
        if (res.success && res.url) {
          setSlideMediaUrl(res.url);
          setModalResolvedUrl(res.url);
          showToast('Video imepakiwa Cloudinary CDN kikamilifu! 🎬☁️');
        } else {
          showToast(`Cloudinary: ${res.message || 'Imehifadhiwa ndani ya IndexedDB'}`);
        }
      } else {
        const res = await uploadImageToCloudinary(uploadedFile, pct => setCloudinaryProgress(pct));
        if (res.success && res.url) {
          setSlideMediaUrl(res.url);
          setModalResolvedUrl(res.url);
          showToast('Picha imepakiwa Cloudinary CDN kikamilifu! 🖼️☁️');
        } else {
          showToast(`Cloudinary: ${res.message || 'Imehifadhiwa ndani ya kifaa'}`);
        }
      }
    } catch (err) {
      console.warn('Cloudinary upload error:', err);
      showToast('Hitilafu ya Cloudinary');
    } finally {
      setIsUploadingCloudinary(false);
    }
  };

  const handleOpenAddSlide = () => {
    setEditingSlide(null);
    setSlideType('video');
    setSlideMediaUrl(VIDEO_PRESETS[0].url);
    setModalResolvedUrl(VIDEO_PRESETS[0].url);
    setUploadedFile(null);
    setModalVideoDuration(null);
    setSlideTitle('Karibu Kookoos - Fried Chicken');
    setSlideSubtitle('Kuku safi wa kukaanga, chipsi za viazi vya asubuhi, na uletewe popote Dar es Salaam');
    setSlideDuration(6);
    setSlideButtonText('Anza Sasa ➔');
    setSlideFitMode('fit');
    setIsSlideModalOpen(true);
  };

  const handleOpenEditSlide = (slide: SplashMediaItem) => {
    setEditingSlide(slide);
    setSlideType(slide.type);
    setSlideMediaUrl(slide.mediaUrl);
    setModalResolvedUrl(slide.mediaUrl);
    setUploadedFile(null);
    setModalVideoDuration(null);
    setSlideTitle(slide.title || '');
    setSlideSubtitle(slide.subtitle || '');
    setSlideDuration(slide.durationSeconds || 5);
    setSlideButtonText(slide.buttonText || 'Anza Sasa ➔');
    setSlideFitMode(slide.fitMode || 'fit');
    setIsSlideModalOpen(true);
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideMediaUrl.trim()) {
      showToast('Tafadhali weka picha au video URL!');
      return;
    }

    const durationNum = Math.max(2, Number(slideDuration) || 5);

    if (editingSlide) {
      updateSplashSlide(editingSlide.id, {
        type: slideType,
        mediaUrl: slideMediaUrl.trim(),
        title: slideTitle.trim(),
        subtitle: slideSubtitle.trim(),
        durationSeconds: durationNum,
        buttonText: slideButtonText.trim(),
        fitMode: slideFitMode,
        active: true
      });
      showToast('Slide ya Splash Screen imesasishwa! ✅ Bofya "Tazama Splash" kuiona.');
    } else {
      addSplashSlide({
        type: slideType,
        mediaUrl: slideMediaUrl.trim(),
        title: slideTitle.trim(),
        subtitle: slideSubtitle.trim(),
        durationSeconds: durationNum,
        buttonText: slideButtonText.trim(),
        fitMode: slideFitMode,
        active: true
      });
      showToast('Slide mpya ya Splash Screen imeongezwa! 🎉 Bofya "Tazama Splash" kuiona.');
    }

    updateAppBranding({ splashEnabled: true });
    sessionStorage.removeItem('zebra_splash_seen');
    setIsSlideModalOpen(false);
    setUploadedFile(null);
  };

  const handleSetSinglePizzaVideo = () => {
    const slide: SplashMediaItem = {
      id: `splash-${Date.now()}`,
      orderIndex: 0,
      type: 'video',
      mediaUrl: VIDEO_PRESETS[0].url,
      title: 'Kookoos Bomba Box & Fried Chicken',
      subtitle: 'Kookoos - Kuku wa kukaanga aliyekolea vikolezo safi na chipsi za viazi vya asili',
      durationSeconds: 6,
      buttonText: 'Anza Sasa ➔',
      fitMode: 'fit',
      active: true
    };
    updateAppBranding({ splashSlides: [slide], splashEnabled: true });
    showToast('Imewekwa: Slide 1 ya Video ya Kookoos! 🍗🎬');
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
      fitMode: 'fit',
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
      title: 'Karibu Kookoos Dar es Salaam',
      subtitle: 'Mwenge, Sinza, Kariakoo, Tegeta, Kigamboni na Bahari Beach - Huduma bora na kuku mtamu',
      durationSeconds: 5,
      buttonText: 'Fungua Menyu ➔',
      fitMode: 'fit',
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
        fitMode: 'fit',
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
        fitMode: 'fit',
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
        fitMode: 'fit',
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
        ? 'Imewekwa: Single Restaurant (Mteja anabadilisha location yake tuu ya kuletewa chakula, ramani ya matawi imefichwa) 🍽️'
        : 'Imewekwa: Multi-Restaurant (Wateja wanaona na kuchagua matawi yote kwenye ramani) 🌐'
    );
  };

  // Branch management state for Multi-Branch Mode
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isBranchMapPickerOpen, setIsBranchMapPickerOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<RestaurantBranch | null>(null);
  const [branchName, setBranchName] = useState('');
  const [branchArea, setBranchArea] = useState('');
  const [branchAddress, setBranchAddress] = useState('');
  const [branchPhone, setBranchPhone] = useState('');
  const [branchHours, setBranchHours] = useState('10:00 - 00:00');
  const [branchTag, setBranchTag] = useState('');
  const [branchLat, setBranchLat] = useState<number>(-6.7538);
  const [branchLng, setBranchLng] = useState<number>(39.2780);

  const branches = appBranding.branches || DEFAULT_BRANCHES;

  const handleOpenAddBranch = () => {
    setEditingBranch(null);
    setBranchName('');
    setBranchArea('Masaki Peninsula');
    setBranchAddress('');
    setBranchPhone('+255 712 345 678');
    setBranchHours('10:00 - 00:00');
    setBranchTag('Kitchen Hub • Fresh Meals');
    setBranchLat(-6.7538);
    setBranchLng(39.2780);
    setIsBranchModalOpen(true);
  };

  const handleOpenEditBranch = (b: RestaurantBranch) => {
    setEditingBranch(b);
    setBranchName(b.name);
    setBranchArea(b.area);
    setBranchAddress(b.address);
    setBranchPhone(b.phone);
    setBranchHours(b.hours);
    setBranchTag(b.tag || '');
    setBranchLat(b.lat);
    setBranchLng(b.lng);
    setIsBranchModalOpen(true);
  };

  const handleSaveBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchName.trim()) {
      showToast('Tafadhali weka jina la tawi');
      return;
    }

    const currentBranches = appBranding.branches || DEFAULT_BRANCHES;
    let updated: RestaurantBranch[];

    if (editingBranch) {
      updated = currentBranches.map(b =>
        b.id === editingBranch.id
          ? {
              ...b,
              name: branchName.trim(),
              area: branchArea.trim(),
              address: branchAddress.trim(),
              phone: branchPhone.trim(),
              hours: branchHours.trim(),
              tag: branchTag.trim(),
              lat: Number(branchLat) || -6.7538,
              lng: Number(branchLng) || 39.2780
            }
          : b
      );
      showToast(`Tawi "${branchName}" limesasishwa! ✅`);
    } else {
      const newBranch: RestaurantBranch = {
        id: `branch-${Date.now()}`,
        name: branchName.trim(),
        area: branchArea.trim(),
        address: branchAddress.trim(),
        phone: branchPhone.trim(),
        hours: branchHours.trim(),
        tag: branchTag.trim(),
        lat: Number(branchLat) || -6.7538,
        lng: Number(branchLng) || 39.2780,
        active: true
      };
      updated = [...currentBranches, newBranch];
      showToast(`Tawi jipya "${branchName}" limeongezwa! 🎉`);
    }

    updateAppBranding({ branches: updated });
    setIsBranchModalOpen(false);
  };

  const handleDeleteBranch = (id: string) => {
    const currentBranches = appBranding.branches || DEFAULT_BRANCHES;
    const updated = currentBranches.filter(b => b.id !== id);
    updateAppBranding({ branches: updated });
    showToast('Tawi limefutwa! 🗑️');
  };

  const handleToggleBranchActive = (id: string) => {
    const currentBranches = appBranding.branches || DEFAULT_BRANCHES;
    const updated = currentBranches.map(b => (b.id === id ? { ...b, active: !b.active } : b));
    updateAppBranding({ branches: updated });
    showToast('Hali ya tawi imebadilishwa! 🔄');
  };

  const handleResetDefaultBranches = () => {
    updateAppBranding({ branches: DEFAULT_BRANCHES });
    showToast('Matawi 4 ya mfano yamerudishwa! 🏢');
  };

  const handleClearAllBranches = () => {
    updateAppBranding({ branches: [] });
    showToast('Matawi yote yameondolewa! Ramani haitaonekana. 🚫');
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

      {/* Subtab Navigation Pills */}
      <div className="flex items-center space-x-2 p-1.5 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 w-fit">
        <button
          type="button"
          onClick={() => setBrandingSubTab('media')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            brandingSubTab === 'media'
              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
              : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5 text-orange-500" />
          <span>Nembo & Splash Media (Picha & Video)</span>
        </button>

        <button
          type="button"
          onClick={() => setBrandingSubTab('themes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
            brandingSubTab === 'themes'
              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
              : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-amber-500" />
          <span>Rangi & Mandhari ya Mfumo Mzima</span>
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        </button>
      </div>

      {brandingSubTab === 'themes' ? (
        <AdminThemeColorsView />
      ) : (
        <>
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

        {/* Branch Management Subsection (Visible only when Multi-Branch is selected) */}
        {appBranding.restaurantMode === 'multi' ? (
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-extrabold text-sm text-neutral-900 dark:text-white flex items-center space-x-2">
                  <span>🏪 Matawi ya Mgahawa (Live Kitchen Hubs & Branches)</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-bold text-xs">
                    {branches.length} {branches.length === 1 ? 'Tawi' : 'Matawi'}
                  </span>
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Matawi haya ndiyo yanayoonekana kwenye Ramani ya Matawi. Ukiondoa yote, ramani itafichwa kiotomatiki.
                </p>
              </div>

              <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                <button
                  type="button"
                  onClick={handleOpenAddBranch}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-black text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Ongeza Tawi Jipya</span>
                </button>

                {branches.length === 0 ? (
                  <button
                    type="button"
                    onClick={handleResetDefaultBranches}
                    className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold text-xs flex items-center space-x-1 transition-all cursor-pointer"
                    title="Rudisha matawi 4 ya mfano"
                  >
                    <RotateCcw className="w-3 h-3 text-amber-500" />
                    <span>Rudisha Matawi (4)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleClearAllBranches}
                    className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold text-xs flex items-center space-x-1 transition-all cursor-pointer"
                    title="Ondoa matawi yote ili kujaribu mfumo bila matawi"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Ondoa Yote (Jaribu Bila Tawi)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Status Alert for Multi-Branch and Branches count */}
            {branches.length > 0 ? (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-start space-x-2.5 text-xs text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Ramani ya Matawi INAONEKANA kwa wateja!</strong>
                  <p className="text-[11px] opacity-90 mt-0.5">
                    Wateja wataona kitufe cha Ramani ya Matawi kwenye Header, Footer, na sehemu ya Ramani ya Matawi kwenye ukurasa wa mwanzo.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start space-x-2.5 text-xs text-amber-700 dark:text-amber-400">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">HAKUNA TAWI LILILOWEKWA: Ramani ya Matawi IMEFICHWA kwa wateja!</strong>
                  <p className="text-[11px] opacity-90 mt-0.5">
                    Kwa sababu hakuna tawi lililowekwa, wateja hawatoona ramani ya matawi popote kwenye app. Bofya "Ongeza Tawi Jipya" au "Rudisha Matawi (4)" ili ramani ionekane.
                  </p>
                </div>
              </div>
            )}

            {/* List of Branches */}
            {branches.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {branches.map(branch => (
                  <div
                    key={branch.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      branch.active !== false
                        ? 'bg-neutral-50/70 dark:bg-neutral-900/40 border-neutral-200 dark:border-neutral-800'
                        : 'bg-neutral-100/50 dark:bg-neutral-900/10 border-dashed border-neutral-300 dark:border-neutral-700 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-sm text-neutral-900 dark:text-white truncate">
                            {branch.name}
                          </span>
                          {branch.active !== false ? (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-500 uppercase shrink-0">
                              Active
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-neutral-500/20 text-neutral-400 uppercase shrink-0">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                          📍 {branch.address} ({branch.area})
                        </p>
                        <p className="text-[11px] text-neutral-400 truncate">
                          📞 {branch.phone} • ⏱️ {branch.hours}
                        </p>
                        <div className="mt-1 flex items-center space-x-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                          <span>🌐 [{branch.lat.toFixed(4)}, {branch.lng.toFixed(4)}]</span>
                          {branch.tag && <span className="text-neutral-400">• {branch.tag}</span>}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleBranchActive(branch.id)}
                          className={`p-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                            branch.active !== false
                              ? 'border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10'
                              : 'border-neutral-500/30 text-neutral-400 hover:bg-neutral-500/10'
                          }`}
                          title={branch.active !== false ? 'Zima tawi hili' : 'Washa tawi hili'}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditBranch(branch)}
                          className="p-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer"
                          title="Hariri tawi"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBranch(branch.id)}
                          className="p-1.5 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Futa tawi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 flex items-start space-x-2">
              <span className="text-base">🍽️</span>
              <p className="leading-relaxed">
                <strong>Hali ya Single Restaurant inatumika:</strong> Ramani ya matawi imefichwa (haionekani kwa wateja). Wateja wanapewa ramani ya kuchagua au kubadilisha eneo lao la kuletewa chakula (Delivery Location) tu wanapoagiza.
              </p>
            </div>
          </div>
        )}
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
                    <span className="text-4xl">{logoEmojiInput || '🍗'}</span>
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
                  {appNameInput || 'Kookoos'}
                </h4>
                <p className="text-[11px] text-amber-500 font-medium">
                  {taglineInput || 'Proudly Tanzanian Fried Chicken • Dar es Salaam'}
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
                    placeholder="Kookoos"
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
                    placeholder="Proudly Tanzanian Fried Chicken • Dar es Salaam"
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

                  {/* Thumbnail with async resolution */}
                  <SplashSlideThumbnail slide={slide} />

                  {/* Content details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-xs sm:text-sm text-neutral-900 dark:text-white truncate">
                        {slide.title || '(Bila Kichwa cha Habari)'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-500/15 text-orange-500 border border-orange-500/20 shrink-0">
                        ⏱️ {slide.durationSeconds}s
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 shrink-0">
                        {slide.fitMode === 'cover' ? '🗖 Cover' : '⛶ Fit'}
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

                  {/* Preview Splash */}
                  <button
                    type="button"
                    onClick={() => {
                      updateAppBranding({ splashEnabled: true });
                      sessionStorage.removeItem('zebra_splash_seen');
                      setShowSplashPreview(true);
                    }}
                    className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-emerald-500 cursor-pointer"
                    title="Tazama Preview ya Splash Screen Sasa"
                  >
                    <Eye className="w-4 h-4" />
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

              {/* Fitting Mode: Fit (Contain) vs Cover */}
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-bold mb-1.5">
                  Mfumo wa Kufiti Skrini (Screen Fit Mode):
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSlideFitMode('fit')}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                      slideFitMode === 'fit'
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                        : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    <span className="font-extrabold flex items-center space-x-1">
                      <span>⛶</span>
                      <span>Fit (Onyesha Yote)</span>
                    </span>
                    <span className="text-[10px] opacity-85 text-center">Inaonekana yote bila kukatwa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSlideFitMode('cover')}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                      slideFitMode === 'cover'
                        ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-600/20'
                        : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    <span className="font-extrabold flex items-center space-x-1">
                      <span>🗖</span>
                      <span>Cover (Jaza Skrini)</span>
                    </span>
                    <span className="text-[10px] opacity-85 text-center">Inajaza kioo kizima</span>
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
                      ? 'https://mfano.com/video.mp4 au YouTube link'
                      : 'https://images.unsplash.com/...'
                  }
                  className="w-full p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono outline-none focus:border-orange-500"
                  required
                />
              </div>

              {/* Live Preview Player inside Modal */}
              {slideMediaUrl && (
                <div className="rounded-2xl overflow-hidden border border-neutral-300 dark:border-neutral-700 bg-neutral-950 p-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-neutral-300">
                    <span className="font-bold flex items-center space-x-1.5">
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Uhakiki wa Moja kwa Moja (Live Preview):</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                      {slideType === 'video' ? '🎬 VIDEO' : '🖼️ PICHA'}
                    </span>
                  </div>

                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
                    {slideType === 'video' ? (
                      (() => {
                        const parsed = parseVideoSource(modalResolvedUrl || slideMediaUrl);
                        if (parsed.type === 'youtube' || parsed.type === 'vimeo') {
                          return (
                            <iframe
                              src={parsed.embedUrl}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              title="Preview"
                            />
                          );
                        }
                        return (
                          <video
                            key={modalResolvedUrl || slideMediaUrl}
                            src={modalResolvedUrl || slideMediaUrl}
                            controls
                            autoPlay
                            muted
                            playsInline
                            onLoadedMetadata={e => {
                              const dur = e.currentTarget.duration;
                              if (dur && !isNaN(dur) && isFinite(dur)) {
                                setModalVideoDuration(Math.ceil(dur));
                              }
                            }}
                            className="w-full h-full object-contain"
                          />
                        );
                      })()
                    ) : (
                      <img
                        src={modalResolvedUrl || slideMediaUrl}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>

                  {modalVideoDuration && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-neutral-300">
                        ⏱️ Urefu wa video: <strong className="text-emerald-400">{modalVideoDuration}s</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => setSlideDuration(modalVideoDuration)}
                        className="text-[10px] font-bold px-2 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 transition-colors cursor-pointer"
                      >
                        Weka Muda kuwa {modalVideoDuration}s
                      </button>
                    </div>
                  )}

                  {/* Cloudinary upload option if uploaded local file */}
                  {uploadedFile && !slideMediaUrl.startsWith('https://res.cloudinary.com') && (
                    <div className="pt-2 border-t border-neutral-800 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-neutral-400">
                        Faili lipo kwenye Fast Storage. Je, ungependa kupakia Cloudinary CDN?
                      </span>
                      <button
                        type="button"
                        onClick={handleUploadToCloudinaryNow}
                        disabled={isUploadingCloudinary}
                        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold flex items-center space-x-1 cursor-pointer disabled:opacity-50 shrink-0"
                      >
                        {isUploadingCloudinary ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>{cloudinaryProgress}%</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3 h-3" />
                            <span>Pakia Cloudinary CDN</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

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
                    placeholder="Mfano: Karibu Kookoos - Fried Chicken"
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
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <label className="text-neutral-700 dark:text-neutral-300 font-bold">
                      Hakiki Mwonekano Halisi wa Slide:
                    </label>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {slideFitMode === 'fit' ? '⛶ Fit (Hakuna Kinachokatwa)' : '🗖 Cover (Full Bleed)'}
                    </span>
                  </div>
                  <div className="w-full h-40 rounded-2xl overflow-hidden bg-neutral-950 relative border border-neutral-300 dark:border-neutral-700 flex items-center justify-center">
                    {/* Ambient blurred backdrop */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {slideType === 'video' ? (
                        <video
                          src={modalResolvedUrl || slideMediaUrl}
                          className="w-full h-full object-cover blur-md opacity-35 scale-105"
                          muted
                          playsInline
                        />
                      ) : (
                        <img
                          src={modalResolvedUrl || slideMediaUrl}
                          alt=""
                          className="w-full h-full object-cover blur-md opacity-35 scale-105"
                        />
                      )}
                    </div>

                    {slideType === 'video' ? (
                      <video
                        src={modalResolvedUrl || slideMediaUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className={`relative z-10 m-auto transition-all ${
                          slideFitMode === 'cover'
                            ? 'w-full h-full object-cover'
                            : 'w-full h-full max-w-full max-h-full object-contain'
                        }`}
                      />
                    ) : (
                      <img
                        src={modalResolvedUrl || slideMediaUrl}
                        alt="Preview"
                        className={`relative z-10 m-auto transition-all ${
                          slideFitMode === 'cover'
                            ? 'w-full h-full object-cover'
                            : 'w-full h-full max-w-full max-h-full object-contain'
                        }`}
                      />
                    )}

                    {/* Overlay with title, subtitle, and CTA button */}
                    <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-3 pointer-events-none">
                      <p className="font-extrabold text-white text-xs sm:text-sm drop-shadow truncate">
                        {slideTitle || 'Kichwa cha Habari cha Slide'}
                      </p>
                      <p className="text-[10px] text-neutral-300 line-clamp-1 drop-shadow mt-0.5">
                        {slideSubtitle || 'Maelezo mafupi ya slide yataonekana hapa chini...'}
                      </p>
                      <div className="flex items-center space-x-2 pt-2">
                        <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-neutral-950 font-black text-[10px] shadow-sm">
                          {slideButtonText || 'Anza Sasa ➔'}
                        </span>
                        <span className="text-[9px] text-white/60">
                          ⏱️ {slideDuration}s
                        </span>
                      </div>
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

      {/* MODAL: ONGEZA / HARIRI TAWI LA MGAHAWA (ADD / EDIT BRANCH) */}
      {isBranchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-[#151518] rounded-3xl border border-neutral-200 dark:border-neutral-800 p-5 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center space-x-2">
                <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500">
                  <Store className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-extrabold text-base text-neutral-900 dark:text-white">
                    {editingBranch ? 'Hariri Tawi la Mgahawa' : 'Ongeza Tawi Jipya la Mgahawa'}
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Weka taarifa za tawi litakaloonekana kwenye ramani ya matawi
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBranchModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBranch} className="space-y-3.5 text-xs">
              {/* Branch Name */}
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-bold mb-1">
                  Jina la Tawi (Branch Name) *
                </label>
                <input
                  type="text"
                  required
                  value={branchName}
                  onChange={e => setBranchName(e.target.value)}
                  placeholder="Mfano: Kookoos Mwenge HQ"
                  className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Area & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-bold mb-1">
                    Eneo (Area)
                  </label>
                  <input
                    type="text"
                    value={branchArea}
                    onChange={e => setBranchArea(e.target.value)}
                    placeholder="Mfano: Mikocheni A"
                    className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-bold mb-1">
                    Anwani ya Mtaa (Address)
                  </label>
                  <input
                    type="text"
                    value={branchAddress}
                    onChange={e => setBranchAddress(e.target.value)}
                    placeholder="Mfano: Mwai Kibaki Rd, Shoppers"
                    className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Phone & Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-bold mb-1">
                    Namba ya Simu
                  </label>
                  <input
                    type="text"
                    value={branchPhone}
                    onChange={e => setBranchPhone(e.target.value)}
                    placeholder="+255 712 345 678"
                    className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 font-bold mb-1">
                    Masaa ya Kazi (Hours)
                  </label>
                  <input
                    type="text"
                    value={branchHours}
                    onChange={e => setBranchHours(e.target.value)}
                    placeholder="10:00 - 00:00"
                    className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Tag / Category */}
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-bold mb-1">
                  Tag / Sifa Kuu ya Tawi (Optional)
                </label>
                <input
                  type="text"
                  value={branchTag}
                  onChange={e => setBranchTag(e.target.value)}
                  placeholder="Mfano: Woodfired Pizza • BBQ • Family Dining"
                  className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Coordinates (Latitude & Longitude) */}
              <div>
                <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1.5">
                  <label className="text-neutral-700 dark:text-neutral-300 font-bold flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Coordinates za Ramani (GPS Lat / Lng):</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsBranchMapPickerOpen(true)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer"
                    title="Bofya hapa kufungua ramani na kuchagua eneo la tawi moja kwa moja"
                  >
                    <span>🗺️ Chagua Kwenye Ramani</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-neutral-400 block mb-0.5">Latitude (Lat)</span>
                    <input
                      type="number"
                      step="any"
                      value={branchLat}
                      onChange={e => setBranchLat(parseFloat(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block mb-0.5">Longitude (Lng)</span>
                    <input
                      type="number"
                      step="any"
                      value={branchLng}
                      onChange={e => setBranchLng(parseFloat(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Selected Location Indicator Card with Map Trigger */}
                <div className="mt-2 p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 text-xs min-w-0">
                    <span className="text-emerald-500 font-extrabold shrink-0">📍 GPS Pin:</span>
                    <span className="font-mono text-neutral-800 dark:text-neutral-200 font-bold truncate">
                      {branchLat.toFixed(5)}, {branchLng.toFixed(5)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsBranchMapPickerOpen(true)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shrink-0 transition-colors cursor-pointer"
                  >
                    Gusa Kwenye Ramani ➔
                  </button>
                </div>

                {/* Quick Presets for Dar es Salaam Areas */}
                <div className="mt-2.5 flex items-center space-x-1.5 flex-wrap gap-y-1.5">
                  <span className="text-[10px] text-neutral-400 mr-0.5 font-semibold">Maeneo ya Haraka (Dar):</span>
                  {[
                    { name: 'Mwenge HQ', lat: -6.7712, lng: 39.2215 },
                    { name: 'Sinza Mori', lat: -6.7820, lng: 39.2310 },
                    { name: 'Kariakoo', lat: -6.8240, lng: 39.2785 },
                    { name: 'Masaki', lat: -6.7580, lng: 39.2820 },
                    { name: 'Mikocheni', lat: -6.7725, lng: 39.2485 },
                    { name: 'Goba Masana', lat: -6.7450, lng: 39.1850 },
                    { name: 'Tegeta', lat: -6.6850, lng: 39.2010 },
                    { name: 'Kigamboni', lat: -6.8320, lng: 39.3010 },
                    { name: 'Bahari Beach', lat: -6.6620, lng: 39.2130 }
                  ].map(preset => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setBranchLat(preset.lat);
                        setBranchLng(preset.lng);
                        if (!branchArea.trim() || branchArea === 'Masaki Peninsula') {
                          setBranchArea(preset.name);
                        }
                      }}
                      className="px-2 py-0.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-emerald-500/20 hover:text-emerald-400 text-[10px] font-bold text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center space-x-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsBranchModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold cursor-pointer"
                >
                  Ghairi
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-black shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                >
                  {editingBranch ? 'Hifadhi Mabadiliko' : 'Weka Tawi Jipya'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INTERACTIVE MAP LOCATION PICKER MODAL FOR BRANCH PIN */}
      {isBranchMapPickerOpen && (
        <MapLocationPickerModal
          isOpen={isBranchMapPickerOpen}
          onClose={() => setIsBranchMapPickerOpen(false)}
          initialCoords={[branchLat, branchLng]}
          initialAddress={branchAddress || branchArea || 'Kookoos Branch'}
          title="Chagua Eneo la Tawi kwenye Ramani"
          subtitle="Bofya au sogeza alama kuweka tawi lako jipya la Kookoos popote Dar es Salaam"
          isDark={isDark}
          onSelectLocation={(res: LocationPickerResult) => {
            setBranchLat(res.coords[0]);
            setBranchLng(res.coords[1]);
            if (!branchArea.trim() || branchArea === 'Masaki Peninsula') {
              setBranchArea(res.areaName);
            }
            if (!branchAddress.trim()) {
              setBranchAddress(res.address);
            }
            setIsBranchMapPickerOpen(false);
            showToast(`📍 Eneo la tawi limechaguliwa: ${res.areaName} (${res.coords[0].toFixed(4)}, ${res.coords[1].toFixed(4)})`);
          }}
        />
      )}
        </>
      )}
    </div>
  );
};
