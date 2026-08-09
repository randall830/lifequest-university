"use client";

import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/lib/auth-context";
import { DEMO_STUDENTS } from "@/lib/demo-data";
import { useMemo } from "react";

export default function ConnectPage() {
  const { user } = useAuth();

  const people = useMemo(() => {
    return DEMO_STUDENTS
      .filter((s) => s.id !== user?.id)
      .map((s) => ({
        ...s,
        instagram: s.name.toLowerCase().replace(/\s/g, ".") + "_",
        bio: `Year ${s.yearOfStudy} ${s.faculty} · into growth & campus life`,
        openToConnect: true,
      }))
      .slice(0, 12);
  }, [user]);

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#16162a] to-[#0f0f1a] border border-white/5 p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Connect</h1>
            <p className="text-slate-400 text-sm mt-1.5 max-w-lg">
              Find students who are open to making new friends after quests.
            </p>
          </div>
        </div>

        {/* Tip */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
          <span className="text-xl">💡</span>
          <div className="text-sm text-purple-200/90 leading-relaxed">
            Complete <strong>Social</strong> or <strong>Community</strong> quests, then come here to find people to connect with. Only students who turned on “Open to connect” appear here.
          </div>
        </div>

        {/* People Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {people.map((person) => (
            <div
              key={person.id}
              className="group p-5 rounded-2xl bg-[#12121a] border border-white/5 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/5"
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-lg font-bold shadow-md shadow-purple-500/20">
                  {person.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold truncate">{person.name}</div>
                  <div className="text-xs text-slate-500">
                    {person.faculty} · Year {person.yearOfStudy}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                {person.bio}
              </p>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20">
                  Lvl {person.level}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  Open to connect
                </span>
              </div>

              {/* Action */}
              <a
                href={`https://instagram.com/${person.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center py-2.5 rounded-xl bg-white/5 hover:bg-pink-500/10 border border-white/10 hover:border-pink-500/40 text-sm font-medium transition"
              >
                📸 Instagram
              </a>
            </div>
          ))}
        </div>

        {people.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🤝</div>
            <p className="text-slate-400 text-lg">No one is open to connect yet</p>
            <p className="text-sm text-slate-500 mt-2">
              Complete more Social quests and check back later.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}