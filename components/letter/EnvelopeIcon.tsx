"use client";

import { motion } from "framer-motion";

interface EnvelopeIconProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function EnvelopeIcon({ isOpen, onClick }: EnvelopeIconProps) {
  return (
    <div
      className="relative mx-auto cursor-pointer select-none"
      style={{ width: 140, height: 90 }}
      onClick={onClick}
      role="button"
      aria-label="Open letter"
    >
      {/* z=1: Envelope interior (back face) */}
      <div
        className="absolute inset-0 rounded-md"
        style={{
          background: "var(--bg-card)",
          border: "1.5px solid var(--border-dark)",
          zIndex: 1,
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        }}
      />

      {/* z=2: Letter paper — sits inside, rises upward when open */}
      <motion.div
        className="absolute rounded-sm overflow-hidden"
        style={{
          width: 108,
          height: 80,
          left: "50%",
          bottom: 5,
          x: "-50%",
          background: "linear-gradient(to bottom, #FFFDF9, #FAF8F3)",
          border: "1px solid #DDD9D0",
          boxShadow: "0 2px 6px rgba(0,0,0,0.07)",
          zIndex: 2,
        }}
        animate={{ y: isOpen ? -88 : 0 }}
        transition={{
          duration: 0.65,
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: isOpen ? 0.35 : 0,
        }}
      >
        {/* Ruled lines on letter paper */}
        {[12, 24, 36, 48, 60].map((top) => (
          <div
            key={top}
            className="absolute left-4 right-4"
            style={{ top, height: 1, background: "#EAE7DF" }}
          />
        ))}
        <div className="absolute bottom-2 right-3 text-xs" style={{ color: "#C9A0A0" }}>♥</div>
      </motion.div>

      {/* z=3: Envelope BODY FRONT — masks the lower part of the letter (creates "inside" illusion) */}
      <svg
        viewBox="0 0 140 90"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 3 }}
      >
        {/* Lower body covers roughly y=45 to y=90 — masks letter while still inside */}
        <path
          d="M 0 45 L 70 50 L 140 45 L 140 90 L 0 90 Z"
          fill="var(--bg-subtle)"
          stroke="var(--border-dark)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Bottom center V fold */}
        <path
          d="M 0 90 L 70 50 L 140 90"
          fill="none"
          stroke="var(--border-dark)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* z=4: Flap lid (top triangle) — rotates open on click */}
      <motion.div
        className="absolute top-0 left-0 right-0"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "top center",
          zIndex: 4,
        }}
        animate={{ rotateX: isOpen ? -180 : 0 }}
        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <svg viewBox="0 0 140 50" className="w-full pointer-events-none">
          <path
            d="M 0 0 L 70 50 L 140 0 Z"
            fill="var(--bg-card)"
            stroke="var(--border-dark)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}
