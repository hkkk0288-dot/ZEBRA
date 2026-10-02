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
      </div>

      {/* Tap Zones for Quick Navigation (Left to go back, Right to go next/complete) */}
      <div className="absolute inset-0 z-10 flex cursor-pointer">
        {activeSlides.length > 1 && (
          <div
            onClick={handlePrev}
            className="w-1/3 h-full cursor-pointer active:bg-white/5 transition-colors"
            title="Nyuma"
          />
        )}
        <div
          onClick={handleNext}
          className={`${activeSlides.length > 1 ? 'w-2/3' : 'w-full'} h-full cursor-pointer active:bg-white/5 transition-colors`}
          title="Endelea"
        />
      </div>

      {/* Top Floating Controls: Story Progress Bars, Audio Toggle & Discreet Skip */}
      <div className="relative z-20 pt-4 sm:pt-6 px-4 sm:px-6 w-full max-w-4xl mx-auto flex flex-col space-y-3 pointer-events-none">
        {/* Segmented Progress Bars (if multiple slides or single slide progress) */}
        <div className="flex items-center space-x-1.5 w-full pointer-events-auto">
          {activeSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className="flex-1 h-1 sm:h-1.5 rounded-full overflow-hidden bg-white/25 backdrop-blur-xs cursor-pointer shadow-xs"
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

        {/* Floating Top Controls: Sound toggle & Skip Button */}
        <div className="flex items-center justify-between pointer-events-auto">
          {/* Audio toggle button for videos */}
          {currentSlide.type === 'video' ? (
            <button
              type="button"
              onClick={toggleAudio}
              className="px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center space-x-1.5 text-xs font-semibold border border-white/20 shadow-lg cursor-pointer transition-all active:scale-95"
              title={isMuted ? 'Washa Sauti' : 'Zima Sauti'}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-neutral-300" />
                  <span className="text-[11px] text-neutral-300">Gusa kuwasha sauti</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] text-emerald-400">Sauti Ipo</span>
                </>
              )}
            </button>
          ) : (
            <div />
          )}

          {/* Discreet Minimal Skip Button */}
          <button
            type="button"
            onClick={handleComplete}
            className="px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white text-xs font-bold flex items-center space-x-1.5 border border-white/20 shadow-lg cursor-pointer transition-all active:scale-95 hover:border-white/40"
            title="Ruka (Skip)"
          >
            <span>Ruka</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Subtle bottom indicator */}
      <div className="relative z-20 pb-4 px-4 w-full text-center pointer-events-none">
        <span className="text-[10px] text-white/50 tracking-wider">
          Gusa popote kuendelea • {currentIndex + 1}/{activeSlides.length}
        </span>
      </div>
    </div>
  );
};
