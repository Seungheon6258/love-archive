"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import PhotoGrid from "@/components/gallery/PhotoGrid";
import UploadButton from "@/components/gallery/UploadButton";
import { CATEGORIES } from "@/lib/schema";
import { fetchPhotos, fetchLetter } from "@/lib/supabase";
import type { Photo, Letter } from "@/lib/schema";

const LetterReveal = dynamic(() => import("@/components/letter/LetterReveal"), { ssr: false });

export default function GalleryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = Number(params.category);
  const category = CATEGORIES.find((c) => c.id === categoryId);

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [letter, setLetter] = useState<Letter | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const loadPhotos = useCallback(async () => {
    setLoading(true);
    const data = await fetchPhotos(categoryId);
    setPhotos(data);
    setLoading(false);
  }, [categoryId]);

  useEffect(() => {
    loadPhotos();
    if (categoryId === 6) fetchLetter().then(setLetter);
  }, [categoryId, loadPhotos]);

  if (!category) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: "var(--bg)" }}>
        <p className="font-sans text-sm" style={{ color: "var(--text-muted)" }}>Not found</p>
      </div>
    );
  }

  const isSpecial = category.isSpecial;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <motion.header
        className="sticky top-0 z-20 px-5 pt-12 pb-4"
        style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => router.push("/dashboard")}
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
            whileTap={{ scale: 0.9 }}
            aria-label="뒤로"
          >
            ←
          </motion.button>
          <div className="flex-1">
            <h1
              className={`font-serif text-xl font-medium ${isSpecial ? "text-gold-shimmer" : ""}`}
              style={!isSpecial ? { color: "var(--text-primary)" } : undefined}
            >
              {category.label}
            </h1>
            <p className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
              {category.range}
            </p>
          </div>
          <span
            className="font-sans text-xs tabular-nums px-2 py-1 rounded-lg"
            style={{ background: "var(--bg-subtle)", color: "var(--text-secondary)" }}
          >
            {loading ? "…" : `${photos.length}`}
          </span>
        </div>
      </motion.header>

      <main className="flex-1 px-4 py-5">
        {/* Upload toggle */}
        <motion.div className="mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <button
            onClick={() => setShowUpload((v) => !v)}
            className="w-full py-2.5 rounded-xl font-sans text-sm flex items-center justify-center gap-2"
            style={{
              background: "var(--bg-card)",
              border: `1px solid ${isSpecial ? "var(--gold)" : "var(--border)"}`,
              color: isSpecial ? "var(--gold)" : "var(--text-secondary)",
            }}
          >
            {showUpload ? "↑ Close" : "+ Add photos"}
          </button>
        </motion.div>

        {/* Upload area */}
        <AnimatePresence>
          {showUpload && (
            <motion.div
              className="mb-5"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <UploadButton
                category={categoryId}
                onUploadComplete={() => { setShowUpload(false); loadPhotos(); }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Photo grid */}
        <PhotoGrid photos={photos} loading={loading} onDelete={loadPhotos} />

        {/* 500 days special section */}
        {categoryId === 6 && letter && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="my-8 divider-gold" />
            <LetterReveal letter={letter} />
          </motion.div>
        )}
      </main>

      <div className="h-16" />
    </div>
  );
}
