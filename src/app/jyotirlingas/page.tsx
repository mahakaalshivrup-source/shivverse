"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";

// North to South order (approximate for narrative flow)
const jyotirlingas = [
  {
    id: 1,
    name: "Kedarnath",
    location: "Uttarakhand",
    description: "Located in the Himalayas, it is the northernmost Jyotirlinga, accessible only by a rigorous trek.",
  },
  {
    id: 2,
    name: "Kashi Vishwanath",
    location: "Varanasi, Uttar Pradesh",
    description: "Situated on the western bank of the holy river Ganga, representing the supreme light.",
  },
  {
    id: 3,
    name: "Baidyanath",
    location: "Deoghar, Jharkhand",
    description: "Also known as Vaijnath, it is where Ravana sacrificed his heads to Lord Shiva.",
  },
  {
    id: 4,
    name: "Mahakaleshwar",
    location: "Ujjain, Madhya Pradesh",
    description: "The only Jyotirlinga facing south (Dakshinamukhi), famous for its Bhasma Aarti.",
  },
  {
    id: 5,
    name: "Omkareshwar",
    location: "Madhya Pradesh",
    description: "Situated on an island shaped like the holy symbol 'Om' in the Narmada river.",
  },
  {
    id: 6,
    name: "Nageshwar",
    location: "Dwarka, Gujarat",
    description: "Believed to protect devotees from all poisons, located near the coast of Saurashtra.",
  },
  {
    id: 7,
    name: "Somnath",
    location: "Veraval, Gujarat",
    description: "Considered the first among the twelve Jyotirlingas, known as the Shrine Eternal.",
  },
  {
    id: 8,
    name: "Trimbakeshwar",
    location: "Nashik, Maharashtra",
    description: "Source of the Godavari river, unique for having three faces representing Brahma, Vishnu, and Shiva.",
  },
  {
    id: 9,
    name: "Grishneshwar",
    location: "Ellora, Maharashtra",
    description: "Located near the famous Ellora Caves, it is the last of the 12 Jyotirlingas.",
  },
  {
    id: 10,
    name: "Bhimashankar",
    location: "Pune, Maharashtra",
    description: "Source of the Bhima river, set in the Sahyadri mountains.",
  },
  {
    id: 11,
    name: "Mallikarjuna",
    location: "Srisailam, Andhra Pradesh",
    description: "Known as the Kailash of the South, located on the Shri Parvata hill.",
  },
  {
    id: 12,
    name: "Rameshwaram",
    location: "Tamil Nadu",
    description: "The southernmost Jyotirlinga, worshipped by Lord Rama before crossing the ocean to Lanka.",
  },
];

export default function JyotirlingasPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-5xl mx-auto relative overflow-x-hidden">
      
      <div className="text-center mb-24 relative z-10">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
          The 12 Jyotirlingas
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Embark on a divine journey from the snow-capped Himalayas in the North to the sacred shores of the South.
        </p>
      </div>

      <div ref={containerRef} className="relative">
        
        {/* The Animated Connecting Line */}
        <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-1 bg-gray-800 -translate-x-1/2 z-0" />
        <motion.div
          className="absolute left-[28px] md:left-1/2 top-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-amber-500 -translate-x-1/2 z-10 origin-top shadow-[0_0_15px_rgba(59,130,246,0.8)]"
          style={{ height: lineHeight }}
        />

        {jyotirlingas.map((site, index) => {
          const isEven = index % 2 === 0;
          
          return (
            <div key={site.id} className="relative z-20 flex flex-col md:flex-row items-center w-full mb-24 last:mb-0">
              
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

              {/* Content Card (Alternating left/right on desktop) */}
              <div className={`w-full pl-16 md:pl-0 md:w-1/2 ${isEven ? "md:pr-16 md:text-right" : "md:pl-16 md:ml-auto"}`}>
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="bg-shiva-charcoal/80 backdrop-blur-sm border border-white/5 p-6 rounded-2xl hover:border-white/20 transition-colors"
                >
                  <div className={`flex items-center gap-2 mb-2 text-shiva-gold ${isEven ? "md:justify-end" : ""}`}>
                    <MapPin size={16} />
                    <span className="text-xs uppercase tracking-widest font-semibold">{site.location}</span>
                  </div>
                  
                  <h3 className="text-2xl font-serif font-bold text-white mb-3">
                    {site.name}
                  </h3>
                  
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {site.description}
                  </p>
                  
                  {/* Map Placeholder */}
                  <div className="w-full h-32 bg-gray-900 rounded-lg mb-6 flex items-center justify-center border border-white/5">
                    <span className="text-gray-600 text-sm font-mono">[ Map Iframe Placeholder ]</span>
                  </div>

                  {/* AI Trip Planner Button */}
                  <button className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-medium transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] group">
                    <Sparkles size={16} className="text-shiva-blue group-hover:text-shiva-blue-glow transition-colors" />
                    Plan Trip with AI
                  </button>
                </motion.div>
              </div>

            </div>
          );
        })}
      </div>
    </main>
  );
}
