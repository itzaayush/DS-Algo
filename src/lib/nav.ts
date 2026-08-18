import {
  BookOpen,
  Bookmark,
  Gamepad2,
  LayoutDashboard,
  Home,
  Target,
  Trophy,
  Dumbbell,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, description: "Resume, streak, and progress" },
  { href: "/learn", label: "Learn", icon: BookOpen, description: "Sequential DSA fundamentals" },
  { href: "/patterns", label: "Pattern Lab", icon: Target, description: "Recognize and apply patterns" },
  { href: "/practice", label: "Practice", icon: Dumbbell, description: "Curated LeetCode & Codeforces" },
  { href: "/adventure", label: "Adventure", icon: Gamepad2, description: "3D concept challenges" },
];

export const SECONDARY_NAV: NavItem[] = [
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark, description: "Saved lessons and problems" },
  { href: "/achievements", label: "Achievements", icon: Trophy, description: "Earned and locked badges" },
  { href: "/settings", label: "Settings", icon: Settings, description: "Accessibility and data" },
];

export const HOME_NAV: NavItem = { href: "/", label: "Home", icon: Home, description: "Overview" };

export const ALL_NAV = [HOME_NAV, ...PRIMARY_NAV, ...SECONDARY_NAV];
