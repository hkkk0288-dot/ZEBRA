import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SplashMediaItem } from '../types';
import { X, ChevronRight, ChevronLeft, Volume2, VolumeX, Sparkles, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
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
                // Video might still decode, wait for onCanPlay or onError
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
    }, 400);
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

    // Use detected video duration or configured duration
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

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-neutral-950 text-white flex flex-col justify-between transition-opacity duration-400 select-none ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Media Container (Picture or Video or Embed) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-neutral-950">
        {currentSlide.type === 'video' ? (
          parsedVideo.type === 'youtube' ? (
            <div className="w-full h-full relative overflow-hidden pointer-events-none">
              <iframe
                key={parsedVideo.embedUrl}
                src={parsedVideo.embedUrl}
                className="w-full h-full object-cover scale-[1.35] pointer-events-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={currentSlide.title || 'Video'}
              />
            </div>
          ) : parsedVideo.type === 'vimeo' ? (
            <div className="w-full h-full relative overflow-hidden pointer-events-none">
              <iframe
                key={parsedVideo.embedUrl}
                src={parsedVideo.embedUrl}
                className="w-full h-full object-cover scale-[1.35] pointer-events-none"
                allow="autoplay; fullscreen"
                allowFullScreen
                title={currentSlide.title || 'Video'}
              />
            </div>
          ) : (
            <video
              ref={videoRef}
              key={resolvedMediaUrl || currentSlide.mediaUrl}
              src={resolvedMediaUrl || currentSlide.mediaUrl}
              autoPlay
              muted={isMuted}
              playsInline
              loop={activeSlides.length === 1}
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
                if (activeSlides.length > 1) {
                  handleNext();
                }
              }}
              className="w-full h-full object-cover transform scale-105 transition-all duration-700"
            />
          )
        ) : (
          <img
            key={resolvedMediaUrl || currentSlide.mediaUrl}
            src={resolvedMediaUrl || currentSlide.mediaUrl}
            alt={currentSlide.title || appBranding.appName}
            className="w-full h-full object-cover transform scale-105 animate-in fade-in zoom-in-105 duration-700"
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

        {/* Ambient Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/80 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-neutral-950/30 to-neutral-950/90 pointer-events-none" />
      </div>

      {/* Tap Zones for Quick Navigation (Left to go back, Right to go next) */}
      <div className="absolute inset-0 z-10 flex">
        <div
          onClick={handlePrev}
          className="w-1/3 h-full cursor-pointer active:bg-white/5 transition-colors"
          title="Nyuma"
        />
        <div className="w-1/3 h-full" />
        <div
          onClick={handleNext}
          className="w-1/3 h-full cursor-pointer active:bg-white/5 transition-colors"
          title="Mbele"
        />
      </div>

      {/* Top Header Bar: Progress Bars + App Logo + Controls */}
      <div className="relative z-20 pt-4 px-4 sm:px-6 w-full max-w-4xl mx-auto space-y-3">
        {/* Segmented Progress Bars (if multiple slides or single slide) */}
        <div className="flex items-center space-x-1.5 w-full">
          {activeSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className="flex-1 h-1 sm:h-1.5 rounded-full overflow-hidden bg-white/25 backdrop-blur-xs cursor-pointer"
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

        {/* Brand Banner & Skip Controls */}
        <div className="flex items-center justify-between pt-1">
          {/* Logo & App Name */}
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-500 flex items-center justify-center text-lg sm:text-xl shadow-lg shadow-emerald-500/30 overflow-hidden border border-white/20 shrink-0">
              {appBranding.logoUrl ? (
                <img
                  src={appBranding.logoUrl}
                  alt={appBranding.appName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{appBranding.logoEmoji || '🦓'}</span>
              )}
            </div>
            <div>
              <h1 className="font-display font-black text-sm sm:text-base text-white tracking-tight drop-shadow-md">
                {appBranding.appName}
              </h1>
              <p className="text-[10px] sm:text-xs text-amber-300 font-medium drop-shadow-xs">
                {appBranding.tagline}
              </p>
            </div>
          </div>

          {/* Top Actions: Audio Toggle (if video) + Skip Button */}
          <div className="flex items-center space-x-2">
            {currentSlide.type === 'video' && parsedVideo.type === 'direct' && (
              <button
                type="button"
                onClick={toggleAudio}
                className="px-2.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs flex items-center space-x-1.5 transition-all cursor-pointer shadow-lg active:scale-95"
                title={isMuted ? 'Washa Sauti (Unmute)' : 'Zima Sauti (Mute)'}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-4 h-4 text-neutral-300" />
                    <span className="text-[10px] font-bold text-neutral-300 hidden sm:inline">Sauti Imefungwa</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-400 hidden sm:inline">Sauti Imewashwa</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={handleComplete}
              className="px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white font-bold text-xs flex items-center space-x-1 transition-all cursor-pointer active:scale-95 shadow-lg"
            >
              <span>{currentSlide.buttonText || (isPreview ? 'Funga Preview' : 'Ruka (Skip)')}</span>
              <X className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Content: Slide Title, Subtitle, Slide Count, and CTA */}
      <div className="relative z-20 pb-8 sm:pb-12 px-5 sm:px-8 w-full max-w-4xl mx-auto space-y-4">
        {/* Slide Counter badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {currentSlide.type === 'video' ? '🎬 Video' : '🖼️ Picha'} • {currentIndex + 1} / {activeSlides.length}
          </span>
        </div>

        {/* Slide Title & Subtitle */}
        <div className="space-y-2">
          {currentSlide.title && (
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-display text-white tracking-tight leading-tight drop-shadow-lg">
              {currentSlide.title}
            </h2>
          )}
          {currentSlide.subtitle && (
            <p className="text-xs sm:text-base text-neutral-200 max-w-2xl leading-relaxed drop-shadow-md">
              {currentSlide.subtitle}
            </p>
          )}
        </div>

        {/* Bottom Interactive Bar */}
        <div className="flex items-center justify-between pt-2 gap-3">
          {/* Arrow navigation indicators for multiple slides */}
          {activeSlides.length > 1 ? (
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                title="Slide Iliyotangulia"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
                title="Slide Inayofuata"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div />
          )}

          {/* Big CTA Button */}
          <button
            type="button"
            onClick={currentIndex === activeSlides.length - 1 ? handleComplete : handleNext}
            className="px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-neutral-950 font-black text-xs sm:text-sm flex items-center space-x-2 shadow-xl shadow-emerald-500/30 transition-all cursor-pointer active:scale-95 ml-auto"
          >
            <span>
              {currentIndex === activeSlides.length - 1
                ? isPreview
                  ? 'Kamilisha Preview'
                  : 'Anza Sasa (Order Now)'
                : 'Inayofuata ➔'}
            </span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
};
