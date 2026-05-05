"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDayCount } from "@/lib/supabase";

interface Dot {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

function createDots(count: number): Dot[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    duration: 1.0 + Math.random() * 1.2,
    delay: Math.random() * 0.5,
  }));
}

export default function AntigravityEffect() {
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "rising" | "done">("idle");
  const [dots] = useState<Dot[]>(() => createDots(30));
  const [dayCount, setDayCount] = useState(0);

  useEffect(() => {
    setDayCount(getDayCount("2024-12-23"));
  }, []);

  const handleClick = useCallback(() => {
    if (phase !== "idle") return;
    setPhase("rising");
    setTimeout(() => {
      setPhase("done");
      router.push("/dashboard");
    }, 1800);
  }, [phase, router]);

  return (
    <div
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center"
      onClick={handleClick}
      style={{ background: "var(--bg)", cursor: "pointer" }}
    >
      {/* Background dots — idle floating */}
      {dots.map((d) => (
        <AnimatePresence key={d.id}>
          {phase === "idle" && (
            <motion.div
              key={`idle-${d.id}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${d.x}%`,
                top: `${d.y}%`,
                width: d.size,
                height: d.size,
                background: "var(--border-dark)",
                opacity: 0.35,
              }}
              animate={{ y: [0, -6, 0], opacity: [0.2, 0.45, 0.2] }}
              transition={{ duration: 2.5 + d.delay, repeat: Infinity, delay: d.delay }}
            />
          )}
          {phase === "rising" && (
            <motion.div
              key={`rise-${d.id}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${d.x}%`,
                top: `${d.y}%`,
                width: d.size,
                height: d.size,
                background: "var(--border-dark)",
              }}
              initial={{ y: 0, opacity: 0.4 }}
              animate={{ y: -900, opacity: 0, x: (Math.random() - 0.5) * 60 }}
              transition={{ duration: d.duration, delay: d.delay * 0.6, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
      ))}

      {/* Ripple on click */}
      <AnimatePresence>
        {phase === "rising" && (
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{ border: "1px solid var(--border-dark)" }}
            initial={{ width: 60, height: 60, opacity: 0.6 }}
            animate={{ width: 600, height: 600, opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <motion.div
        className="flex flex-col items-center gap-8 z-10 px-8 w-full max-w-sm"
        animate={
          phase === "rising"
            ? { y: -500, opacity: 0, transition: { duration: 1.2, ease: "easeOut" } }
            : { y: 0, opacity: 1 }
        }
      >
        {/* Day counter — large */}
        <div className="text-center">
          <motion.p
            className="font-serif select-none"
            style={{
              fontSize: 80,
              fontWeight: 300,
              lineHeight: 1,
              color: "var(--text-primary)",
              letterSpacing: "-2px",
            }}
            animate={phase === "idle" ? { opacity: [0.85, 1, 0.85] } : {}}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {dayCount > 0 ? dayCount : "—"}
          </motion.p>
          <p
            className="font-sans text-sm mt-3 tracking-[0.2em] uppercase"
            style={{ color: "var(--text-muted)", letterSpacing: "0.18em" }}
          >
            days together
          </p>
        </div>

        {/* Divider line */}
        <div className="divider w-12" />

        {/* Tap hint */}
        <motion.p
          className="font-sans text-xs tracking-widest uppercase text-center"
          style={{ color: "var(--text-muted)", letterSpacing: "0.15em" }}
          animate={phase === "idle" ? { opacity: [0.4, 0.9, 0.4] } : { opacity: 0 }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          tap to open
        </motion.p>
      </motion.div>
    </div>
  );
}
