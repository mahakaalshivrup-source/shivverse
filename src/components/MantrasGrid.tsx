"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";
import { useAudio } from "@/context/AudioProvider";
import type { Mantra } from "@/data/mantrasData";

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
// CLS Skeleton Loader (Option B)
// ═══════════════════════════════════════════════════
function MantraCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gray-900/50 text-left animate-pulse">
      {/* Strict aspect ratio wrapper identical to real cards */}
      <div className="relative aspect-square overflow-hidden bg-white/5" />
      
      {/* Exact padding mirroring the real cards */}
      <div className="p-4 md:p-5">
        <div className="h-[18px] md:h-5 bg-white/10 rounded w-2/3 mb-1" />
        <div className="h-4 bg-white/10 rounded w-full mt-2" />
        <div className="h-4 bg-white/10 rounded w-4/5 mt-1" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// Single Card
// ═══════════════════════════════════════════════════
function MantraCard({
  mantra,
  index,
  onPlay,
}: {
  mantra: Mantra;
  index: number;
  onPlay: () => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const { currentTrack, isPlaying } = useAudio();
  const isActive = currentTrack?.id === mantra.id;
  const gradient = gradients[index % gradients.length];

  return (
    <motion.button
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onPlay}
      className={`group relative overflow-hidden rounded-2xl bg-gray-900/50 cursor-pointer text-left
        transition-all duration-300 hover:scale-[1.02]
        hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]
        ${isActive ? "ring-2 ring-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.2)]" : ""}
      `}
    >
      {/* Thumbnail with strict aspect ratio wrapper to prevent CLS */}
      <div className="relative aspect-square overflow-hidden bg-black/20">
        {!imgFailed ? (
          <Image
            src={mantra.thumbnail}
            alt={mantra.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImgFailed(true)}
            className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-[1.8]"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
          >
            <span className="text-white/20 text-6xl md:text-7xl font-serif select-none">
              ॐ
            </span>
          </div>
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500" />

        {/* Play icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <Play size={28} className="text-white ml-1" fill="white" />
          </div>
        </div>

        {/* Active equalizer indicator */}
        {isActive && isPlaying && (
          <div className="absolute top-3 right-3 flex gap-[2px] items-end h-4">
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
        )}
      </div>

      {/* Text content */}
      <div className="p-4 md:p-5">
        <h3
          className={`text-base md:text-lg font-semibold mb-1 transition-colors duration-300 ${
            isActive ? "text-blue-400" : "text-white group-hover:text-white"
          }`}
        >
          {mantra.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2">
          {mantra.subtitle}
        </p>
      </div>
    </motion.button>
  );
}

// ═══════════════════════════════════════════════════
// MantrasGrid — Discovery View
// ═══════════════════════════════════════════════════
export default function MantrasGrid({
  onSelectMantra,
}: {
  onSelectMantra: (mantra: Mantra, index: number) => void;
}) {
  const { playTrack } = useAudio();
  const [mantras, setMantras] = useState<Mantra[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchMantras = async () => {
      try {
        const res = await fetch('/api/content');
        const data = await res.json();
        if (isMounted && data.mantras) {
          setMantras(data.mantras);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchMantras();

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePlay = (mantra: Mantra, index: number) => {
    playTrack(mantra, index, mantras);
    onSelectMantra(mantra, index);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 md:mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
          Sacred Mantras
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Immerse yourself in the divine vibrations of Lord Shiva&apos;s most
          powerful mantras. Each chant carries the energy of cosmic
          transformation.
        </p>
      </motion.div>

      {/* Grid: CSS Classes match skeletons perfectly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 min-h-[500px]">
        {isLoading
          ? Array(6)
              .fill(0)
              .map((_, i) => <MantraCardSkeleton key={`skeleton-${i}`} />)
          : mantras.map((mantra, index) => (
              <MantraCard
                key={mantra.id}
                mantra={mantra}
                index={index}
                onPlay={() => handlePlay(mantra, index)}
              />
            ))}
      </div>
    </div>
  );
}
