"use client";

import { useEffect, useRef } from "react";
import ShivaInteractiveMap from "./ShivaInteractiveMap";
import { motion } from "framer-motion";

export default function SymbolismSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Force muted state via JS before playing to bypass iOS blocks
      video.muted = true;
      video.defaultMuted = true;
      video.setAttribute('playsinline', 'true');
      
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Autoplay blocked by browser:", error);
        });
      }
    }
  }, []);
  return (
    <section
      id="symbolism"
      className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center bg-black py-16"
    >
      {/* Bulletproof iOS Autoplay Video Wrapper */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-60 scale-105 object-cover"
      >
        <source src="/New folder/landing2vidoe.webm" type="video/webm" />
      </video>

      {/* Gradient Blending Overlay (z-10) */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black via-black/30 to-black" />

      {/* Content Layer (z-20) */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Divine Symbolism
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Hover over the glowing elements to uncover the profound meaning
            behind Lord Shiva&apos;s form.
          </p>
        </motion.div>

        <ShivaInteractiveMap />
      </div>
    </section>
  );
}
