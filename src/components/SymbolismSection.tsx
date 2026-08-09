"use client";

import ShivaInteractiveMap from "./ShivaInteractiveMap";
import { motion } from "framer-motion";

export default function SymbolismSection() {
  return (
    <section id="symbolism" className="relative min-h-screen w-full bg-black py-20 overflow-hidden flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false, amount: 0.5 }}
        className="text-center mb-16 z-10"
      >
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
          Divine Symbolism
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto px-4">
          Hover over the glowing elements to uncover the profound meaning behind Lord Shiva's form.
        </p>
      </motion.div>

      <ShivaInteractiveMap />
    </section>
  );
}
