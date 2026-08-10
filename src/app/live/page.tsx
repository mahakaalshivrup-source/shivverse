import RetroLiveTV from "@/components/RetroLiveTV";

export const metadata = {
  title: "Live Darshan | ShivaVerse",
  description: "Experience the divine energy through live streams of ancient Shiva temples.",
};

export default function LivePage() {
  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-12 px-4 relative overflow-hidden flex flex-col items-center">
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,rgba(0,75,122,0.15),transparent_50%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent" />

      <div className="text-center mb-8 relative z-10 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
          Live Darshan
        </h1>
        <p className="text-gray-400 font-light tracking-wide">
          Tune into the cosmic energy. Connect with sacred Shiva temples across India in real-time through our Retro Live TV.
        </p>
      </div>

      <RetroLiveTV />
      
    </main>
  );
}
