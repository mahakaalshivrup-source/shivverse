"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2 } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: text.trim(),
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setInput("");
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to get response");
        }

        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.reply,
        };

        setMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Connection disrupted. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading]
  );

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  
  const handleQuickPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════
          FLOATING ACTION BUTTON
          ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-28 right-6 z-50 flex items-center gap-3 group cursor-pointer"
          >
            {/* Label */}
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium px-4 py-2 rounded-full shadow-lg hidden sm:block"
            >
              Ask Me
            </motion.span>

            {/* Logo Button with Pulse Ring */}
            <div className="relative">
              {/* Pulse Animation Rings */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white/30"
                animate={{ scale: [1, 1.4, 1.4], opacity: [0.6, 0, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white/20"
                animate={{ scale: [1, 1.6, 1.6], opacity: [0.4, 0, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.5,
                }}
              />

              {/* The Actual Button */}
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white/10 backdrop-blur-md border-2 border-white/20 shadow-[0_0_30px_rgba(0,75,122,0.4)] group-hover:shadow-[0_0_40px_rgba(0,75,122,0.6)] transition-shadow duration-500">
                <Image
                  src="/logos/shivalogo.png"
                  alt="Ask Divine Guide"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════
          CHAT WINDOW
          ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-28 right-6 w-[340px] md:w-96 h-[520px] z-50 flex flex-col rounded-2xl overflow-hidden bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,75,122,0.3)]"
          >
            {}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-gradient-to-r from-[#004B7A]/20 to-transparent">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/20">
                  <Image
                    src="/logos/shivalogo.png"
                    alt="Divine Guide"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm tracking-wide">
                    Divine Guide
                  </h3>
                  <p className="text-white/40 text-[11px]">
                    Sanatan Dharma • Temples • Mantras
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/50 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
            >
              {/* Welcome Message */}
              {messages.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-center px-4 gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/10 shadow-[0_0_20px_rgba(0,75,122,0.2)]">
                    <Image
                      src="/logos/shivalogo.png"
                      alt="Welcome"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium mb-1">
                      🕉️ Om Namah Shivaya
                    </p>
                    <p className="text-white/40 text-xs leading-relaxed">
                      Ask me about Lord Shiva, Hindu scriptures, mantras,
                      temples, Jyotirlingas, or any aspect of Sanatan Dharma.
                    </p>
                  </div>
                  {/* Quick Prompts */}
                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {[
                      "Tell me about Shiva",
                      "What are the 12 Jyotirlingas?",
                      "Explain Mahamrityunjaya Mantra",
                    ].map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => handleQuickPrompt(prompt)}
                        className="text-[11px] text-white/60 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 hover:bg-white/10 hover:text-white/80 transition-all cursor-pointer"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Bubbles */}
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "bg-blue-900/40 text-white rounded-l-xl rounded-tr-xl border border-blue-500/20"
                        : "bg-white/5 text-white/90 rounded-r-xl rounded-tl-xl border border-white/10"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <div className="prose prose-invert prose-sm prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0 max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/5 border border-white/10 rounded-r-xl rounded-tl-xl px-4 py-3 flex items-center gap-2">
                    <Loader2
                      size={14}
                      className="animate-spin text-white/50"
                    />
                    <span className="text-white/40 text-sm">
                      Channeling wisdom...
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Error */}
              {error && (
                <div className="text-red-400/80 text-xs text-center bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error} 🙏
                </div>
              )}
            </div>

            {}
            <form
              onSubmit={handleSubmit}
              className="px-4 py-3 border-t border-white/10 bg-black/30"
            >
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Shiva, mantras, temples..."
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/25 transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-[#004B7A] hover:bg-[#005d99] disabled:bg-white/5 disabled:text-white/20 text-white p-2.5 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(0,75,122,0.3)] hover:shadow-[0_0_20px_rgba(0,75,122,0.5)] disabled:shadow-none cursor-pointer disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
