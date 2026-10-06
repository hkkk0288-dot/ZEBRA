import React, { useState } from 'react';
import {
  Palette,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Monitor,
  Shield,
  RotateCcw,
  Check,
  Eye,
  Sliders,
  Sun,
  Moon,
  ChevronRight,
  Flame,
  ShoppingBag,
  Home,
  Heart,
  Store,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ThemeColorPreset, AdminThemeStyle } from '../../types';

interface PresetItem {
  key: ThemeColorPreset;
  name: string;
  swahiliName: string;
  emoji: string;
  primary: string;
  secondary: string;
  description: string;
  vibe: string;
}

export const THEME_COLOR_PRESETS: PresetItem[] = [
  {
    key: 'amber',
    name: 'Kookoos Golden Amber',
    swahiliName: 'Dhahabu ya Kookoos (Asili)',
    emoji: '🍗',
    primary: '#f59e0b',
    secondary: '#ea580c',
    description: 'Rangi asili na maarufu ya kuku mtamu wa kukaanga wa Kookoos Dar es Salaam.',
    vibe: 'Kuvutia, Joto, Ladha Halisi'
  },
  {
    key: 'emerald',
    name: 'Safari Fresh Emerald',
    swahiliName: 'Kijani cha Asili (Emerald)',
    emoji: '🌿',
    primary: '#10b981',
    secondary: '#059669',
    description: 'Rangi ya kijani kibichi ya asili, chakula freshi, na uhai.',
    vibe: 'Freshi, Afya, Ya Kisasa'
  },
  {
    key: 'rose',
    name: 'Peri-Peri Hot Ruby',
    swahiliName: 'Nyekundu ya Pilipili (Peri-Peri)',
    emoji: '🌶️',
    primary: '#e11d48',
    secondary: '#be123c',
    description: 'Rangi ya pilipili moto, spicy chicken na mchuzi mkali unaovutia macho.',
    vibe: 'Moto, Nguvu, Njaa ya Haraka'
  },
  {
    key: 'orange',
    name: 'Sunset Crisp Orange',
    swahiliName: 'Machungwa Angavu (Sunset Crisp)',
    emoji: '🍊',
    primary: '#ea580c',
    secondary: '#c2410c',
    description: 'Rangi ya jua linapozama Dar na ukoko wa crispy golden fry.',
    vibe: 'Msisimko, Hamu ya Chakula'
  },
  {
    key: 'blue',
    name: 'Ocean Coastal Blue',
    swahiliName: 'Bluu ya Bahari ya Hindi (Ocean)',
    emoji: '🌊',
    primary: '#0284c7',
    secondary: '#0369a1',
    description: 'Upepo wa fukwe za Masaki Slipway na utulivu wa Bahari ya Hindi.',
    vibe: 'Utulivu, Uaminifu, Hadhi ya Juu'
  },
  {
    key: 'purple',
    name: 'Royal Velvet Purple',
    swahiliName: 'Zambarau ya Kifalme (Royal Velvet)',
    emoji: '👑',
    primary: '#7c3aed',
    secondary: '#6d28d9',
    description: 'Rangi ya anasa, hadhi ya kipekee na ofa maalum za wateja wa VIP.',
    vibe: 'Anasa, Hadhi, Ya Kifahari'
  },
  {
    key: 'teal',
    name: 'Tropical Coastal Teal',
    swahiliName: 'Mwambao wa Tropiki (Teal)',
    emoji: '💎',
    primary: '#0d9488',
    secondary: '#0f766e',
    description: 'Rangi ya kijani-bluu ya fukwe za Bahari Beach na Kigamboni.',
    vibe: 'Upekee, Utulivu, Ya Kipekee'
  },
  {
    key: 'cyan',
    name: 'Tropical Azure Cyan',
    swahiliName: 'Samawati Safi (Azure Cyan)',
    emoji: '🏝️',
    primary: '#06b6d4',
    secondary: '#0891b2',
    description: 'Anga angavu ya joto na mwambao wa Pwani ya Afrika Mashariki.',
    vibe: 'Changamfu, Mwanga, Kisasa'
  },
  {
    key: 'gold',
    name: 'Espresso Caramel Gold',
    swahiliName: 'Caramel & Dhahabu ya Kahawa',
    emoji: '☕',
    primary: '#d97706',
    secondary: '#b45309',
    description: 'Rangi ya kukaangwa kwa kiwango cha juu, caramel na kahawa ya asili.',
    vibe: 'Ubora, Asili, Utulivu'
  },
  {
    key: 'slate',
    name: 'Midnight Obsidian & Crimson',
    swahiliName: 'Usiku wa Kisasa & Crimson',
    emoji: '🖤',
    primary: '#dc2626',
    secondary: '#991b1b',
    description: 'Muundo wa hali ya juu wa usiku, kivuli cha kifahari na mng\'ao thabiti.',
    vibe: 'Bold, Usiku, Ya Kisasa Sana'
  }
];

export const AdminThemeColorsView: React.FC = () => {
  const {
    appBranding,
    updateAppBranding,
    setSystemThemeColor,
    theme,
    toggleTheme
  } = useApp();

  const isDark = theme === 'dark';

  // Current active branding values
  const activeColor = appBranding.themeColor || '#f59e0b';
  const activeSecondary = appBranding.themeSecondaryColor || '#ea580c';
  const activePreset = appBranding.themePreset || 'amber';
  const activeAdminStyle: AdminThemeStyle = appBranding.adminThemeStyle || 'dark';

  // Local draft states
  const [selectedPreset, setSelectedPreset] = useState<ThemeColorPreset>(activePreset);
  const [customPrimary, setCustomPrimary] = useState<string>(activeColor);
  const [customSecondary, setCustomSecondary] = useState<string>(activeSecondary);
  const [adminStyle, setAdminStyle] = useState<AdminThemeStyle>(activeAdminStyle);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'web' | 'admin'>('mobile');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Select a preset
  const handleSelectPreset = (p: PresetItem) => {
    setSelectedPreset(p.key);
    setCustomPrimary(p.primary);
    setCustomSecondary(p.secondary);
    setSystemThemeColor(p.primary, p.key, p.secondary, adminStyle);
    showToast(`Rangi ya mfumo imebadilishwa kuwa: ${p.swahiliName}! 🎉`);
  };

  // Custom primary change
  const handleCustomPrimaryChange = (color: string) => {
    setCustomPrimary(color);
    setSelectedPreset('custom');
    setSystemThemeColor(color, 'custom', customSecondary, adminStyle);
  };

  // Custom secondary change
  const handleCustomSecondaryChange = (color: string) => {
    setCustomSecondary(color);
    setSystemThemeColor(customPrimary, 'custom', color, adminStyle);
  };

  // Apply changes explicitly
  const handleApplyTheme = () => {
    setSystemThemeColor(customPrimary, selectedPreset, customSecondary, adminStyle);
    showToast('Mandhari na rangi zimehifadhiwa kikamilifu kwenye mfumo mzima! 🚀');
  };

  // Reset to default Amber
  const handleResetToDefault = () => {
    const defaultPreset = THEME_COLOR_PRESETS[0];
    setSelectedPreset('amber');
    setCustomPrimary(defaultPreset.primary);
    setCustomSecondary(defaultPreset.secondary);
    setAdminStyle('dark');
    setSystemThemeColor(defaultPreset.primary, 'amber', defaultPreset.secondary, 'dark');
    showToast('Rangi imerudishwa kwenye Kookoos Golden Amber ya asili! 🍗');
  };

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center space-x-2 px-4 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-xs shadow-xl animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span
              className="p-2.5 rounded-2xl text-white shadow-md flex items-center justify-center transition-all"
              style={{ backgroundColor: customPrimary }}
            >
              <Palette className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-black font-display text-neutral-900 dark:text-white">
                Usimamizi wa Rangi & Mandhari ya Mfumo Mzima
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Badilisha muonekano wa simu (Mobile Phone View), tovuti ya kompyuta (Desktop Web View), na Admin Panel.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-2.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95 border border-neutral-300 dark:border-neutral-700"
            title="Rudisha rangi asili ya Kookoos (Amber Gold)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
            <span>Rangi Asili (Amber)</span>
          </button>

          <button
            type="button"
            onClick={handleApplyTheme}
            className="px-4 py-2.5 rounded-2xl text-white font-black text-xs flex items-center space-x-2 shadow-lg transition-all cursor-pointer active:scale-95"
            style={{
              backgroundColor: customPrimary,
              boxShadow: `0 8px 20px -4px ${customPrimary}66`
            }}
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Thibitisha Rangi Hii</span>
          </button>
        </div>
      </div>

      {/* ACTIVE STATUS HIGHLIGHT CARD */}
      <div
        className="p-4 sm:p-5 rounded-3xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        style={{
          backgroundColor: `${customPrimary}12`,
          borderColor: `${customPrimary}40`
        }}
      >
        <div className="flex items-center space-x-3.5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md border-2 border-white/40 shrink-0"
            style={{ backgroundColor: customPrimary }}
          >
            {THEME_COLOR_PRESETS.find(p => p.key === selectedPreset)?.emoji || '🎨'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm text-neutral-900 dark:text-white">
                Rangi Inayofanya Kazi Sasa:
              </span>
              <span
                className="px-2.5 py-0.5 rounded-full text-white font-black text-[10px] uppercase tracking-wider shadow-xs"
                style={{ backgroundColor: customPrimary }}
              >
                {selectedPreset}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-neutral-600 dark:text-neutral-300 font-mono mt-1">
              <span>Kuu (Primary): <strong>{customPrimary.toUpperCase()}</strong></span>
              <span>•</span>
              <span>Msisitizo (Secondary): <strong>{customSecondary.toUpperCase()}</strong></span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <div
            className="px-3 py-1.5 rounded-xl text-white text-xs font-bold flex items-center space-x-1 shadow-sm"
            style={{ backgroundColor: customPrimary }}
          >
            <span>Mfano wa Kitufe (Button)</span>
          </div>
          <div
            className="px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1"
            style={{
              borderColor: customPrimary,
              color: customPrimary,
              backgroundColor: `${customPrimary}15`
            }}
          >
            <span>Mfano wa Beji (Badge)</span>
          </div>
        </div>
      </div>

      {/* SECTION 1: CURATED COLOR PRESETS */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-neutral-900 dark:text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Chagua Rangi Iliyopangwa Kitaalamu (Curated Color Palettes)</span>
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              Bofya rangi yoyote hapa chini kuibadilisha papo hapo kwenye mfumo mzima wa simu na kompyuta.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
            {THEME_COLOR_PRESETS.length} Mandhari
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {THEME_COLOR_PRESETS.map(p => {
            const isCurrent = selectedPreset === p.key;
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 relative group active:scale-98 ${
                  isCurrent
                    ? 'border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-900/60 shadow-md ring-2 ring-neutral-400/40'
                    : 'border-neutral-200 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30 hover:border-neutral-400 dark:hover:border-neutral-700'
                }`}
              >
                {/* Active check icon badge */}
                {isCurrent && (
                  <div
                    className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full text-white flex items-center justify-center text-xs shadow-md"
                    style={{ backgroundColor: p.primary }}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  {/* Color Swatch Circle */}
                  <div className="relative shrink-0">
                    <div
                      className="w-10 h-10 rounded-2xl shadow-md border-2 border-white flex items-center justify-center text-lg"
                      style={{ backgroundColor: p.primary }}
                    >
                      {p.emoji}
                    </div>
                    {/* Secondary accent pip */}
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white absolute -bottom-1 -right-1 shadow-sm"
                      style={{ backgroundColor: p.secondary }}
                      title={`Secondary: ${p.secondary}`}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="font-extrabold text-xs sm:text-sm text-neutral-900 dark:text-white truncate">
                      {p.swahiliName}
                    </h4>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {p.primary} • {p.secondary}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
                  {p.description}
                </p>

                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-neutral-100 dark:border-neutral-800/80">
                  <span className="text-neutral-400">Mtindo: <strong>{p.vibe}</strong></span>
                  <span
                    className="font-bold underline"
                    style={{ color: p.primary }}
                  >
                    {isCurrent ? 'Imechaguliwa ✓' : 'Weka Hii ➔'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: CUSTOM COLOR PICKER STUDIO */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-purple-500/15 text-purple-500">
              <Sliders className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-neutral-900 dark:text-white">
                Studio ya Rangi Maalum (Custom Color Picker)
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Kama una rangi mahususi ya nembo yako (Hex code), ichague moja kwa moja hapa chini.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Primary Color Picker */}
          <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-neutral-900 dark:text-white">
                Rangi Kuu (Primary Brand Color)
              </span>
              <span className="text-[10px] text-neutral-400">Vitufe, Tab amilifu, Mipaka</span>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={customPrimary}
                onChange={e => handleCustomPrimaryChange(e.target.value)}
                className="w-12 h-12 rounded-2xl cursor-pointer border-2 border-neutral-300 dark:border-neutral-700 p-0.5 bg-transparent"
                title="Bofya kuchagua rangi kutoka kwenye palette"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={customPrimary}
                  onChange={e => handleCustomPrimaryChange(e.target.value)}
                  placeholder="#f59e0b"
                  className="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 uppercase focus:outline-none focus:ring-2 focus:ring-amber-500 text-neutral-900 dark:text-white"
                />
              </div>
            </div>
            <p className="text-[10px] text-neutral-400">
              Rangi hii itatumika kwenye vifungo vya kuagiza, nembo, vichwa vya habari na tab za chini za simu.
            </p>
          </div>

          {/* Secondary Color Picker */}
          <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-neutral-900 dark:text-white">
                Rangi ya Pili (Secondary / Accent Color)
              </span>
              <span className="text-[10px] text-neutral-400">Msisitizo, Ofa, Gradients</span>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={customSecondary}
                onChange={e => handleCustomSecondaryChange(e.target.value)}
                className="w-12 h-12 rounded-2xl cursor-pointer border-2 border-neutral-300 dark:border-neutral-700 p-0.5 bg-transparent"
                title="Bofya kuchagua rangi ya msisitizo"
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={customSecondary}
                  onChange={e => handleCustomSecondaryChange(e.target.value)}
                  placeholder="#ea580c"
                  className="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 uppercase focus:outline-none focus:ring-2 focus:ring-amber-500 text-neutral-900 dark:text-white"
                />
              </div>
            </div>
            <p className="text-[10px] text-neutral-400">
              Rangi hii itasaidia kutengeneza gradients na viashiria vya punguzo la bei (Discounts & Badges).
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: ADMIN PANEL TONE & SURFACE STYLING */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-blue-500/15 text-blue-500">
              <Shield className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-neutral-900 dark:text-white">
                Muonekano wa Admin Panel (Admin Panel Appearance)
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Chagua kivuli na mazingira ya jopo la admin kulingana na matakwa yako.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {[
            { id: 'dark' as AdminThemeStyle, name: 'Midnight Charcoal', icon: '🌙', desc: 'Nyeusi ya kawaida (#121215)' },
            { id: 'brand_tint' as AdminThemeStyle, name: 'Brand Tinted Glow', icon: '✨', desc: 'Inachukua mwanga wa rangi ya mgahawa' },
            { id: 'midnight' as AdminThemeStyle, name: 'AMOLED Obsidian', icon: '🖤', desc: 'Nyeusi tii (#09090b)' },
            { id: 'light' as AdminThemeStyle, name: 'Clean Crisp Light', icon: '☀️', desc: 'Muonekano mweupe msafi' }
          ].map(style => {
            const isSel = adminStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => {
                  setAdminStyle(style.id);
                  setSystemThemeColor(customPrimary, selectedPreset, customSecondary, style.id);
                  showToast(`Mtindo wa Admin Panel: ${style.name}`);
                }}
                className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSel
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-sm ring-1 ring-emerald-500/30'
                    : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{style.icon}</span>
                  {isSel && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-neutral-900 dark:text-white">{style.name}</h4>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{style.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: TRIPLE LIVE SIMULATION PREVIEW (MOBILE, WEB, ADMIN) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#151518] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800 gap-2">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-neutral-900 dark:text-white flex items-center space-x-2">
              <Eye className="w-4 h-4 text-emerald-500" />
              <span>Mtazamo wa Moja kwa Moja (Live Simulation Previews)</span>
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Tazama jinsi rangi iliyochaguliwa inavyoonekana kwenye Simu (Mobile), Tovuti (Web), na Jopo la Usimamizi (Admin).
            </p>
          </div>

          {/* Toggle between Mobile, Web, Admin preview */}
          <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shrink-0">
            <button
              type="button"
              onClick={() => setPreviewMode('mobile')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                previewMode === 'mobile'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Simu (Mobile)</span>
            </button>

            <button
              type="button"
              onClick={() => setPreviewMode('web')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                previewMode === 'web'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Tovuti (Desktop Web)</span>
            </button>

            <button
              type="button"
              onClick={() => setPreviewMode('admin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                previewMode === 'admin'
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>

        {/* PREVIEW 1: MOBILE PHONE SIMULATION */}
        {previewMode === 'mobile' && (
          <div className="flex justify-center p-3 sm:p-6 bg-neutral-100 dark:bg-black/60 rounded-3xl border border-neutral-200 dark:border-neutral-800/80">
            <div className="w-[320px] sm:w-[360px] rounded-[40px] bg-[#0f0f12] text-white p-3 border-4 border-neutral-700 shadow-2xl relative overflow-hidden space-y-3">
              {/* Phone punch hole & status bar */}
              <div className="flex items-center justify-between px-3 pt-1 text-[11px] text-neutral-400 select-none">
                <span className="font-bold">19:42</span>
                <div className="w-3 h-3 rounded-full bg-black border border-neutral-800" />
                <span className="font-bold">5G • 94%</span>
              </div>

              {/* Mobile Header */}
              <div className="flex items-center justify-between px-2 py-1">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shadow-md font-bold text-white"
                    style={{ backgroundColor: customPrimary }}
                  >
                    🍗
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-white leading-tight">
                      {appBranding.appName || 'Kookoos'}
                    </h5>
                    <p className="text-[9px] text-neutral-400">Dar es Salaam • Delivery</p>
                  </div>
                </div>

                <div
                  className="px-2 py-1 rounded-xl text-[10px] font-bold text-white shadow-sm"
                  style={{ backgroundColor: customPrimary }}
                >
                  Meza 4
                </div>
              </div>

              {/* Mobile Hero Banner */}
              <div
                className="p-3.5 rounded-2xl text-white relative overflow-hidden shadow-lg space-y-1"
                style={{
                  background: `linear-gradient(135deg, ${customPrimary} 0%, ${customSecondary} 100%)`
                }}
              >
                <span className="px-2 py-0.5 rounded-full bg-black/25 text-white text-[9px] font-black uppercase">
                  OFA MAALUM
                </span>
                <h4 className="font-extrabold text-sm leading-tight">Kookoos Bomba Box</h4>
                <p className="text-[10px] text-white/90">Vipande 3 vya kuku & chipsi moto</p>
              </div>

              {/* Mobile Category Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
                <span
                  className="px-3 py-1 rounded-full text-white font-bold text-[11px] shadow-sm shrink-0"
                  style={{ backgroundColor: customPrimary }}
                >
                  🍗 Kuku Crispy
                </span>
                <span className="px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 text-[11px] shrink-0">
                  🍔 Burgers
                </span>
                <span className="px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 text-[11px] shrink-0">
                  🍟 Chipsi
                </span>
              </div>

              {/* Mobile Food Item Card */}
              <div className="p-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center space-x-2.5">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ backgroundColor: `${customPrimary}20` }}
                >
                  🍗
                </div>
                <div className="flex-1 min-w-0">
                  <h6 className="font-bold text-xs text-white truncate">Kookoos 4-Piece Feast</h6>
                  <p className="text-[10px] font-mono font-bold mt-0.5" style={{ color: customPrimary }}>
                    TZS 18,000
                  </p>
                </div>
                <button
                  type="button"
                  className="px-2.5 py-1.5 rounded-xl text-white font-bold text-[10px] shadow-xs cursor-default"
                  style={{ backgroundColor: customPrimary }}
                >
                  + Weka
                </button>
              </div>

              {/* Mobile Bottom Navigation Bar Simulation */}
              <div className="pt-2">
                <div className="flex items-center justify-around py-2 px-3 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400">
                  <div
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-white font-bold text-[11px] shadow-md"
                    style={{ backgroundColor: customPrimary }}
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Home</span>
                  </div>
                  <Heart className="w-4 h-4 hover:text-white" />
                  <ShoppingBag className="w-4 h-4 hover:text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PREVIEW 2: DESKTOP WEB SIMULATION */}
        {previewMode === 'web' && (
          <div className="p-4 sm:p-6 bg-neutral-100 dark:bg-black/60 rounded-3xl border border-neutral-200 dark:border-neutral-800/80 space-y-3">
            {/* Browser Header Bar */}
            <div className="flex items-center space-x-2 pb-2 border-b border-neutral-200 dark:border-neutral-800">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <div className="text-[11px] font-mono text-neutral-400 ml-2">
                https://kookoos.co.tz/menu
              </div>
            </div>

            {/* Desktop Web Navbar Simulation */}
            <div className="p-3 rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 shadow-md flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg text-white font-bold shadow-md"
                  style={{ backgroundColor: customPrimary }}
                >
                  🍗
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-neutral-900 dark:text-white">
                    {appBranding.appName || 'Kookoos'}
                  </h4>
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.2 rounded"
                    style={{ backgroundColor: `${customPrimary}20`, color: customPrimary }}
                  >
                    DAR ES SALAAM
                  </span>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="hidden sm:flex items-center space-x-2 text-xs">
                <span
                  className="px-3 py-1.5 rounded-xl font-bold"
                  style={{ backgroundColor: `${customPrimary}15`, color: customPrimary }}
                >
                  Menyu Kuu
                </span>
                <span className="px-3 py-1.5 text-neutral-500">Matawi & Ramani</span>
                <span className="px-3 py-1.5 text-neutral-500">Ofa & Zawadi</span>
              </div>

              {/* Cart Button */}
              <div
                className="px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center space-x-2 shadow-md"
                style={{ backgroundColor: customPrimary }}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Kikapu (3) • TZS 26,000</span>
              </div>
            </div>
          </div>
        )}

        {/* PREVIEW 3: ADMIN PANEL SIMULATION */}
        {previewMode === 'admin' && (
          <div className="p-4 sm:p-6 bg-neutral-100 dark:bg-black/60 rounded-3xl border border-neutral-200 dark:border-neutral-800/80">
            <div
              className="p-4 rounded-3xl border shadow-xl flex flex-col md:flex-row gap-4"
              style={{
                backgroundColor: adminStyle === 'midnight' ? '#09090b' : adminStyle === 'brand_tint' ? `${customPrimary}08` : '#121215',
                borderColor: `${customPrimary}30`
              }}
            >
              {/* Mini Admin Sidebar */}
              <div className="w-full md:w-52 p-3 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2 shrink-0">
                <div className="flex items-center space-x-2 pb-2 border-b border-neutral-800">
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center text-xs text-white font-bold"
                    style={{ backgroundColor: customPrimary }}
                  >
                    👑
                  </div>
                  <span className="text-xs font-bold text-white">Admin Console</span>
                </div>

                <div
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl text-white text-xs font-bold shadow-sm"
                  style={{ backgroundColor: customPrimary }}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </div>

                <div className="flex items-center space-x-2 px-3 py-2 rounded-xl text-neutral-400 text-xs">
                  <Store className="w-3.5 h-3.5" />
                  <span>POS Terminal</span>
                </div>

                <div className="flex items-center space-x-2 px-3 py-2 rounded-xl text-neutral-400 text-xs">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Orders (12)</span>
                </div>
              </div>

              {/* Mini Admin Content Area */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-sm text-white">Usimamizi wa Mgahawa</h5>
                    <p className="text-[11px] text-neutral-400">Mapato na takwimu za leo</p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-xl text-white font-bold text-xs"
                    style={{ backgroundColor: customPrimary }}
                  >
                    + Sajili Oda Mpya
                  </span>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                    <span className="text-[10px] text-neutral-400">Mapato ya Leo</span>
                    <h4 className="font-black text-sm text-white mt-0.5" style={{ color: customPrimary }}>
                      TZS 1,420,000
                    </h4>
                  </div>
                  <div className="p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800">
                    <span className="text-[10px] text-neutral-400">Oda Zilizokamilika</span>
                    <h4 className="font-black text-sm text-white mt-0.5">84 Oda</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
