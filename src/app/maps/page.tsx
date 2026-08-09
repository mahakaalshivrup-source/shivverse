"use client";

import dynamic from "next/dynamic";

const JyotirlingaMap = dynamic(
  () => import("@/components/JyotirlingaMap"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[100dvh] w-full bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-500">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500/30 border-t-blue-400 animate-spin" />
          <p className="text-sm font-sans">Loading Map…</p>
        </div>
      </div>
    ),
  },
);

export default function JyotirlingaMapDemoPage() {
  return <JyotirlingaMap />;
}
