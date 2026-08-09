"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { UserProfile, Quest, UserQuest, UserAchievement, BossBattle } from "@/types";
import { storage } from "./storage";
import { generateQuests, analyzeReflection } from "./ai-quest";
import { getDemoLeaderboard } from "./demo-data";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
  completeOnboarding: (data: any) => void;
  refreshUser: () => void;
  acceptQuest: (quest: Quest) => UserQuest | null;
  completeQuest: (userQuestId: string, reflection: string) => Promise<{
    xp: number;
    feedback: string;
    leveledUp: boolean;
    newLevel?: number;
    unlocked: UserAchievement[];
  } | null>;
  generateNewQuests: (count?: number) => Promise<Quest[]>;
  userQuests: UserQuest[];
  allQuests: Quest[];
  achievements: UserAchievement[];
  bossBattles: BossBattle[];
  leaderboard: ReturnType<typeof getDemoLeaderboard>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [userQuests, setUserQuests] = useState<UserQuest[]>([]);
  const [allQuests, setAllQuests] = useState<Quest[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [bossBattles, setBossBattles] = useState<BossBattle[]>([]);

  const refresh = useCallback(() => {
    const u = storage.getUser();
    setUser(u);
    setUserQuests(storage.getUserQuests());
    setAllQuests(storage.getQuests());
    setAchievements(storage.getUserAchievements());
    setBossBattles(storage.getBossBattles());
  }, []);

  useEffect(() => {
    refresh();
    setLoading(false);
  }, [refresh]);

  const login = async (email: string, _password: string) => {
    const existing = storage.getUser();
    if (existing && existing.email === email) {
      setUser(existing);
      return {};
    }
    if (existing) {
      setUser(existing);
      return {};
    }
    return { error: "No account found. Please sign up." };
  };

  const signup = async (email: string, _password: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lq_pending_email", email);
    }
    return {};
  };

  const logout = () => {
    storage.clearUser();
    setUser(null);
    setUserQuests([]);
    setAchievements([]);
  };

  const completeOnboarding = (data: any) => {
    const email =
      (typeof window !== "undefined" && localStorage.getItem("lq_pending_email")) ||
      "student@lifequest.my";
    const newUser = storage.createUserFromOnboarding(email, data);
    setUser(newUser);
    refresh();
  };

  const acceptQuest = (quest: Quest) => {
    if (!user) return null;
    const uq = storage.acceptQuest(user.id, quest);
    setUserQuests(storage.getUserQuests());
    return uq;
  };

  const completeQuest = async (userQuestId: string, reflection: string) => {
    if (!user) return null;
    const uqs = storage.getUserQuests();
    const uq = uqs.find((q) => q.id === userQuestId);
    if (!uq || !uq.quest) return null;

    const analysis = await analyzeReflection(reflection, uq.quest, user);
    const completed = storage.completeQuest(
      userQuestId,
      reflection,
      analysis.recommendedXp,
      analysis.feedback,
      analysis.quality === "excellent" ? 100 : analysis.quality === "good" ? 80 : 60
    );
    if (!completed) return null;

    const result = storage.applyQuestRewards(user, uq.quest, analysis.recommendedXp);
    setUser(result.user);
    setUserQuests(storage.getUserQuests());
    setAchievements(storage.getUserAchievements());

    return {
      xp: analysis.recommendedXp,
      feedback: analysis.feedback,
      leveledUp: result.leveledUp,
      newLevel: result.newLevel,
      unlocked: result.unlocked,
    };
  };

  const generateNewQuests = async (count = 3) => {
    if (!user) return [];
    const completed = storage
      .getUserQuests()
      .filter((uq) => uq.status === "completed" && uq.quest)
      .map((uq) => uq.quest!);
    const newQuests = await generateQuests({ profile: user, completedQuests: completed }, count);
    newQuests.forEach((q) => storage.addQuest(q));
    setAllQuests(storage.getQuests());
    return newQuests;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isOnboarded: storage.isOnboarded(),
        login,
        signup,
        logout,
        completeOnboarding,
        refreshUser: refresh,
        acceptQuest,
        completeQuest,
        generateNewQuests,
        userQuests,
        allQuests,
        achievements,
        bossBattles,
        leaderboard: getDemoLeaderboard(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}