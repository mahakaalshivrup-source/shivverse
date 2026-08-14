const fs = require('fs');
let hero = fs.readFileSync('src/components/HeroSection.tsx', 'utf-8');
hero = hero.replace('<div className="absolute inset-0 bg-black/60 z-10" />', '');
hero = hero.replace('{/* Dark Overlay */}', '');
hero = hero.replace(/<video[\s\S]*?<\/video>/, '<video\n          autoPlay\n          loop\n          muted\n          playsInline\n          preload="metadata"\n          poster="/poster.webp"\n          className="w-full h-full object-cover brightness-[0.4]"\n          style={{ WebkitTransform: "translateZ(0)" }}\n        >\n          <source src="/New folder/All_thing_is_fine_but_he_look.webm" type="video/webm" />\n        </video>');
fs.writeFileSync('src/components/HeroSection.tsx', hero);
let layout = fs.readFileSync('src/app/layout.tsx', 'utf-8');
if (!layout.includes('<link rel="preload"')) {
  layout = layout.replace('<head>', '<head>\n        <link rel="preload" as="image" href="/poster.webp" media="(max-width: 768px)" fetchPriority="high" />');
  fs.writeFileSync('src/app/layout.tsx', layout);
}
let page = fs.readFileSync('src/app/page.tsx', 'utf-8');
if (!page.includes('dynamic(() => import')) {
  page = page.replace('import SymbolismSection from "@/components/SymbolismSection";', 'import dynamic from "next/dynamic";\nconst SymbolismSection = dynamic(() => import("@/components/SymbolismSection"), { ssr: true });');
  fs.writeFileSync('src/app/page.tsx', page);
}
let dynamicTexts = fs.readFileSync('src/components/DynamicSacredTexts.tsx', 'utf-8');
if (!dynamicTexts.includes('ssr: false')) {
  dynamicTexts = dynamicTexts.replace(/const SacredTextsSection = dynamic\([\s\S]*?\);/, 'const SacredTextsSection = dynamic(\n  () => import("@/components/SacredTextsSection"),\n  { \n    ssr: false,\n    loading: () => (\n      <div className="w-full h-96 flex items-center justify-center text-white/50 animate-pulse">\n        <p>Loading Sacred Texts...</p>\n      </div>\n    )\n  }\n);');
  fs.writeFileSync('src/components/DynamicSacredTexts.tsx', dynamicTexts);
}
