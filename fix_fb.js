const fs = require('fs');
let footer = fs.readFileSync('src/components/Footer.tsx', 'utf-8');
footer = footer.replace('https://www.facebook.com/jai.maa.ambe/', 'https://www.facebook.com/mymahakaal/');
fs.writeFileSync('src/components/Footer.tsx', footer);
