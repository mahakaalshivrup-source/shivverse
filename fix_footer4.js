const fs = require('fs');
let footer = fs.readFileSync('src/components/Footer.tsx', 'utf-8');

const searchStr = `</svg>
                    </a>
                </div>`;

const newStr = `</svg>
                    </a>
                    <a href="https://www.google.com/search?q=Siddheshwar+Mahadev+Temple&stick=H4sIAAAAAAAA_-NgU1I2qDC2tLQwTTNMSkszT0kxNrG0MqgwsTAyMDEySko2TTU0M1jEKhWcmZKSkVqcUZ5YpOCbmJGYklqmEJKaW5CTCgDqL0UYRAAAAA&hl=en&mat=CdqAYXVUE6DyElcBa0lj_32YGgO06Gougd64URCJrAjAEibw-IH5huuDd6J_vA9dqzShQ8lf4f-R0CkAKGMDCSgZiO2pO1i-k3JZVCDj-ZYWJAJE5eENCV5ekRtQYnY6m5k&authuser=0" target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-110 transform flex items-center justify-center grayscale hover:grayscale-0">
                      <Image src="/logos/google-business.png" alt="Google Business Profile" width={24} height={24} className="object-contain" />
                    </a>
                </div>`;

footer = footer.replace(searchStr, newStr);
fs.writeFileSync('src/components/Footer.tsx', footer);
