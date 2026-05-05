"use client";

import { create } from "zustand";

interface AppStore {
  introComplete: boolean;
  setIntroComplete: (v: boolean) => void;
  selectedCategory: number | null;
  setSelectedCategory: (id: number | null) => void;
  isLetterOpen: boolean;
  setLetterOpen: (v: boolean) => void;
  isAudioPlaying: boolean;
  setAudioPlaying: (v: boolean) => void;
  photoRefreshTick: number;
  triggerPhotoRefresh: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  introComplete: false,
  setIntroComplete: (v) => set({ introComplete: v }),
  selectedCategory: null,
  setSelectedCategory: (id) => set({ selectedCategory: id }),
  isLetterOpen: false,
  setLetterOpen: (v) => set({ isLetterOpen: v }),
  isAudioPlaying: false,
  setAudioPlaying: (v) => set({ isAudioPlaying: v }),
  photoRefreshTick: 0,
  triggerPhotoRefresh: () => set((s) => ({ photoRefreshTick: s.photoRefreshTick + 1 })),
}));
