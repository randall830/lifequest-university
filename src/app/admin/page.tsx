"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/lib/auth-context";
import { DEMO_STUDENTS, DEMO_QUESTS } from "@/lib/demo-data";
import { formatXp } from "@/lib/utils";

export default function AdminPage() {
  const { allQuests, leaderboard } = useAuth();
  const [tab, setTab] = useState<"students" | "quests" | "stats">("students");

  const categoryCounts: Record<string, number> = {};
  allQuests.forEach((q) => {
    categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1;
  });

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm">University / community management (MVP)</p>
        </div>

        <div className="flex gap-2">
          {(["students", "quests", "stats"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm capitalize ${
                tab === t ? "bg-purple-600 text-white" : "bg-white/5 text-slate-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "students" && (
          <div className="rounded-2xl border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white/5 text-slate-400 text-left">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Faculty</th>
                    <th className="px-4 py-3">Level</th>
                    <th className="px-4 py-3">XP</th>
                    <th className="px-4 py-3">Quests</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_STUDENTS.map((s) => (
                    <tr key={s.id} className="border-t border-white/5">
                      <td className="px-4 py-3 font-medium">{s.name}</td>
                      <td className="px-4 py-3 text-slate-400">{s.faculty}</td>
                      <td className="px-4 py-3">{s.level}</td>
                      <td className="px-4 py-3 text-purple-400">{formatXp(s.xp)}</td>
                      <td className="px-4 py-3">{s.totalQuestsCompleted}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "quests" && (
          <div className="space-y-3">
            <p className="text-sm text-slate-400">{allQuests.length} total quests in system</p>
            {allQuests.slice(0, 10).map((q) => (
              <div key={q.id} className="p-4 rounded-xl bg-[#12121a] border border-white/5 flex justify-between items-start">
                <div>
                  <div className="font-medium">{q.title}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {q.category} · {q.difficulty}/5 · +{q.xpReward} XP · {q.createdBy}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "stats" && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-[#12121a] border border-white/5">
              <h3 className="font-semibold mb-3">Popular Categories</h3>
              {Object.entries(categoryCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, count]) => (
                  <div key={cat} className="flex justify-between text-sm py-1.5">
                    <span className="text-slate-300">{cat}</span>
                    <span className="text-slate-500">{count}</span>
                  </div>
                ))}
            </div>
            <div className="p-5 rounded-xl bg-[#12121a] border border-white/5">
              <h3 className="font-semibold mb-3">Participation Snapshot</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Demo students</span>
                  <span>{DEMO_STUDENTS.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">System quests</span>
                  <span>{DEMO_QUESTS.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Top XP</span>
                  <span className="text-purple-400">{formatXp(leaderboard[0]?.xp || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}