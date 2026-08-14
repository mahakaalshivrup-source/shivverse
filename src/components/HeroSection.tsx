"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";

const TITLE = "SHIVA VERSE";

export default function HeroSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    if (isInView) {
      // Reset and start typing
      setDisplayedText("");
      setIsTypingDone(false);
      let i = 0;
      const interval = setInterval(() => {
        if (i < TITLE.length) {
          setDisplayedText(TITLE.substring(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setIsTypingDone(true);
        }
      }, 100);
      return () => clearInterval(interval);
    } else {
      // When scrolled away, reset everything
      setDisplayedText("");
      setIsTypingDone(false);
    }
  }, [isInView]);

  return (
    <section id="hero" className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
         
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/poster.webp"
          className="w-full h-full object-cover brightness-[0.4]"
          style={{ WebkitTransform: "translateZ(0)" }}
        >
          <source src="/New folder/All_thing_is_fine_but_he_look.webm" type="video/webm" />
        </video>
        {/* Seamless blend gradient into the next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
      </div>

      {/* Content */}
      <div ref={ref} className="relative z-20 flex flex-col items-center text-center px-4">
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-serif font-bold tracking-tight min-h-[1.2em]">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
            {displayedText}
          </span>
          {!isTypingDone && displayedText.length > 0 && (
            <span className="text-white/50 animate-pulse ml-1">|</span>
          )}
        </h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isTypingDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl font-light tracking-wide"
        >
          Explore the cosmic dance, ancient stories, and sacred mantras of the Supreme Destroyer and Creator.
        </motion.p>
      </div>

      {/* Scroll Indicator */}
      <a href="#symbolism">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-gray-400">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown className="text-white/70" size={24} />
          </motion.div>
        </motion.div>
      </a>
    </section>
  );
}
