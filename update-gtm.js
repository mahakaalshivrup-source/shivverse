const fs = require('fs');
let content = fs.readFileSync('src/app/layout.tsx', 'utf8');
if (!content.includes('import Script')) {
  content = content.replace('import { SpeedInsights } from "@vercel/speed-insights/next";', 'import { SpeedInsights } from "@vercel/speed-insights/next";\nimport Script from "next/script";');
}
if (!content.includes('id="google-tag-manager"')) {
  content = content.replace('<html lang="en" className={`${inter.variable} ${playfair.variable} dark`}>', '<html lang="en" className={`${inter.variable} ${playfair.variable} dark`}>\n      <head>\n        <Script\n          id="google-tag-manager"\n          strategy="afterInteractive"\n          dangerouslySetInnerHTML={{\n            __html: `\n              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({\\'gtm.start\\':\n              new Date().getTime(),event:\\'gtm.js\\'});var f=d.getElementsByTagName(s)[0],\n              j=d.createElement(s),dl=l!=\\'dataLayer\\'?\\'&l=\\'+l:\\'\\';j.async=true;j.src=\n              \\'https://www.googletagmanager.com/gtm.js?id=\\'+i+dl;f.parentNode.insertBefore(j,f);\n              })(window,document,\\'script\\',\\'dataLayer\\',\\'GTM-NZRN6R2B\\');\n            `\n          }}\n        />\n      </head>');
}
if (!content.includes('ns.html?id=GTM-NZRN6R2B')) {
  content = content.replace('<body className="antialiased bg-black text-slate-200">', '<body className="antialiased bg-black text-slate-200">\n        <noscript>\n          <iframe\n            src="https://www.googletagmanager.com/ns.html?id=GTM-NZRN6R2B"\n            height="0"\n            width="0"\n            style={{ display: "none", visibility: "hidden" }}\n          />\n        </noscript>');
}
fs.writeFileSync('src/app/layout.tsx', content, 'utf8');
console.log('Updated layout.tsx');
