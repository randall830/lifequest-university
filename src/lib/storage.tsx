"use client";

import type {
  Achievement,
  BossBattle,
  Quest,
  UserAchievement,
  UserProfile,
  UserQuest,
} from "@/types";
import { DEMO_ACHIEVEMENTS, DEMO_BOSS_BATTLES, DEMO_QUESTS } from "./demo-data";
import { DEFAULT_SKILLS, generateId, levelFromXp } from "./utils";

const KEYS = {
  user: "lq_user",
  quests: "lq_quests",
  userQuests: "lq_user_quests",
  achievements: "lq_achievements",
  userAchievements: "lq_user_achievements",
  bossBattles: "lq_boss_battles",
  onboardingDone: "lq_onboarding_done",
};

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const storage = {
  getUser(): UserProfile | null {
    if (typeof window === "undefined") return null;
    return safeParse(localStorage.getItem(KEYS.user), null);
  },

  setUser(user: UserProfile) {
    localStorage.setItem(KEYS.user, JSON.stringify(user));
  },

  clearUser() {
    localStorage.removeItem(KEYS.user);
    localStorage.removeItem(KEYS.onboardingDone);
    localStorage.removeItem(KEYS.userQuests);
    localStorage.removeItem(KEYS.userAchievements);
  },

  isOnboarded(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(KEYS.onboardingDone) === "true";
  },

  setOnboarded() {
    localStorage.setItem(KEYS.onboardingDone, "true");
  },

  getQuests(): Quest[] {
    const stored = safeParse<Quest[]>(localStorage.getItem(KEYS.quests), []);
    if (stored.length === 0) {
      localStorage.setItem(KEYS.quests, JSON.stringify(DEMO_QUESTS));
      return DEMO_QUESTS;
    }
    return stored;
  },

  saveQuests(quests: Quest[]) {
    localStorage.setItem(KEYS.quests, JSON.stringify(quests));
  },

  addQuest(quest: Quest) {
    const quests = this.getQuests();
    quests.unshift(quest);
    this.saveQuests(quests);
  },

  getUserQuests(): UserQuest[] {
    return safeParse(localStorage.getItem(KEYS.userQuests), []);
  },

  saveUserQuests(uqs: UserQuest[]) {
    localStorage.setItem(KEYS.userQuests, JSON.stringify(uqs));
  },

  acceptQuest(userId: string, quest: Quest): UserQuest {
    const uqs = this.getUserQuests();
    const existing = uqs.find((uq) => uq.questId === quest.id && uq.status === "accepted");
    if (existing) return existing;

    const uq: UserQuest = {
      id: generateId(),
      userId,
      questId: quest.id,
      quest,
      status: "accepted",
      acceptedAt: new Date().toISOString(),
    };
    uqs.push(uq);
    this.saveUserQuests(uqs);
    return uq;
  },

  completeQuest(
    userQuestId: string,
    reflection: string,
    xpAwarded: number,
    aiFeedback: string,
    qualityScore: number
  ): UserQuest | null {
    const uqs = this.getUserQuests();
    const idx = uqs.findIndex((uq) => uq.id === userQuestId);
    if (idx === -1) return null;

    uqs[idx] = {
      ...uqs[idx],
      status: "completed",
      completedAt: new Date().toISOString(),
      reflection,
      xpAwarded,
      aiFeedback,
      qualityScore,
    };
    this.saveUserQuests(uqs);
    return uqs[idx];
  },

  getAchievements(): Achievement[] {
    return DEMO_ACHIEVEMENTS;
  },

  getUserAchievements(): UserAchievement[] {
    return safeParse(localStorage.getItem(KEYS.userAchievements), []);
  },

  unlockAchievement(userId: string, achievementId: string): UserAchievement | null {
    const existing = this.getUserAchievements();
    if (existing.some((ua) => ua.achievementId === achievementId)) return null;

    const ua: UserAchievement = {
      id: generateId(),
      userId,
      achievementId,
      unlockedAt: new Date().toISOString(),
      achievement: DEMO_ACHIEVEMENTS.find((a) => a.id === achievementId),
    };
    existing.push(ua);
    localStorage.setItem(KEYS.userAchievements, JSON.stringify(existing));
    return ua;
  },

  getBossBattles(): BossBattle[] {
    const stored = safeParse<BossBattle[]>(localStorage.getItem(KEYS.bossBattles), []);
    if (stored.length === 0) {
      localStorage.setItem(KEYS.bossBattles, JSON.stringify(DEMO_BOSS_BATTLES));
      return DEMO_BOSS_BATTLES;
    }
    return stored;
  },

  applyQuestRewards(
    user: UserProfile,
    quest: Quest,
    xpGained: number
  ): { user: UserProfile; leveledUp: boolean; newLevel?: number; unlocked: UserAchievement[] } {
    const oldLevel = user.level;
    const newXp = user.xp + xpGained;
    const newLevel = levelFromXp(newXp);

    const newSkills = user.skills.map((s) => {
      const gain = quest.skillsRewarded[s.name] || 0;
      return {
        ...s,
        value: Math.min(s.max, s.value + gain),
      };
    });

    const today = new Date().toISOString().slice(0, 10);
    let streak = user.currentStreak;
    if (user.lastQuestDate !== today) {
      const last = user.lastQuestDate ? new Date(user.lastQuestDate) : null;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (last && last.toISOString().slice(0, 10) === yesterday.toISOString().slice(0, 10)) {
        streak += 1;
      } else {
        streak = 1;
      }
    }

    const updated: UserProfile = {
      ...user,
      xp: newXp,
      level: newLevel,
      skills: newSkills,
      totalQuestsCompleted: user.totalQuestsCompleted + 1,
      currentStreak: streak,
      longestStreak: Math.max(user.longestStreak, streak),
      lastQuestDate: today,
    };

    this.setUser(updated);

    const unlocked: UserAchievement[] = [];
    const check = (id: string, condition: boolean) => {
      if (condition) {
        const ua = this.unlockAchievement(user.id, id);
        if (ua) unlocked.push(ua);
      }
    };

    check("first-quest", updated.totalQuestsCompleted >= 1);
    check("campus-legend", updated.level >= 10);
    check("streak-7", updated.currentStreak >= 7);

    const completed = this.getUserQuests().filter((uq) => uq.status === "completed");
    const cats = new Set(completed.map((uq) => uq.quest?.category).filter(Boolean));
    check("explorer", cats.size >= 5);

    const socialCount = completed.filter((uq) => uq.quest?.category === "Social").length;
    check("social-butterfly", socialCount >= 10);

    const entreCount = completed.filter((uq) => uq.quest?.category === "Entrepreneurship").length;
    check("entrepreneur", entreCount >= 5);

    const leadCount = completed.filter((uq) => uq.quest?.category === "Leadership").length;
    check("leader", leadCount >= 10);

    const knowledge = updated.skills.find((s) => s.name === "Knowledge");
    check("knowledge-seeker", (knowledge?.value || 0) >= 50);

    return {
      user: updated,
      leveledUp: newLevel > oldLevel,
      newLevel: newLevel > oldLevel ? newLevel : undefined,
      unlocked,
    };
  },

createUserFromOnboarding(
  email: string,
  data: {
    name: string;
    age: number;
    university: string;
    faculty: string;
    degree: string;
    yearOfStudy: number;
    interests: string[];
    personalGoals: string[];
    preferredQuestTypes: any[];
    instagram?: string;
    linkedin?: string;
    bio?: string;
    openToConnect?: boolean;
  }
): UserProfile {
  const user: UserProfile = {
    id: generateId(),
    email,
    name: data.name,
    age: data.age,
    university: data.university,
    faculty: data.faculty,
    degree: data.degree,
    yearOfStudy: data.yearOfStudy,
    interests: data.interests,
    personalGoals: data.personalGoals,
    preferredQuestTypes: data.preferredQuestTypes,
    level: 1,
    xp: 0,
    totalQuestsCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    skills: DEFAULT_SKILLS.map((s) => ({ ...s })),
    createdAt: new Date().toISOString(),
    // Social fields
    instagram: data.instagram,
    linkedin: data.linkedin,
    bio: data.bio,
    openToConnect: data.openToConnect ?? true,
  };
  this.setUser(user);
  this.setOnboarded();
  return user;
},
};