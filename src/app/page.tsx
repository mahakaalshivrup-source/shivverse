import HeroSection from "@/components/HeroSection";
import SymbolismSection from "@/components/SymbolismSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <HeroSection />
      <SymbolismSection />
    </main>
  );
}
