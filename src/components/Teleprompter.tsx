"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Languages } from "lucide-react";
import { useAudio } from "@/context/AudioProvider";

// ═══════════════════════════════════════════════════════════
// Teleprompter v2 — requestAnimationFrame Scroll Engine
// ═══════════════════════════════════════════════════════════
//
// SCROLL ENGINE (rAF loop):
//   targetDur   = audioDuration - buffer
//   progress    = clamp(currentTime / targetDur, 0, 1)
//   targetScroll = progress × maxScrollTop
//   Apply with smooth lerp: scrollTop += (target - current) × 0.06
//
// MANUAL DRAG:
//   On wheel/touch/mousedown → pause auto-scroll for 3 seconds
//   User can freely scroll during pause
//   Auto-scroll resumes smoothly afterward
//
// LANGUAGE TOGGLE:
//   Preserves progress % when switching languages
//   scrollTop auto-adjusts to approximate position
// ═══════════════════════════════════════════════════════════

type Language = "sanskrit" | "english";

export default function Teleprompter({
  onBack,
}: {
  onBack: () => void;
}) {
  const { currentTrack, currentTime, duration } = useAudio();
  const [language, setLanguage] = useState<Language>("sanskrit");

  // The scroll container ref
  const scrollRef = useRef<HTMLDivElement>(null);

  // Refs for the rAF engine (avoids stale closures)
  const currentTimeRef = useRef(currentTime);
  const durationRef = useRef(duration);
  const isUserScrolling = useRef(false);
  const userScrollTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const rafRef = useRef<number>(undefined);

  // Keep refs in sync with state
  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);
  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  // Get lyrics based on language
  const currentLyrics =
    language === "english" && currentTrack?.lyricsEn?.length
      ? currentTrack.lyricsEn
      : currentTrack?.lyrics ?? [];

  const hasEnglish = (currentTrack?.lyricsEn?.length ?? 0) > 0;

  // Reset language on track change
  useEffect(() => {
    setLanguage("sanskrit");
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [currentTrack?.id]);

  // Scroll to proportional position when language changes
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // Small delay to let the DOM update with new lyrics
    const timer = setTimeout(() => {
      const t = currentTimeRef.current;
      const d = durationRef.current;
      if (d <= 0) return;
      const BUFFER = d > 120 ? 90 : d * 0.25;
      const targetDur = d - BUFFER;
      const progress = Math.min(Math.max(t / targetDur, 0), 1);
      const maxScroll = el.scrollHeight - el.clientHeight;
      el.scrollTop = progress * maxScroll;
    }, 100);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // ───── rAF SCROLL ENGINE ─────
  useEffect(() => {
    const loop = () => {
      const el = scrollRef.current;
      if (!el) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      // Skip auto-scroll when user is dragging
      if (isUserScrolling.current) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const t = currentTimeRef.current;
      const d = durationRef.current;

      if (d <= 0) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const BUFFER = d > 120 ? 90 : d * 0.25;
      const targetDur = d - BUFFER;
      const progress = Math.min(Math.max(t / targetDur, 0), 1);

      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 0) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const targetScroll = progress * maxScroll;
      const current = el.scrollTop;
      const diff = targetScroll - current;

      // Smooth lerp — 6% per frame ≈ buttery 60fps scroll
      if (Math.abs(diff) > 0.5) {
        el.scrollTop = current + diff * 0.06;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ───── MANUAL DRAG / SCROLL HANDLERS ─────
  const handleUserInteraction = useCallback(() => {
    isUserScrolling.current = true;
    if (userScrollTimer.current) clearTimeout(userScrollTimer.current);
    // Resume auto-scroll after 3 seconds of no interaction
    userScrollTimer.current = setTimeout(() => {
      isUserScrolling.current = false;
    }, 3000);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Wheel scroll (desktop)
    const onWheel = () => handleUserInteraction();

    // Touch drag (mobile)
    const onTouchStart = () => handleUserInteraction();

    // Mouse drag
    let isMouseDown = false;
    const onMouseDown = (e: MouseEvent) => {
      // Only left click
      if (e.button !== 0) return;
      isMouseDown = true;
      handleUserInteraction();
    };
    const onMouseMove = () => {
      if (isMouseDown) handleUserInteraction();
    };
    const onMouseUp = () => {
      isMouseDown = false;
    };

    el.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", handleUserInteraction, { passive: true });
    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", handleUserInteraction);
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      if (userScrollTimer.current) clearTimeout(userScrollTimer.current);
    };
  }, [handleUserInteraction]);

  if (!currentTrack) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl mx-auto flex flex-col"
      style={{ height: "calc(100vh - 220px)" }}
    >
      {/* ─── Header: Back, Title, Language Toggle ─── */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex-shrink-0"
            aria-label="Back to grid"
          >
            <ArrowLeft size={22} />
          </button>
          <div className="min-w-0">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white truncate">
              {currentTrack.title}
            </h2>
            <p className="text-gray-500 text-sm truncate">
              {currentTrack.subtitle}
            </p>
          </div>
        </div>

        {/* Language Toggle */}
        {hasEnglish && (
          <div className="flex-shrink-0">
            <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10">
              <button
                onClick={() => setLanguage("sanskrit")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-1.5 ${
                  language === "sanskrit"
                    ? "bg-blue-500/20 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                    : "text-gray-500 hover:text-gray-300"
                }`}
                aria-label="Show Sanskrit lyrics"
              >
                <span className="text-sm">अ</span>
                <span className="hidden sm:inline">संस्कृत</span>
              </button>
              <button
                onClick={() => setLanguage("english")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-1.5 ${
                  language === "english"
                    ? "bg-blue-500/20 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                    : "text-gray-500 hover:text-gray-300"
                }`}
                aria-label="Show English translation"
              >
                <Languages size={14} />
                <span className="hidden sm:inline">English</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── Lyrics Scroll Container ─── */}
      <div
        ref={scrollRef}
        className="flex-1 relative overflow-y-auto hide-scrollbar"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          cursor: "grab",
        }}
      >
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

        {/* Top spacer — pushes first line to ~center of view */}
        <div className="h-[35vh]" />

        {/* Lyrics */}
        <div className="relative z-10 px-4 md:px-8">
          {currentLyrics.map((line: string, i: number) => (
            <p
              key={`${language}-${i}`}
              className={`text-center transition-colors duration-500 select-none ${
                line === ""
                  ? "h-6 md:h-8"
                  : language === "sanskrit"
                    ? "text-xl md:text-2xl lg:text-3xl text-gray-300 font-serif leading-relaxed md:leading-loose mb-1"
                    : "text-lg md:text-xl lg:text-2xl text-gray-400 font-sans leading-relaxed mb-2"
              }`}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Bottom spacer — lets the last line scroll up past center */}
        <div className="h-[60vh]" />
      </div>
    </motion.div>
  );
}
