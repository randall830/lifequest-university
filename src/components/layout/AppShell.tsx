"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { xpProgress, formatXp } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/quests", label: "Quest Board", icon: "📜" },
  { href: "/connect", label: "Connect", icon: "🤝" },
  { href: "/boss", label: "Boss Battles", icon: "⚔️" },
  { href: "/leaderboard", label: "Leaderboard", icon: "🏆" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07070c]">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    if (typeof window !== "undefined") router.push("/auth/login");
    return null;
  }

  const prog = xpProgress(user.xp, user.level);

  return (
    <div className="min-h-screen bg-[#07070c] text-slate-100">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#07070c]/85 backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 via-violet-500 to-blue-500 flex items-center justify-center text-xs font-bold shadow-lg shadow-purple-500/30">
              LQ
            </div>
            <span className="font-semibold text-sm hidden sm:inline tracking-tight">LifeQuest</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`px-3.5 py-1.5 rounded-xl text-sm transition-all duration-200 ${
                  pathname.startsWith(n.href)
                    ? "bg-purple-500/20 text-purple-300 font-medium"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Right side - XP + Avatar */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* XP Progress */}
            <div className="hidden sm:flex flex-col items-end min-w-[140px]">
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-[11px] text-slate-400 font-medium">
                  Lvl {user.level}
                </span>
                <span className="text-[11px] text-purple-300 font-medium">
                  {formatXp(user.xp)} XP
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 transition-all duration-700 relative"
                  style={{ width: `${prog.percentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                </div>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 w-full text-right">
                {prog.current}/{prog.needed} to next
              </div>
            </div>

            {/* Mobile XP (compact) */}
            <div className="sm:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/20">
              <span className="text-xs font-semibold text-purple-300">Lvl {user.level}</span>
            </div>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-sm font-bold shadow-md shadow-purple-500/20">
              {user.name.charAt(0).toUpperCase()}
            </div>

            {/* Logout */}
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="text-xs text-slate-500 hover:text-slate-300 transition hidden sm:block"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 bg-[#07070c]/95 backdrop-blur-2xl">
        <div className="flex justify-around py-2">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`flex flex-col items-center px-2 py-1.5 text-[10px] transition ${
                pathname.startsWith(n.href) ? "text-purple-400" : "text-slate-500"
              }`}
            >
              <span className="text-base mb-0.5">{n.icon}</span>
              {n.label.split(" ")[0]}
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-10">
        {children}
      </main>
    </div>
  );
}