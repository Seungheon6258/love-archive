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
      style={{ height: 160 }}
      whileHover={{ scale: 1.015, y: -1 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      onClick={onClick}
      role="button"
      aria-label={`${category.label} 카테고리`}
    >
      {/* Cover photo — right-side poster */}
      {coverUrl ? (
        <>
          {/* Left gradient bg */}
          <div
            className="absolute inset-0"
            style={{
              background: isSpecial
                ? `linear-gradient(135deg, var(--gold-bg) 0%, var(--gold-light) 100%)`
                : `linear-gradient(135deg, var(--bg-subtle) 0%, var(--accent-light) 100%)`,
            }}
          />
          {/* Photo occupies right half, full height, not cropped */}
          <div className="absolute right-0 top-0 bottom-0" style={{ width: "52%" }}>
            <Image
              src={coverUrl}
              alt="cover"
              fill
              className="object-contain"
              sizes="240px"
              unoptimized={coverUrl.startsWith("data:")}
              style={{ objectPosition: "center center" }}
            />
          </div>
          {/* Fade mask so text side is clean */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right, var(--bg-subtle) 40%, transparent 80%)" }}
          />
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

      {/* Content overlay — takes only the left 48% so it doesn't overlap the photo */}
      <div className="relative z-10 h-full flex items-center justify-center px-4" style={{ width: "48%" }}>
        {/* Text block — centered horizontally and vertically */}
        <div className="text-center">
          <p
            className={`font-serif text-xl font-medium tracking-tight leading-tight ${
              isSpecial ? "text-gold-shimmer" : ""
            }`}
            style={!isSpecial ? { color: "var(--text-primary)" } : undefined}
          >
            {category.label}
          </p>
          <p
            className="text-xs mt-1 font-sans tracking-wide"
            style={{ color: isSpecial ? "var(--gold)" : "var(--text-muted)" }}
          >
            {category.range}
          </p>
          <p
            className="text-xs mt-1 font-sans"
            style={{ color: "var(--text-muted)" }}
          >
            {photoCount > 0 ? `${photoCount} photos` : "No photos yet"}
          </p>
        </div>
      </div>

      {/* Buttons — absolute so they don't affect layout */}
      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
        {/* Cover photo edit button */}
        <motion.button
          onClick={handleCoverClick}
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
          style={{
            background: "var(--bg-subtle)",
            border: `1px solid var(--border)`,
            color: "var(--text-muted)",
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
            background: isSpecial ? "rgba(191,160,96,0.2)" : "var(--bg-subtle)",
            color: isSpecial ? "var(--gold)" : "var(--text-muted)",
            fontSize: 16,
          }}
        >
          →
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
