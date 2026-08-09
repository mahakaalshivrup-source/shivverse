"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const hotspots = [
  {
    id: "moon",
    title: "CRESCENT MOON",
    description: "Symbolizes control over time and the phases of the moon. Represents the mind.",
    top: "12%",
    left: "48%",
  },
  {
    id: "snake",
    title: "SNAKE",
    description: "Representing kundalini energy and mastery over ego and poison.",
    top: "35%",
    left: "47%",
  },
  {
    id: "third-eye",
    title: "THIRD EYE",
    description: "The eye of wisdom and spiritual perception. Destroys ignorance.",
    top: "22%",
    left: "50%",
  },
  {
    id: "amulets",
    title: "AMULETS",
    description: "Representing spiritual powers and protection.",
    top: "53%",
    left: "33%",
  },
];

export default function ShivaInteractiveMap() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4">
      {/* Abstract Background Glow */}
      <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Container for the image and hotspots */}
      <div className="relative w-full inline-block group/map">
        <motion.div 
          className="w-full h-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image
            src="/image_1.png"
            alt="Lord Shiva"
            width={1200}
            height={1200}
            className="w-full h-auto object-contain"
            style={{ maskImage: "radial-gradient(ellipse at center, black 70%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse at center, black 70%, transparent 100%)" }}
            priority
          />
        </motion.div>
        
        {/* Hotspots Container */}
        <div className="absolute inset-0">
          {hotspots.map((hotspot) => (
            <div
              key={hotspot.id}
              className="absolute z-20 group"
              style={{ top: hotspot.top, left: hotspot.left, transform: "translate(-50%, -50%)" }}
              onMouseEnter={() => setActiveHotspot(hotspot.id)}
              onMouseLeave={() => setActiveHotspot(null)}
            >
              {/* Hotspot Pulsing Dot */}
              <div className="relative flex items-center justify-center w-8 h-8 cursor-pointer">
                <AnimatePresence>
                  <motion.div
                    animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-6 h-6 bg-blue-500 rounded-full"
                  />
                  <motion.div 
                    whileHover={{ scale: 1.5 }}
                    className="w-2.5 h-2.5 bg-white rounded-full relative z-10 shadow-[0_0_12px_3px_rgba(59,130,246,0.9)] transition-transform duration-300" 
                  />
                </AnimatePresence>
              </div>

              {/* Tooltip Panel */}
              <AnimatePresence>
                {activeHotspot === hotspot.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute left-1/2 -translate-x-1/2 top-10 w-64 md:w-72 z-30 pointer-events-none"
                  >
                    {/* Frosted Glass Panel */}
                    <div className="bg-[rgba(10,20,30,0.4)] backdrop-blur-xl border border-blue-400/40 rounded-xl p-4 md:p-5 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-1 h-4 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                        <h3 className="text-blue-300 font-serif font-semibold text-sm tracking-widest uppercase">
                          {hotspot.title}
                        </h3>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed font-light">
                        {hotspot.description}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
