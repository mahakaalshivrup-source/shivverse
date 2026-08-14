import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AudioProvider from "@/context/AudioProvider";
import GlobalPlayer from "@/components/GlobalPlayer";
import AIChatBot from "@/components/AIChatBot";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shiva Verse",
  description: "Explore the stories, symbolism, mantras, and pilgrimage sites of Lord Shiva.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} dark}>
      <head>
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NZRN6R2B');`
          }}
        />
      </head>
      <body className="antialiased bg-black text-slate-200">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTE-NZRN6R2B"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <AudioProvider>
          <Navbar />
           {children}
          <Footer />
          <GlobalPlayer />
          <AIChatBot />
          <SpeedInsights />
        </AudioProvider>
      </body>
    </html>
  );
}
