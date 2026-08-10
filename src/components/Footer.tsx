'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';

const aboutLinks = [
  { name: 'A Journey of Knowledge, Awareness & Devotion', href: '/about#a-journey-of-knowledge-awareness--devotion' },
  { name: 'Our Purpose', href: '/about#our-purpose' },
  { name: 'What You Can Discover', href: '/about#what-you-can-discover' },
  { name: 'Our Vision', href: '/about#our-vision' },
  { name: 'A Humble Beginning', href: '/about#a-humble-beginning' },
];

const shivaExplorationLinks = [
  { name: 'Home', href: '/' },
  { name: 'Symbolism', href: '/symbolism' },
  { name: 'Stories', href: '/stories' },
  { name: 'Shlokas', href: '/shlokas' },
  { name: 'Library', href: '/library' },
  { name: 'Jyotirlingas', href: '/jyotirlingas' },
  { name: 'Darshan', href: '/darshan' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault(); // Prepare for backend wiring
    if (!email) return;
    
    // Simulate API call
    setIsSubscribed(true);
    setEmail('');
    
    // Reset success message after 3 seconds
    setTimeout(() => {
      setIsSubscribed(false);
    }, 3000);
  };

  return (
    <footer className="bg-[#004B7A] border-t border-white/20">
      <div className="max-w-7xl mx-auto px-6 py-24">

        {/* ═══════════════════════════════════════════════════════════
            TOP TIER: Mission Statement & Newsletter
            ═══════════════════════════════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

          {/* ── Left: Mission ── */}
          <div className="lg:flex-1">
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-white mb-4">
              Har Har Mahadev
            </h3>
            <p className="text-white/80 leading-relaxed max-w-lg text-sm md:text-base">
              ShivVerse is a digital sanctuary dedicated to exploring the divine
              universe, sacred traditions, and timeless philosophy of Lord Shiva.
              We bridge ancient spiritual heritage with modern interactive
              experiences for seekers worldwide.
            </p>
          </div>

          {/* ── Right: Newsletter ── */}
          <div className="lg:flex-1 lg:max-w-md">
            <h3 className="font-[family-name:var(--font-playfair)] text-white text-2xl md:text-3xl tracking-wide mb-6">
              Stay Illuminated
            </h3>
            <p className="text-white/90 mb-4 text-sm md:text-base leading-relaxed">
              Stay illuminated with our latest spiritual insights, temple
              updates, and cosmic wisdom by subscribing to our newsletter.
            </p>
            
            <form onSubmit={handleSubscribe} className="relative">
              <div className="flex items-stretch">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="bg-black/20 border border-white/20 focus:border-white/50 text-white placeholder:text-white/50 px-4 py-3 rounded-l-md outline-none w-full max-w-[250px] md:max-w-xs transition-colors duration-300"
                  disabled={isSubscribed}
                />
                <button
                  type="submit"
                  disabled={isSubscribed}
                  className="bg-white text-[#004B7A] font-bold px-6 py-3 rounded-r-md hover:bg-gray-200 transition-colors duration-300 flex items-center gap-2 whitespace-nowrap group disabled:opacity-80 disabled:cursor-not-allowed"
                >
                  {isSubscribed ? 'Subscribed!' : 'Subscribe'}
                  {!isSubscribed && (
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  )}
                </button>
              </div>
              
              {/* Success Message Overlay */}
              {isSubscribed && (
                <div className="absolute -bottom-8 left-0 flex items-center gap-2 text-green-300 text-sm animate-in fade-in slide-in-from-bottom-2">
                  <CheckCircle2 size={14} />
                  <span>Successfully subscribed to the cosmic wisdom!</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* ── Horizontal Divider ── */}
        <div className="border-t border-white/20 my-12" />

        {/* ═══════════════════════════════════════════════════════════
            BOTTOM TIER: Navigation Columns & Brand Info
            ═══════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* ── Column 1: About Us ── */}
          <div>
            <h4 className="font-[family-name:var(--font-playfair)] text-white text-xl md:text-2xl font-semibold mb-6 tracking-wide">
              About Us
            </h4>
            <ul>
              {aboutLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-base text-white/70 hover:text-white hover:translate-x-2 transition-all duration-300 block mb-5"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 2: Shiva Exploration ── */}
          <div>
            <h4 className="font-[family-name:var(--font-playfair)] text-white text-xl md:text-2xl font-semibold mb-6 tracking-wide">
              Shiva Exploration
            </h4>
            <ul>
              {shivaExplorationLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-base text-white/70 hover:text-white hover:translate-x-2 transition-all duration-300 block mb-5"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3 & 4: Brand & Contact (spans 2 cols on lg) ── */}
          <div className="md:col-span-2">
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              {/* Logo */}
              <div className="shrink-0">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 mb-6 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  <Image
                    src="/logos/shivalogo.png"
                    alt="ShivVerse Logo"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-5">
                <h4 className="font-[family-name:var(--font-playfair)] text-white text-xl md:text-2xl font-semibold tracking-wide">
                  ShivVerse
                </h4>
                <p className="text-base text-white/80 leading-loose max-w-sm">
                  A digital sanctuary for seekers of Lord Shiva&apos;s eternal wisdom.
                </p>

                {/* Email */}
                <a
                  href="mailto:contact@shivverse1.vercel.app"
                  className="flex items-center gap-3 text-base text-white/80 hover:text-white transition-colors duration-300 group"
                >
                  <Mail
                    size={18}
                    className="text-white/60 group-hover:text-white transition-colors duration-300"
                  />
                  contact@shivverse1.vercel.app
                </a>

                {/* Address */}
                <div className="flex items-start gap-3 text-base text-white/80">
                  <MapPin
                    size={18}
                    className="text-white/60 mt-1 shrink-0"
                  />
                  <span className="leading-loose">
                    Siddheshwar Temple, Chakiya Road,
                    <br />
                    Rupaidiha, UP, 271881
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            COPYRIGHT BAR
            ═══════════════════════════════════════════════════════════ */}
        <div className="text-xs text-white/50 text-center mt-16 pt-8 border-t border-white/20">
          © {new Date().getFullYear()} ShivVerse. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
