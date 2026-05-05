"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Letter } from "@/lib/schema";
import { saveLetter } from "@/lib/supabase";

interface LetterEditorProps {
  letter: Letter;
  onSave: (updated: Letter) => void;
  onClose: () => void;
}

export default function LetterEditor({ letter, onSave, onClose }: LetterEditorProps) {
  const [title, setTitle] = useState(letter.title);
  const [content, setContent] = useState(letter.content);
  const [author, setAuthor] = useState(letter.author);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const updated: Letter = { ...letter, title, content, author, writtenAt: new Date().toISOString() };
    await saveLetter(updated);
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); onSave(updated); }, 900);
  };

  const inputStyle = {
    background: "var(--bg-subtle)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
    borderRadius: 12,
    padding: "10px 14px",
    width: "100%",
    fontFamily: "inherit",
    fontSize: 14,
    outline: "none",
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(26,25,23,0.5)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-sm rounded-t-3xl px-5 pt-4 pb-10"
        style={{ background: "var(--bg-card)" }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: "var(--border)" }} />

        <div className="flex items-center justify-between mb-5">
          <h3 className="font-sans font-semibold text-base" style={{ color: "var(--text-primary)" }}>
            Edit letter
          </h3>
          <button onClick={onClose} className="font-sans text-sm" style={{ color: "var(--text-muted)" }}>
            Cancel
          </button>
        </div>

        <div className="space-y-3 mb-5">
          <div>
            <label className="font-sans text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} placeholder="Letter title" />
          </div>
          <div>
            <label className="font-sans text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>From</label>
            <input value={author} onChange={(e) => setAuthor(e.target.value)} style={inputStyle} placeholder="Your name" />
          </div>
          <div>
            <label className="font-sans text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              style={{ ...inputStyle, resize: "none", lineHeight: 1.8 }}
              placeholder="Write your letter here..."
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving || saved}
          className="w-full py-3 rounded-xl font-sans text-sm font-medium text-white"
          style={{ background: saved ? "#5A7A5A" : "var(--text-primary)", transition: "background 0.3s" }}
        >
          {saved ? "Saved" : saving ? "Saving…" : "Save"}
        </button>
      </motion.div>
    </motion.div>
  );
}
