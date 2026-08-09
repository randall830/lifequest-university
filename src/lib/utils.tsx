import type { SkillName } from "@/types";

export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(100 * Math.pow(1.35, level - 2));
}

export function totalXpForLevel(level: number): number {
  let total = 0;
  for (let i = 2; i <= level; i++) {
    total += xpForLevel(i);
  }
  return total;
}

export function levelFromXp(xp: number): number {
  let level = 1;
  let remaining = xp;
  while (remaining >= xpForLevel(level + 1)) {
    remaining -= xpForLevel(level + 1);
    level++;
    if (level > 100) break;
  }
  return level;
}

export function xpProgress(xp: number, level: number) {
  const currentLevelXp = totalXpForLevel(level);
  const nextLevelXp = totalXpForLevel(level + 1);
  const needed = nextLevelXp - currentLevelXp;
  const progress = xp - currentLevelXp;
  return {
    current: Math.max(0, progress),
    needed,
    percentage: needed > 0 ? Math.min(100, (progress / needed) * 100) : 100,
  };
}

export function formatXp(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return xp.toString();
}

export const SKILL_NAMES: SkillName[] = [
  "Knowledge",
  "Communication",
  "Creativity",
  "Leadership",
  "Entrepreneurship",
  "Social",
  "Discipline",
  "Problem Solving",
];

export const DEFAULT_SKILLS = SKILL_NAMES.map((name) => ({
  name,
  value: 10,
  max: 100,
}));

export function getDifficultyLabel(d: number): string {
  const labels = ["", "Easy", "Moderate", "Challenging", "Hard", "Epic"];
  return labels[d] || "Unknown";
}

export function getDifficultyColor(d: number): string {
  if (d <= 1) return "text-green-400";
  if (d <= 2) return "text-lime-400";
  if (d <= 3) return "text-yellow-400";
  if (d <= 4) return "text-orange-400";
  return "text-red-400";
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}