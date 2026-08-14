const fs = require('fs');
let content = fs.readFileSync('src/app/layout.tsx', 'utf8');

const importScript = 'import Script from "next/script";\n';
if (!content.includes('import Script')) {
  content = content.replace('import { SpeedInsights }', importScript + 'import { SpeedInsights }');
}

const headInsert = 
      <head>
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: \
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-NZRN6R2B');
            \
          }}
        />
      </head>;

if (!content.includes('google-tag-manager')) {
  content = content.replace('<html lang="en" className={${inter.variable}  dark}>', '<html lang="en" className={${inter.variable}  dark}>' + headInsert);
}

const bodyInsert = 
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NZRN6R2B"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>;

if (!content.includes('GTM-NZRN6R2B"')) {
  content = content.replace('<body className="antialiased bg-black text-slate-200">', '<body className="antialiased bg-black text-slate-200">' + bodyInsert);
}

fs.writeFileSync('src/app/layout.tsx', content, 'utf8');
console.log('Success');
