"use client";

import { use, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/lib/auth-context";
import { getDifficultyLabel, getDifficultyColor } from "@/lib/utils";
import type { Quest, UserQuest } from "@/types";

export default function QuestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { allQuests, userQuests, acceptQuest, completeQuest, user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [quest, setQuest] = useState<Quest | null>(null);
  const [userQuest, setUserQuest] = useState<UserQuest | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    xp: number;
    feedback: string;
    leveledUp: boolean;
    newLevel?: number;
  } | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Anti-cheat states
  const [minutesLeft, setMinutesLeft] = useState(1);
  const [canComplete, setCanComplete] = useState(false);
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState("");
  const [q3, setQ3] = useState("");
  const [honest, setHonest] = useState(false);

  // Photo evidence
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);

  useEffect(() => {
    const q = allQuests.find((x) => x.id === id) || null;
    setQuest(q);
    const uq = userQuests.find((x) => x.questId === id) || null;
    setUserQuest(uq);
  }, [id, allQuests, userQuests]);

  // Time Gate
  useEffect(() => {
    if (!userQuest || userQuest.status !== "accepted" || !userQuest.acceptedAt) {
      setCanComplete(false);
      return;
    }

    const acceptedTime = new Date(userQuest.acceptedAt).getTime();
    const requiredWait = 1 * 60 * 1000; // 1 minute for testing

    const updateTimer = () => {
      const now = Date.now();
      const elapsed = now - acceptedTime;
      const remaining = Math.max(0, requiredWait - elapsed);
      const mins = Math.ceil(remaining / 60000);

      setMinutesLeft(mins);
      setCanComplete(remaining <= 0);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [userQuest]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB");
      return;
    }

    setPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setPhotoName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!quest || !user) {
    return (
      <AppShell>
        <div className="text-center py-20 text-slate-500">
          {user ? "Quest not found" : "Loading..."}
        </div>
      </AppShell>
    );
  }

  const handleAccept = () => {
    const uq = acceptQuest(quest);
    if (uq) setUserQuest(uq);
  };

  const handleComplete = async () => {
    if (!userQuest || !honest) return;

    const reflection = `
What I did: ${q1.trim()}

What was difficult: ${q2.trim()}

What I learned: ${q3.trim()}
${photoName ? `\nPhoto evidence: ${photoName}` : ""}
    `.trim();

    const totalLength = q1.trim().length + q2.trim().length + q3.trim().length;
    if (totalLength < 80) {
      alert("Please write more detailed answers. Short answers get less XP.");
      return;
    }

    setSubmitting(true);
    const res = await completeQuest(userQuest.id, reflection);
    setSubmitting(false);

    if (res) {
      // Bonus XP if photo was uploaded
      if (photoPreview) {
        res.xp = Math.round(res.xp * 1.15);
        res.feedback = res.feedback + " Photo evidence bonus applied.";
      }
      setResult(res);
      if (res.leveledUp) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3500);
      }
    }
  };

  const isFormValid =
    q1.trim().length >= 15 &&
    q2.trim().length >= 10 &&
    q3.trim().length >= 15 &&
    honest;

  return (
    <AppShell>
      {showLevelUp && result?.newLevel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="animate-level-up-pop animate-glow-pulse text-center p-10 rounded-3xl bg-[#12121a] border border-purple-500/50 max-w-sm mx-4">
            <div className="text-5xl mb-4">🎉</div>
            <div className="text-sm uppercase tracking-widest text-purple-400 mb-2 font-medium">
              Level Up!
            </div>
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent mb-3">
              Level {result.newLevel}
            </div>
            <div className="text-slate-400 text-sm mb-6">
              Level {result.newLevel - 1} → Level {result.newLevel}
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-sm font-semibold">
              +{result.xp} XP
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="text-sm text-slate-500 hover:text-slate-300 transition"
        >
          ← Back
        </button>

        {/* Quest Card */}
        <div className="p-6 rounded-2xl bg-[#12121a] border border-white/5">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/20">
              {quest.category}
            </span>
            <span className={`text-xs ${getDifficultyColor(quest.difficulty)}`}>
              {getDifficultyLabel(quest.difficulty)} · {quest.difficulty}/5
            </span>
            <span className="text-xs text-slate-500">⏱ {quest.estimatedDuration}</span>
            <span className="text-xs font-semibold text-amber-400 ml-auto">
              +{quest.xpReward} XP
            </span>
          </div>

          <h1 className="text-2xl font-bold mb-3">{quest.title}</h1>
          <p className="text-slate-300 leading-relaxed mb-6">{quest.description}</p>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-400 mb-2">Skills Rewarded</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(quest.skillsRewarded).map(([skill, pts]) => (
                <span
                  key={skill}
                  className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                >
                  {skill} +{pts}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-slate-400 mb-2">Instructions</h3>
            <ol className="space-y-2">
              {quest.instructions.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-xs shrink-0 font-medium">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-sm text-slate-400">
            <strong className="text-slate-300">Completion criteria:</strong> {quest.completionCriteria}
          </div>
        </div>

        {!userQuest && (
          <button
            onClick={handleAccept}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold hover:from-purple-500 hover:to-blue-500 transition shadow-lg shadow-purple-500/20"
          >
            Accept Quest
          </button>
        )}

        {userQuest?.status === "accepted" && !result && (
          <div className="p-6 rounded-2xl bg-[#12121a] border border-purple-500/30 space-y-5">
            <h3 className="font-semibold text-lg">Complete Quest</h3>

            {!canComplete ? (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm">
                <div className="font-medium mb-1">⏳ Time Gate Active</div>
                <p>
                  You can submit in <strong>{minutesLeft} minute{minutesLeft !== 1 ? "s" : ""}</strong>.
                  <br />
                  Use this time to actually do the activity.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">
                ✓ Time gate passed. You can now submit.
              </div>
            )}

            {/* Guided Questions */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1.5">
                  1. What did you actually do?
                </label>
                <textarea
                  value={q1}
                  onChange={(e) => setQ1(e.target.value)}
                  rows={2}
                  disabled={!canComplete}
                  placeholder="Be specific about what you did..."
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-white/10 focus:border-purple-500 outline-none text-sm resize-none disabled:opacity-40"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1.5">
                  2. What was difficult or surprising?
                </label>
                <textarea
                  value={q2}
                  onChange={(e) => setQ2(e.target.value)}
                  rows={2}
                  disabled={!canComplete}
                  placeholder="What felt awkward or unexpected?"
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-white/10 focus:border-purple-500 outline-none text-sm resize-none disabled:opacity-40"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1.5">
                  3. What did you learn?
                </label>
                <textarea
                  value={q3}
                  onChange={(e) => setQ3(e.target.value)}
                  rows={2}
                  disabled={!canComplete}
                  placeholder="One clear takeaway..."
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-white/10 focus:border-purple-500 outline-none text-sm resize-none disabled:opacity-40"
                />
              </div>
            </div>

            {/* Photo Evidence */}
            <div>
              <label className="block text-sm text-slate-300 mb-1.5">
                Photo Evidence <span className="text-slate-500">(optional · +15% XP)</span>
              </label>

              {!photoPreview ? (
                <button
                  type="button"
                  disabled={!canComplete}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 rounded-xl border border-dashed border-white/15 hover:border-purple-500/40 bg-white/[0.02] text-sm text-slate-400 hover:text-slate-200 transition disabled:opacity-40"
                >
                  📷 Upload a photo as proof
                </button>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-white/10">
                  <img
                    src={photoPreview}
                    alt="Evidence"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/70 text-xs text-white hover:bg-black/90"
                  >
                    Remove
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-black/60 text-xs text-slate-300 truncate">
                    {photoName}
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            {/* Honesty */}
            <label className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
              <input
                type="checkbox"
                checked={honest}
                onChange={(e) => setHonest(e.target.checked)}
                disabled={!canComplete}
                className="mt-1 w-4 h-4 accent-purple-500"
              />
              <div>
                <div className="text-sm font-medium">I actually completed this quest in real life</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  I did not just write answers without doing the activity.
                </div>
              </div>
            </label>

            <button
              onClick={handleComplete}
              disabled={submitting || !canComplete || !isFormValid}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
            >
              {submitting ? "Analyzing..." : "Submit & Earn XP"}
            </button>
          </div>
        )}

        {result && (
          <div className="p-6 rounded-2xl bg-[#12121a] border border-emerald-500/30 space-y-3">
            <div className="text-emerald-400 font-semibold text-lg flex items-center gap-2">
              <span>✓</span> Quest Complete!
            </div>
            <p className="text-slate-300">{result.feedback}</p>
            <div className="text-2xl font-bold text-amber-400">+{result.xp} XP</div>
            {result.leveledUp && (
              <div className="text-purple-300 font-medium">
                You reached Level {result.newLevel}!
              </div>
            )}
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm transition border border-white/10"
            >
              Back to Dashboard
            </button>
          </div>
        )}

        {userQuest?.status === "completed" && !result && (
          <div className="p-6 rounded-2xl bg-[#12121a] border border-emerald-500/20 text-center">
            <div className="text-emerald-400 font-medium mb-1">Already completed</div>
            <p className="text-sm text-slate-400">{userQuest.aiFeedback}</p>
            <p className="text-amber-400 mt-2 font-semibold">
              +{userQuest.xpAwarded} XP earned
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}