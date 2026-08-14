import HeroSection from "@/components/HeroSection";
import dynamic from "next/dynamic";
const SymbolismSection = dynamic(() => import("@/components/SymbolismSection"), { ssr: true });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <HeroSection />
      <SymbolismSection />
    </main>
  );
}
