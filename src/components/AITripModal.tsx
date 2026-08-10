"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Loader2 } from "lucide-react";
import type { JyotirlingaLocation } from "@/data/jyotirlingaData";

interface TripRoute {
  details: string;
  searchQuery: string;
}

interface TripPlan {
  intro: string;
  road: TripRoute;
  cheapest: TripRoute;
  fastest: TripRoute;
}

type ChatStep = "greeting" | "waiting" | "loading" | "result" | "error";

interface AITripModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedJyotirlinga: JyotirlingaLocation | null;
}

export default function AITripModal({
  isOpen,
  onClose,
  selectedJyotirlinga,
}: AITripModalProps) {
  const [step, setStep] = useState<ChatStep>("greeting");
  const [userCity, setUserCity] = useState("");
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStep("greeting");
      setUserCity("");
      setTripPlan(null);
      setErrorMsg("");
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, selectedJyotirlinga]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [step, tripPlan]);

  const handleSubmit = async () => {
    if (!userCity.trim() || !selectedJyotirlinga) return;

    setStep("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/trip-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userCity: userCity.trim(),
          destination: `${selectedJyotirlinga.name}, ${selectedJyotirlinga.location}`,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      setTripPlan({
        intro: data.intro || "",
        road: {
          details: data.road?.details || "Route information unavailable.",
          searchQuery: data.road?.searchQuery || "",
        },
        cheapest: {
          details: data.cheapest?.details || "Route information unavailable.",
          searchQuery: data.cheapest?.searchQuery || "",
        },
        fastest: {
          details: data.fastest?.details || "Route information unavailable.",
          searchQuery: data.fastest?.searchQuery || "",
        },
      });
      setStep("result");
    } catch (err) {
      console.error("Trip planner error:", err);
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong."
      );
      setStep("error");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!selectedJyotirlinga) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal — narrow & tall */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-black/30 backdrop-blur-3xl border border-white/10 rounded-2xl w-[400px] sm:w-[420px] min-h-[500px] max-h-[85vh] flex flex-col shadow-2xl pointer-events-auto">
              {/* Minimal Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                <span className="text-white/90 text-sm font-medium tracking-wide">
                  {selectedJyotirlinga.name}{" "}
                  <span className="text-white/30">•</span>{" "}
                  <span className="text-white/50 font-normal">
                    {selectedJyotirlinga.location}
                  </span>
                </span>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white/40 hover:text-white/80"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Chat Body */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 hide-scrollbar">
                {/* Greeting */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-md px-4 py-3 max-w-[88%]">
                    <p className="text-white/90 text-sm leading-relaxed">
                      🙏 Namaste! I can help you reach{" "}
                      <span className="text-white font-medium">
                        {selectedJyotirlinga.name}
                      </span>
                      . What is your current location or starting city?
                    </p>
                  </div>
                </motion.div>

                {/* User Message */}
                {(step === "loading" ||
                  step === "result" ||
                  step === "error") && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                  >
                    <div className="bg-white/[0.08] border border-white/10 rounded-2xl rounded-tr-md px-4 py-3 max-w-[80%]">
                      <p className="text-white text-sm">{userCity}</p>
                    </div>
                  </motion.div>
                )}

                {/* Loading */}
                {step === "loading" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-md px-4 py-3 inline-block">
                      <div className="flex items-center gap-2 text-white/50 text-sm">
                        <Loader2 size={13} className="animate-spin" />
                        <span>Calculating routes…</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Error */}
                {step === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-red-500/5 border border-red-500/10 rounded-2xl rounded-tl-md px-4 py-3 max-w-[88%]">
                      <p className="text-red-400/80 text-sm leading-relaxed">
                        {errorMsg || "Something went wrong. Please try again."}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* ── Trip Plan Result — Single Fluid Chat Bubble ── */}
                {step === "result" && tripPlan && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                  >
                    <div className="bg-white/5 border border-white/10 rounded-xl rounded-tl-md px-4 py-4 max-w-[95%] text-sm leading-relaxed">
                      {/* Intro Paragraph */}
                      <p className="text-white/90">{tripPlan.intro}</p>

                      {/* Divider */}
                      <div className="border-t border-white/10 my-3" />

                      {/* 🚗 By Road */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-white/90">
                            🚗 By Road
                          </span>
                          <a
                            href={`https://www.google.com/maps/dir/${encodeURIComponent(tripPlan.road.searchQuery)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 border border-white/20 rounded-md text-[10px] uppercase tracking-wider text-white/50 hover:text-white/90 hover:bg-white/10 transition-colors"
                          >
                            Check Route
                          </a>
                        </div>
                        <p className="text-white/70">
                          {tripPlan.road.details}
                        </p>
                      </div>

                      {/* 🚆 Cheapest */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-white/90">
                            🚆 Cheapest (Train + Road)
                          </span>
                          <a
                            href={`https://www.google.com/search?q=${encodeURIComponent(tripPlan.cheapest.searchQuery)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 border border-white/20 rounded-md text-[10px] uppercase tracking-wider text-white/50 hover:text-white/90 hover:bg-white/10 transition-colors"
                          >
                            Check Trains
                          </a>
                        </div>
                        <p className="text-white/70">
                          {tripPlan.cheapest.details}
                        </p>
                      </div>

                      {/* ✈️ Fastest */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-white/90">
                            ✈️ Fastest (Flight + Road)
                          </span>
                          <a
                            href={`https://www.google.com/search?q=${encodeURIComponent(tripPlan.fastest.searchQuery)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 border border-white/20 rounded-md text-[10px] uppercase tracking-wider text-white/50 hover:text-white/90 hover:bg-white/10 transition-colors"
                          >
                            Check Flights
                          </a>
                        </div>
                        <p className="text-white/70">
                          {tripPlan.fastest.details}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              {(step === "greeting" ||
                step === "waiting" ||
                step === "error") && (
                <div className="px-4 pb-4 pt-2">
                  <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-xl p-1.5 focus-within:border-white/20 transition-colors">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Enter your city (e.g., Kanpur, Lucknow, Delhi)..."
                      value={userCity}
                      onChange={(e) => setUserCity(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 bg-transparent text-white/90 text-sm placeholder:text-white/20 px-3 py-2 outline-none"
                    />
                    <button
                      onClick={handleSubmit}
                      disabled={!userCity.trim()}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 disabled:bg-transparent disabled:text-white/10 flex items-center justify-center transition-all text-white/50 hover:text-white shrink-0 border border-white/5 disabled:border-transparent"
                    >
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Reset */}
              {step === "result" && (
                <div className="px-4 pb-4 pt-2">
                  <button
                    onClick={() => {
                      setStep("greeting");
                      setUserCity("");
                      setTripPlan(null);
                      setErrorMsg("");
                      setTimeout(() => inputRef.current?.focus(), 100);
                    }}
                    className="w-full py-2.5 text-xs text-white/30 hover:text-white/60 bg-white/[0.02] hover:bg-white/5 rounded-xl transition-all border border-white/5"
                  >
                    Plan from a different city
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
