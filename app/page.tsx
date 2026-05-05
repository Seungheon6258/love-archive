"use client";

import dynamic from "next/dynamic";

const AntigravityEffect = dynamic(
  () => import("@/components/intro/AntigravityEffect"),
  { ssr: false }
);

export default function IntroPage() {
  return (
    <main className="w-full h-screen overflow-hidden">
      <AntigravityEffect />
    </main>
  );
}
