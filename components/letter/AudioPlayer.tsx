"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { isAudioPlaying, setAudioPlaying } = useAppStore();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isAudioPlaying) {
      audio.volume = 0;
      audio.play().catch(() => {});
      let vol = 0;
      const fadeIn = setInterval(() => {
        vol = Math.min(vol + 0.04, 0.35);
        if (audio) audio.volume = vol;
        if (vol >= 0.35) clearInterval(fadeIn);
      }, 120);
    } else {
      let vol = audio.volume;
      const fadeOut = setInterval(() => {
        vol = Math.max(vol - 0.04, 0);
        if (audio) audio.volume = vol;
        if (vol <= 0) { clearInterval(fadeOut); audio?.pause(); }
      }, 80);
    }
  }, [isAudioPlaying]);

  return (
    <>
      <audio ref={audioRef} loop preload="none">
        <source src="/music/letter-bgm.mp3" type="audio/mpeg" />
      </audio>
      <button
        onClick={() => setAudioPlaying(!isAudioPlaying)}
        className="fixed bottom-6 right-4 z-40 w-10 h-10 rounded-full flex items-center justify-center text-sm"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          color: "var(--text-secondary)",
          boxShadow: "0 2px 12px rgba(26,25,23,0.08)",
        }}
        aria-label={isAudioPlaying ? "Pause music" : "Play music"}
      >
        {isAudioPlaying ? "⏸" : "▶"}
      </button>
    </>
  );
}
