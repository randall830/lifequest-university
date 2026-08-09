"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/lib/auth-context";
import { xpProgress, formatXp, getDifficultyLabel } from "@/lib/utils";
import { useState } from "react";

export default function DashboardPage() {
  const { user, userQuests, allQuests, achievements, bossBattles, leaderboard, generateNewQuests } = useAuth();
  const [generating, setGenerating] = useState(false);

  if (!user) return null;

  const prog = xpProgress(user.xp, user.level);
  const accepted = userQuests.filter((q) => q.status === "accepted");
  const rank = leaderboard.findIndex((e) => e.name === user.name) + 1 || "—";
  const recommended = allQuests.slice(0, 3);

  const handleGenerate = async () => {
    setGenerating(true);
    await generateNewQuests(3);
    setGenerating(false);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#16162a] to-[#0f0f1a] border border-white/5 p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <p className="text-sm text-purple-300/80 mb-1">Welcome back</p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {user.name.split(" ")[0]} 👋
              </h1>
              <p className="text-slate-400 text-sm mt-1.5">
                {user.faculty} · Year {user.yearOfStudy} · {user.university}
              </p>
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="group relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-sm font-medium shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition disabled:opacity-50"
            >
              {generating ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </span>
              ) : (
                "✨ Generate New Quests"
              )}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Level */}
          <div className="relative p-5 rounded-2xl bg-[#12121a] border border-white/5 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Level</div>
              <div className="text-3xl font-bold text-purple-300">{user.level}</div>
              <div className="mt-3 h-2 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-700"
                  style={{ width: `${prog.percentage}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-500 mt-1.5">
                {prog.current} / {prog.needed} XP to next
              </div>
            </div>
          </div>

          {/* Total XP */}
          <div className="relative p-5 rounded-2xl bg-[#12121a] border border-white/5 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Total XP</div>
              <div className="text-3xl font-bold">{formatXp(user.xp)}</div>
              <div className="text-[11px] text-slate-500 mt-3">Lifetime of experience</div>
            </div>
          </div>

          {/* Streak */}
          <div className="relative p-5 rounded-2xl bg-[#12121a] border border-white/5 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Streak</div>
              <div className="text-3xl font-bold text-orange-400 flex items-center gap-1">
                {user.currentStreak}
                <span className="text-xl">🔥</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-3">days in a row</div>
            </div>
          </div>

          {/* Rank */}
          <div className="relative p-5 rounded-2xl bg-[#12121a] border border-white/5 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Campus Rank</div>
              <div className="text-3xl font-bold text-amber-400">#{rank}</div>
              <div className="text-[11px] text-slate-500 mt-3">among all players</div>
            </div>
          </div>
        </div>

        {/* Active Quests */}
        {accepted.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Active Quests
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {accepted.map((uq) => (
                <Link
                  key={uq.id}
                  href={`/quests/${uq.questId}`}
                  className="group p-5 rounded-2xl bg-[#12121a] border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/10"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/20">
                      {uq.quest?.category}
                    </span>
                    <span className="text-sm font-semibold text-amber-400">+{uq.quest?.xpReward} XP</span>
                  </div>
                  <h3 className="font-semibold group-hover:text-purple-200 transition">{uq.quest?.title}</h3>
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                    Tap to complete
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recommended Quests */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Recommended For You
            </h2>
            <Link href="/quests" className="text-sm text-purple-400 hover:text-purple-300 transition">
              View all →
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {recommended.map((q) => (
              <Link
                key={q.id}
                href={`/quests/${q.id}`}
                className="group p-5 rounded-2xl bg-[#12121a] border border-white/5 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/5"
              >
                <div className="flex justify-between mb-3">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-slate-400 border border-white/5">
                    {q.category}
                  </span>
                  <span className="text-sm font-semibold text-amber-400">+{q.xpReward}</span>
                </div>
                <h3 className="font-medium text-sm mb-2 group-hover:text-purple-200 transition line-clamp-1">
                  {q.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{q.description}</p>
                <div className="mt-3 text-[11px] text-slate-600 flex items-center gap-2">
                  <span>⏱ {q.estimatedDuration}</span>
                  <span>·</span>
                  <span>{getDifficultyLabel(q.difficulty)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Skill Progression
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {user.skills.map((s) => (
              <div
                key={s.name}
                className="p-4 rounded-2xl bg-[#12121a] border border-white/5 hover:border-white/10 transition"
              >
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-400">{s.name}</span>
                  <span className="text-slate-300 font-medium">{s.value}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-700"
                    style={{ width: `${s.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom row */}
        <div className="grid sm:grid-cols-2 gap-5">
          {/* Achievements */}
          <section className="p-5 rounded-2xl bg-[#12121a] border border-white/5">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>🏅</span> Recent Achievements
            </h2>
            {achievements.length === 0 ? (
              <p className="text-sm text-slate-500 py-4">Complete quests to unlock achievements.</p>
            ) : (
              <div className="space-y-3">
                {achievements.slice(-3).reverse().map((a) => (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-xl">🏅</span>
                    <div>
                      <div className="font-medium text-sm">{a.achievement?.name}</div>
                      <div className="text-xs text-slate-500">{a.achievement?.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Boss Battles */}
          <section className="p-5 rounded-2xl bg-[#12121a] border border-white/5">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>⚔️</span> Upcoming Challenges
            </h2>
            {bossBattles.filter((b) => b.isActive).slice(0, 2).map((b) => (
              <Link
                key={b.id}
                href="/boss"
                className="block mb-3 last:mb-0 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 hover:border-amber-500/30 transition"
              >
                <div className="text-sm font-medium text-amber-200">{b.title}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {b.participants} participants · {b.xpReward} XP
                </div>
              </Link>
            ))}
          </section>
        </div>
      </div>
    </AppShell>
  );
}