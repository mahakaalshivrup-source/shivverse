"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";

// ═══════════════════════════════════════════════════
// Gradient palettes for fallback banners (per card)
// ═══════════════════════════════════════════════════
const gradients = [
  "from-slate-900 via-gray-900 to-black",
  "from-indigo-950 via-slate-900 to-black",
  "from-blue-950 via-gray-900 to-black",
  "from-cyan-950 via-slate-900 to-black",
  "from-violet-950 via-gray-900 to-black",
  "from-slate-900 via-zinc-900 to-black",
  "from-stone-900 via-gray-900 to-black",
  "from-neutral-900 via-slate-900 to-black",
  "from-blue-950 via-indigo-950 to-black",
  "from-emerald-950 via-gray-900 to-black",
  "from-purple-950 via-slate-900 to-black",
  "from-sky-950 via-gray-900 to-black",
  "from-rose-950 via-gray-900 to-black",
  "from-amber-950 via-slate-900 to-black",
  "from-teal-950 via-gray-900 to-black",
  "from-fuchsia-950 via-gray-900 to-black",
  "from-lime-950 via-slate-900 to-black",
  "from-orange-950 via-gray-900 to-black",
  "from-pink-950 via-slate-900 to-black",
  "from-cyan-950 via-indigo-950 to-black",
];

// ═══════════════════════════════════════════════════
// Complete Stories Data from CMS
// ═══════════════════════════════════════════════════
// Data is now fetched dynamically from /api/content

// ═══════════════════════════════════════════════════
// StoryCard sub-component with fallback banner
// ═══════════════════════════════════════════════════
function StoryCard({
  story,
  index,
  onClick,
}: {
  story: any;
  index: number;
  onClick: () => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const gradient = gradients[story.id % gradients.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.3 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl bg-gray-900 aspect-[4/5] cursor-pointer shadow-lg hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(100,149,237,0.2)] transition-all duration-300"
    >
      {/* Background: Image or Fallback Banner */}
      <div className="absolute inset-0">
        {!imgFailed ? (
          <img
            src={story.image}
            alt={story.title}
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover opacity-60 brightness-[1.8] group-hover:opacity-40 transition-opacity duration-700 group-hover:scale-110"
          />
        ) : (
          /* ═══ Dynamic Fallback Banner ═══ */
          <div
            className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center p-8`}
          >
            <p className="text-white/30 text-2xl md:text-3xl font-serif font-bold text-center leading-snug select-none">
              {story.title}
            </p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent group-hover:from-black transition-colors duration-500" />
      </div>

      {/* Content Container (Bottom) */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-1 transform transition-transform duration-500 group-hover:-translate-y-2">
          {story.title}
        </h2>
        <div className="w-10 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-y-2 group-hover:translate-y-0" />
      </div>

      {/* Subtle glow border on hover */}
      <div className="absolute inset-0 border border-transparent group-hover:border-white/10 rounded-2xl transition-colors duration-500 pointer-events-none" />
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════
// Main Page Component
// ═══════════════════════════════════════════════════
export default function StoriesPage() {
  const [storiesData, setStoriesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState<any | null>(null);
  const [language, setLanguage] = useState<"english" | "hindi">("english");
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        setStoriesData(data.stories?.reverse() || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const visibleStories = storiesData.slice(0, visibleCount);
  const hasMore = visibleCount < storiesData.length;

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
          The Cosmic Tales
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Delve into the ancient myths and legends of Lord Shiva. Each story
          reveals a profound truth about existence, duty, and devotion.
        </p>
      </motion.div>

      {/* Grid Layout for Stories */}
      {loading ? (
        <div className="flex justify-center py-20">
          <p className="text-white/50 text-xl font-serif">Loading stories from cloud...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleStories.map((story, index) => (
            <StoryCard
              key={story.id}
              story={story}
              index={index}
              onClick={() => setSelectedStory(story)}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mt-16"
        >
          <button
            onClick={() =>
              setVisibleCount((prev) =>
                Math.min(prev + 6, storiesData.length)
              )
            }
            className="group px-8 py-3.5 rounded-full border border-white/20 text-white font-medium tracking-wide hover:bg-white/5 hover:border-blue-400/50 hover:shadow-[0_0_25px_rgba(59,130,246,0.25)] transition-all duration-300 flex items-center gap-2"
          >
            Load More Stories
            <ChevronDown
              size={18}
              className="transition-transform duration-300 group-hover:translate-y-0.5"
            />
          </button>
        </motion.div>
      )}

      {/* Story count indicator */}
      <p className="text-center text-gray-600 text-sm mt-6">
        Showing {visibleStories.length} of {storiesData.length} stories
      </p>

      {/* ═══ Detailed Story Modal ═══ */}
      <AnimatePresence>
        {selectedStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedStory(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.15 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-[#0a0f14]/95 border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header section with sticky behavior */}
              <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-white/5 bg-[#0a0f14]/80 backdrop-blur-md">
                {/* Language Switch */}
                <div className="flex bg-black/50 p-1 rounded-full border border-white/10">
                  <button
                    onClick={() => setLanguage("english")}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      language === "english"
                        ? "bg-white/10 text-white"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage("hindi")}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      language === "hindi"
                        ? "bg-white/10 text-white"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    हिंदी
                  </button>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedStory(null)}
                  className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Scrollable Content Area */}
              <div className="overflow-y-auto p-6 md:p-10 hide-scrollbar">
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-3">
                  {selectedStory.title}
                </h2>

                <p className="text-blue-400/80 text-sm italic tracking-wide mb-8">
                  {selectedStory.source}
                </p>

                {/* Sloka Container */}
                <div className="relative mb-10 p-6 md:p-8 rounded-xl bg-gradient-to-r from-blue-900/20 to-transparent border-l-4 border-blue-500 shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]">
                  <p className="text-lg md:text-xl font-medium text-blue-100 leading-loose text-center md:text-left whitespace-pre-line">
                    {selectedStory.sloka}
                  </p>
                </div>

                {/* Main Story Text */}
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed md:leading-loose text-lg">
                    {selectedStory[language]}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
