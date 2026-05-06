"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Letter } from "@/lib/schema";
import { useAppStore } from "@/lib/store";
import EnvelopeIcon from "./EnvelopeIcon";
import LetterEditor from "./LetterEditor";
import AudioPlayer from "./AudioPlayer";

interface LetterRevealProps {
  letter: Letter;
}

type Phase = "closed" | "opening" | "reading";

export default function LetterReveal({ letter: initialLetter }: LetterRevealProps) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [letter, setLetter] = useState(initialLetter);
  const [isEditing, setIsEditing] = useState(false);
  const { setAudioPlaying } = useAppStore();

  const handleEnvelopeClick = () => {
    if (phase !== "closed") return;
    // Step 1: open flap + letter rises
    setPhase("opening");
    // Step 2: after letter has fully risen, show reading modal
    setTimeout(() => {
      setPhase("reading");
      setAudioPlaying(true);
    }, 1100);
  };

  const handleClose = () => {
    setPhase("opening");
    setTimeout(() => {
      setPhase("closed");
      setAudioPlaying(false);
    }, 500);
  };

  return (
    <>
      {/* Envelope card — centered */}
      <div className="mb-6">
        <div
          className="rounded-2xl p-8 flex flex-col items-center relative overflow-visible"
          style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
        >
          <p className="font-sans text-xs tracking-widest uppercase mb-6" style={{ color: "var(--text-muted)" }}>
            Day 500
          </p>

          {/* Envelope — letter paper is built-in and rises from inside */}
          <div style={{ marginBottom: 32 }}>
            <EnvelopeIcon isOpen={phase !== "closed"} onClick={handleEnvelopeClick} />
          </div>

          {/* Hint text */}
          <motion.p
            className="font-sans text-xs text-center"
            style={{ color: "var(--text-muted)" }}
            animate={phase === "closed" ? { opacity: [0.4, 0.9, 0.4] } : { opacity: 0 }}
            transition={{ duration: 2.5, repeat: phase === "closed" ? Infinity : 0 }}
          >
            Click the envelope to open
          </motion.p>
        </div>
      </div>

      {/* Reading overlay — letter slides up from bottom (sheet style) */}
      <AnimatePresence>
        {phase === "reading" && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
            style={{ background: "rgba(26,25,23,0.45)", backdropFilter: "blur(6px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={handleClose}
          >
            <motion.div
              className="relative w-full max-w-md bg-white flex flex-col sm:rounded-2xl"
              style={{
                maxHeight: "88vh",
                border: "1px solid #E0DCD3",
                backgroundImage: "linear-gradient(to bottom, #FFF, #FAF8F5)",
                borderRadius: "20px 20px 0 0",
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 30, mass: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full" style={{ background: "#D8D5CE" }} />
              </div>

              <div className="overflow-y-auto px-8 pt-4 pb-6 sm:px-10 sm:pt-6 sm:pb-8 flex-1 scrollbar-hide">
                <p className="font-sans text-xs tracking-widest uppercase mb-4" style={{ color: "var(--text-muted)" }}>
                  Day 500
                </p>
                <h2 className="font-serif text-3xl font-light mb-8" style={{ color: "var(--text-primary)" }}>
                  {letter.title}
                </h2>
                <div className="font-serif text-base whitespace-pre-wrap" style={{ color: "#333", lineHeight: 2.2, letterSpacing: "0.02em" }}>
                  {letter.content}
                </div>
                <p className="font-serif text-sm text-right mt-12 italic" style={{ color: "var(--text-muted)" }}>
                  — {letter.author}
                </p>
              </div>

              {/* Action bar */}
              <div className="px-4 pb-6 pt-3 border-t" style={{ borderColor: "#F0EFE9", background: "rgba(255,255,255,0.9)" }}>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 py-2.5 rounded-xl font-sans text-sm transition-colors hover:bg-gray-50"
                    style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex-1 py-2.5 rounded-xl font-sans text-sm text-white transition-opacity hover:opacity-90"
                    style={{ background: "#2B2A27" }}
                  >
                    Fold
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio player — hidden outside reading overlay, only plays audio */}
      <AudioPlayer />

      <AnimatePresence>
        {isEditing && (
          <LetterEditor
            letter={letter}
            onSave={(updated) => { setLetter(updated); setIsEditing(false); }}
            onClose={() => setIsEditing(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
