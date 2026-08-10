import HeroSection from "@/components/HeroSection";
import SymbolismSection from "@/components/SymbolismSection";
import dynamic from "next/dynamic";

const SacredTextsSection = dynamic(
  () => import("@/components/SacredTextsSection"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <HeroSection />
      <SymbolismSection />
      <SacredTextsSection />
    </main>
  );
}
