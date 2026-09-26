import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    // Check if already in standalone PWA mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    // Also show banner initially after 3 seconds for easy install discoverability
    const timer = setTimeout(() => {
      if (!isStandalone) {
        setShowBanner(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setShowInstallGuide(true);
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
      setShowBanner(false);
    } catch {
      setShowInstallGuide(true);
    }
  };

  if (isInstalled || !showBanner) return null;

  return (
    <>
      <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 animate-bounce-once">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-3.5 rounded-2xl shadow-2xl border border-emerald-400/40 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 text-xl border border-white/30">
              🦓
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <h4 className="font-bold text-xs sm:text-sm truncate">Sakinisha Zebra App (PWA)</h4>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-neutral-950 font-black text-[9px]">
                  PWA
                </span>
              </div>
              <p className="text-[11px] text-emerald-100 truncate">
                Agiza haraka bila intaneti & pokea taarifa za oda
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded-xl bg-white text-emerald-900 font-extrabold text-xs shadow-md hover:bg-emerald-50 active:scale-95 transition-all flex items-center space-x-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
            <button
              type="button"
              onClick={() => setShowBanner(false)}
              className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Funga"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Instructional Guide Modal for Browsers without direct Prompt */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-white dark:bg-[#121824] rounded-3xl p-5 text-neutral-900 dark:text-white space-y-4 shadow-2xl border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-sm">Jinsi ya Kusakinisha App (PWA)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInstallGuide(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs space-y-2.5 text-neutral-600 dark:text-neutral-300">
              <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 space-y-1">
                <span className="font-bold text-emerald-500">Kwenye Chrome au Android:</span>
                <p>Bonyeza mistari mitatu (⋮) juu kulia ya browser kisha chagua <strong>&quot;Install app&quot;</strong> au <strong>&quot;Add to Home screen&quot;</strong>.</p>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 space-y-1">
                <span className="font-bold text-emerald-500">Kwenye iPhone / Safari:</span>
                <p>Bonyeza kitufe cha Share (alama ya sanduku lenye mshale unaoelekea juu) kisha chagua <strong>&quot;Add to Home Screen&quot;</strong>.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowInstallGuide(false)}
              className="w-full py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs"
            >
              Nimeelewa
            </button>
          </div>
        </div>
      )}
    </>
  );
};
