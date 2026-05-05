import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Photo, Letter, DEFAULT_LETTER } from "./schema";

// ─── Supabase Client (lazy init) ─────────────────────────────────────────────
let _supabase: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  if (_supabase) return _supabase;
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const url = rawUrl.replace(/\/$/, ""); // Remove trailing slash if user accidentally added it
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!url || !key || url === "your_supabase_project_url") return null;
  try {
    _supabase = createClient(url, key);
    return _supabase;
  } catch {
    return null;
  }
}

// Backward compat export (may be null at build time)
export const supabase = null as SupabaseClient | null;

const BUCKET = "love-photos";

// ─── LocalStorage fallback (dev / before Supabase setup) ─────────────────────
function lsGetPhotos(): Photo[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("love500_photos") ?? "[]"); }
  catch { return []; }
}
function lsSavePhoto(photo: Photo) {
  const all = lsGetPhotos();
  localStorage.setItem("love500_photos", JSON.stringify([...all, photo]));
}
function lsDeletePhoto(id: string) {
  const filtered = lsGetPhotos().filter((p) => p.id !== id);
  localStorage.setItem("love500_photos", JSON.stringify(filtered));
}
function lsGetLetter(): Letter {
  try { return JSON.parse(localStorage.getItem("love500_letter") ?? "null") ?? DEFAULT_LETTER; }
  catch { return DEFAULT_LETTER; }
}
function lsSaveLetter(letter: Letter) {
  localStorage.setItem("love500_letter", JSON.stringify(letter));
}

// ─── Photo API ────────────────────────────────────────────────────────────────
export async function fetchPhotos(category: number): Promise<Photo[]> {
  const sb = getClient();
  if (!sb) {
    return lsGetPhotos().filter((p) => p.category === category);
  }
  const { data, error } = await sb
    .from("photos")
    .select("*")
    .eq("category", category)
    .order("uploaded_at", { ascending: false });

  if (error) { console.error("[fetchPhotos]", error); return []; }
  return (data ?? []).map((row) => ({
    id: row.id,
    category: row.category,
    url: row.url,
    caption: row.caption,
    takenAt: row.taken_at,
    uploadedAt: row.uploaded_at,
  }));
}

export async function uploadPhoto(
  file: File,
  category: number,
  caption?: string
): Promise<Photo | null> {
  const sb = getClient();
  if (!sb) {
    const base64 = await fileToBase64(file);
    const photo: Photo = {
      id: `photo-${Date.now()}`,
      category,
      url: base64,
      caption,
      uploadedAt: new Date().toISOString(),
    };
    lsSavePhoto(photo);
    return photo;
  }

  const extRaw = file.name.split(".").pop() || "jpg";
  const ext = extRaw.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "jpg";
  const path = `cat${category}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await sb.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) { 
    console.error("[uploadPhoto storage]", uploadError); 
    throw new Error("Storage Error: " + uploadError.message); 
  }

  const { data: urlData } = sb.storage.from(BUCKET).getPublicUrl(path);
  const url = urlData.publicUrl;

  const { data, error: dbError } = await sb
    .from("photos")
    .insert({ category, url, caption: caption ?? null })
    .select()
    .single();

  if (dbError) { 
    console.error("[uploadPhoto db]", dbError); 
    throw new Error("DB Error: " + dbError.message); 
  }
  return {
    id: data.id,
    category: data.category,
    url: data.url,
    caption: data.caption,
    uploadedAt: data.uploaded_at,
  };
}

export async function deletePhoto(id: string, url?: string): Promise<void> {
  const sb = getClient();
  if (!sb) { lsDeletePhoto(id); return; }

  if (url?.includes(BUCKET)) {
    const path = url.split(`/${BUCKET}/`)[1];
    if (path) await sb.storage.from(BUCKET).remove([path]);
  }
  await sb.from("photos").delete().eq("id", id);
}

// ─── Letter API ───────────────────────────────────────────────────────────────
export async function fetchLetter(): Promise<Letter> {
  const sb = getClient();
  if (!sb) return lsGetLetter();

  const { data, error } = await sb
    .from("letters")
    .select("*")
    .eq("id", "letter-500")
    .single();

  if (error || !data) return DEFAULT_LETTER;
  return {
    id: data.id,
    title: data.title,
    content: data.content,
    author: data.author,
    writtenAt: data.written_at,
  };
}

export async function saveLetter(letter: Letter): Promise<void> {
  const sb = getClient();
  if (!sb) { lsSaveLetter(letter); return; }

  await sb.from("letters").upsert({
    id: letter.id,
    title: letter.title,
    content: letter.content,
    author: letter.author,
    written_at: new Date().toISOString(),
  });
}

// ─── Utility ──────────────────────────────────────────────────────────────────
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function getDayCount(startDate: string = "2024-12-23"): number {
  const start = new Date(startDate);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diff + 1;
}

// ─── Cover Photo (per-category thumbnail) ─────────────────────────────────────
const COVERS_KEY = "love500_covers";

type CoverMap = Record<number, string>; // categoryId → base64 or URL

export function getCoverPhotos(): CoverMap {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(COVERS_KEY) ?? "{}"); }
  catch { return {}; }
}

export function getCoverPhoto(categoryId: number): string | null {
  return getCoverPhotos()[categoryId] ?? null;
}

export async function setCoverPhoto(categoryId: number, file: File): Promise<string> {
  const base64 = await fileToBase64(file);
  const covers = getCoverPhotos();
  covers[categoryId] = base64;
  if (typeof window !== "undefined") {
    localStorage.setItem(COVERS_KEY, JSON.stringify(covers));
  }
  return base64;
}
