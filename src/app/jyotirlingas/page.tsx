"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import jyotirlingaData from "@/data/jyotirlingaData";
import type { JyotirlingaLocation } from "@/data/jyotirlingaData";
import AITripModal from "@/components/AITripModal";

/* ─── Per-card component with its own IntersectionObserver ─── */

function JyotirlingaCard({
  site,
  index,
  isEven,
  onPlanTrip,
}: {
  site: JyotirlingaLocation;
  index: number;
  isEven: boolean;
  onPlanTrip: (site: JyotirlingaLocation) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isInView = useInView(cardRef, {
    margin: "-35% 0px -35% 0px",
  });

  const hasVideo = site.videoUrl !== "";
  const shouldPlay = isInView || isHovered;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasVideo) return;

    if (shouldPlay) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [shouldPlay, hasVideo]);

  return (
    <div className="relative z-20 flex flex-col md:flex-row items-center w-full mb-24 last:mb-0">
      {/* Node Point */}
      <div className="absolute left-[28px] md:left-1/2 w-6 h-6 bg-black border-4 border-gray-700 rounded-full -translate-x-1/2 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-2 h-2 bg-white rounded-full"
        />
      </div>

      {/* Full-Bleed Video Card */}
      <div
        className={`w-full pl-16 md:pl-0 md:w-1/2 ${isEven ? "md:pr-16 md:text-right" : "md:pl-16 md:ml-auto"}`}
      >
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, x: isEven ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden group min-h-[300px] rounded-2xl border border-white/5 hover:border-white/15 transition-all duration-500 cursor-default bg-shiva-charcoal hover:scale-[1.02]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Background Video (z-0) */}
          {hasVideo && (
            <video
              ref={videoRef}
              src={site.videoUrl}
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover z-0 group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            />
          )}

          {/* Gradient Overlay (z-10) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 z-10 transition-opacity duration-500 group-hover:opacity-80" />

          {/* Text Content (z-20) */}
          <div
            className={`relative z-20 p-6 flex flex-col justify-end min-h-[300px] ${isEven ? "md:text-right" : ""}`}
          >
            <div
              className={`flex items-center gap-2 mb-2 text-shiva-gold ${isEven ? "md:justify-end" : ""}`}
            >
              <MapPin size={14} />
              <span className="text-[11px] uppercase tracking-widest font-semibold">
                {site.location}
              </span>
            </div>

            <h3 className="text-2xl font-serif font-bold text-white mb-2 drop-shadow-lg">
              {site.name}
            </h3>

            <p className="text-white/60 text-sm leading-relaxed drop-shadow-md">
              {site.desc}
            </p>
          </div>

          {/* Pill "Plan trip" Button — bottom-right (z-20) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlanTrip(site);
            }}
            className="absolute bottom-4 right-4 z-20 rounded-full px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-1.5 text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
          >
            <span className="text-xs font-medium tracking-wide">
              Plan trip
            </span>
            <Navigation size={12} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */

export default function JyotirlingasPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJyotirlinga, setSelectedJyotirlinga] =
    useState<JyotirlingaLocation | null>(null);

  const openTripPlanner = useCallback((site: JyotirlingaLocation) => {
    setSelectedJyotirlinga(site);
    setIsModalOpen(true);
  }, []);

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-5xl mx-auto relative overflow-x-hidden">
      <div className="text-center mb-24 relative z-10">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
          The 12 Jyotirlingas
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Embark on a divine journey from the snow-capped Himalayas in the North
          to the sacred shores of the South.
        </p>
      </div>

      <div ref={containerRef} className="relative">
        {/* The Animated Connecting Line */}
        <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-1 bg-gray-800 -translate-x-1/2 z-0" />
        <motion.div
          className="absolute left-[28px] md:left-1/2 top-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-amber-500 -translate-x-1/2 z-10 origin-top shadow-[0_0_15px_rgba(59,130,246,0.8)]"
          style={{ height: lineHeight }}
        />

        {jyotirlingaData.map((site, index) => (
          <JyotirlingaCard
            key={site.id}
            site={site}
            index={index}
            isEven={index % 2 === 0}
            onPlanTrip={openTripPlanner}
          />
        ))}
      </div>

      {/* Trip Modal */}
      <AITripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedJyotirlinga={selectedJyotirlinga}
      />
    </main>
  );
}
