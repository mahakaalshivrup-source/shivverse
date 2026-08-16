const fs = require('fs');
let footer = fs.readFileSync('src/components/Footer.tsx', 'utf-8');

const oldEmailRegex = /\{\/\* Email \*\/\}\s*<a\s*href="mailto:mahakaalshiv1987@gmail\.com"[\s\S]*?<\/a>/;
const newEmails = `{/* Emails */}
                <div className="flex flex-col gap-2">
                  <a
                    href="mailto:mahakaalshiv1987@gmail.com"
                    className="flex items-center gap-3 text-base text-white/80 hover:text-white hover:underline hover:underline-offset-4 decoration-white/50 transition-colors duration-300 group w-fit"
                  >
                    <Mail size={18} className="text-white/60 group-hover:text-white transition-colors duration-300" />
                    mahakaalshiv1987@gmail.com
                  </a>
                  <a
                    href="mailto:mahakaalshivrup@gmail.com"
                    className="flex items-center gap-3 text-base text-white/80 hover:text-white hover:underline hover:underline-offset-4 decoration-white/50 transition-colors duration-300 group w-fit"
                  >
                    <Mail size={18} className="text-white/60 group-hover:text-white transition-colors duration-300" />
                    mahakaalshivrup@gmail.com
                  </a>
                </div>`;
footer = footer.replace(oldEmailRegex, newEmails);

const oldGoogleRegex = /<a href="https:\/\/www\.google\.com\/search\?q=Siddheshwar\+Mahadev\+Temple[\s\S]*?<\/a>/;
const newGoogleSVG = `<a href="https://www.google.com/search?q=Siddheshwar+Mahadev+Temple&stick=H4sIAAAAAAAA_-NgU1I2qDC2tLQwTTNMSkszT0kxNrG0MqgwsTAyMDEySko2TTU0M1jEKhWcmZKSkVqcUZ5YpOCbmJGYklqmEJKaW5CTCgDqL0UYRAAAAA&hl=en&mat=CdqAYXVUE6DyElcBa0lj_32YGgO06Gougd64URCJrAjAEibw-IH5huuDd6J_vA9dqzShQ8lf4f-R0CkAKGMDCSgZiO2pO1i-k3JZVCDj-ZYWJAJE5eENCV5ekRtQYnY6m5k&authuser=0" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#EA4335] transition-colors duration-300 hover:scale-110 transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    </a>`;
footer = footer.replace(oldGoogleRegex, newGoogleSVG);

fs.writeFileSync('src/components/Footer.tsx', footer);
