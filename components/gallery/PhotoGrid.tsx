"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import Image from "next/image";
import { Photo } from "@/lib/schema";
import { deletePhoto } from "@/lib/supabase";

interface PhotoGridProps {
  photos: Photo[];
  loading: boolean;
  onDelete: () => void;
}

export default function PhotoGrid({ photos, loading, onDelete }: PhotoGridProps) {
  const [selected, setSelected] = useState<Photo | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = useCallback(
    async (photo: Photo, e: React.MouseEvent) => {
      e.stopPropagation();
      if (!confirm("Delete this photo?")) return false;
      setDeleting(photo.id);
      try {
        await deletePhoto(photo.id, photo.url);
      } catch (err) {
        console.error("Failed to delete", err);
      }
      setDeleting(null);
      onDelete();
      return true;
    },
    [onDelete]
  );

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-1.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.div
            key={i}
            className="rounded-xl"
            style={{ aspectRatio: "1", background: "var(--bg-subtle)" }}
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.3, repeat: Infinity, delay: i * 0.08 }}
          />
        ))}
      </div>
    );
  }

  if (!photos.length) {
    return (
      <motion.div
        className="py-16 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div
          className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          style={{ background: "var(--bg-subtle)", border: "1px solid var(--border)" }}
        >
          <span style={{ fontSize: 28, opacity: 0.4 }}>🖼</span>
        </div>
        <p className="font-sans text-sm" style={{ color: "var(--text-secondary)" }}>
          No photos yet
        </p>
        <p className="font-sans text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          Add photos with the button above
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        className="grid grid-cols-3 gap-1.5"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.04 } } }}
      >
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            className="relative overflow-hidden cursor-pointer group"
            style={{ aspectRatio: "1", borderRadius: 12, background: "#111" }}
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelected(photo)}
          >
            <Image
              src={photo.url}
              alt={photo.caption ?? "photo"}
              fill
              className="object-contain"
              sizes="(max-width: 480px) 33vw, 160px"
              unoptimized={photo.url.startsWith("data:")}
            />
            {/* Dark overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200" />
          </motion.div>
        ))}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(26,25,23,0.9)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="relative w-full max-w-sm rounded-2xl overflow-hidden"
              style={{ background: "var(--bg-card)" }}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full" style={{ aspectRatio: "1" }}>
                <Image
                  src={selected.url}
                  alt={selected.caption ?? "photo"}
                  fill
                  className="object-cover"
                  sizes="480px"
                  unoptimized={selected.url.startsWith("data:")}
                />
              </div>
              {selected.caption && (
                <div className="px-4 py-3">
                  <p className="font-sans text-sm" style={{ color: "var(--text-secondary)" }}>
                    {selected.caption}
                  </p>
                </div>
              )}
              
              {/* Action buttons */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  className="w-8 h-8 rounded-full flex items-center justify-center font-sans text-xs font-bold transition-transform hover:scale-110"
                  style={{ background: "rgba(26,25,23,0.7)", color: "white" }}
                  onClick={async (e) => {
                    const deleted = await handleDelete(selected, e);
                    if (deleted) setSelected(null);
                  }}
                  disabled={deleting === selected.id}
                  title="Delete photo"
                >
                  {deleting === selected.id ? "…" : "🗑"}
                </button>
                <button
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg transition-transform hover:scale-110"
                  style={{ background: "rgba(26,25,23,0.7)", color: "white" }}
                  onClick={() => setSelected(null)}
                  title="Close"
                >
                  ×
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
