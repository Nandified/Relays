"use client";

import * as React from "react";

interface ProIntroVideoPlayerProps {
  videoUrl: string;
  proName: string;
  /** Compact mode for inline/card usage */
  compact?: boolean;
}

/**
 * Custom dark-themed video player for pro intro videos.
 * Supports 16:9 and 9:16 aspect ratios (auto-detect).
 * Muted by default with unmute option.
 * Liquid glass container with subtle glow border.
 */
export function ProIntroVideoPlayer({ videoUrl, proName, compact = false }: ProIntroVideoPlayerProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [showControls, setShowControls] = React.useState(true);
  const [isVertical, setIsVertical] = React.useState(false);
  const controlsTimeout = React.useRef<NodeJS.Timeout | null>(null);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
    // Auto-detect aspect ratio
    if (video.videoHeight > video.videoWidth) {
      setIsVertical(true);
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
    resetControlsTimer();
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
    resetControlsTimer();
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !duration) return;
    setProgress((video.currentTime / duration) * 100);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    video.currentTime = pct * duration;
    resetControlsTimer();
  };

  const resetControlsTimer = () => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const handleMouseMove = () => resetControlsTimer();

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // Since this is a mock (no actual video file), we'll show a styled placeholder
  const isMock = videoUrl.includes("placeholder");

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl
        liquid-glass
        ${isVertical ? "max-w-xs mx-auto" : "w-full"}
        ${compact ? "" : "shadow-[0_0_30px_rgba(59,130,246,0.08)]"}
        border border-[var(--border-hover)]
        group
      `}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowControls(true)}
    >
      {/* Glow border effect */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none z-10 border border-[rgba(59,130,246,0.12)] group-hover:border-[rgba(59,130,246,0.25)] transition-colors duration-500" />

      <div className={`relative ${isVertical ? "aspect-[9/16]" : "aspect-video"} bg-[#0c0c14]`}>
        {isMock ? (
          /* Mock placeholder UI */
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#0e0e18] to-[#141420]">
            {/* Ambient glow */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-indigo-500/15 rounded-full blur-3xl" />
            </div>

            {/* Play button overlay */}
            <button
              onClick={togglePlay}
              className="relative z-20 flex items-center justify-center w-16 h-16 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/15 hover:scale-105 transition-all duration-200 group/play"
            >
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24" className="ml-1">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </button>

            <p className="relative z-20 mt-3 text-sm text-slate-500 dark:text-slate-400">{proName}&apos;s intro video</p>
            <p className="relative z-20 mt-1 text-xs text-slate-500 dark:text-slate-600">15–30 seconds</p>

            {/* Duration badge */}
            <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 border border-black/10 dark:border-white/10">
              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              0:24
            </div>
          </div>
        ) : (
          /* Real video player */
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              muted={isMuted}
              playsInline
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => { setIsPlaying(false); setShowControls(true); }}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Controls overlay */}
            <div
              className={`absolute inset-0 z-20 flex flex-col justify-end transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
            >
              {/* Gradient overlay for controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Center play/pause */}
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center"
              >
                {!isPlaying && (
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/15 transition-all">
                    <svg width="22" height="22" fill="white" viewBox="0 0 24 24" className="ml-1">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>
                )}
              </button>

              {/* Bottom controls */}
              <div className="relative z-30 px-3 pb-3 space-y-2">
                {/* Progress bar */}
                <div
                  className="h-1 rounded-full bg-black/8 dark:bg-white/20 cursor-pointer group/progress"
                  onClick={handleProgressClick}
                >
                  <div
                    className="h-full rounded-full bg-blue-400 transition-all duration-100 group-hover/progress:h-1.5 relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-sm opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={togglePlay} className="text-white/80 hover:text-slate-900 dark:text-white transition-colors">
                      {isPlaying ? (
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                          <rect x="6" y="4" width="4" height="16" rx="1" />
                          <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                      )}
                    </button>
                    <span className="text-xs text-white/60">
                      {formatTime((progress / 100) * duration)} / {formatTime(duration)}
                    </span>
                  </div>

                  <button onClick={toggleMute} className="text-white/80 hover:text-slate-900 dark:text-white transition-colors">
                    {isMuted ? (
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <line x1="23" y1="9" x2="17" y2="15" />
                        <line x1="17" y1="9" x2="23" y2="15" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** Small play badge for marketplace cards — indicates pro has an intro video */
export function VideoPlayBadge() {
  return (
    <div className="absolute top-2 right-2 z-10 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-sm px-2 py-0.5 border border-black/10 dark:border-white/10">
      <svg width="10" height="10" fill="white" viewBox="0 0 24 24">
        <polygon points="5,3 19,12 5,21" />
      </svg>
      <span className="text-[10px] font-medium text-white/80">Video</span>
    </div>
  );
}
