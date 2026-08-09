"use client";

import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/lib/auth-context";
import { getDemoFacultyRankings } from "@/lib/demo-data";
import { formatXp } from "@/lib/utils";

export default function LeaderboardPage() {
  const { leaderboard, user } = useAuth();
  const facultyRankings = getDemoFacultyRankings();

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#16162a] to-[#0f0f1a] border border-white/5 p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Leaderboard</h1>
            <p className="text-slate-400 text-sm mt-1.5">
              Campus rankings by XP. Climb higher.
            </p>
          </div>
        </div>

        {/* Top Students */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>🏆</span> Top Students
          </h2>
          <div className="rounded-2xl border border-white/5 overflow-hidden bg-[#12121a]/80">
            {leaderboard.slice(0, 15).map((entry, index) => {
              const isYou = user && entry.name === user.name;
              const medal = entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : null;

              return (
                <div
                  key={entry.userId}
                  className={`flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-0 transition ${
                    isYou ? "bg-purple-500/10" : index % 2 === 0 ? "bg-transparent" : "bg-white/[0.01]"
                  }`}
                >
                  <div className="w-10 text-center shrink-0">
                    {medal ? (
                      <span className="text-xl">{medal}</span>
                    ) : (
                      <span className="text-sm font-bold text-slate-500">#{entry.rank}</span>
                    )}
                  </div>

                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-sm font-bold shrink-0">
                    {entry.name.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {entry.name}
                      {isYou && (
                        <span className="ml-2 text-xs text-purple-400 font-normal">(You)</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">{entry.faculty}</div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-semibold text-purple-300">Lvl {entry.level}</div>
                    <div className="text-xs text-amber-400/90">{formatXp(entry.xp)} XP</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Faculty Rankings */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>🏛️</span> Faculty Rankings
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {facultyRankings.map((f, i) => (
              <div
                key={f.faculty}
                className="p-5 rounded-2xl bg-[#12121a] border border-white/5 flex items-center gap-4 hover:border-white/10 transition"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-lg font-bold text-slate-400">
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{f.faculty}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {f.studentCount} students · Avg Lvl {f.averageLevel}
                  </div>
                </div>
                <div className="text-sm font-semibold text-purple-400">
                  {formatXp(f.totalXp)}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}