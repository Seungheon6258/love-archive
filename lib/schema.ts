// ─── Constants ──────────────────────────────────────────────────────────────
export const START_DATE = "2024-12-23"; // 기념일 시작일

// ─── Data Schema ───────────────────────────────────────────────────────────
export interface Photo {
  id: string;
  category: number; // 1~6 (1=~100, 2=101~200, ..., 6=500)
  url: string;      // base64 data URL or remote URL
  caption?: string;
  takenAt?: string;
  uploadedAt: string;
}

export interface Letter {
  id: string;
  title: string;
  content: string;
  author: string;
  writtenAt: string;
}

export interface AppState {
  photos: Photo[];
  letter: Letter;
}

// ─── Category Config ────────────────────────────────────────────────────────
export interface CategoryConfig {
  id: number;
  label: string;
  range: string;
  emoji: string;
  isSpecial: boolean;
  color: string;
}

export const CATEGORIES: CategoryConfig[] = [
  { id: 1, label: "~ 100 days",     range: "Day 1 – 100",   emoji: "①", isSpecial: false, color: "#9B8B7A" },
  { id: 2, label: "101 ~ 200 days", range: "Day 101 – 200", emoji: "②", isSpecial: false, color: "#8B7B6A" },
  { id: 3, label: "201 ~ 300 days", range: "Day 201 – 300", emoji: "③", isSpecial: false, color: "#7B6B5A" },
  { id: 4, label: "301 ~ 400 days", range: "Day 301 – 400", emoji: "④", isSpecial: false, color: "#6B5B4A" },
  { id: 5, label: "401 ~ 499 days", range: "Day 401 – 499", emoji: "⑤", isSpecial: false, color: "#5B4B3A" },
  { id: 6, label: "♥ 500 days",     range: "Day 500",       emoji: "★", isSpecial: false, color: "#BFA060" },
];

export const DEFAULT_LETTER: Letter = {
  id: "letter-500",
  title: "나에게 온 편지",
  content: `사랑하는 당신에게,

우리가 처음 만났던 그 날을 기억하나요?
설레는 마음으로 손을 잡던 그 순간이
아직도 생생하게 남아있어요.

500일이라는 시간 동안
기쁠 때도, 힘들 때도
항상 곁에 있어줘서 고마워요.

당신과 함께라면
앞으로의 500일도,
그 이후의 시간도
모두 아름다울 것 같아요.

오늘 이 특별한 날,
진심을 담아 전해요.

사랑해요. 💕

– 당신의 소중한 사람이`,
  author: "당신의 소중한 사람",
  writtenAt: new Date().toISOString(),
};
