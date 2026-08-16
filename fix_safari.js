const fs = require('fs');
let hero = fs.readFileSync('src/components/HeroSection.tsx', 'utf-8');
hero = hero.replace('<source src="/New folder/All_thing_is_fine_but_he_look.webm" type="video/webm" />', '<source src="/New%20folder/All_thing_is_fine_but_he_look.mp4" type="video/mp4" />\n            <source src="/New%20folder/All_thing_is_fine_but_he_look.webm" type="video/webm" />');
fs.writeFileSync('src/components/HeroSection.tsx', hero);
