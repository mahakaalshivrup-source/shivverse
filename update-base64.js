const fs = require('fs');
let content = fs.readFileSync('src/app/layout.tsx', 'utf8');

const gtmScript = '        <Script id="google-tag-manager" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({\'gtm.start\': new Date().getTime(),event:\'gtm.js\'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!=\'dataLayer\'?\'&l=\'+l:\'';j.async=true;j.src=\'https://www.googletagmanager.com/gtm.js?id=\'+i+dl;f.parentNode.insertBefore(j,f); })(window,document,\'script\',\'dataLayer\',\'GTM-NZRN6R2B\');` }} />';

const gtmNoScript = '        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NZRN6R2B" height="0" width="0" style={{ display: "none", visibility: "hidden" }}></iframe></noscript>';

if (!content.includes('import Script')) {
  content = content.replace('import { SpeedInsights }', 'import Script from "next/script";\nimport { SpeedInsights }');
}

if (!content.includes('google-tag-manager')) {
  content = content.replace('      <body', '      <head>\n' + gtmScript + '\n      </head>\n      <body');
}

if (!content.includes('GTM-NZRN6R2B"w)) {
  content = content.replace('        <AudioProvider>', gtmNoScript + '\n        <AudioProvider>');
}

fs.writeFileSync('src/app/layout.tsx', content, 'utf8');