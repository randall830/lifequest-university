"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { isAuthenticated, isOnboarded, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated && isOnboarded) {
      router.push("/dashboard");
    }
  }, [loading, isAuthenticated, isOnboarded, router]);

  return (
    <div className="min-h-screen bg-[#07070c] text-slate-100 overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] right-[-15%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#07070c]/70 backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 via-violet-500 to-blue-500 flex items-center justify-center font-bold text-sm shadow-lg shadow-purple-500/30">
              LQ
            </div>
            <span className="font-semibold tracking-tight text-[15px]">LifeQuest University</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-slate-400 hover:text-white transition px-3 py-1.5">
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="text-sm px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition font-medium shadow-lg shadow-purple-500/25"
            >
              Start Your Quest
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/40 bg-purple-500/10 text-purple-300 text-xs mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            AI-Powered Real-Life RPG for University Students
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Your university life
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
              is the game.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Turn your campus experience into quests, challenges, skills and achievements —
            powered by AI. The real world is your playground.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="group relative px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold text-white shadow-2xl shadow-purple-500/30 transition hover:shadow-purple-500/50 hover:scale-[1.02]"
            >
              Begin Your Journey
            </Link>
            <a
              href="#how-it-works"
              className="px-10 py-4 rounded-2xl border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10 font-medium transition backdrop-blur-sm"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              AI creates the quest. You live the quest. The real world provides the experience.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-5">
            {[
              { step: "01", title: "Discover", desc: "AI generates personalized quests based on your profile, skills and goals.", color: "from-purple-500 to-violet-500" },
              { step: "02", title: "Accept", desc: "Choose quests that fit your day — social, academic, entrepreneurship and more.", color: "from-blue-500 to-cyan-500" },
              { step: "03", title: "Live It", desc: "Complete the activity in the real world — on campus, with people, in action.", color: "from-emerald-500 to-green-500" },
              { step: "04", title: "Level Up", desc: "Reflect, earn XP, grow skills, unlock achievements and climb the leaderboard.", color: "from-amber-500 to-orange-500" },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative p-6 rounded-2xl bg-[#12121a]/80 border border-white/5 hover:border-white/15 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-sm font-bold mb-4 shadow-lg`}>
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="relative py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">What you actually get</h2>
          <p className="text-slate-400 mb-10">No long lectures. Just real results.</p>

          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {[
              { icon: "📈", title: "Level up real skills", desc: "Communication, leadership, creativity, entrepreneurship" },
              { icon: "🤝", title: "Meet new people", desc: "Not just your course mates" },
              { icon: "🔥", title: "Get out of your comfort zone", desc: "In a fun, low-pressure way" },
              { icon: "💼", title: "Build real stories", desc: "For internships & interviews" },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 p-5 rounded-2xl bg-[#12121a] border border-white/5 hover:border-purple-500/30 transition"
              >
                <span className="text-2xl shrink-0">{item.icon}</span>
                <div>
                  <div className="font-semibold mb-1">{item.title}</div>
                  <div className="text-sm text-slate-400">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example quests */}
      <section className="relative py-24 px-4">
        <div className="max-w-5xl mx-auto relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Example Quests</h2>
          <p className="text-slate-400 text-center mb-12">Real activities. Real growth. Real XP.</p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { cat: "Social", title: "Cross-Faculty Connection", xp: 100, time: "15 min", diff: 2, desc: "Find a student from a different faculty and learn about one challenge they face." },
              { cat: "Entrepreneurship", title: "The RM50 Idea", xp: 180, time: "1 hour", diff: 3, desc: "Invent a simple idea that could generate RM50 and validate it with 3 people." },
              { cat: "Leadership", title: "Lead the Next 10 Minutes", xp: 150, time: "20 min", diff: 3, desc: "Take initiative in any group setting and facilitate a short decision moment." },
            ].map((q) => (
              <div
                key={q.title}
                className="group relative p-6 rounded-2xl bg-[#12121a] border border-white/5 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-500/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20">
                    {q.cat}
                  </span>
                  <span className="text-sm font-semibold text-amber-400">+{q.xp} XP</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-200 transition">{q.title}</h3>
                <p className="text-sm text-slate-400 mb-5 leading-relaxed">{q.desc}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>⏱ {q.time}</span>
                  <span className="text-amber-500/80">{"★".repeat(q.diff)}{"☆".repeat(5 - q.diff)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Grow Real Skills</h2>
          <p className="text-slate-400 mb-12 max-w-lg mx-auto">
            Every quest awards skill points. Watch yourself level up in areas that actually matter.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: "Knowledge", emoji: "📚" },
              { name: "Communication", emoji: "💬" },
              { name: "Creativity", emoji: "🎨" },
              { name: "Leadership", emoji: "👑" },
              { name: "Entrepreneurship", emoji: "🚀" },
              { name: "Social", emoji: "🤝" },
              { name: "Discipline", emoji: "⚡" },
              { name: "Problem Solving", emoji: "🧩" },
            ].map((skill) => (
              <div
                key={skill.name}
                className="group p-5 rounded-2xl bg-[#12121a] border border-white/5 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-2xl mb-2">{skill.emoji}</div>
                <div className="text-sm font-medium text-slate-200 group-hover:text-white transition">
                  {skill.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard preview */}
      <section className="relative py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Campus Leaderboard</h2>
          <p className="text-slate-400 text-center mb-10">Climb the ranks. Become a Campus Legend.</p>

          <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#12121a]/80 backdrop-blur-sm shadow-2xl shadow-purple-900/20">
            {[
              { rank: 1, name: "Aisha Rahman", faculty: "Business", level: 12, xp: 2450, medal: "🥇" },
              { rank: 2, name: "Wei Jun Tan", faculty: "Computing", level: 11, xp: 2180, medal: "🥈" },
              { rank: 3, name: "Priya Sharma", faculty: "Science", level: 10, xp: 1920, medal: "🥉" },
            ].map((row, i) => (
              <div
                key={row.rank}
                className={`flex items-center gap-4 px-6 py-5 ${i !== 2 ? "border-b border-white/5" : ""} ${
                  row.rank === 1 ? "bg-gradient-to-r from-amber-500/10 to-transparent" : ""
                }`}
              >
                <span className="text-2xl w-10 text-center">{row.medal}</span>
                <div className="flex-1">
                  <div className="font-semibold">{row.name}</div>
                  <div className="text-xs text-slate-500">{row.faculty}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-purple-300">Lvl {row.level}</div>
                  <div className="text-xs text-amber-400/90">{row.xp.toLocaleString()} XP</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-28 px-4">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-950/30 to-transparent pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">
            Ready to turn campus
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              into your quest log?
            </span>
          </h2>
          <p className="text-slate-400 mb-10 text-lg">
            Join students who are leveling up their real lives.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block px-12 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 font-semibold text-white shadow-2xl shadow-purple-500/40 transition hover:scale-[1.03] text-lg"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-10 px-4 border-t border-white/5 text-center">
        <p className="text-sm text-slate-500">
          LifeQuest University · MVP · Your university life is the game.
        </p>
      </footer>
    </div>
  );
}