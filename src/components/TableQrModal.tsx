import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { toPng } from 'html-to-image';
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  UtensilsCrossed,
  Sparkles,
  Smartphone,
  Menu,
  ShoppingCart,
  Edit3,
  Eye,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  MapPin,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { RestaurantTable } from '../types';
import { useApp } from '../context/AppContext';

interface TableQrModalProps {
  table: RestaurantTable;
  onClose: () => void;
  onSelectTableForDineIn?: (table: RestaurantTable) => void;
}

export const TableQrModal: React.FC<TableQrModalProps> = ({
  table: initialTable,
  onClose,
  onSelectTableForDineIn
}) => {
  const { tables, setActiveTable, setActiveTab } = useApp();

  // Active table selection (can be switched to other tables without closing)
  const [selectedTable, setSelectedTable] = useState<RestaurantTable>(initialTable);
  const [activeTab, setModalTab] = useState<'preview' | 'edit'>('preview');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  interface FlyerFields {
    tableName: string;
    sectionName: string;
    restaurantName: string;
    restaurantType: string;
    locationText: string;
    taglineLine1: string;
    taglineLine2: string;
    ctaTitle: string;
    ctaSubtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    bottomGreeting: string;
    customUrl: string;
    bgTheme: 'steak_mojito' | 'dark_wood' | 'minimal';
  }

  // Form / Editable fields
  const [fields, setFields] = useState<FlyerFields>({
    tableName: initialTable.name.toUpperCase(),
    sectionName: String(initialTable.section),
    restaurantName: 'Zebra',
    restaurantType: 'Restaurant & Lounge',
    locationText: 'Masaki & Slipway • Dar es Salaam',
    taglineLine1: 'Good Food',
    taglineLine2: 'Good Vibes',
    ctaTitle: 'Changanua Kuagiza',
    ctaSubtitle: 'Chakula na Vinywaji',
    step1Title: '1. Scan',
    step1Desc: 'with your phone camera or Google Lens',
    step2Title: '2. View',
    step2Desc: 'full menu, customize dishes,',
    step3Title: '3. Order',
    step3Desc: 'directly to this table!',
    bottomGreeting: 'Karibu Sana!',
    customUrl: '',
    bgTheme: 'steak_mojito'
  });

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const flyerRef = useRef<HTMLDivElement>(null);

  // When selectedTable changes, update fields
  const handleSwitchTable = (tbl: RestaurantTable) => {
    setSelectedTable(tbl);
    setFields(prev => ({
      ...prev,
      tableName: tbl.name.toUpperCase(),
      sectionName: tbl.section
    }));
  };

  // Generate target table link
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const defaultTableUrl = `${origin}${pathname}?table=${encodeURIComponent(selectedTable.id)}`;
  const effectiveUrl = fields.customUrl.trim() ? fields.customUrl.trim() : defaultTableUrl;

  // Generate high-resolution QR code
  useEffect(() => {
    QRCode.toDataURL(effectiveUrl, {
      width: 650,
      margin: 1,
      color: {
        dark: '#0a0a0b',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR Generation failed:', err));
  }, [effectiveUrl]);

  // Reset fields to default
  const handleReset = () => {
    setFields({
      tableName: selectedTable.name.toUpperCase(),
      sectionName: selectedTable.section,
      restaurantName: 'Zebra',
      restaurantType: 'Restaurant & Lounge',
      locationText: 'Masaki & Slipway • Dar es Salaam',
      taglineLine1: 'Good Food',
      taglineLine2: 'Good Vibes',
      ctaTitle: 'Changanua Kuagiza',
      ctaSubtitle: 'Chakula na Vinywaji',
      step1Title: '1. Scan',
      step1Desc: 'with your phone camera or Google Lens',
      step2Title: '2. View',
      step2Desc: 'full menu, customize dishes,',
      step3Title: '3. Order',
      step3Desc: 'directly to this table!',
      bottomGreeting: 'Karibu Sana!',
      customUrl: '',
      bgTheme: 'steak_mojito'
    });
  };

  // Download FULL flyer as HD PNG
  const handleDownloadFullFlyer = async () => {
    if (!flyerRef.current) return;
    setIsDownloading(true);
    try {
      // Small pause to ensure layout and image rendering is ready
      await new Promise(r => setTimeout(r, 100));

      const dataUrl = await toPng(flyerRef.current, {
        quality: 0.98,
        pixelRatio: 2.5, // Generates high-res image (~1350 x 2025 px)
        cacheBust: true
      });

      const safeName = fields.tableName.replace(/[^a-zA-Z0-9]/g, '_');
      const link = document.createElement('a');
      link.download = `Zebra-${safeName}-Full-Flyer.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to download full flyer:', err);
      // Fallback: download QR only
      handleDownloadQrOnly();
    } finally {
      setIsDownloading(false);
    }
  };

  // Download QR code only
  const handleDownloadQrOnly = () => {
    if (!qrDataUrl) return;
    const safeName = fields.tableName.replace(/[^a-zA-Z0-9]/g, '_');
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `Zebra-QR-${safeName}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Print full flyer
  const handlePrintFull = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(effectiveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestAsCustomer = () => {
    if (onSelectTableForDineIn) {
      onSelectTableForDineIn(selectedTable);
    } else {
      setActiveTable(selectedTable);
      setActiveTab('home');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white dark:bg-[#151518] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden relative my-auto animate-scaleUp flex flex-col max-h-[95vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-100 dark:border-neutral-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                  Kadi ya QR ya Mezani (Table Stand Flyer)
                </h2>
                <span className="text-[11px] bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-full font-bold">
                  {fields.tableName}
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Editi, pakua picha kamili ya HD, au printi kwa ukubwa wa meza (Acrylic Stand / Kadi)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Quick Table Switcher Dropdown */}
            {tables && tables.length > 0 && (
              <div className="relative hidden sm:block">
                <select
                  value={selectedTable.id}
                  onChange={(e) => {
                    const found = tables.find(t => t.id === e.target.value);
                    if (found) handleSwitchTable(found);
                  }}
                  className="text-xs font-bold py-1.5 px-3 pr-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 cursor-pointer appearance-none"
                >
                  {tables.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.section})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector: Preview vs Edit Mode */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setModalTab('preview')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Muonekano wa Flyer (Preview)</span>
            </button>

            <button
              type="button"
              onClick={() => setModalTab('edit')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'edit'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editi Maandishi (Customize)</span>
            </button>
          </div>

          {activeTab === 'preview' && (
            <div className="hidden sm:flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.1))}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-neutral-400 w-10 text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.min(1.3, prev + 0.1))}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeTab === 'edit' ? (
            /* ===================================
               EDIT MODE (Live Customizer)
               =================================== */
            <div className="space-y-5 max-w-2xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Badilisha Maandishi ya Flyer ya Meza
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Maandishi unayobadilisha hapa yataonekana mara moja kwenye flyer na wakati wa kupakua au kuprinti.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Rudisha Awali</span>
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Table Name */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Jina la Meza (Table Name)
                  </label>
                  <input
                    type="text"
                    value={fields.tableName}
                    onChange={e => setFields(prev => ({ ...prev, tableName: e.target.value }))}
                    placeholder="TABLE 06"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-neutral-900 dark:text-white font-bold"
                  />
                </div>

                {/* Section / Area */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Eneo / Section
                  </label>
                  <input
                    type="text"
                    value={fields.sectionName}
                    onChange={e => setFields(prev => ({ ...prev, sectionName: e.target.value }))}
                    placeholder="Garden Terrace"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-neutral-900 dark:text-white"
                  />
                </div>

                {/* Restaurant Name */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Jina la Mgahawa (Brand)
                  </label>
                  <input
                    type="text"
                    value={fields.restaurantName}
                    onChange={e => setFields(prev => ({ ...prev, restaurantName: e.target.value }))}
                    placeholder="Zebra"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-neutral-900 dark:text-white"
                  />
                </div>

                {/* Subtitle / Type */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Aina ya Mgahawa (Subtitle)
                  </label>
                  <input
                    type="text"
                    value={fields.restaurantType}
                    onChange={e => setFields(prev => ({ ...prev, restaurantType: e.target.value }))}
                    placeholder="Restaurant & Lounge"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-neutral-900 dark:text-white"
                  />
                </div>

                {/* Location */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Mahali (Location)
                  </label>
                  <input
                    type="text"
                    value={fields.locationText}
                    onChange={e => setFields(prev => ({ ...prev, locationText: e.target.value }))}
                    placeholder="Masaki & Slipway • Dar es Salaam"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-neutral-900 dark:text-white"
                  />
                </div>

                {/* Slogan */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Kauli Mbiu Mstari 1 (Slogan 1)
                  </label>
                  <input
                    type="text"
                    value={fields.taglineLine1}
                    onChange={e => setFields(prev => ({ ...prev, taglineLine1: e.target.value }))}
                    placeholder="Good Food"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Kauli Mbiu Mstari 2 (Slogan 2)
                  </label>
                  <input
                    type="text"
                    value={fields.taglineLine2}
                    onChange={e => setFields(prev => ({ ...prev, taglineLine2: e.target.value }))}
                    placeholder="Good Vibes"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-neutral-900 dark:text-white"
                  />
                </div>

                {/* Call to action headline */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Kichwa cha Wito (Banner Juu)
                  </label>
                  <input
                    type="text"
                    value={fields.ctaTitle}
                    onChange={e => setFields(prev => ({ ...prev, ctaTitle: e.target.value }))}
                    placeholder="Changanua Kuagiza"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Kichwa cha Wito (Banner Chini)
                  </label>
                  <input
                    type="text"
                    value={fields.ctaSubtitle}
                    onChange={e => setFields(prev => ({ ...prev, ctaSubtitle: e.target.value }))}
                    placeholder="Chakula na Vinywaji"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-neutral-900 dark:text-white"
                  />
                </div>

                {/* Step 1 */}
                <div className="sm:col-span-2 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <span className="text-xs font-bold text-amber-500">Hatua 1 (Step 1)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={fields.step1Title}
                      onChange={e => setFields(prev => ({ ...prev, step1Title: e.target.value }))}
                      placeholder="1. Scan"
                      className="px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                    />
                    <input
                      type="text"
                      value={fields.step1Desc}
                      onChange={e => setFields(prev => ({ ...prev, step1Desc: e.target.value }))}
                      placeholder="with your phone camera or Google Lens"
                      className="px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                    />
                  </div>
                </div>

                {/* Step 2 */}
                <div className="sm:col-span-2 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <span className="text-xs font-bold text-amber-500">Hatua 2 (Step 2)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={fields.step2Title}
                      onChange={e => setFields(prev => ({ ...prev, step2Title: e.target.value }))}
                      placeholder="2. View"
                      className="px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                    />
                    <input
                      type="text"
                      value={fields.step2Desc}
                      onChange={e => setFields(prev => ({ ...prev, step2Desc: e.target.value }))}
                      placeholder="full menu, customize dishes,"
                      className="px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                    />
                  </div>
                </div>

                {/* Step 3 */}
                <div className="sm:col-span-2 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <span className="text-xs font-bold text-amber-500">Hatua 3 (Step 3)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={fields.step3Title}
                      onChange={e => setFields(prev => ({ ...prev, step3Title: e.target.value }))}
                      placeholder="3. Order"
                      className="px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                    />
                    <input
                      type="text"
                      value={fields.step3Desc}
                      onChange={e => setFields(prev => ({ ...prev, step3Desc: e.target.value }))}
                      placeholder="directly to this table!"
                      className="px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
                    />
                  </div>
                </div>

                {/* Bottom Greeting */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Salamu ya Chini (Bottom Greeting)
                  </label>
                  <input
                    type="text"
                    value={fields.bottomGreeting}
                    onChange={e => setFields(prev => ({ ...prev, bottomGreeting: e.target.value }))}
                    placeholder="Karibu Sana!"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-neutral-900 dark:text-white"
                  />
                </div>

                {/* Custom URL */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Link Maalum ya QR (Ikiachwa wazi itatumia link ya meza)
                  </label>
                  <input
                    type="text"
                    value={fields.customUrl}
                    onChange={e => setFields(prev => ({ ...prev, customUrl: e.target.value }))}
                    placeholder={defaultTableUrl}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-neutral-900 dark:text-white font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setModalTab('preview')}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>Angalia Flyer (View Preview)</span>
                </button>
              </div>
            </div>
          ) : (
            /* ===================================
               PREVIEW MODE (Full Visual Flyer)
               =================================== */
            <div className="flex flex-col items-center justify-center">
              {/* Flyer Container: Scaled for screen preview, but full HD for export and print */}
              <div
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'top center'
                }}
                className="transition-transform duration-200 pb-4"
              >
                {/* 
                  THE FULL FLYER POSTER ELEMENT
                  Targeted by id="zebra-full-flyer-printable" for print and toPng export
                */}
                <div
                  id="zebra-full-flyer-printable"
                  ref={flyerRef}
                  className="w-[420px] sm:w-[480px] h-[630px] sm:h-[720px] rounded-3xl relative overflow-hidden shadow-2xl flex flex-col justify-between text-center select-none border-4 border-amber-500/30"
                  style={{
                    backgroundColor: '#121214',
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.7) 100%), url('/table_qr_flyer_bg.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                  {/* Subtle vignette layer to enhance contrast */}
                  <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/60 pointer-events-none" />

                  {/* ================= TOP SECTION ================= */}
                  <div className="relative z-10 pt-5 px-6 flex items-start justify-between">
                    {/* Left: Zebra Mascot + Brand Name */}
                    <div className="flex items-center space-x-3 text-left">
                      {/* Stylized Zebra Mascot SVG */}
                      <div className="w-12 h-12 rounded-2xl bg-white/95 p-1.5 shadow-lg border border-amber-400 flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          {/* Stylized Zebra Head & Stripes */}
                          <path d="M20 75 Q20 30 50 20 Q70 15 80 30 Q85 45 75 60 Q70 70 85 85 L20 85 Z" fill="#ffffff" stroke="#111" strokeWidth="2" />
                          {/* Black Stripes */}
                          <path d="M35 32 L45 38 L38 45" stroke="#111" strokeWidth="4" strokeLinecap="round" fill="none" />
                          <path d="M48 24 L58 34 L50 44" stroke="#111" strokeWidth="4" strokeLinecap="round" fill="none" />
                          <path d="M60 22 L72 32 L64 45" stroke="#111" strokeWidth="4" strokeLinecap="round" fill="none" />
                          <path d="M30 55 L50 56 L40 68" stroke="#111" strokeWidth="4" strokeLinecap="round" fill="none" />
                          <path d="M48 58 L68 60 L58 72" stroke="#111" strokeWidth="4" strokeLinecap="round" fill="none" />
                          <path d="M25 74 L75 75" stroke="#111" strokeWidth="4" strokeLinecap="round" fill="none" />
                          {/* Zebra Eye & Muzzle */}
                          <circle cx="72" cy="38" r="3" fill="#111" />
                          <path d="M80 50 Q88 55 82 62" stroke="#111" strokeWidth="3" fill="none" />
                        </svg>
                      </div>

                      <div>
                        <div className="flex items-baseline space-x-1.5">
                          <span
                            className="text-3xl sm:text-4xl font-black italic tracking-wide text-white"
                            style={{
                              fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
                              textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)'
                            }}
                          >
                            {fields.restaurantName}
                          </span>
                        </div>
                        <p
                          className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-white/95 -mt-1"
                          style={{ textShadow: '0 2px 6px rgba(0,0,0,0.9)' }}
                        >
                          {fields.restaurantType}
                        </p>
                        <p
                          className="text-[10px] text-amber-300 font-semibold flex items-center space-x-1 mt-0.5"
                          style={{ textShadow: '0 2px 5px rgba(0,0,0,0.9)' }}
                        >
                          <MapPin className="w-2.5 h-2.5 text-amber-400 shrink-0 inline mr-0.5" />
                          <span>{fields.locationText}</span>
                        </p>
                      </div>
                    </div>

                    {/* Right: Handwritten Slogan with Sunburst rays */}
                    <div className="relative text-right pt-1">
                      {/* Sunburst spark rays */}
                      <div className="text-amber-400 text-xs font-mono font-bold tracking-widest opacity-90 text-right pr-1">
                        \ | /
                      </div>
                      <div
                        className="font-black text-amber-400 leading-tight transform -rotate-3"
                        style={{
                          fontFamily: "cursive, 'Brush Script MT', sans-serif",
                          fontSize: '18px',
                          textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 0 12px rgba(245,158,11,0.5)'
                        }}
                      >
                        <div>{fields.taglineLine1}</div>
                        <div className="text-amber-300">{fields.taglineLine2}</div>
                      </div>
                      <div className="text-amber-400 text-xs font-mono font-bold tracking-widest opacity-90 text-right pr-1">
                        / | \
                      </div>
                    </div>
                  </div>

                  {/* ================= CENTER SECTION ================= */}
                  <div className="relative z-10 flex flex-col items-center px-4 my-auto">
                    {/* TABLE BADGE (Yellow Capsule Pill) */}
                    <div className="relative mb-3 flex items-center justify-center">
                      {/* Left Sparks */}
                      <span className="text-amber-400 text-base font-black mr-2 select-none">
                        \ | /
                      </span>

                      <div className="bg-amber-400 text-neutral-950 px-6 py-2 rounded-full font-black text-sm sm:text-base tracking-wider uppercase shadow-[0_8px_25px_rgba(245,158,11,0.6)] border-2 border-amber-300 flex items-center space-x-2.5">
                        <UtensilsCrossed className="w-5 h-5 text-neutral-950 stroke-[2.5]" />
                        <span>{fields.tableName}</span>
                        <span className="text-xs font-bold text-neutral-800 normal-case opacity-90">
                          ({fields.sectionName})
                        </span>
                      </div>

                      {/* Right Sparks */}
                      <span className="text-amber-400 text-base font-black ml-2 select-none">
                        \ | /
                      </span>
                    </div>

                    {/* HIGH CONTRAST QR CODE CARD */}
                    <div className="relative p-3.5 bg-white rounded-3xl border-4 border-amber-400 shadow-[0_12px_40px_rgba(0,0,0,0.85)] max-w-[270px] sm:max-w-[290px] aspect-square flex items-center justify-center">
                      {qrDataUrl ? (
                        <img
                          src={qrDataUrl}
                          alt={`QR Code kwa ${fields.tableName}`}
                          className="w-full h-full object-contain rounded-xl"
                          crossOrigin="anonymous"
                        />
                      ) : (
                        <div className="w-56 h-56 flex items-center justify-center">
                          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>

                    {/* CALL TO ACTION BANNER (White Brush Stroke Ribbon) */}
                    <div className="relative mt-3.5 w-full max-w-[360px] sm:max-w-[390px] bg-white text-neutral-900 py-2.5 px-4 rounded-2xl shadow-xl border border-neutral-200">
                      <h4
                        className="font-black text-sm sm:text-base text-neutral-950 tracking-tight"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                      >
                        {fields.ctaTitle}
                      </h4>
                      <p
                        className="font-black text-base sm:text-lg text-emerald-700 leading-none mt-0.5"
                        style={{ fontFamily: "cursive, 'Brush Script MT', sans-serif" }}
                      >
                        {fields.ctaSubtitle}
                      </p>
                    </div>
                  </div>

                  {/* ================= BOTTOM SECTION ================= */}
                  <div className="relative z-10 pb-5 px-4 sm:px-6 space-y-3">
                    {/* 3-STEP INFOGRAPHIC BAR */}
                    <div className="grid grid-cols-3 gap-2 bg-black/60 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 text-white shadow-lg">
                      {/* Step 1 */}
                      <div className="flex items-center space-x-2 text-left">
                        <div className="w-8 h-8 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center shrink-0 shadow-md">
                          <Smartphone className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[11px] text-amber-300 leading-none">
                            {fields.step1Title}
                          </div>
                          <div className="text-[9px] text-neutral-300 leading-tight">
                            {fields.step1Desc}
                          </div>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="flex items-center space-x-2 text-left border-l border-white/15 pl-2">
                        <div className="w-8 h-8 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center shrink-0 shadow-md">
                          <Menu className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[11px] text-amber-300 leading-none">
                            {fields.step2Title}
                          </div>
                          <div className="text-[9px] text-neutral-300 leading-tight">
                            {fields.step2Desc}
                          </div>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="flex items-center space-x-2 text-left border-l border-white/15 pl-2">
                        <div className="w-8 h-8 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center shrink-0 shadow-md">
                          <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        <div>
                          <div className="font-extrabold text-[11px] text-amber-300 leading-none">
                            {fields.step3Title}
                          </div>
                          <div className="text-[9px] text-neutral-300 leading-tight">
                            {fields.step3Desc}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* VIBRANT GREEN BOTTOM BANNER (Karibu Sana!) */}
                    <div className="relative inline-flex items-center justify-center">
                      <span className="text-amber-400 text-sm font-bold mr-2 select-none">
                        \ | /
                      </span>
                      <div className="bg-emerald-600 text-white px-7 py-2 rounded-full font-black text-sm sm:text-base tracking-wide shadow-[0_6px_20px_rgba(5,150,105,0.7)] border-2 border-emerald-400 flex items-center space-x-1.5">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span style={{ fontFamily: "cursive, 'Brush Script MT', sans-serif" }}>
                          {fields.bottomGreeting}
                        </span>
                      </div>
                      <span className="text-amber-400 text-sm font-bold ml-2 select-none">
                        / | \
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions Bar */}
        <div className="p-4 sm:p-5 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/70 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Link box */}
          <div className="w-full sm:w-auto flex items-center space-x-2 text-xs font-mono bg-white dark:bg-neutral-800 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 max-w-sm overflow-hidden">
            <span className="text-neutral-400 truncate flex-1">{effectiveUrl}</span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="text-amber-600 dark:text-amber-400 hover:underline font-bold shrink-0 cursor-pointer"
            >
              {copied ? '✓ Inakiliwa' : 'Nakili'}
            </button>
          </div>

          {/* Action buttons */}
          <div className="w-full sm:w-auto flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleTestAsCustomer}
              className="py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
              <span>Jaribu Kama Mteja</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadQrOnly}
              className="py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
              title="Pakua QR Code Pekee bila flyer"
            >
              <Download className="w-3.5 h-3.5 text-neutral-500" />
              <span>QR Pekee</span>
            </button>

            {/* DOWNLOAD FULL FLYER */}
            <button
              type="button"
              onClick={handleDownloadFullFlyer}
              disabled={isDownloading}
              className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-amber-500/25 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>{isDownloading ? 'Inaandaa HD...' : downloadSuccess ? '✓ Imepakuliwa!' : 'Pakua Flyer Nzima (HD)'}</span>
            </button>

            {/* PRINT FULL FLYER */}
            <button
              type="button"
              onClick={handlePrintFull}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4 stroke-[2.5]" />
              <span>Printi Flyer Kamili</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
