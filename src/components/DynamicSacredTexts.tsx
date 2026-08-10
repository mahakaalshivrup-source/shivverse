"use client";

import dynamic from "next/dynamic";

const SacredTextsSection = dynamic(
  () => import("@/components/SacredTextsSection"),
  { ssr: false }
);

export default function DynamicSacredTexts() {
  return <SacredTextsSection />;
}
