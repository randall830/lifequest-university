"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import type { QuestCategory } from "@/types";
import { DEMO_FACULTIES, DEMO_UNIVERSITIES } from "@/lib/demo-data";

const QUEST_TYPES: QuestCategory[] = [
  "Social", "Academic", "Entrepreneurship", "Creativity",
  "Leadership", "Health", "Career", "Community",
];

export default function OnboardingPage() {
  const { completeOnboarding } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    name: "",
    age: 20,
    university: DEMO_UNIVERSITIES[0],
    faculty: DEMO_FACULTIES[0],
    degree: "",
    yearOfStudy: 1,
    interests: "",
    personalGoals: "",
    preferredQuestTypes: [] as QuestCategory[],
    // Social fields
    instagram: "",
    linkedin: "",
    bio: "",
    openToConnect: true,
  });

  const update = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const toggleType = (t: QuestCategory) => {
    setForm((f) => ({
      ...f,
      preferredQuestTypes: f.preferredQuestTypes.includes(t)
        ? f.preferredQuestTypes.filter((x) => x !== t)
        : [...f.preferredQuestTypes, t],
    }));
  };

  const finish = () => {
    completeOnboarding({
      name: form.name,
      age: form.age,
      university: form.university,
      faculty: form.faculty,
      degree: form.degree || form.faculty + " Studies",
      yearOfStudy: form.yearOfStudy,
      interests: form.interests.split(",").map((s) => s.trim()).filter(Boolean),
      personalGoals: form.personalGoals.split(",").map((s) => s.trim()).filter(Boolean),
      preferredQuestTypes: form.preferredQuestTypes.length
        ? form.preferredQuestTypes
        : ["Social", "Academic"],
      instagram: form.instagram || undefined,
      linkedin: form.linkedin || undefined,
      bio: form.bio || undefined,
      openToConnect: form.openToConnect,
    });
    router.push("/dashboard");
  };

  const steps = [
    // Step 0 - Basic info
    <div key="0" className="space-y-4">
      <h2 className="text-xl font-semibold">Who are you?</h2>
      <div>
        <label className="block text-sm text-slate-400 mb-1">Name</label>
        <input
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-[#0a0a0f] border border-white/10 focus:border-purple-500 outline-none text-sm"
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-1">Age</label>
        <input
          type="number"
          min={16}
          max={40}
          value={form.age}
          onChange={(e) => update("age", parseInt(e.target.value) || 20)}
          className="w-full px-3 py-2.5 rounded-lg bg-[#0a0a0f] border border-white/10 focus:border-purple-500 outline-none text-sm"
        />
      </div>
    </div>,

    // Step 1 - University
    <div key="1" className="space-y-4">
      <h2 className="text-xl font-semibold">Your university</h2>
      <div>
        <label className="block text-sm text-slate-400 mb-1">University</label>
        <select
          value={form.university}
          onChange={(e) => update("university", e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-[#0a0a0f] border border-white/10 focus:border-purple-500 outline-none text-sm"
        >
          {DEMO_UNIVERSITIES.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-1">Faculty</label>
        <select
          value={form.faculty}
          onChange={(e) => update("faculty", e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-[#0a0a0f] border border-white/10 focus:border-purple-500 outline-none text-sm"
        >
          {DEMO_FACULTIES.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-1">Degree / Program</label>
        <input
          value={form.degree}
          onChange={(e) => update("degree", e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-[#0a0a0f] border border-white/10 focus:border-purple-500 outline-none text-sm"
          placeholder="e.g. Computer Science"
        />
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-1">Year of Study</label>
        <select
          value={form.yearOfStudy}
          onChange={(e) => update("yearOfStudy", parseInt(e.target.value))}
          className="w-full px-3 py-2.5 rounded-lg bg-[#0a0a0f] border border-white/10 focus:border-purple-500 outline-none text-sm"
        >
          {[1, 2, 3, 4, 5].map((y) => (
            <option key={y} value={y}>Year {y}</option>
          ))}
        </select>
      </div>
    </div>,

    // Step 2 - Interests & Goals
    <div key="2" className="space-y-4">
      <h2 className="text-xl font-semibold">Interests & Goals</h2>
      <div>
        <label className="block text-sm text-slate-400 mb-1">Interests (comma separated)</label>
        <input
          value={form.interests}
          onChange={(e) => update("interests", e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-[#0a0a0f] border border-white/10 focus:border-purple-500 outline-none text-sm"
          placeholder="AI, startups, design, sports..."
        />
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-1">Personal goals (comma separated)</label>
        <input
          value={form.personalGoals}
          onChange={(e) => update("personalGoals", e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-[#0a0a0f] border border-white/10 focus:border-purple-500 outline-none text-sm"
          placeholder="Improve public speaking, build a side project..."
        />
      </div>
    </div>,

    // Step 3 - Quest types
    <div key="3" className="space-y-4">
      <h2 className="text-xl font-semibold">Preferred Quest Types</h2>
      <p className="text-sm text-slate-400">Select the kinds of challenges you want more of.</p>
      <div className="grid grid-cols-2 gap-2">
        {QUEST_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => toggleType(t)}
            className={`px-3 py-2.5 rounded-lg text-sm border transition ${
              form.preferredQuestTypes.includes(t)
                ? "border-purple-500 bg-purple-500/20 text-purple-200"
                : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>,

    // Step 4 - Social / Connect (NEW)
    <div key="4" className="space-y-4">
      <h2 className="text-xl font-semibold">Connect with others</h2>
      <p className="text-sm text-slate-400">
        Optional — helps you make friends after quests.
      </p>

      <div>
        <label className="block text-sm text-slate-400 mb-1">Instagram</label>
        <input
          value={form.instagram}
          onChange={(e) => update("instagram", e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-[#0a0a0f] border border-white/10 focus:border-purple-500 outline-none text-sm"
          placeholder="@yourusername"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">LinkedIn (optional)</label>
        <input
          value={form.linkedin}
          onChange={(e) => update("linkedin", e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-[#0a0a0f] border border-white/10 focus:border-purple-500 outline-none text-sm"
          placeholder="linkedin.com/in/yourname"
        />
      </div>

      <div>
        <label className="block text-sm text-slate-400 mb-1">Short bio</label>
        <input
          value={form.bio}
          onChange={(e) => update("bio", e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-[#0a0a0f] border border-white/10 focus:border-purple-500 outline-none text-sm"
          placeholder="Year 2 CS · into startups & design"
        />
      </div>

      <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
        <input
          type="checkbox"
          checked={form.openToConnect}
          onChange={(e) => update("openToConnect", e.target.checked)}
          className="w-4 h-4 accent-purple-500"
        />
        <div>
          <div className="text-sm font-medium">Open to connect</div>
          <div className="text-xs text-slate-500">Other students can see your socials after quests</div>
        </div>
      </label>
    </div>,
  ];

  const totalSteps = steps.length;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#07070c]">
      <div className="w-full max-w-lg">
        <div className="mb-6">
          <div className="flex gap-1.5 mb-4">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all ${
                  i <= step ? "bg-purple-500" : "bg-white/10"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500">Step {step + 1} of {totalSteps}</p>
        </div>

        <div className="p-6 rounded-2xl bg-[#12121a] border border-white/5">
          {steps[step]}

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white disabled:opacity-30"
            >
              Back
            </button>

            {step < totalSteps - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 0 && !form.name}
                className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm font-medium disabled:opacity-50"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={finish}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-sm font-medium"
              >
                Enter the Game
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}