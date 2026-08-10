"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useAudio } from "@/context/AudioProvider";

// ═══════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════
function formatTime(seconds: number) {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// ═══════════════════════════════════════════════════
// Fallback gradient palette for thumbnails
// ═══════════════════════════════════════════════════
const gradients = [
  "from-indigo-950 via-slate-900 to-black",
  "from-blue-950 via-gray-900 to-black",
  "from-cyan-950 via-slate-900 to-black",
  "from-violet-950 via-gray-900 to-black",
  "from-emerald-950 via-gray-900 to-black",
];

// ═══════════════════════════════════════════════════
// GlobalPlayer — Fixed bottom bar
// ═══════════════════════════════════════════════════
export default function GlobalPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlayPause,
    seek,
    setVolume,
    playNext,
    playPrev,
    closePlayer,
  } = useAudio();

  const [imgFailed, setImgFailed] = useState(false);

  // Don't render if no track is loaded
  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const gradient = gradients[(currentTrack.id - 1) % gradients.length];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_30px_rgba(0,0,0,0.5)]"
      >
        {/* Progress bar strip at the very top of the player */}
        <div className="w-full h-1 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-[width] duration-200 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="px-4 md:px-6 py-3 flex flex-col md:flex-row items-center gap-3 md:gap-4 relative">
          {/* Close Button for Mobile */}
          <button
            onClick={closePlayer}
            className="md:hidden absolute top-2 right-4 text-white/50 hover:text-white transition-colors z-10"
            aria-label="Close player"
          >
            <X size={20} />
          </button>

          {/* ─── Left: Track Info ─── */}
          <div className="flex items-center gap-3 w-full md:w-1/3 min-w-0 pr-8 md:pr-0">
            {/* Thumbnail */}
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden flex-shrink-0 border border-white/10 relative">
              {!imgFailed ? (
                <img
                  src={currentTrack.thumbnail}
                  alt={currentTrack.title}
                  onError={() => setImgFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
                >
                  <span className="text-white/40 text-xl font-serif">ॐ</span>
                </div>
              )}
              {/* Animated equalizer on playing */}
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="flex gap-[2px] items-end h-4">
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="w-[3px] bg-blue-400 rounded-full"
                        animate={{ height: ["20%", "100%", "40%", "80%", "20%"] }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="text-white font-medium text-sm md:text-base truncate">
                {currentTrack.title}
              </h3>
              <p className="text-gray-500 text-xs md:text-sm truncate">
                {currentTrack.subtitle}
              </p>
            </div>
          </div>

          {/* ─── Center: Controls & Seek ─── */}
          <div className="flex flex-col items-center w-full md:w-1/3 gap-1.5">
            {/* Buttons */}
            <div className="flex items-center gap-5">
              <button
                onClick={playPrev}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Previous track"
              >
                <SkipBack size={20} fill="currentColor" />
              </button>
              <button
                onClick={togglePlayPause}
                className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-white/10"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause size={20} fill="currentColor" />
                ) : (
                  <Play size={20} fill="currentColor" className="ml-0.5" />
                )}
              </button>
              <button
                onClick={playNext}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Next track"
              >
                <SkipForward size={20} fill="currentColor" />
              </button>
            </div>

            {/* Seek bar */}
            <div className="w-full flex items-center gap-2 text-[11px] text-gray-500">
              <span className="w-8 text-right tabular-nums">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 relative group">
                <input
                  type="range"
                  min={0}
                  max={duration || 1}
                  step={0.1}
                  value={currentTime}
                  onChange={(e) => seek(Number(e.target.value))}
                  className="w-full h-1.5 appearance-none bg-white/10 rounded-full cursor-pointer outline-none
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-3
                    [&::-webkit-slider-thumb]:h-3
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:opacity-0
                    [&::-webkit-slider-thumb]:group-hover:opacity-100
                    [&::-webkit-slider-thumb]:transition-opacity
                    [&::-webkit-slider-thumb]:shadow-md"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 ${progress}%, rgba(255,255,255,0.1) ${progress}%)`,
                  }}
                />
              </div>
              <span className="w-8 tabular-nums">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* ─── Right: Volume ─── */}
          <div className="hidden md:flex items-center justify-end w-1/3 gap-2">
            <button
              onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Toggle mute"
            >
              {volume === 0 ? (
                <VolumeX size={18} />
              ) : (
                <Volume2 size={18} />
              )}
            </button>
            <div className="relative group w-24">
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-1.5 appearance-none bg-white/10 rounded-full cursor-pointer outline-none
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-3
                  [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:shadow-md"
                style={{
                  background: `linear-gradient(to right, #3b82f6 ${volume * 100}%, rgba(255,255,255,0.1) ${volume * 100}%)`,
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
