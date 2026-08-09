"use client";

import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/lib/auth-context";

export default function BossBattlesPage() {
  const { bossBattles } = useAuth();

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1508] to-[#0f0f1a] border border-amber-500/20 p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs mb-3">
              ⚔️ Special Challenges
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Boss Battles</h1>
            <p className="text-slate-400 text-sm mt-1.5 max-w-lg">
              Bigger real-world challenges with bigger rewards. Join alone or with friends.
            </p>
          </div>
        </div>

        {/* Boss Cards */}
        <div className="space-y-6">
          {bossBattles.map((b) => {
            const daysLeft = Math.max(
              0,
              Math.ceil((new Date(b.deadline).getTime() - Date.now()) / 86400000)
            );

            return (
              <div
                key={b.id}
                className="relative p-6 sm:p-8 rounded-2xl bg-[#12121a] border border-amber-500/20 overflow-hidden hover:border-amber-500/40 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl" />

                <div className="relative">
                  {/* Top badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                      BOSS BATTLE
                    </span>
                    {b.isActive && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                        Active
                      </span>
                    )}
                    <span className="text-xs text-slate-500 ml-auto">
                      {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-amber-100 mb-2">
                    {b.title}
                  </h2>
                  <p className="text-amber-200/80 text-sm font-medium mb-1">{b.objective}</p>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">{b.description}</p>

                  {/* Rules */}
                  <div className="mb-6">
                    <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Rules</h4>
                    <ul className="space-y-1.5">
                      {b.rules.map((r, i) => (
                        <li key={i} className="text-sm text-slate-400 flex gap-2">
                          <span className="text-amber-500 shrink-0">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stats row */}
                  <div className="flex flex-wrap items-center gap-4 text-sm mb-5">
                    <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-slate-500">Reward: </span>
                      <span className="text-amber-300 font-medium">{b.reward}</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-slate-500">Players: </span>
                      <span className="font-medium">
                        {b.participants}
                        {b.maxParticipants ? ` / ${b.maxParticipants}` : ""}
                      </span>
                    </div>
                  </div>

                  {/* Progress */}
                  {typeof b.progress === "number" && (
                    <div className="mb-6">
                      <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                        <span>Campus Progress</span>
                        <span>{b.progress}%</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-700"
                          style={{ width: `${b.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <button className="w-full sm:w-auto px-8 py-3 rounded-xl bg-amber-600/20 border border-amber-500/40 text-amber-200 font-medium hover:bg-amber-600/30 transition shadow-lg shadow-amber-500/5">
                    Join Challenge
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}