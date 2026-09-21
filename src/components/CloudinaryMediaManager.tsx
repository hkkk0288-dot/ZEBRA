import React, { useState } from 'react';
import {
  Cloud,
  ExternalLink,
  CheckCircle,
  Copy,
  Sparkles,
  Zap,
  Sliders,
  ShieldCheck,
  RefreshCw,
  FolderOpen,
  Image as ImageIcon
} from 'lucide-react';
import {
  getCloudinaryConfig,
  saveCloudinaryConfig,
  getOptimizedCloudinaryUrl
} from '../services/cloudinaryService';
import { CloudinaryUploader } from './CloudinaryUploader';
import { useApp } from '../context/AppContext';
import { FoodImage } from './FoodImage';

export const CloudinaryMediaManager: React.FC = () => {
  const { menuItems, updateMenuItem } = useApp();
  const [config, setConfig] = useState(getCloudinaryConfig());
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [sampleUploadedUrl, setSampleUploadedUrl] = useState<string>(
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80'
  );
  const [selectedDishId, setSelectedDishId] = useState<string>(menuItems[0]?.id || '');
  const [activeTransformation, setActiveTransformation] = useState<'normal' | 'thumb' | 'banner' | 'rounded'>('normal');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleApplyToDish = () => {
    if (!selectedDishId || !sampleUploadedUrl) return;
    updateMenuItem(selectedDishId, { image: sampleUploadedUrl });
    alert('Picha imesasishwa kikamilifu kwenye menyu ya mgahawa!');
  };

  // Compute transformation URL preview
  const getTransformedUrl = () => {
    if (activeTransformation === 'thumb') {
      return getOptimizedCloudinaryUrl(sampleUploadedUrl, { width: 250, height: 250, crop: 'thumb' });
    }
    if (activeTransformation === 'banner') {
      return getOptimizedCloudinaryUrl(sampleUploadedUrl, { width: 800, height: 400, crop: 'fill' });
    }
    return sampleUploadedUrl;
  };

  return (
    <div className="space-y-6 text-white">
      {/* Cloudinary Status Hero Card */}
      <div className="p-5 sm:p-6 rounded-3xl border border-[#4863ff]/30 bg-gradient-to-br from-[#1d2757]/80 via-[#121424]/90 to-neutral-900/90 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Cloud className="w-48 h-48 text-[#4863ff]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-[#4863ff] text-white shadow-lg shadow-[#4863ff]/30">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg sm:text-xl font-bold font-display">
                    Cloudinary Console Imeunganishwa
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Active</span>
                  </span>
                </div>
                <p className="text-xs text-neutral-300">
                  Cloud Name rasmi: <strong className="text-white font-mono">{config.cloudName}</strong> • Dynamic Folders: <span className="text-emerald-400">zebra_restaurant</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <a
              href="https://console.cloudinary.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-2xl bg-[#4863ff] hover:bg-[#3448c5] text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-[#4863ff]/25 transition-all"
            >
              <span>Fungua Console (cy4pidvh)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Quick Info Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-neutral-800">
          <div className="bg-black/30 p-2.5 rounded-xl border border-neutral-800">
            <span className="text-[10px] text-neutral-400 block font-medium">Cloud Name</span>
            <span className="text-xs font-mono font-bold text-white flex items-center justify-between">
              <span>{config.cloudName}</span>
              <button
                onClick={() => handleCopy(config.cloudName)}
                className="text-neutral-400 hover:text-white"
                title="Nakili Cloud Name"
              >
                <Copy className="w-3 h-3" />
              </button>
            </span>
          </div>

          <div className="bg-black/30 p-2.5 rounded-xl border border-neutral-800">
            <span className="text-[10px] text-neutral-400 block font-medium">Upload Preset</span>
            <span className="text-xs font-mono font-bold text-amber-400 truncate">
              {config.uploadPreset}
            </span>
          </div>

          <div className="bg-black/30 p-2.5 rounded-xl border border-neutral-800">
            <span className="text-[10px] text-neutral-400 block font-medium">API Upload Endpoint</span>
            <span className="text-[11px] font-mono text-emerald-400 truncate">
              /v1_1/{config.cloudName}/upload
            </span>
          </div>

          <div className="bg-black/30 p-2.5 rounded-xl border border-neutral-800">
            <span className="text-[10px] text-neutral-400 block font-medium">CDN Delivery</span>
            <span className="text-[11px] font-mono text-cyan-400 truncate">
              res.cloudinary.com
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Cloudinary Uploader */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl border border-neutral-800 bg-neutral-900/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Pakia Picha Mpya kwenye Cloudinary</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Buruta picha ya chakula au chagua kutoka kwenye kompyuta/simu yako
                </p>
              </div>
            </div>

            <CloudinaryUploader
              currentImageUrl={sampleUploadedUrl}
              onImageUploaded={(url) => setSampleUploadedUrl(url)}
              label="Chagua au buruta picha ya sahani, pizza au mishkaki"
            />

            {/* Quick Actions for Uploaded Image */}
            {sampleUploadedUrl && (
              <div className="p-3.5 rounded-2xl bg-neutral-800/60 border border-neutral-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-300">
                    Husisha Picha Hii na Sahani kwenye Menyu:
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={selectedDishId}
                    onChange={(e) => setSelectedDishId(e.target.value)}
                    className="flex-1 p-2 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white outline-none"
                  >
                    {menuItems.map((dish) => (
                      <option key={dish.id} value={dish.id}>
                        {dish.name} ({dish.category})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleApplyToDish}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 shrink-0"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Weka kwenye Menyu</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cloudinary Transformations Simulator */}
          <div className="p-5 rounded-3xl border border-neutral-800 bg-neutral-900/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>Cloudinary URL Transformations (On-The-Fly)</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Tazama jinsi Cloudinary inavyobana picha kwa mtandao wa haraka bila kupoteza ubora
                </p>
              </div>
            </div>

            {/* Transformation pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTransformation('normal')}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                  activeTransformation === 'normal'
                    ? 'bg-emerald-500 text-white font-bold'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                Normal Auto-Optimized (q_auto, f_auto)
              </button>
              <button
                onClick={() => setActiveTransformation('thumb')}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                  activeTransformation === 'thumb'
                    ? 'bg-emerald-500 text-white font-bold'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                Square Thumbnail (250x250 c_thumb)
              </button>
              <button
                onClick={() => setActiveTransformation('banner')}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                  activeTransformation === 'banner'
                    ? 'bg-emerald-500 text-white font-bold'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                Wide Hero Banner (800x400 c_fill)
              </button>
            </div>

            {/* Transformed Result Preview */}
            <div className="p-3 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                <span>Transformed CDN Link:</span>
                <button
                  onClick={() => handleCopy(getTransformedUrl())}
                  className="text-emerald-400 hover:underline flex items-center space-x-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedUrl === getTransformedUrl() ? 'Imenakiliwa!' : 'Nakili URL'}</span>
                </button>
              </div>
              <div className="p-2 bg-neutral-900 rounded-lg text-[11px] font-mono text-neutral-300 break-all">
                {getTransformedUrl()}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Preset Guide & Menu Food Images */}
        <div className="lg:col-span-5 space-y-4">
          {/* Step by step guide according to their screenshot */}
          <div className="p-5 rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-neutral-900 to-neutral-900/90 space-y-3">
            <div className="flex items-center space-x-2 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="font-bold text-sm font-display">
                Mwongozo wa Console ya Cloudinary
              </h4>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Kwenye screenshot uliyotuma kutoka <strong>console.cloudinary.com</strong>:
            </p>

            <div className="space-y-2.5 text-xs text-neutral-300">
              <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-black/40 border border-neutral-800">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  ✓
                </span>
                <p>
                  Umeshaweka jina <strong className="text-white font-mono">zebra</strong> na Signing mode kuwa <strong className="text-emerald-400">Unsigned</strong> (kazi nzuri!).
                </p>
              </div>

              <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <p>
                  Bofya kitufe cha bluu cha <strong className="text-white bg-blue-600 px-2 py-0.5 rounded">Save</strong> kilichopo juu kabisa kulia mwa skrini yako ya Cloudinary.
                </p>
              </div>

              <div className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-black/40 border border-neutral-800">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <p>
                  Baada ya kubofya Save, uunganishaji umekamilika 100%! App yetu tayari imewekwa kutumia <strong className="text-emerald-400 font-mono">zebra</strong>.
                </p>
              </div>
            </div>

            <a
              href="https://console.cloudinary.com/settings/cy4pidvh/upload_presets"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white font-bold text-xs flex items-center justify-center space-x-2 border border-neutral-700 transition-colors"
            >
              <span>Fungua Upload Presets Moja kwa Moja</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Current Restaurant Dishes Using CDN */}
          <div className="p-5 rounded-3xl border border-neutral-800 bg-neutral-900/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Picha za Vyakula Menyu ({menuItems.length})
              </h4>
              <span className="text-[11px] text-emerald-400 font-semibold">CDN Ready</span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {menuItems.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-neutral-800/50 border border-neutral-800"
                >
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1 mr-2">
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-neutral-700">
                      <FoodImage
                        src={item.image}
                        alt={item.name}
                        category={item.category}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate">{item.name}</p>
                      <p className="text-[10px] text-neutral-400 font-mono truncate">{item.image}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(item.image)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                    title="Nakili Link ya Picha"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
