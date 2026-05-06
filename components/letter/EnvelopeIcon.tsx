"use client";

import { motion } from "framer-motion";

interface EnvelopeIconProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function EnvelopeIcon({ isOpen, onClick }: EnvelopeIconProps) {
  return (
    <motion.button
      onClick={onClick}
      className="relative mx-auto block focus:outline-none cursor-pointer"
      style={{ width: 140, height: 90 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label="Open letter"
    >
      {/* Shadow */}
      <div className="absolute inset-0 rounded-md" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.06)", top: 2 }} />

      {/* Envelope Back (Inside) */}
      <div
        className="absolute inset-0 rounded-md overflow-hidden"
        style={{ background: "var(--bg-card)", border: "1.5px solid var(--border-dark)" }}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.05), transparent)" }} />
      </div>

      {/* Envelope Front Flaps (Bottom and Sides) */}
      <svg viewBox="0 0 140 90" className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-sm" style={{ borderRadius: 6 }}>
        <path
          d="M 0 0 L 70 50 L 140 0 L 140 90 L 0 90 Z"
          fill="var(--bg-subtle)"
          stroke="var(--border-dark)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M 0 90 L 70 50 L 140 90"
          fill="none"
          stroke="var(--border-dark)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* Flap Lid (Top) */}
      <motion.div
        className="absolute top-0 left-0 right-0"
        style={{ transformStyle: "preserve-3d", transformOrigin: "top center", zIndex: 10 }}
        animate={{ rotateX: isOpen ? -180 : 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <svg viewBox="0 0 140 50" className="w-full pointer-events-none drop-shadow-sm">
          <path
            d="M 0 0 L 70 50 L 140 0 Z"
            fill="var(--bg-card)"
            stroke="var(--border-dark)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </motion.button>
  );
}
