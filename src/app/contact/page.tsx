"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, MapPin, Mail, Phone } from "lucide-react";
import { TrishulLoader } from '@/components/TrishulLoader';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          ...formData,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
        // Optional: Reset success message after a few seconds
        setTimeout(() => setIsSubmitted(false), 8000);
      } else {
        throw new Error(result.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black relative overflow-hidden flex flex-col pt-32 pb-24 text-white">
      {/* Background Cosmic Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col space-y-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 drop-shadow-md">
              Connect with the <br />
              <span className="text-[#004B7A]">
                Divine Energy
              </span>
            </h1>
            <p className="text-gray-300 leading-relaxed text-lg mb-6">
              Welcome to our digital sanctuary. Our mission is to bridge the gap
              between ancient sacred traditions and the modern seeker. Whether
              you are beginning your journey into the cosmic consciousness of Lord
              Shiva or deepening your spiritual practice, this space is built for
              you.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Have questions about your spiritual journey, our Jyotirlinga
              guides, or the sacred texts? Reach out to us. We are here to guide
              and assist you on your path to inner awakening.
            </p>
          </div>

        </motion.div>

        {/* Contact Form Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Subtle card glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] pointer-events-none rounded-full" />

            <h2 className="text-2xl font-serif font-semibold text-white mb-8 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> Send a Message
            </h2>

            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-6 bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3 text-green-400"
                >
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-sm font-medium">
                    Your query has been received. May the divine blessings be
                    with you!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm"
                >
                  {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="text-xs font-medium text-gray-400 uppercase tracking-wider pl-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Arjuna"
                  className="w-full bg-black/40 border border-white/15 focus:border-amber-400/80 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="text-xs font-medium text-gray-400 uppercase tracking-wider pl-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="arjuna@example.com"
                    className="w-full bg-black/40 border border-white/15 focus:border-amber-400/80 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="phone"
                    className="text-xs font-medium text-gray-400 uppercase tracking-wider pl-1"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 ..."
                    className="w-full bg-black/40 border border-white/15 focus:border-amber-400/80 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="message"
                  className="text-xs font-medium text-gray-400 uppercase tracking-wider pl-1"
                >
                  Your Query
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we assist you on your spiritual journey?"
                  className="w-full bg-black/40 border border-white/15 focus:border-amber-400/80 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-[#004B7A] hover:bg-[#00385b] text-white font-semibold rounded-xl py-3.5 shadow-lg transition-all transform active:scale-95 disabled:opacity-70 disabled:active:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <TrishulLoader size={20} className="mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message <Send className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
