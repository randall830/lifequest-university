"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/lib/auth-context";
import { getDifficultyLabel, getDifficultyColor } from "@/lib/utils";
import type { QuestCategory } from "@/types";

const CATEGORIES: (QuestCategory | "All")[] = [
  "All", "Social", "Academic", "Entrepreneurship", "Creativity",
  "Leadership", "Health", "Career", "Community",
];

const CATEGORY_COLORS: Record<string, string> = {
  Social: "bg-pink-500/15 text-pink-300 border-pink-500/20",
  Academic: "bg-blue-500/15 text-blue-300 border-blue-500/20",
  Entrepreneurship: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  Creativity: "bg-violet-500/15 text-violet-300 border-violet-500/20",
  Leadership: "bg-indigo-500/15 text-indigo-300 border-indigo-500/20",
  Health: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  Career: "bg-sky-500/15 text-sky-300 border-sky-500/20",
  Community: "bg-teal-500/15 text-teal-300 border-teal-500/20",
};

export default function QuestBoardPage() {
  const { allQuests, userQuests, generateNewQuests } = useAuth();
  const [filter, setFilter] = useState<QuestCategory | "All">("All");
  const [generating, setGenerating] = useState(false);

  const acceptedIds = useMemo(
    () => new Set(userQuests.filter((uq) => uq.status === "accepted").map((uq) => uq.questId)),
    [userQuests]
  );
  const completedIds = useMemo(
    () => new Set(userQuests.filter((uq) => uq.status === "completed").map((uq) => uq.questId)),
    [userQuests]
  );

  const filtered = allQuests.filter(
    (q) => filter === "All" || q.category === filter
  );

  const handleGenerate = async () => {
    setGenerating(true);
    await generateNewQuests(4);
    setGenerating(false);
  };

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Quest Board</h1>
            <p className="text-slate-400 text-sm mt-1">Discover and accept real-world challenges</p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="group relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-sm font-medium shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition disabled:opacity-50"
          >
            {generating ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                AI is creating...
              </span>
            ) : (
              "✨ AI Generate Quests"
            )}
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap border transition-all duration-200 ${
                filter === c
                  ? "border-purple-500 bg-purple-500/20 text-purple-200 shadow-md shadow-purple-500/10"
                  : "border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200 bg-white/[0.02]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Quest Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((q) => {
            const isAccepted = acceptedIds.has(q.id);
            const isCompleted = completedIds.has(q.id);
            const catColor = CATEGORY_COLORS[q.category] || "bg-white/5 text-slate-300 border-white/10";

            return (
              <div
                key={q.id}
                className={`group relative p-5 rounded-2xl bg-[#12121a] border transition-all duration-300 hover:-translate-y-1 ${
                  isAccepted
                    ? "border-purple-500/50 shadow-lg shadow-purple-500/10"
                    : isCompleted
                    ? "border-emerald-500/20 opacity-75"
                    : "border-white/5 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/5"
                }`}
              >
                {/* Top row */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${catColor}`}>
                    {q.category}
                  </span>
                  <span className="text-sm font-semibold text-amber-400">+{q.xpReward} XP</span>
                </div>

                {/* Title & description */}
                <h3 className="font-semibold text-[15px] mb-2 group-hover:text-purple-200 transition line-clamp-1">
                  {q.title}
                </h3>
                <p className="text-sm text-slate-400 line-clamp-3 mb-5 leading-relaxed">
                  {q.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-5">
                  <span className="flex items-center gap-1">⏱ {q.estimatedDuration}</span>
                  <span className={getDifficultyColor(q.difficulty)}>
                    {getDifficultyLabel(q.difficulty)}
                  </span>
                </div>

                {/* Action */}
                {isCompleted ? (
                  <div className="flex items-center gap-2 text-sm text-emerald-400">
                    <span>✓</span> Completed
                  </div>
                ) : isAccepted ? (
                  <Link
                    href={`/quests/${q.id}`}
                    className="block text-center py-2.5 rounded-xl bg-purple-600/20 text-purple-300 text-sm font-medium border border-purple-500/30 hover:bg-purple-600/30 transition"
                  >
                    Continue Quest →
                  </Link>
                ) : (
                  <Link
                    href={`/quests/${q.id}`}
                    className="block text-center py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium border border-white/10 hover:border-white/20 transition"
                  >
                    View & Accept
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">📜</div>
            <p className="text-slate-400 mb-4">No quests in this category yet.</p>
            <button
              onClick={handleGenerate}
              className="text-purple-400 text-sm hover:text-purple-300 transition underline underline-offset-4"
            >
              Generate some with AI
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}