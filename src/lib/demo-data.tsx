import type {
  Achievement,
  BossBattle,
  LeaderboardEntry,
  Quest,
  UserProfile,
  FacultyRanking,
} from "@/types";
import { DEFAULT_SKILLS, generateId } from "./utils";

export const DEMO_UNIVERSITIES = [
  "Universiti Malaya (UM)",
  "Universiti Kebangsaan Malaysia (UKM)",
  "Universiti Putra Malaysia (UPM)",
  "Universiti Teknologi Malaysia (UTM)",
  "Monash University Malaysia",
  "Sunway University",
  "Taylor's University",
];

export const DEMO_FACULTIES = [
  "Business",
  "Computing",
  "Engineering",
  "Arts",
  "Science",
  "Medicine",
  "Law",
  "Education",
];

export const DEMO_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-quest",
    name: "First Quest",
    description: "Complete your first quest",
    icon: "Sparkles",
    condition: "complete_1_quest",
    xpBonus: 50,
  },
  {
    id: "explorer",
    name: "Explorer",
    description: "Complete quests in 5 different categories",
    icon: "Compass",
    condition: "categories_5",
    xpBonus: 150,
  },
  {
    id: "social-butterfly",
    name: "Social Butterfly",
    description: "Complete 10 social quests",
    icon: "Users",
    condition: "social_10",
    xpBonus: 200,
  },
  {
    id: "entrepreneur",
    name: "Entrepreneur",
    description: "Complete 5 entrepreneurship quests",
    icon: "Rocket",
    condition: "entrepreneurship_5",
    xpBonus: 200,
  },
  {
    id: "leader",
    name: "Leader",
    description: "Complete 10 leadership quests",
    icon: "Crown",
    condition: "leadership_10",
    xpBonus: 250,
  },
  {
    id: "campus-legend",
    name: "Campus Legend",
    description: "Reach Level 10",
    icon: "Trophy",
    condition: "level_10",
    xpBonus: 500,
  },
  {
    id: "streak-7",
    name: "Week Warrior",
    description: "Maintain a 7-day quest streak",
    icon: "Flame",
    condition: "streak_7",
    xpBonus: 100,
  },
  {
    id: "knowledge-seeker",
    name: "Knowledge Seeker",
    description: "Reach 50 Knowledge skill",
    icon: "BookOpen",
    condition: "knowledge_50",
    xpBonus: 100,
  },
];

export const DEMO_QUESTS: Quest[] = [
  {
    id: "q-cross-faculty",
    title: "Cross-Faculty Connection",
    description:
      "Find a student from a different faculty and ask them about one challenge they face in university. Listen actively and share one insight of your own.",
    category: "Social",
    difficulty: 2,
    estimatedDuration: "15 minutes",
    xpReward: 100,
    skillsRewarded: { Communication: 10, Social: 10 },
    instructions: [
      "Identify a student from a different faculty (library, cafe, club event).",
      "Introduce yourself briefly and ask about a challenge they face.",
      "Listen without interrupting. Share one related insight from your experience.",
      "Thank them and note what you learned.",
    ],
    completionCriteria: "Write a short reflection (3-5 sentences) about what you learned from the conversation.",
    createdBy: "system",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "q-study-group",
    title: "Study Session Catalyst",
    description:
      "Organize or join a focused 45-minute study session with at least one other student on a topic from your current courses.",
    category: "Academic",
    difficulty: 2,
    estimatedDuration: "45 minutes",
    xpReward: 120,
    skillsRewarded: { Knowledge: 12, Discipline: 8, Communication: 5 },
    instructions: [
      "Invite a classmate or join an existing study group.",
      "Agree on a clear topic and set a 45-minute timer.",
      "Stay focused (phones away).",
      "End with a 2-minute summary of key takeaways.",
    ],
    completionCriteria: "Reflect on what you learned and how the group dynamic helped (or hindered) focus.",
    createdBy: "system",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "q-rm50-idea",
    title: "The RM50 Idea",
    description:
      "Come up with a simple product or service idea that could realistically generate RM50 in revenue this week. Validate it by asking 3 people for feedback.",
    category: "Entrepreneurship",
    difficulty: 3,
    estimatedDuration: "1 hour",
    xpReward: 180,
    skillsRewarded: { Entrepreneurship: 15, "Problem Solving": 8, Communication: 5 },
    instructions: [
      "Brainstorm 3 simple ideas that solve a student pain point.",
      "Pick the most feasible one.",
      "Describe it in one sentence + estimated cost/time.",
      "Ask 3 students for honest feedback and note their reactions.",
    ],
    completionCriteria: "Write your idea, the 3 pieces of feedback, and whether you would pursue it.",
    createdBy: "system",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "q-creative-campus",
    title: "Campus in One Frame",
    description:
      "Capture or create one piece of creative content (photo, short video, sketch, poem, or design) that represents the spirit of your campus today.",
    category: "Creativity",
    difficulty: 2,
    estimatedDuration: "30 minutes",
    xpReward: 110,
    skillsRewarded: { Creativity: 15, Discipline: 5 },
    instructions: [
      "Walk around campus for 10 minutes with your chosen medium.",
      "Find a moment, place, or feeling that stands out.",
      "Create one piece of content (no more than 60 seconds if video).",
      "Write a 1-2 sentence caption explaining the intent.",
    ],
    completionCriteria: "Describe what you created and why it captures campus spirit.",
    createdBy: "system",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "q-lead-meeting",
    title: "Lead the Next 10 Minutes",
    description:
      "In any group setting (club, project team, study group, or informal hangout), take initiative and lead a short 10-minute discussion or decision-making moment.",
    category: "Leadership",
    difficulty: 3,
    estimatedDuration: "20 minutes",
    xpReward: 150,
    skillsRewarded: { Leadership: 15, Communication: 8, Social: 5 },
    instructions: [
      "Identify a natural moment where a decision or discussion is needed.",
      "Propose a clear agenda or question.",
      "Facilitate listening and keep time.",
      "Summarize the outcome or next step.",
    ],
    completionCriteria: "Reflect on how the group responded and what you would do differently next time.",
    createdBy: "system",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "q-morning-routine",
    title: "The 20-Minute Reset",
    description:
      "Complete a focused 20-minute morning or evening routine that includes movement + intentional planning for the day/week.",
    category: "Health",
    difficulty: 1,
    estimatedDuration: "20 minutes",
    xpReward: 80,
    skillsRewarded: { Discipline: 12, "Problem Solving": 5 },
    instructions: [
      "Choose a quiet 20-minute window.",
      "Spend 8-10 minutes on light movement (walk, stretch, bodyweight).",
      "Spend 8-10 minutes writing your top 3 priorities and one non-negotiable.",
      "No phone scrolling during the window.",
    ],
    completionCriteria: "Note what you did and how you felt afterwards.",
    createdBy: "system",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "q-career-chat",
    title: "Career Insight Conversation",
    description:
      "Have a short conversation with someone working in a field related to your degree or interest. Ask about one skill that matters more than they expected.",
    category: "Career",
    difficulty: 3,
    estimatedDuration: "25 minutes",
    xpReward: 160,
    skillsRewarded: { Communication: 10, Knowledge: 8 },
    instructions: [
      "Identify someone (alumni, lecturer, senior, family friend, LinkedIn).",
      "Request 15-20 minutes of their time.",
      "Ask: 'What skill turned out to be more important than you expected?'",
      "Listen and ask one follow-up question.",
    ],
    completionCriteria: "Summarize the skill they mentioned and how it changes your current priorities.",
    createdBy: "system",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "q-community-help",
    title: "One Quiet Contribution",
    description:
      "Perform one small, unprompted act of helpfulness on campus that improves someone else's day (without seeking recognition).",
    category: "Community",
    difficulty: 1,
    estimatedDuration: "15 minutes",
    xpReward: 90,
    skillsRewarded: { Social: 8, Leadership: 5, Discipline: 5 },
    instructions: [
      "Look for a small friction point (lost student, messy shared space, someone struggling with bags, etc.).",
      "Offer help or take action quietly.",
      "Do not post about it or announce it.",
    ],
    completionCriteria: "Describe the situation and how it felt to contribute without recognition.",
    createdBy: "system",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export const DEMO_BOSS_BATTLES: BossBattle[] = [
  {
    id: "boss-rm100",
    title: "THE RM100 STARTUP CHALLENGE",
    objective: "Create something that generates RM100 in revenue within 7 days.",
    description:
      "This is a real-world entrepreneurship boss battle. You may work alone or form a small team. The goal is simple: generate RM100 in actual revenue within one week using any legal, ethical method suitable for students.",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    rules: [
      "Revenue must be real (cash, bank transfer, or verified digital payment).",
      "No illegal, harmful, or deceptive activities.",
      "You may sell products, services, or digital goods.",
      "Document your process and results.",
      "Teams of up to 4 are allowed.",
    ],
    reward: "500 XP + exclusive 'Founder' achievement + feature on the leaderboard",
    xpReward: 500,
    participants: 47,
    maxParticipants: 200,
    isActive: true,
    progress: 23,
  },
  {
    id: "boss-networking",
    title: "THE 5-CONNECTION CHALLENGE",
    objective: "Build 5 meaningful new connections across different faculties or industries in 10 days.",
    description:
      "Expand your network intentionally. Each connection must include a real conversation and a recorded insight.",
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    rules: [
      "Connections must be new (not existing friends).",
      "At least 2 must be from different faculties.",
      "At least 1 should be outside pure student circles if possible.",
      "Write a short note on each conversation.",
    ],
    reward: "300 XP + Social Butterfly progress boost",
    xpReward: 300,
    participants: 89,
    isActive: true,
    progress: 41,
  },
];

function makeDemoStudent(
  name: string,
  faculty: string,
  level: number,
  xp: number,
  index: number
): UserProfile {
  return {
    id: `demo-user-${index}`,
    email: `${name.toLowerCase().replace(/\s/g, ".")}@student.edu.my`,
    name,
    age: 19 + (index % 5),
    university: "Universiti Malaya (UM)",
    faculty,
    degree: faculty === "Computing" ? "Computer Science" : faculty === "Business" ? "Business Administration" : `${faculty} Studies`,
    yearOfStudy: 1 + (index % 4),
    interests: ["AI", "Startups", "Campus life", "Personal growth"].slice(0, 2 + (index % 3)),
    personalGoals: ["Improve communication", "Build a side project", "Network more"],
    preferredQuestTypes: ["Social", "Entrepreneurship", "Academic", "Leadership"].slice(0, 2 + (index % 3)) as any,
    level,
    xp,
    totalQuestsCompleted: Math.floor(level * 2.5 + (index % 5)),
    currentStreak: index % 8,
    longestStreak: 5 + (index % 10),
    skills: DEFAULT_SKILLS.map((s) => ({
      ...s,
      value: Math.min(95, 15 + level * 4 + (index % 20) + (s.name === "Communication" ? 10 : 0)),
    })),
    createdAt: new Date(Date.now() - index * 86400000 * 3).toISOString(),
  };
}

export const DEMO_STUDENTS: UserProfile[] = [
  makeDemoStudent("Aisha Rahman", "Business", 12, 2450, 1),
  makeDemoStudent("Wei Jun Tan", "Computing", 11, 2180, 2),
  makeDemoStudent("Priya Sharma", "Science", 10, 1920, 3),
  makeDemoStudent("Daniel Lim", "Engineering", 9, 1750, 4),
  makeDemoStudent("Siti Nurhaliza", "Arts", 9, 1680, 5),
  makeDemoStudent("Hafiz Ahmad", "Business", 8, 1420, 6),
  makeDemoStudent("Emily Wong", "Computing", 8, 1380, 7),
  makeDemoStudent("Rajesh Kumar", "Engineering", 7, 1210, 8),
  makeDemoStudent("Nurul Ain", "Education", 7, 1150, 9),
  makeDemoStudent("Jason Lee", "Business", 6, 980, 10),
  makeDemoStudent("Mei Ling", "Arts", 6, 920, 11),
  makeDemoStudent("Amirul Hakim", "Science", 5, 780, 12),
  makeDemoStudent("Chloe Ng", "Computing", 5, 740, 13),
  makeDemoStudent("Farah Binti", "Law", 4, 610, 14),
  makeDemoStudent("Kevin Teo", "Engineering", 4, 580, 15),
  makeDemoStudent("Zara Ismail", "Business", 3, 420, 16),
  makeDemoStudent("Lucas Tan", "Computing", 3, 390, 17),
  makeDemoStudent("Alya Sofia", "Arts", 2, 250, 18),
  makeDemoStudent("Ben Chong", "Science", 2, 210, 19),
  makeDemoStudent("Iman Yusuf", "Education", 1, 80, 20),
];

export function getDemoLeaderboard(): LeaderboardEntry[] {
  return DEMO_STUDENTS.sort((a, b) => b.xp - a.xp).map((s, i) => ({
    rank: i + 1,
    userId: s.id,
    name: s.name,
    level: s.level,
    xp: s.xp,
    faculty: s.faculty,
  }));
}

export function getDemoFacultyRankings(): FacultyRanking[] {
  const map = new Map<string, { totalXp: number; count: number; levels: number }>();
  DEMO_STUDENTS.forEach((s) => {
    const cur = map.get(s.faculty) || { totalXp: 0, count: 0, levels: 0 };
    cur.totalXp += s.xp;
    cur.count += 1;
    cur.levels += s.level;
    map.set(s.faculty, cur);
  });
  return Array.from(map.entries())
    .map(([faculty, data]) => ({
      faculty,
      totalXp: data.totalXp,
      studentCount: data.count,
      averageLevel: Math.round((data.levels / data.count) * 10) / 10,
    }))
    .sort((a, b) => b.totalXp - a.totalXp);
}