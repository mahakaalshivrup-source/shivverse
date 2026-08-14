const fs = require('fs');
let hero = fs.readFileSync('src/components/HeroSection.tsx', 'utf-8');
hero = hero.replace(/<video[\s\S]*?<\/video>/, '<video\n          autoPlay\n          loop\n          muted\n          playsInline\n          preload="metadata"\n          poster="/poster2.webp"\n          className="w-full h-full object-cover opacity-60 brightness-[1.7]"\n          style={{ WebkitTransform: "translateZ(0)" }}\n        >\n          <source src="/New folder/landing2vidoe.webm" type="video/webm" />\n          <source src="/New folder/landing2vidoe.mp4" type="video/mp4" />\n        </video>');
fs.writeFileSync('src/components/HeroSection.tsx', hero);
let layout = fs.readFileSync('src/app/layout.tsx', 'utf-8');
layout = layout.replace('href="/poster.webp"', 'href="/poster2.webp"');
fs.writeFileSync('src/app/layout.tsx', layout);
