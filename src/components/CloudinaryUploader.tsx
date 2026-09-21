import React, { useState, useRef } from 'react';
import {
  Cloud,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Settings,
  Image as ImageIcon,
  Loader2,
  Trash2,
  Sparkles
} from 'lucide-react';
import {
  getCloudinaryConfig,
  saveCloudinaryConfig,
  uploadImageToCloudinary,
  UploadResult
} from '../services/cloudinaryService';

interface CloudinaryUploaderProps {
  onImageUploaded?: (url: string) => void;
  currentImageUrl?: string;
  label?: string;
  folder?: string;
}

export const CloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({
  onImageUploaded,
  currentImageUrl,
  label = 'Pakia Picha kupitia Cloudinary',
  folder = 'zebra_restaurant'
}) => {
  const [config, setConfig] = useState(getCloudinaryConfig());
  const [showSettings, setShowSettings] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || '');
  const [uploadStatus, setUploadStatus] = useState<UploadResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Editable config fields
  const [cloudNameInput, setCloudNameInput] = useState(config.cloudName);
  const [presetInput, setPresetInput] = useState(config.uploadPreset);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveCloudinaryConfig({
      cloudName: cloudNameInput.trim() || 'cy4pidvh',
      uploadPreset: presetInput.trim() || 'zebra',
      folder
    });
    setConfig(updated);
    setShowSettings(false);
  };

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Tafadhali chagua faili la picha (JPEG, PNG, WEBP).');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    setUploadStatus(null);

    try {
      const result = await uploadImageToCloudinary(file, (progress) => {
        setUploadProgress(progress);
      });

      setUploadStatus(result);
      if (result.url) {
        setPreviewUrl(result.url);
        if (onImageUploaded) {
          onImageUploaded(result.url);
        }
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const copyToClipboard = () => {
    if (!previewUrl) return;
    navigator.clipboard.writeText(previewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearImage = () => {
    setPreviewUrl('');
    setUploadStatus(null);
    if (onImageUploaded) {
      onImageUploaded('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-700 bg-neutral-900/90 p-4 space-y-3 text-white">
      {/* Header with Cloudinary Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-[#3448c5]/20 text-[#4863ff] border border-[#4863ff]/30">
            <Cloud className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold flex items-center space-x-1.5">
              <span>Cloudinary CDN</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-semibold">
                cy4pidvh
              </span>
            </span>
            <p className="text-[10px] text-neutral-400">{label}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Cloudinary Settings"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
          <a
            href="https://console.cloudinary.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Fungua Console ya Cloudinary"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Cloudinary Settings Drawer (if toggled) */}
      {showSettings && (
        <form
          onSubmit={handleSaveSettings}
          className="p-3 rounded-xl bg-neutral-800/80 border border-neutral-700 space-y-2.5 text-xs"
        >
          <div className="flex items-center justify-between text-neutral-300">
            <span className="font-semibold text-[11px] uppercase tracking-wider text-emerald-400">
              Cloudinary Account Config
            </span>
            <span className="text-[10px] text-neutral-400">Console: cy4pidvh</span>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-neutral-400 block">Cloud Name</label>
            <input
              type="text"
              value={cloudNameInput}
              onChange={(e) => setCloudNameInput(e.target.value)}
              className="w-full p-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-mono text-xs outline-none focus:border-emerald-500"
              placeholder="cy4pidvh"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-neutral-400 block">
              Upload Preset Name (Signed au Unsigned)
            </label>
            <input
              type="text"
              value={presetInput}
              onChange={(e) => setPresetInput(e.target.value)}
              className="w-full p-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-mono text-xs outline-none focus:border-emerald-500"
              placeholder="zebra"
            />
            <p className="text-[10px] text-neutral-400">
              Ushauri: Kwenye Cloudinary console, unaweza kubofya <strong>+ Add Upload Preset</strong> na kuweka Signing Mode kuwa <strong>Unsigned</strong> kwa ajili ya direct upload.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-1.5 rounded-lg text-xs"
          >
            Hifadhi Mipangilio
          </button>
        </form>
      )}

      {/* Upload Drag & Drop Zone */}
      {!previewUrl ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-emerald-500 bg-emerald-500/10'
              : 'border-neutral-700 hover:border-neutral-500 bg-neutral-800/40 hover:bg-neutral-800/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {isUploading ? (
            <div className="py-4 space-y-2">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
              <p className="text-xs font-bold text-neutral-200">
                Inapakia kwenye Cloudinary ({config.cloudName})... {uploadProgress}%
              </p>
              <div className="w-48 mx-auto h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-neutral-800 text-emerald-400 flex items-center justify-center mx-auto">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-200">
                  Bofya hapa au buruta (Drag & Drop) picha ya chakula
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Itapakiwa moja kwa moja kwenye Cloudinary (PNG, JPG, WEBP)
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Preview & Details Area */
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden border border-neutral-700 bg-neutral-950 aspect-video max-h-48 flex items-center justify-center">
            <img
              src={previewUrl}
              alt="Cloudinary Upload Preview"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-red-600 text-white transition-colors"
              title="Ondoa picha"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Cloudinary cy4pidvh</span>
            </div>
          </div>

          {/* URL Bar & Copy */}
          <div className="flex items-center space-x-2 bg-neutral-800/80 p-2 rounded-xl border border-neutral-700 text-xs">
            <div className="p-1 text-emerald-400">
              <ImageIcon className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              readOnly
              value={previewUrl}
              className="bg-transparent border-none outline-none flex-1 text-[11px] text-neutral-300 font-mono truncate"
            />
            <button
              type="button"
              onClick={copyToClipboard}
              className="px-2.5 py-1 rounded-lg bg-neutral-700 hover:bg-neutral-600 text-white text-[11px] font-medium flex items-center space-x-1"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  <span>Imenakiliwa!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Nakili</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Upload Feedback Note */}
      {uploadStatus && (
        <div
          className={`p-2.5 rounded-xl text-[11px] flex items-start space-x-2 ${
            uploadStatus.isFallback
              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
              : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
          }`}
        >
          {uploadStatus.isFallback ? (
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          ) : (
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
          )}
          <div className="flex-1">
            <p className="font-semibold">{uploadStatus.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};
