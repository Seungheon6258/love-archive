"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { CategoryConfig } from "@/lib/schema";
import { setCoverPhoto } from "@/lib/supabase";

interface CategoryCardProps {
  category: CategoryConfig;
  photoCount: number;
  coverUrl: string | null;
  onClick: () => void;
  onCoverChange: (url: string) => void;
}

export default function CategoryCard({
  category,
  photoCount,
  coverUrl,
  onClick,
  onCoverChange,
}: CategoryCardProps) {
  const isSpecial = category.isSpecial;
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleCoverClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    fileRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await setCoverPhoto(category.id, file);
    setUploading(false);
    onCoverChange(url);
    e.target.value = "";
  };

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl cursor-pointer ${
        isSpecial ? "gold-card animate-gold-glow" : "card"
      }`}
      style={{ height: 120 }}
      whileHover={{ scale: 1.015, y: -1 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      onClick={onClick}
      role="button"
      aria-label={`${category.label} 카테고리`}
    >
      {/* Cover photo background */}
      {coverUrl ? (
        <>
          <Image
            src={coverUrl}
            alt="cover"
            fill
            className="object-cover"
            sizes="480px"
            unoptimized={coverUrl.startsWith("data:")}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(26,25,23,0.72) 0%, rgba(26,25,23,0.2) 60%, transparent 100%)" }} />
        </>
      ) : (
        /* No cover — subtle gradient placeholder */
        <div
          className="absolute inset-0"
          style={{
            background: isSpecial
              ? `linear-gradient(135deg, var(--gold-bg) 0%, var(--gold-light) 100%)`
              : `linear-gradient(135deg, var(--bg-subtle) 0%, var(--accent-light) 100%)`,
          }}
        />
      )}

      {/* Content overlay */}
      <div className="relative z-10 h-full flex items-center justify-between px-5">
        {/* Left: text */}
        <div>
          <p
            className={`font-serif text-xl font-medium tracking-tight leading-tight ${
              isSpecial ? "text-gold-shimmer" : coverUrl ? "text-white" : ""
            }`}
            style={!isSpecial && !coverUrl ? { color: "var(--text-primary)" } : undefined}
          >
            {category.label}
          </p>
          <p
            className="text-xs mt-1 font-sans tracking-wide"
            style={{ color: coverUrl ? "rgba(255,255,255,0.7)" : isSpecial ? "var(--gold)" : "var(--text-muted)" }}
          >
            {category.range}
          </p>
          <p
            className="text-xs mt-1 font-sans"
            style={{ color: coverUrl ? "rgba(255,255,255,0.55)" : "var(--text-muted)" }}
          >
            {photoCount > 0 ? `${photoCount} photos` : "No photos yet"}
          </p>
        </div>

        {/* Right: cover edit + arrow */}
        <div className="flex items-center gap-2">
          {/* Cover photo edit button */}
          <motion.button
            onClick={handleCoverClick}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
            style={{
              background: coverUrl ? "rgba(255,255,255,0.15)" : "var(--bg-subtle)",
              border: `1px solid ${coverUrl ? "rgba(255,255,255,0.3)" : "var(--border)"}`,
              color: coverUrl ? "white" : "var(--text-muted)",
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="커버 사진 변경"
            aria-label="커버 사진 설정"
          >
            {uploading ? "…" : "📌"}
          </motion.button>

          {/* Arrow */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: isSpecial ? "rgba(191,160,96,0.2)" : coverUrl ? "rgba(255,255,255,0.15)" : "var(--bg-subtle)",
              color: isSpecial ? "var(--gold)" : coverUrl ? "white" : "var(--text-muted)",
              fontSize: 16,
            }}
          >
            →
          </div>
        </div>
      </div>

      {/* Gold accent line for special */}
      {isSpecial && (
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "var(--gold)" }} />
      )}

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>
  );
}
