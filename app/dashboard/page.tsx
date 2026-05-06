"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CategoryCard from "@/components/dashboard/CategoryCard";
import { CATEGORIES } from "@/lib/schema";
import { getDayCount, fetchCovers, fetchPhotos } from "@/lib/supabase";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function DashboardPage() {
  const router = useRouter();
  const [photoCounts, setPhotoCounts] = useState<Record<number, number>>({});
  const [covers, setCovers] = useState<Record<number, string | null>>({});
  const [dayCount, setDayCount] = useState(0);

  useEffect(() => {
    setDayCount(getDayCount("2024-12-23"));
    // Load cover photos
    fetchCovers().then((storedCovers) => {
      const coverMap: Record<number, string | null> = {};
      CATEGORIES.forEach((c) => { coverMap[c.id] = storedCovers[c.id] ?? null; });
      setCovers(coverMap);
    });
    // Load photo counts
    const counts: Record<number, number> = {};
    Promise.all(
      CATEGORIES.map((c) =>
        fetchPhotos(c.id).then((photos) => { counts[c.id] = photos.length; })
      )
    ).then(() => setPhotoCounts({ ...counts }));
  }, []);

  const totalPhotos = Object.values(photoCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <motion.header
        className="px-5 pt-16 pb-32 relative"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* OUR MEMORIES — original top-left position */}
        <p className="font-sans text-xs tracking-widest uppercase mb-3" style={{ color: "var(--text-muted)" }}>
          our memories
        </p>
        {/* Back button — absolute top-right */}
        <motion.button
          onClick={() => router.push("/")}
          className="absolute top-14 right-5 w-8 h-8 flex items-center justify-center rounded-full"
          style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
          whileTap={{ scale: 0.9 }}
          aria-label="인트로로"
        >
          ←
        </motion.button>
        {/* Title — centered */}
        <div className="text-center">
          <h1 className="font-serif text-4xl font-light" style={{ color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
            승헌 ♥ 지원
          </h1>
        </div>
      </motion.header>

      {/* Stats row */}
      <motion.div
        className="mx-4 mb-28 grid grid-cols-3 gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {[
          { label: "Photos",   value: totalPhotos },
          { label: "Days",     value: dayCount },
          { label: "Albums",   value: CATEGORIES.length },
        ].map((stat) => (
          <div
            key={stat.label}
            className="card rounded-2xl p-4 text-center"
          >
            <p className="font-serif text-2xl font-light tabular-nums" style={{ color: "var(--text-primary)" }}>
              {stat.value || "—"}
            </p>
            <p className="font-sans text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Divider */}
      <div className="divider mx-6 mb-16" />

      {/* Category list */}
      <main className="flex-1 px-5">
        <motion.p
          className="font-sans text-xs tracking-widest uppercase mb-12"
          style={{ color: "var(--text-muted)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Albums
        </motion.p>

        <motion.div
          className="flex flex-col gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {CATEGORIES.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <CategoryCard
                category={category}
                photoCount={photoCounts[category.id] ?? 0}
                coverUrl={covers[category.id] ?? null}
                onClick={() => router.push(`/gallery/${category.id}`)}
                onCoverChange={(url) =>
                  setCovers((prev) => ({ ...prev, [category.id]: url }))
                }
              />
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <div className="h-12" />
    </div>
  );
}
