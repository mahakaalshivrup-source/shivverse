"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import MantrasGrid from "@/components/MantrasGrid";
import Teleprompter from "@/components/Teleprompter";
import type { Mantra } from "@/data/mantrasData";

// ═══════════════════════════════════════════════════
// Mantras Page — Orchestrates Grid ↔ Player Views
// ═══════════════════════════════════════════════════
export default function MantrasPage() {
  const [activeView, setActiveView] = useState<"grid" | "player">("grid");
  const [, setSelectedMantra] = useState<Mantra | null>(null);

  const handleSelectMantra = (mantra: Mantra) => {
    setSelectedMantra(mantra);
    setActiveView("player");
  };

  const handleBackToGrid = () => {
    setActiveView("grid");
  };

  return (
    <main className="min-h-screen pt-28 md:pt-32 pb-32 px-4 md:px-8">
      <AnimatePresence mode="wait">
        {activeView === "grid" ? (
          <MantrasGrid
            key="grid"
            onSelectMantra={handleSelectMantra}
          />
        ) : (
          <Teleprompter
            key="player"
            onBack={handleBackToGrid}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
