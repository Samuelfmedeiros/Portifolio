// === Portifolio Samuel — Centralized Type Definitions ===

/** Primary production URL — Vercel is primary deploy target */
export const SITE_URL = "https://samuelmedeiros.vercel.app";

/** GitHub repository returned by the public API */
export interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string | null;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  pushed_at: string;
  created_at: string;
  /** Custom gradient for project card header */
  imageGradient?: string;
  /** Whether this project has a live demo */
  hasDemo?: boolean;
  /** URL for project thumbnail/screenshot */
  imageUrl?: string;
  /** Project emoji/icon for visual identity */
  icon?: string;
}

/** Terminal command history entry */
export interface Command {
  cmd: string;
  output: string;
}

/** Supabase "messages" table row */
export interface Message {
  id: number;
  created_at: string;
  name: string;
  email: string;
  content: string;
}

/** Analytics page-view record */
export interface PageView {
  id: number;
  page_path: string;
  view_count: number;
  last_access: string;
}

/** Parallax background star particle */
export interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

/** Application colour theme */
export type Theme = "dark" | "light";

/** Utility Deck widget identifiers */
export type Widget = "clock" | "calculator" | "game" | null;

/** Contact-form submission lifecycle */
export type FormStatus = "idle" | "sending" | "sent" | "error";
