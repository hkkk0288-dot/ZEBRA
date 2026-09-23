import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  UtensilsCrossed,
  Sparkles,
  CheckCircle2,
  Users,
  Bell,
  ArrowRight,
  MapPin,
  QrCode,
  Camera,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import jsQR from 'jsqr';
import { RestaurantTable } from '../types';
import { playScanSuccessSound } from '../utils/soundEffects';

interface CustomerTableModalProps {
  tables: RestaurantTable[];
  activeTable: RestaurantTable | null;
  onSelectTable: (table: RestaurantTable) => void;
  onClearTable: () => void;
  onClose: () => void;
  onCallWaiter?: (tableNumber: string, reason: string) => void;
}

export const CustomerTableModal: React.FC<CustomerTableModalProps> = ({
  tables,
  activeTable,
  onSelectTable,
  onClearTable,
  onClose,
  onCallWaiter
}) => {
  const [modalMode, setModalMode] = useState<'camera' | 'manual'>('camera');
  const [selectedSection, setSelectedSection] = useState<'All' | 'Indoor' | 'Garden Terrace' | 'VIP Lounge'>('All');
  const [callNotice, setCallNotice] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const filteredTables = tables.filter(t => {
    if (selectedSection === 'All') return true;
    return t.section === selectedSection;
  });

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  const startCamera = async () => {
    stopCamera();
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Kifaa hiki hakiruhusu kamera ya moja kwa moja. Tafadhali chagua namba ya meza hapa chini.');
      setModalMode('manual');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play().catch(() => {});
        setScanning(true);
        scanFrame();
      }
    } catch (err: unknown) {
      console.warn('Camera access denied or failed:', err);
      setCameraError('Ruhusa ya kamera haijapatikana au kifaa hakina kamera inayopatikana. Unaweza kuchagua namba ya meza yako kwa urahisi hapa chini.');
      setModalMode('manual');
    }
  };

  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current) {
      animationFrameRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code && code.data) {
        const raw = code.data.toLowerCase();
        let matchedTable: RestaurantTable | undefined;

        // Try query param ?table=xxx
        try {
          const url = new URL(code.data);
          const tableParam = url.searchParams.get('table');
          if (tableParam) {
            matchedTable = tables.find(
              t => t.id.toLowerCase() === tableParam.toLowerCase() || t.name.toLowerCase() === tableParam.toLowerCase()
            );
          }
        } catch {
          // not a full URL, parse directly
        }

        if (!matchedTable) {
          matchedTable = tables.find(
            t => raw.includes(t.id.toLowerCase()) || raw.includes(t.name.toLowerCase())
          );
        }

        if (matchedTable) {
          playScanSuccessSound();
          stopCamera();
          onSelectTable(matchedTable);
          onClose();
          return;
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanFrame);
  };

  useEffect(() => {
    if (modalMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [modalMode, facingMode]);

  const handleCall = (reason: string) => {
    if (!activeTable) return;
    if (onCallWaiter) {
      onCallWaiter(activeTable.name, reason);
    }
    setCallNotice(`Mhudumu ametaarifiwa kwa ajili ya "${reason}" kwenye ${activeTable.name}!`);
    setTimeout(() => setCallNotice(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-[#151518] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden relative my-auto animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
                <span>Huduma ya Mezani (Dine-In QR)</span>
              </h2>
              <p className="text-xs text-neutral-500">
                Changanua QR code mezani au chagua namba ya meza yako
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Camera Live vs Manual Selection */}
        <div className="p-3 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setModalMode('camera')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              modalMode === 'camera'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>📷 Changanua QR (Camera Live)</span>
          </button>

          <button
            type="button"
            onClick={() => setModalMode('manual')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              modalMode === 'manual'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>🪑 Chagua Meza Yako</span>
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Active Table Status If Already Seated */}
          {activeTable && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-sm">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-xs text-neutral-900 dark:text-white">
                    Umeketi: {activeTable.name} ({activeTable.section})
                  </h4>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Oda zako zitaletwa mezani kwako bila tozo ya delivery!
                  </p>
                </div>
              </div>

              <button
                onClick={onClearTable}
                className="text-xs text-rose-500 hover:text-rose-600 font-bold px-2 py-1 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                Ondoka
              </button>
            </div>
          )}

          {/* Call Waiter Quick Actions if at Table */}
          {activeTable && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-neutral-500 flex items-center space-x-1">
                <Bell className="w-3.5 h-3.5 text-amber-500" />
                <span>Huduma ya Haraka kwa Meza {activeTable.name}:</span>
              </span>

              {callNotice && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                  {callNotice}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleCall('Mhudumu anahitajika')}
                  className="py-2 px-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 hover:bg-emerald-500 hover:text-white text-xs font-bold transition-all text-center cursor-pointer"
                >
                  🙋 Mhudumu
                </button>
                <button
                  type="button"
                  onClick={() => handleCall('Maji au Kinywaji')}
                  className="py-2 px-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 hover:bg-emerald-500 hover:text-white text-xs font-bold transition-all text-center cursor-pointer"
                >
                  💧 Maji / Drinks
                </button>
                <button
                  type="button"
                  onClick={() => handleCall('Bili ya Malipo')}
                  className="py-2 px-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 hover:bg-emerald-500 hover:text-white text-xs font-bold transition-all text-center cursor-pointer"
                >
                  🧾 Lete Bili
                </button>
              </div>
            </div>
          )}

          {/* Mode 1: Live In-App Camera QR Scanner */}
          {modalMode === 'camera' && (
            <div className="space-y-3">
              <div className="relative rounded-3xl overflow-hidden bg-black aspect-square max-h-[300px] mx-auto border-2 border-emerald-500/40 shadow-inner flex items-center justify-center">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Laser scan line overlay */}
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                  <div className="w-56 h-56 border-2 border-emerald-400 rounded-3xl relative shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />
                    
                    {/* Animated scanning laser */}
                    <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_10px_#10b981] animate-bounce mt-24 opacity-80" />
                  </div>
                </div>

                {/* Camera Flip Button */}
                <button
                  type="button"
                  onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')}
                  className="absolute bottom-3 right-3 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors backdrop-blur-xs cursor-pointer"
                  title="Geuza Kamera"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  Elekeza kamera kwenye QR Code ya meza yako
                </p>
                <p className="text-[11px] text-neutral-500">
                  Mfumo utagundua meza moja kwa moja na kukupakia mezani
                </p>
              </div>

              {cameraError && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}
            </div>
          )}

          {/* Mode 2: Manual Table Selection Grid */}
          {modalMode === 'manual' && (
            <div className="space-y-3">
              {/* Section filter tabs */}
              <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
                {(['All', 'Indoor', 'Garden Terrace', 'VIP Lounge'] as const).map(sec => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setSelectedSection(sec)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      selectedSection === sec
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    {sec === 'All' ? 'Meza Zote' : sec}
                  </button>
                ))}
              </div>

              {/* Grid of Tables */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
                {filteredTables.map(t => {
                  const isSelected = activeTable?.id === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        stopCamera();
                        playScanSuccessSound();
                        onSelectTable(t);
                        onClose();
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all relative group cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20 shadow-sm'
                          : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 hover:border-emerald-500/40 hover:bg-neutral-100 dark:hover:bg-neutral-800/80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-xs text-neutral-900 dark:text-white">
                          {t.name}
                        </span>
                        <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-[10px] text-neutral-600 dark:text-neutral-300">
                          {t.capacity}👥
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-neutral-500 truncate max-w-[85px]">
                          {t.section}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded-full font-bold ${
                          t.status === 'occupied'
                            ? 'bg-amber-500/20 text-amber-600'
                            : 'bg-emerald-500/20 text-emerald-600'
                        }`}>
                          {t.status === 'occupied' ? 'Kuna Watu' : 'Wazi'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between">
          <p className="text-[11px] text-neutral-500">
            Zebra Masaki Peninsula • Toure Drive
          </p>
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            Funga
          </button>
        </div>

      </div>
    </div>
  );
};
