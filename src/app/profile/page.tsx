"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/lib/auth-context";
import { xpProgress, formatXp } from "@/lib/utils";
import { DEMO_ACHIEVEMENTS } from "@/lib/demo-data";
import { storage } from "@/lib/storage";

export default function ProfilePage() {
  const { user, achievements, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);

  // Edit form state
  const [instagram, setInstagram] = useState(user?.instagram || "");
  const [linkedin, setLinkedin] = useState(user?.linkedin || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [openToConnect, setOpenToConnect] = useState(user?.openToConnect ?? true);

  if (!user) return null;

  const prog = xpProgress(user.xp, user.level);
  const unlockedIds = new Set(achievements.map((a) => a.achievementId));

  const handleSave = () => {
    const updated = {
      ...user,
      instagram: instagram || undefined,
      linkedin: linkedin || undefined,
      bio: bio || undefined,
      openToConnect,
    };
    storage.setUser(updated);
    refreshUser();
    setEditing(false);
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="p-6 rounded-2xl bg-[#12121a] border border-white/5 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-3xl font-bold shadow-lg shadow-purple-500/20">
            {user.name.charAt(0)}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-slate-400 text-sm">
              {user.degree} · Year {user.yearOfStudy} · {user.faculty}
            </p>
            <p className="text-xs text-slate-500 mt-1">{user.university}</p>
            {user.bio && !editing && (
              <p className="text-sm text-slate-300 mt-2">{user.bio}</p>
            )}
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-300">Lvl {user.level}</div>
            <div className="text-xs text-slate-500">{formatXp(user.xp)} XP</div>
            <div className="w-28 h-2 mt-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                style={{ width: `${prog.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Social / Connect Section */}
        <section className="p-5 rounded-2xl bg-[#12121a] border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span>🤝</span> Connect
            </h2>
            <button
              onClick={() => {
                if (editing) {
                  handleSave();
                } else {
                  setInstagram(user.instagram || "");
                  setLinkedin(user.linkedin || "");
                  setBio(user.bio || "");
                  setOpenToConnect(user.openToConnect ?? true);
                  setEditing(true);
                }
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition"
            >
              {editing ? "Save" : "Edit"}
            </button>
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Instagram</label>
                <input
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#0a0a0f] border border-white/10 focus:border-purple-500 outline-none text-sm"
                  placeholder="@yourusername"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">LinkedIn (optional)</label>
                <input
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#0a0a0f] border border-white/10 focus:border-purple-500 outline-none text-sm"
                  placeholder="linkedin.com/in/yourname"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Short bio</label>
                <input
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#0a0a0f] border border-white/10 focus:border-purple-500 outline-none text-sm"
                  placeholder="Year 2 CS · into startups & design"
                />
              </div>
              <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={openToConnect}
                  onChange={(e) => setOpenToConnect(e.target.checked)}
                  className="w-4 h-4 accent-purple-500"
                />
                <div>
                  <div className="text-sm font-medium">Open to connect</div>
                  <div className="text-xs text-slate-500">Others can see your socials</div>
                </div>
              </label>
              <button
                onClick={() => setEditing(false)}
                className="text-xs text-slate-500 hover:text-slate-300"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                {user.openToConnect ? (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    Open to connect
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-slate-500 border border-white/10">
                    Closed
                  </span>
                )}
              </div>

              {user.instagram ? (
                <a
                  href={`https://instagram.com/${user.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-pink-500/30 transition"
                >
                  <span className="text-xl">📸</span>
                  <div>
                    <div className="text-sm font-medium">Instagram</div>
                    <div className="text-xs text-pink-400">{user.instagram}</div>
                  </div>
                </a>
              ) : (
                <div className="text-sm text-slate-500 py-2">No Instagram added yet</div>
              )}

              {user.linkedin && (
                <a
                  href={user.linkedin.startsWith("http") ? user.linkedin : `https://${user.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 transition"
                >
                  <span className="text-xl">💼</span>
                  <div>
                    <div className="text-sm font-medium">LinkedIn</div>
                    <div className="text-xs text-blue-400 truncate max-w-[220px]">{user.linkedin}</div>
                  </div>
                </a>
              )}
            </div>
          )}
        </section>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-[#12121a] border border-white/5 text-center">
            <div className="text-xl font-bold">{user.totalQuestsCompleted}</div>
            <div className="text-xs text-slate-500">Quests</div>
          </div>
          <div className="p-4 rounded-xl bg-[#12121a] border border-white/5 text-center">
            <div className="text-xl font-bold text-orange-400">{user.currentStreak}</div>
            <div className="text-xs text-slate-500">Streak</div>
          </div>
          <div className="p-4 rounded-xl bg-[#12121a] border border-white/5 text-center">
            <div className="text-xl font-bold text-amber-400">{achievements.length}</div>
            <div className="text-xs text-slate-500">Achievements</div>
          </div>
        </div>

        {/* Skills */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Skills</h2>
          <div className="space-y-3">
            {user.skills.map((s) => (
              <div key={s.name} className="p-3 rounded-xl bg-[#12121a] border border-white/5">
                <div className="flex justify-between text-sm mb-1.5">
                  <span>{s.name}</span>
                  <span className="text-slate-400">{s.value}/100</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                    style={{ width: `${s.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Achievements</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {DEMO_ACHIEVEMENTS.map((a) => {
              const unlocked = unlockedIds.has(a.id);
              return (
                <div
                  key={a.id}
                  className={`p-4 rounded-xl border ${
                    unlocked
                      ? "bg-[#12121a] border-amber-500/30"
                      : "bg-[#0d0d14] border-white/5 opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{unlocked ? "🏅" : "🔒"}</span>
                    <div>
                      <div className="font-medium text-sm">{a.name}</div>
                      <div className="text-xs text-slate-500">{a.description}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}