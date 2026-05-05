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
    setPhase("opening");
    setTimeout(() => {
      setPhase("reading");
      setAudioPlaying(true);
    }, 800);
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
      <div className="mb-6">
        <div
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
        >
          <p className="font-sans text-xs tracking-widest uppercase mb-1" style={{ color: "var(--text-muted)" }}>
            Day 500
          </p>
          <h2 className="font-serif text-xl font-medium mb-6" style={{ color: "var(--text-primary)" }}>
            A letter
          </h2>

          <div className="relative">
            <EnvelopeIcon isOpen={phase !== "closed"} onClick={handleEnvelopeClick} />
            
            {/* Peeking letter during opening phase */}
            <AnimatePresence>
              {phase === "opening" && (
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 w-28 rounded-md"
                  style={{ height: 60, background: "var(--bg-card)", border: "1px solid var(--border)", top: 10, zIndex: 5 }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: -30, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              )}
            </AnimatePresence>
          </div>

          <motion.p
            className="font-sans text-xs text-center mt-6"
            style={{ color: "var(--text-muted)" }}
            animate={phase === "closed" ? { opacity: [0.4, 0.9, 0.4] } : { opacity: 0 }}
            transition={{ duration: 2.5, repeat: phase === "closed" ? Infinity : 0 }}
          >
            Click the envelope to open
          </motion.p>
        </div>
      </div>

      {/* Reading overlay (Letter pops out to center) */}
      <AnimatePresence>
        {phase === "reading" && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            style={{ background: "rgba(26,25,23,0.4)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={handleClose}
          >
            <motion.div
              className="relative w-full max-w-md bg-white rounded-sm shadow-2xl flex flex-col"
              style={{ maxHeight: "85vh", border: "1px solid #E0DCD3", backgroundImage: "linear-gradient(to bottom, #FFF, #FAF8F5)" }}
              initial={{ y: 200, scale: 0.8, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 150, scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="overflow-y-auto p-8 sm:p-10 flex-1 scrollbar-hide">
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

              {/* Action bar attached to letter bottom */}
              <div className="p-4 border-t" style={{ borderColor: "#F0EFE9", background: "rgba(255,255,255,0.8)" }}>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 py-2.5 rounded-lg font-sans text-sm transition-colors hover:bg-gray-50"
                    style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex-1 py-2.5 rounded-lg font-sans text-sm text-white transition-opacity hover:opacity-90"
                    style={{ background: "#2B2A27" }}
                  >
                    Fold
                  </button>
                </div>
              </div>
            </motion.div>

            <AudioPlayer />
          </motion.div>
        )}
      </AnimatePresence>

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
