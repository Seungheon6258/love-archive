"use client";

import { Photo, Letter, DEFAULT_LETTER } from "./schema";

const PHOTOS_KEY = "love500_photos";
const LETTER_KEY = "love500_letter";

// ─── Photo Storage ───────────────────────────────────────────────────────────
export function getPhotos(): Photo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PHOTOS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getPhotosByCategory(category: number): Photo[] {
  return getPhotos().filter((p) => p.category === category);
}

export function savePhoto(photo: Omit<Photo, "id" | "uploadedAt">): Photo {
  const newPhoto: Photo = {
    ...photo,
    id: `photo-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    uploadedAt: new Date().toISOString(),
  };
  const all = getPhotos();
  all.push(newPhoto);
  if (typeof window !== "undefined") {
    localStorage.setItem(PHOTOS_KEY, JSON.stringify(all));
  }
  return newPhoto;
}

export function deletePhoto(id: string): void {
  const filtered = getPhotos().filter((p) => p.id !== id);
  if (typeof window !== "undefined") {
    localStorage.setItem(PHOTOS_KEY, JSON.stringify(filtered));
  }
}

// ─── File → Base64 Helper ────────────────────────────────────────────────────
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Letter Storage ──────────────────────────────────────────────────────────
export function getLetter(): Letter {
  if (typeof window === "undefined") return DEFAULT_LETTER;
  try {
    const raw = localStorage.getItem(LETTER_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_LETTER;
  } catch {
    return DEFAULT_LETTER;
  }
}

export function saveLetter(letter: Letter): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(LETTER_KEY, JSON.stringify(letter));
  }
}

// ─── Mock Supabase-compatible API (swap these for real calls) ────────────────
export const mockApi = {
  async uploadPhoto(file: File, category: number, caption?: string): Promise<Photo> {
    const url = await fileToBase64(file);
    return savePhoto({ url, category, caption });
  },

  async fetchPhotos(category: number): Promise<Photo[]> {
    await new Promise((r) => setTimeout(r, 300)); // simulate network
    return getPhotosByCategory(category);
  },

  async removePhoto(id: string): Promise<void> {
    deletePhoto(id);
  },

  async fetchLetter(): Promise<Letter> {
    await new Promise((r) => setTimeout(r, 200));
    return getLetter();
  },
};
