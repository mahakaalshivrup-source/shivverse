const fs = require('fs');
let footer = fs.readFileSync('src/components/Footer.tsx', 'utf-8');

// Replace Address
const addressRegex = /\{\/\* Address \*\/\}\s*<div className="flex items-start gap-3 text-base text-white\/80">[\s\S]*?<\/div>/;
const newAddressAndSocials = `                {/* Address (Clickable) */}
                <a
                  href="https://www.google.com/search?q=Siddheshwar+Mahadev+Temple&stick=H4sIAAAAAAAA_-NgU1I2qDC2tLQwTTNMSkszT0kxNrG0MqgwsTAyMDEySko2TTU0M1jEKhWcmZKSkVqcUZ5YpOCbmJGYklqmEJKaW5CTCgDqL0UYRAAAAA&hl=en&mat=CdqAYXVUE6DyElcBa0lj_32YGgO06Gougd64URCJrAjAEibw-IH5huuDd6J_vA9dqzShQ8lf4f-R0CkAKGMDCSgZiO2pO1i-k3JZVCDj-ZYWJAJE5eENCV5ekRtQYnY6m5k&authuser=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-base text-white/80 hover:text-white hover:underline hover:underline-offset-4 decoration-white/50 transition-colors duration-300 group w-fit"
                >
                  <MapPin size={18} className="text-white/60 mt-1 shrink-0 group-hover:text-white transition-colors duration-300" />
                  <span className="leading-loose">
                    Siddheshwar Temple, Chakiya Road,
                    <br />
                    Rupaidiha, UP, 271881
                  </span>
                </a>

                {/* Socials */}
                <div className="flex items-center gap-6 pt-2">
                  <a href="https://www.facebook.com/jai.maa.ambe/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#1877F2] transition-colors duration-300 hover:scale-110 transform">
                    <Facebook size={24} />
                  </a>
                  <a href="https://www.instagram.com/mahakaalshivrup" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#E4405F] transition-colors duration-300 hover:scale-110 transform">
                    <Instagram size={24} />
                  </a>
                </div>`;
footer = footer.replace(addressRegex, newAddressAndSocials);

// Replace Copyright
const copyRegex = /<div className="text-xs text-white\/50 text-center mt-16 pt-8 border-t border-white\/20">[\s\S]*?<\/div>/;
const newCopyright = `<div className="flex flex-col sm:flex-row justify-between items-center text-xs text-white/50 mt-16 pt-8 border-t border-white/20 gap-4">
          <div>\xA9 {new Date().getFullYear()} ShivaVerse. All rights reserved.</div>
          <Link href="/sitemap.xml" className="hover:text-white hover:underline transition-colors duration-300">
            Sitemap
          </Link>
        </div>`;
footer = footer.replace(copyRegex, newCopyright);

fs.writeFileSync('src/components/Footer.tsx', footer);
