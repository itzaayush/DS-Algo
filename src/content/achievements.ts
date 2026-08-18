import type { LucideIcon } from "lucide-react";
import {
  Award,
  Flame,
  Footprints,
  Gamepad2,
  Grid3x3,
  Medal,
  Sparkles,
  Star,
  Swords,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

export interface AchievementDef {
  key: string;
  title: string;
  description: string;
  icon: LucideIcon;
  points: number;
  tone: "primary" | "secondary" | "accent" | "success";
  hidden?: boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { key: "first-lesson", title: "First Steps", description: "Complete your very first lesson.", icon: Footprints, points: 10, tone: "primary" },
  { key: "arrays-complete", title: "Array Architect", description: "Finish the Arrays & Strings module.", icon: Grid3x3, points: 40, tone: "secondary" },
  { key: "first-solve", title: "First Blood", description: "Mark your first practice problem as solved.", icon: Swords, points: 15, tone: "accent" },
  { key: "first-pattern", title: "Pattern Seeker", description: "Complete your first Pattern Lab unit.", icon: Target, points: 30, tone: "primary" },
  { key: "mastery-ace", title: "Flawless", description: "Score 100% on a mastery quiz.", icon: Star, points: 25, tone: "accent" },
  { key: "streak-3", title: "On a Roll", description: "Learn 3 days in a row.", icon: Flame, points: 20, tone: "accent" },
  { key: "streak-7", title: "Unstoppable", description: "Keep a 7-day learning streak.", icon: Zap, points: 50, tone: "success" },
  { key: "first-game", title: "Adventurer", description: "Complete your first Adventure level.", icon: Gamepad2, points: 30, tone: "secondary" },
  { key: "first-bookmark", title: "Curator", description: "Bookmark your first piece of content.", icon: Medal, points: 10, tone: "primary" },
  { key: "visualizer-explorer", title: "Trace Master", description: "Play a full algorithm trace to the end.", icon: Sparkles, points: 15, tone: "secondary" },
  { key: "level-5", title: "Rising Star", description: "Reach account level 5.", icon: Trophy, points: 60, tone: "success", hidden: true },
  { key: "pattern-graduate", title: "Pattern Graduate", description: "Complete six Pattern Lab units.", icon: Award, points: 80, tone: "success", hidden: true },
];

export const ACHIEVEMENT_MAP = new Map(ACHIEVEMENTS.map((a) => [a.key, a]));

export function getAchievement(key: string) {
  return ACHIEVEMENT_MAP.get(key);
}
