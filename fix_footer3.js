const fs = require('fs');
let footer = fs.readFileSync('src/components/Footer.tsx', 'utf-8');

// Revert the lucide-react import
footer = footer.replace(
  "import { Mail, MapPin, ArrowRight, CheckCircle2, Facebook, Instagram } from 'lucide-react';",
  "import { Mail, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';"
);

const facebookSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`;
const instagramSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`;

const oldSocials = `<Facebook size={24} />
                  </a>
                  <a href="https://www.instagram.com/mahakaalshivrup" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#E4405F] transition-colors duration-300 hover:scale-110 transform">
                    <Instagram size={24} />`;

const newSocials = `${facebookSvg}
                  </a>
                  <a href="https://www.instagram.com/mahakaalshivrup" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#E4405F] transition-colors duration-300 hover:scale-110 transform">
                    ${instagramSvg}`;

footer = footer.replace(oldSocials, newSocials);

fs.writeFileSync('src/components/Footer.tsx', footer);
