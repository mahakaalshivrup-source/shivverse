import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import AudioProvider from "@/context/AudioProvider";
import GlobalPlayer from "@/components/GlobalPlayer";
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
    <html lang="en" className={`${inter.variable} ${playfair.variable} dark`}>
      <body className="antialiased bg-black text-slate-200">
        <AudioProvider>
          <Navbar />
          {children}
          <GlobalPlayer />
        </AudioProvider>
      </body>
    </html>
  );
}
