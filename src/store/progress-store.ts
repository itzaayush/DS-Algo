"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/* ---------------------------------------------------------------------------
   Types
--------------------------------------------------------------------------- */

export type ContentState = "not-started" | "in-progress" | "completed";
export type PracticeState = "not-started" | "attempted" | "solved" | "revisit";
export type Pace = "relaxed" | "steady" | "intense";

export interface LessonProgress {
  state: ContentState;
  percent: number;
  lastSection: string | null;
  masteryScore: number | null;
  attempts: number;
  updatedAt: number;
}

export interface GameLevelProgress {
  state: ContentState;
  bestScore: number;
  attempts: number;
  completedAt: number | null;
}

export interface Bookmark {
  id: string;
  type: "lesson" | "pattern" | "practice" | "visualization";
  label: string;
  href: string;
  createdAt: number;
}

export interface LearningPath {
  goal: "interview" | "contests" | "fundamentals" | "explore";
  experience: "new" | "some" | "returning";
  weeklyMinutes: number;
  pace: Pace;
  companies: string[];
  startModule: string;
}

export interface SettingsState {
  reducedMotion: boolean;
  lowBandwidth: boolean;
  sound: boolean;
  highContrast: boolean;
}

interface ProgressState {
  _hasHydrated: boolean;
  lessons: Record<string, LessonProgress>;
  practice: Record<string, PracticeState>;
  bookmarks: Bookmark[];
  achievements: Record<string, number>; // key -> awardedAt
  games: Record<string, GameLevelProgress>;
  settings: SettingsState;
  path: LearningPath | null;
  lastActiveDay: string | null;
  currentStreak: number;
  longestStreak: number;
  lastAwarded: { key: string; at: number } | null;
}

interface ProgressActions {
  setLessonProgress: (id: string, patch: Partial<LessonProgress>) => void;
  completeLesson: (id: string, masteryScore?: number) => void;
  setPracticeStatus: (id: string, status: PracticeState) => void;
  toggleBookmark: (b: Omit<Bookmark, "createdAt">) => void;
  isBookmarked: (id: string) => boolean;
  awardAchievement: (key: string) => boolean;
  completeGameLevel: (id: string, score: number) => void;
  updateSettings: (patch: Partial<SettingsState>) => void;
  setPath: (path: LearningPath) => void;
  clearLastAwarded: () => void;
  recordActivity: () => void;
  resetProgress: () => void;
  setHasHydrated: (v: boolean) => void;
}

export type ProgressStore = ProgressState & ProgressActions;

/* ---------------------------------------------------------------------------
   Helpers
--------------------------------------------------------------------------- */

const todayKey = () => new Date().toISOString().slice(0, 10);

function dayDiff(a: string, b: string) {
  const da = new Date(a + "T00:00:00Z").getTime();
  const db = new Date(b + "T00:00:00Z").getTime();
  return Math.round((db - da) / 86_400_000);
}

const initialSettings: SettingsState = {
  reducedMotion: false,
  lowBandwidth: false,
  sound: true,
  highContrast: false,
};

const initialState: ProgressState = {
  _hasHydrated: false,
  lessons: {},
  practice: {},
  bookmarks: [],
  achievements: {},
  games: {},
  settings: initialSettings,
  path: null,
  lastActiveDay: null,
  currentStreak: 0,
  longestStreak: 0,
  lastAwarded: null,
};

/* ---------------------------------------------------------------------------
   Store
--------------------------------------------------------------------------- */

export const useProgress = create<ProgressStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setLessonProgress: (id, patch) =>
        set((s) => {
          const prev = s.lessons[id] ?? {
            state: "in-progress" as ContentState,
            percent: 0,
            lastSection: null,
            masteryScore: null,
            attempts: 0,
            updatedAt: Date.now(),
          };
          return {
            lessons: {
              ...s.lessons,
              [id]: { ...prev, ...patch, updatedAt: Date.now() },
            },
          };
        }),

      completeLesson: (id, masteryScore) =>
        set((s) => {
          const prev = s.lessons[id];
          return {
            lessons: {
              ...s.lessons,
              [id]: {
                state: "completed",
                percent: 100,
                lastSection: prev?.lastSection ?? null,
                masteryScore: masteryScore ?? prev?.masteryScore ?? null,
                attempts: (prev?.attempts ?? 0) + (masteryScore != null ? 1 : 0),
                updatedAt: Date.now(),
              },
            },
          };
        }),

      setPracticeStatus: (id, status) =>
        set((s) => ({ practice: { ...s.practice, [id]: status } })),

      toggleBookmark: (b) =>
        set((s) => {
          const exists = s.bookmarks.some((x) => x.id === b.id);
          return {
            bookmarks: exists
              ? s.bookmarks.filter((x) => x.id !== b.id)
              : [{ ...b, createdAt: Date.now() }, ...s.bookmarks],
          };
        }),

      isBookmarked: (id) => get().bookmarks.some((x) => x.id === id),

      // Idempotent award — never double-grants even on retried events.
      awardAchievement: (key) => {
        if (get().achievements[key]) return false;
        const at = Date.now();
        set((s) => ({
          achievements: { ...s.achievements, [key]: at },
          lastAwarded: { key, at },
        }));
        return true;
      },

      completeGameLevel: (id, score) =>
        set((s) => {
          const prev = s.games[id];
          return {
            games: {
              ...s.games,
              [id]: {
                state: "completed",
                bestScore: Math.max(score, prev?.bestScore ?? 0),
                attempts: (prev?.attempts ?? 0) + 1,
                completedAt: prev?.completedAt ?? Date.now(),
              },
            },
          };
        }),

      updateSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),

      setPath: (path) => set({ path }),

      clearLastAwarded: () => set({ lastAwarded: null }),

      recordActivity: () =>
        set((s) => {
          const today = todayKey();
          if (s.lastActiveDay === today) return s;
          let streak = 1;
          if (s.lastActiveDay && dayDiff(s.lastActiveDay, today) === 1) {
            streak = s.currentStreak + 1;
          }
          return {
            lastActiveDay: today,
            currentStreak: streak,
            longestStreak: Math.max(streak, s.longestStreak),
          };
        }),

      resetProgress: () =>
        set((s) => ({
          ...initialState,
          _hasHydrated: true,
          settings: s.settings, // keep accessibility prefs
          path: s.path,
        })),

      setHasHydrated: (v) => set({ _hasHydrated: v }),
    }),
    {
      name: "algoquest-progress",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        lessons: s.lessons,
        practice: s.practice,
        bookmarks: s.bookmarks,
        achievements: s.achievements,
        games: s.games,
        settings: s.settings,
        path: s.path,
        lastActiveDay: s.lastActiveDay,
        currentStreak: s.currentStreak,
        longestStreak: s.longestStreak,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

/* ---------------------------------------------------------------------------
   Derived selectors
--------------------------------------------------------------------------- */

export function selectXp(s: ProgressStore) {
  const lessons = Object.values(s.lessons).filter((l) => l.state === "completed").length;
  const solved = Object.values(s.practice).filter((p) => p === "solved").length;
  const games = Object.values(s.games).filter((g) => g.state === "completed").length;
  const achievements = Object.keys(s.achievements).length;
  return lessons * 100 + solved * 40 + games * 150 + achievements * 25;
}

export function selectLevel(xp: number) {
  // Smooth curve: each level needs a bit more XP than the last.
  const level = Math.floor(Math.sqrt(xp / 60)) + 1;
  const currentBase = Math.pow(level - 1, 2) * 60;
  const nextBase = Math.pow(level, 2) * 60;
  return {
    level,
    into: xp - currentBase,
    span: nextBase - currentBase,
    pct: Math.round(((xp - currentBase) / (nextBase - currentBase)) * 100),
  };
}

export function selectCompletedLessonCount(s: ProgressStore) {
  return Object.values(s.lessons).filter((l) => l.state === "completed").length;
}
