import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SplashMediaItem } from '../types';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Loader2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { resolveMediaUrl, parseVideoSource, ParsedVideoInfo } from '../services/mediaStorageService';

interface SplashScreenProps {
  onFinish?: () => void;
  isPreview?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, isPreview = false }) => {
  const { appBranding, showSplashPreview, setShowSplashPreview } = useApp();
  const activeSlides = appBranding.splashSlides.filter(s => s.active);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [resolvedMediaUrl, setResolvedMediaUrl] = useState<string>('');
  const [parsedVideo, setParsedVideo] = useState<ParsedVideoInfo>({ type: 'direct', directUrl: '' });
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<any>(null);
  const startTimeRef = useRef<number>(Date.now());

  const currentSlide: SplashMediaItem | undefined = activeSlides[currentIndex] || activeSlides[0];

  // User media fitting toggle: default to slide's fitMode or 'fit' so everything fits nicely without cutting off
  const [mediaFit, setMediaFit] = useState<'fit' | 'cover'>(currentSlide?.fitMode || 'fit');

  useEffect(() => {
    if (currentSlide?.fitMode) {
      setMediaFit(currentSlide.fitMode);
    }
  }, [currentSlide?.id, currentSlide?.fitMode]);

  // Resolve media URL (handles IndexedDB idb: references, base64 blobs, or external URLs)
  useEffect(() => {
    let isMounted = true;
    if (!currentSlide) return;

    setVideoError(false);
    setVideoDuration(null);
    if (currentSlide.type === 'video') {
      setIsVideoLoading(true);
    }

    resolveMediaUrl(currentSlide.mediaUrl)
      .then(url => {
        if (!isMounted) return;
        setResolvedMediaUrl(url);
        const parsed = parseVideoSource(url);
        setParsedVideo(parsed);
      })
      .catch(err => {
        console.warn('Failed to resolve splash media:', err);
        if (!isMounted) return;
        setResolvedMediaUrl(currentSlide.mediaUrl);
        setParsedVideo(parseVideoSource(currentSlide.mediaUrl));
      });

    return () => {
      isMounted = false;
    };
  }, [currentSlide?.id, currentSlide?.mediaUrl, currentSlide?.type]);

  // Handle Autoplay & Browser Permission for Video
  useEffect(() => {
    if (currentSlide?.type === 'video' && parsedVideo.type === 'direct' && videoRef.current && resolvedMediaUrl) {
      const video = videoRef.current;
      video.muted = isMuted;
      video.defaultMuted = isMuted;
      video.playsInline = true;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsVideoLoading(false);
            setVideoError(false);
          })
          .catch(err => {
            console.warn('Autoplay with sound was blocked, retrying muted:', err);
            video.muted = true;
            setIsMuted(true);
            video.play()
              .then(() => {
                setIsVideoLoading(false);
                setVideoError(false);
              })
              .catch(retryErr => {
                console.warn('Video playback failed completely:', retryErr);
              });
          });
      }
    }
  }, [resolvedMediaUrl, isMuted, currentSlide?.type, currentIndex, parsedVideo.type]);

  const handleComplete = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (isPreview) {
        setShowSplashPreview(false);
      } else {
        sessionStorage.setItem('zebra_splash_seen', 'true');
        if (onFinish) onFinish();
      }
    }, 350);
  };

  const handleNext = () => {
    if (currentIndex < activeSlides.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
      startTimeRef.current = Date.now();
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
      startTimeRef.current = Date.now();
    }
  };

  const toggleAudio = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      if (!nextMuted) {
        videoRef.current.volume = 1.0;
        videoRef.current.play().catch(() => {});
      }
    }
  };

  // Slide duration and progress ticker
  useEffect(() => {
    if (!currentSlide) return;

    setProgress(0);
    startTimeRef.current = Date.now();

    let effectiveSeconds = currentSlide.durationSeconds || 5;
    if (currentSlide.type === 'video' && videoDuration && videoDuration > 2) {
      effectiveSeconds = Math.min(25, Math.max(effectiveSeconds, Math.ceil(videoDuration)));
    }

    const durationMs = Math.max(2, effectiveSeconds) * 1000;
    const intervalMs = 50;

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentPct = Math.min(100, (elapsed / durationMs) * 100);
      setProgress(currentPct);

      if (elapsed >= durationMs) {
        clearInterval(timerRef.current);
        handleNext();
      }
    }, intervalMs);

    return () => {
      clearInterval(timerRef.current);
    };
  }, [currentIndex, currentSlide?.id, videoDuration]);

  if (!currentSlide || activeSlides.length === 0) {
    return null;
  }

  const mediaSource = resolvedMediaUrl || currentSlide.mediaUrl;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-neutral-950 text-white flex flex-col justify-between transition-opacity duration-300 select-none ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 1. Ambient Background Layer (Blurred duplicate so no harsh borders on any aspect ratio) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {currentSlide.type === 'video' ? (
          <video
            key={`ambient-${mediaSource}`}
            src={mediaSource}
            autoPlay
            muted
            playsInline
            loop
            className="w-full h-full object-cover blur-2xl opacity-35 scale-110"
          />
        ) : (
          <img
            key={`ambient-${mediaSource}`}
            src={mediaSource}
            alt=""
            className="w-full h-full object-cover blur-2xl opacity-35 scale-110"
          />
        )}
        <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-xs" />
      </div>

      {/* 2. Main Foreground Media Layer (Fits 100% cleanly without cutting off in 'fit' mode, or full-bleed in 'cover') */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
        {currentSlide.type === 'video' ? (
          parsedVideo.type === 'youtube' ? (
            <div className="w-full h-full max-w-4xl max-h-[85vh] p-2 sm:p-4 flex items-center justify-center">
              <iframe
                key={parsedVideo.embedUrl}
                src={parsedVideo.embedUrl}
                className="w-full aspect-video rounded-2xl shadow-2xl border border-white/10"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={currentSlide.title || 'Video'}
              />
            </div>
          ) : parsedVideo.type === 'vimeo' ? (
            <div className="w-full h-full max-w-4xl max-h-[85vh] p-2 sm:p-4 flex items-center justify-center">
              <iframe
                key={parsedVideo.embedUrl}
                src={parsedVideo.embedUrl}
                className="w-full aspect-video rounded-2xl shadow-2xl border border-white/10"
                allow="autoplay; fullscreen"
                allowFullScreen
                title={currentSlide.title || 'Video'}
              />
            </div>
          ) : (
            <video
              ref={videoRef}
              key={mediaSource}
              src={mediaSource}
              autoPlay
              muted={isMuted}
              playsInline
              loop={false}
              onWaiting={() => setIsVideoLoading(true)}
              onCanPlay={() => {
                setIsVideoLoading(false);
                setVideoError(false);
              }}
              onPlaying={() => {
                setIsVideoLoading(false);
                setVideoError(false);
              }}
              onLoadedMetadata={e => {
                const dur = e.currentTarget.duration;
                if (dur && !isNaN(dur) && isFinite(dur)) {
                  setVideoDuration(dur);
                }
              }}
              onError={e => {
                console.warn('Video failed to load in splash screen:', e);
                setVideoError(true);
                setIsVideoLoading(false);
              }}
              onEnded={() => {
                handleNext();
              }}
              className={`transition-all duration-300 m-auto ${
                mediaFit === 'cover'
                  ? 'w-full h-full object-cover'
                  : 'w-full h-full max-w-full max-h-full object-contain'
              }`}
            />
          )
        ) : (
          <img
            key={mediaSource}
            src={mediaSource}
            alt={currentSlide.title || appBranding.appName}
            className={`transition-all duration-300 m-auto animate-in fade-in duration-500 ${
              mediaFit === 'cover'
                ? 'w-full h-full object-cover'
                : 'w-full h-full max-w-full max-h-full object-contain'
            }`}
            referrerPolicy="no-referrer"
          />
        )}

        {/* Video Loading Spinner Overlay */}
        {isVideoLoading && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center space-y-3 z-15 backdrop-blur-xs">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            <span className="text-xs text-neutral-300 font-semibold tracking-wide">
              Inapakia video ya mgahawa...
            </span>
          </div>
        )}

        {/* Video Error Fallback */}
        {videoError && (
          <div className="absolute inset-0 bg-neutral-900/90 flex flex-col items-center justify-center p-6 text-center space-y-3 z-15">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-white max-w-xs">
              Video haikuweza kucheza moja kwa moja
            </p>
            <p className="text-xs text-neutral-400 max-w-sm">
              Hakikisha format ya video ni MP4/WebM au weka URL ya moja kwa moja kwenye Admin Branding.
            </p>
            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setVideoError(false);
                  setIsVideoLoading(true);
                  if (videoRef.current) {
                    videoRef.current.load();
                    videoRef.current.play().catch(() => {});
                  }
                }}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white flex items-center space-x-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Jaribu Tena</span>
              </button>
              <button
                type="button"
                onClick={handleComplete}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-neutral-950 cursor-pointer"
              >
                Endelea kwenye App
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tap Zones for Quick Navigation (Left to go back, Right to go next) */}
      <div className="absolute inset-0 z-10 flex">
        {activeSlides.length > 1 && (
          <div
            onClick={handlePrev}
            className="w-1/4 h-full cursor-pointer active:bg-white/5 transition-colors"
            title="Slide ya Nyuma"
          />
        )}
        <div
          onClick={handleNext}
          className={`${activeSlides.length > 1 ? 'w-3/4' : 'w-full'} h-full cursor-pointer active:bg-white/5 transition-colors`}
          title="Slide Inayofuata"
        />
      </div>

      {/* Top Floating Controls: Story Progress Bars, Brand Badge, Fit Toggle, Sound & Skip */}
      <div className="relative z-20 pt-3 sm:pt-5 px-3 sm:px-6 w-full max-w-4xl mx-auto flex flex-col space-y-3 pointer-events-none">
        {/* Segmented Progress Bars */}
        <div className="flex items-center space-x-1.5 w-full pointer-events-auto">
          {activeSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className="flex-1 h-1 sm:h-1.5 rounded-full overflow-hidden bg-white/30 backdrop-blur-xs cursor-pointer shadow-xs transition-transform hover:scale-y-125"
              onClick={() => {
                setCurrentIndex(idx);
                setProgress(0);
                startTimeRef.current = Date.now();
              }}
            >
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-75"
                style={{
                  width:
                    idx < currentIndex
                      ? '100%'
                      : idx === currentIndex
                      ? `${progress}%`
                      : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Top Header Bar */}
        <div className="flex items-center justify-between pointer-events-auto gap-2">
          {/* Brand Badge */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-white shadow-lg">
            {appBranding.logoUrl ? (
              <img
                src={appBranding.logoUrl}
                alt={appBranding.appName}
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <span className="text-sm">{appBranding.logoEmoji || '🦓'}</span>
            )}
            <span className="font-extrabold text-xs tracking-tight truncate max-w-[120px] sm:max-w-[200px]">
              {appBranding.appName}
            </span>
          </div>

          {/* Action Controls: Fit/Fill Toggle, Sound & Skip Button */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Fit vs Cover Mode Toggle (Solves "na naomba vifiti") */}
            <button
              type="button"
              onClick={() => setMediaFit(prev => (prev === 'fit' ? 'cover' : 'fit'))}
              className="px-2.5 sm:px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-md text-white flex items-center space-x-1.5 text-xs font-semibold border border-white/20 shadow-lg cursor-pointer transition-all active:scale-95"
              title={mediaFit === 'fit' ? 'Jaza Skrini Nzima (Cover)' : 'Onyesha Yote Bila Kukatwa (Fit)'}
            >
              {mediaFit === 'fit' ? (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] text-emerald-300 font-bold hidden xs:inline">Fit (Yote)</span>
                </>
              ) : (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] text-amber-300 font-bold hidden xs:inline">Jaza Skrini</span>
                </>
              )}
            </button>

            {/* Audio Toggle for Videos */}
            {currentSlide.type === 'video' && (
              <button
                type="button"
                onClick={toggleAudio}
                className="px-2.5 sm:px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-md text-white flex items-center space-x-1.5 text-xs font-semibold border border-white/20 shadow-lg cursor-pointer transition-all active:scale-95"
                title={isMuted ? 'Washa Sauti' : 'Zima Sauti'}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-neutral-300" />
                    <span className="text-[11px] text-neutral-300 hidden xs:inline">Washa Sauti</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] text-emerald-400 hidden xs:inline">Sauti Ipo</span>
                  </>
                )}
              </button>
            )}

            {/* Skip Button */}
            <button
              type="button"
              onClick={handleComplete}
              className="px-3.5 py-1.5 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-md text-white text-xs font-bold flex items-center space-x-1.5 border border-white/20 shadow-lg cursor-pointer transition-all active:scale-95 hover:border-emerald-400"
              title="Ruka Splash Screen (Skip)"
            >
              <span>Ruka</span>
              <X className="w-3.5 h-3.5 text-neutral-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Content Card (Title, Subtitle & Prominent CTA Button) */}
      <div className="relative z-20 w-full bg-gradient-to-t from-black via-black/85 to-transparent pt-12 pb-5 sm:pb-7 px-4 sm:px-6 pointer-events-none">
        <div className="max-w-2xl mx-auto w-full space-y-3 pointer-events-auto">
          {/* Slide Title */}
          {currentSlide.title && (
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-snug drop-shadow-lg">
              {currentSlide.title}
            </h1>
          )}

          {/* Slide Subtitle */}
          {currentSlide.subtitle && (
            <p className="text-xs sm:text-sm text-neutral-200 line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow">
              {currentSlide.subtitle}
            </p>
          )}

          {/* Action CTA Button & Slide Step Indicator */}
          <div className="flex items-center space-x-2.5 pt-1">
            {activeSlides.length > 1 && currentIndex > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold backdrop-blur-md border border-white/15 transition-all active:scale-95 cursor-pointer shrink-0"
                title="Slide ya Nyuma"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-neutral-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer border border-emerald-400/30"
            >
              <span>
                {currentSlide.buttonText ||
                  (currentIndex === activeSlides.length - 1
                    ? 'Anza Sasa (Order Now)'
                    : 'Inayofuata ➔')}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>

            {activeSlides.length > 1 && (
              <span className="text-[11px] text-white/80 font-mono font-bold px-3 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shrink-0">
                {currentIndex + 1} / {activeSlides.length}
              </span>
            )}
          </div>

          {/* Discreet Help / Swipe Hint */}
          <p className="text-[10px] text-center text-white/50 tracking-wide select-none pt-0.5">
            Gusa pembeni kusonga mbele au kurudi nyuma • Bofya "Ruka" kuingia moja kwa moja
          </p>
        </div>
      </div>
    </div>
  );
};
