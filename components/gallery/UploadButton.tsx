"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { uploadPhoto } from "@/lib/supabase";

interface UploadButtonProps {
  category: number;
  onUploadComplete: () => void;
}

export default function UploadButton({ category, onUploadComplete }: UploadButtonProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;
      setUploading(true);
      setProgress(0);
      for (let i = 0; i < acceptedFiles.length; i++) {
        setProgress(Math.round(((i + 0.5) / acceptedFiles.length) * 100));
        await uploadPhoto(acceptedFiles[i], category);
        setProgress(Math.round(((i + 1) / acceptedFiles.length) * 100));
      }
      setUploading(false);
      setDone(true);
      setTimeout(() => { setDone(false); onUploadComplete(); }, 1200);
    },
    [category, onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp", ".heic"] },
    multiple: true,
    disabled: uploading,
  });

  return (
    <div
      {...getRootProps()}
      className="rounded-xl p-5 text-center cursor-pointer transition-colors"
      style={{
        background: isDragActive ? "var(--bg-subtle)" : "var(--bg-card)",
        border: `1.5px dashed ${isDragActive ? "var(--accent)" : "var(--border)"}`,
      }}
      role="button"
      aria-label="사진 업로드"
    >
      <input {...getInputProps()} />
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-2 py-1">
            <span className="text-sm font-sans" style={{ color: "var(--text-secondary)" }}>Uploaded</span>
          </motion.div>
        ) : uploading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 py-1">
            <div className="w-full rounded-full h-1" style={{ background: "var(--bg-subtle)" }}>
              <motion.div
                className="h-1 rounded-full"
                style={{ background: "var(--accent)" }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>{progress}%</p>
          </motion.div>
        ) : (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-1">
            <p className="font-sans text-sm" style={{ color: "var(--text-secondary)" }}>
              {isDragActive ? "Drop here" : "Click or drag to upload"}
            </p>
            <p className="font-sans text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              JPG, PNG, HEIC — multiple OK
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
