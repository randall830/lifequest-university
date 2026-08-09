import type {
  Quest,
  QuestCategory,
  QuestGenerationContext,
  ReflectionAnalysis,
  SkillName,
  UserProfile,
} from "@/types";
import { DEMO_QUESTS } from "./demo-data";
import { generateId, SKILL_NAMES } from "./utils";

const CATEGORIES: QuestCategory[] = [
  "Social",
  "Academic",
  "Entrepreneurship",
  "Creativity",
  "Leadership",
  "Health",
  "Career",
  "Community",
];

export async function generateQuests(
  context: QuestGenerationContext,
  count: number = 3
): Promise<Quest[]> {
  const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  if (apiKey && apiKey !== "your-openai-key") {
    try {
      return await generateWithOpenAI(context, count, apiKey);
    } catch (err) {
      console.warn("OpenAI generation failed, using fallback:", err);
    }
  }

  return generateLocalQuests(context, count);
}

async function generateWithOpenAI(
  context: QuestGenerationContext,
  count: number,
  apiKey: string
): Promise<Quest[]> {
  const { profile, completedQuests } = context;

  const weakSkills = profile.skills
    .filter((s) => s.value < 40)
    .map((s) => s.name)
    .slice(0, 3);
  const strongSkills = profile.skills
    .filter((s) => s.value >= 60)
    .map((s) => s.name);

  const completedTitles = completedQuests.map((q) => q.title).slice(-15);

  const systemPrompt = `You are the Game Master of LifeQuest University, an AI-powered real-life RPG for university students.
Generate realistic, safe, achievable real-world quests that students can complete on or near campus.
NEVER generate dangerous, illegal, humiliating, discriminatory, sexual, or inappropriate challenges.
Quests must be doable in the real world and result in genuine personal growth.
Return ONLY valid JSON array of quest objects. No markdown, no explanation.`;

  const userPrompt = `Student profile:
- Name: ${profile.name}
- Degree: ${profile.degree} (${profile.faculty}), Year ${profile.yearOfStudy}
- University: ${profile.university}
- Interests: ${profile.interests.join(", ")}
- Goals: ${profile.personalGoals.join(", ")}
- Preferred categories: ${profile.preferredQuestTypes.join(", ")}
- Current level: ${profile.level}, XP: ${profile.xp}
- Weak skills (boost these): ${weakSkills.join(", ") || "none"}
- Strong skills: ${strongSkills.join(", ") || "none"}
- Recently completed quest titles (avoid similar): ${completedTitles.join("; ") || "none"}

Generate exactly ${count} unique personalized quests.
Each quest must have this JSON shape:
{
  "title": "string",
  "description": "string (2-3 sentences)",
  "category": one of ${CATEGORIES.join(" | ")},
  "difficulty": 1-5,
  "estimatedDuration": "e.g. 20 minutes",
  "xpReward": number (80-250 based on difficulty),
  "skillsRewarded": { "SkillName": number, ... } (use only: ${SKILL_NAMES.join(", ")}),
  "instructions": ["step1", "step2", ...],
  "completionCriteria": "what the student must submit/reflect"
}

Prefer categories the student likes, but inject 1 quest that targets a weak skill if possible.
Make quests specific to university life in Malaysia when relevant.`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.85,
      max_tokens: 2000,
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI error: ${res.status}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || "[]";
  const cleaned = content.replace(/```json\n?|\n?```/g, "").trim();
  const parsed = JSON.parse(cleaned) as any[];

  return parsed.slice(0, count).map((q) => ({
    id: generateId(),
    title: q.title,
    description: q.description,
    category: q.category as QuestCategory,
    difficulty: Math.min(5, Math.max(1, q.difficulty || 2)),
    estimatedDuration: q.estimatedDuration || "20 minutes",
    xpReward: q.xpReward || 100,
    skillsRewarded: q.skillsRewarded || {},
    instructions: Array.isArray(q.instructions) ? q.instructions : [q.instructions || "Complete the activity."],
    completionCriteria: q.completionCriteria || "Write a short reflection.",
    createdBy: "ai" as const,
    isActive: true,
    createdAt: new Date().toISOString(),
  }));
}

function generateLocalQuests(context: QuestGenerationContext, count: number): Quest[] {
  const { profile, completedQuests } = context;
  const completedIds = new Set(completedQuests.map((q) => q.id));
  const completedTitles = new Set(completedQuests.map((q) => q.title.toLowerCase()));

  const weakSkills = profile.skills
    .filter((s) => s.value < 45)
    .map((s) => s.name);

  let pool = DEMO_QUESTS.filter(
    (q) => !completedIds.has(q.id) && !completedTitles.has(q.title.toLowerCase())
  );

  pool = pool
    .map((q) => {
      let score = 0;
      if (profile.preferredQuestTypes.includes(q.category)) score += 30;
      Object.keys(q.skillsRewarded).forEach((sk) => {
        if (weakSkills.includes(sk as SkillName)) score += 20;
      });
      const targetDiff = Math.min(5, Math.ceil(profile.level / 3) + 1);
      score += 10 - Math.abs(q.difficulty - targetDiff) * 3;
      return { q, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((x) => x.q);

  const result: Quest[] = [];
  for (let i = 0; i < count; i++) {
    if (pool[i]) {
      result.push({ ...pool[i], id: generateId(), createdBy: "ai" });
    } else {
      result.push(createVariantQuest(profile, i));
    }
  }
  return result;
}

function createVariantQuest(profile: UserProfile, seed: number): Quest {
  const cat =
    profile.preferredQuestTypes[seed % profile.preferredQuestTypes.length] ||
    CATEGORIES[seed % CATEGORIES.length];

  const templates: Record<QuestCategory, { title: string; desc: string; skills: Partial<Record<SkillName, number>> }> = {
    Social: {
      title: "New Voice in the Room",
      desc: "Start a short conversation with someone you don't usually talk to on campus. Ask about one thing they're currently working on or excited about.",
      skills: { Social: 10, Communication: 8 },
    },
    Academic: {
      title: "Teach One Concept",
      desc: "Explain one concept from your recent lectures to a peer or junior student in simple language. Teaching is the best way to deepen understanding.",
      skills: { Knowledge: 12, Communication: 8, Discipline: 5 },
    },
    Entrepreneurship: {
      title: "Pain Point Hunt",
      desc: "Interview 2 students about a daily campus friction (queue, cost, time waste, etc.) and propose one micro-solution you could test this month.",
      skills: { Entrepreneurship: 12, "Problem Solving": 10, Communication: 5 },
    },
    Creativity: {
      title: "10-Minute Create",
      desc: "Produce one small creative artifact in 10 minutes related to your studies or campus life (sketch, short writing, photo series, playlist, etc.).",
      skills: { Creativity: 15, Discipline: 5 },
    },
    Leadership: {
      title: "Clarify the Next Step",
      desc: "In a group chat or meeting, take responsibility for clarifying the next action item and who owns it. Keep it concise and helpful.",
      skills: { Leadership: 12, Communication: 8 },
    },
    Health: {
      title: "Movement Break",
      desc: "Take a deliberate 15-minute movement break away from screens. Walk, stretch, or do light exercise while reflecting on your energy levels.",
      skills: { Discipline: 10, "Problem Solving": 5 },
    },
    Career: {
      title: "Skill Gap Note",
      desc: "Identify one skill that appears frequently in job postings related to your degree but that you have not practiced recently. Write a 3-step mini plan.",
      skills: { Knowledge: 8, Discipline: 8, "Problem Solving": 6 },
    },
    Community: {
      title: "Campus Kindness",
      desc: "Do one small thing that makes a shared campus space better for the next person (tidy a table, help with directions, share notes, etc.).",
      skills: { Social: 8, Leadership: 5 },
    },
  };

  const t = templates[cat];
  return {
    id: generateId(),
    title: t.title,
    description: t.desc,
    category: cat,
    difficulty: Math.min(5, 1 + Math.floor(profile.level / 4) + (seed % 2)),
    estimatedDuration: "15-30 minutes",
    xpReward: 90 + profile.level * 8 + seed * 10,
    skillsRewarded: t.skills,
    instructions: [
      "Read the quest carefully.",
      "Complete the activity in the real world.",
      "Return here and write your reflection.",
    ],
    completionCriteria: "Write a short reflection about what you did and what you learned.",
    createdBy: "ai",
    isActive: true,
    createdAt: new Date().toISOString(),
  };
}

export async function analyzeReflection(
  reflection: string,
  quest: Quest,
  profile: UserProfile
): Promise<ReflectionAnalysis> {
  const apiKey = process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  if (apiKey && apiKey !== "your-openai-key" && reflection.length > 20) {
    try {
      return await analyzeWithOpenAI(reflection, quest, profile, apiKey);
    } catch {
      // fall through
    }
  }

  return analyzeLocally(reflection, quest);
}

async function analyzeWithOpenAI(
  reflection: string,
  quest: Quest,
  profile: UserProfile,
  apiKey: string
): Promise<ReflectionAnalysis> {
  const prompt = `You are the Game Master analyzing a student's quest reflection.
Quest: "${quest.title}" (${quest.category})
Student reflection: "${reflection}"

Return ONLY JSON:
{
  "quality": "excellent" | "good" | "fair" | "poor",
  "detectedSkills": ["SkillName", ...],
  "feedback": "1-2 encouraging sentences of feedback",
  "xpMultiplier": 0.7-1.3,
  "recommendedXp": number
}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 300,
    }),
  });

  if (!res.ok) throw new Error("AI analysis failed");
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || "{}";
  const cleaned = content.replace(/```json\n?|\n?```/g, "").trim();
  const parsed = JSON.parse(cleaned);

  return {
    quality: parsed.quality || "good",
    detectedSkills: parsed.detectedSkills || Object.keys(quest.skillsRewarded),
    feedback: parsed.feedback || "Good effort. Keep reflecting deeply.",
    xpMultiplier: parsed.xpMultiplier || 1,
    recommendedXp: parsed.recommendedXp || quest.xpReward,
  };
}

function analyzeLocally(reflection: string, quest: Quest): ReflectionAnalysis {
  const len = reflection.trim().length;
  let quality: ReflectionAnalysis["quality"] = "fair";
  let multiplier = 1;

  if (len > 180) {
    quality = "excellent";
    multiplier = 1.25;
  } else if (len > 80) {
    quality = "good";
    multiplier = 1.1;
  } else if (len > 30) {
    quality = "fair";
    multiplier = 1;
  } else {
    quality = "poor";
    multiplier = 0.75;
  }

  const feedbacks = {
    excellent:
      "Excellent reflection. You showed real insight and connected the experience to your growth.",
    good: "Solid reflection. You captured the key takeaway and demonstrated engagement.",
    fair: "Decent effort. Next time try to go a bit deeper on what surprised you or what you would change.",
    poor: "Short reflection. Completing the quest is good — adding more detail will unlock higher XP next time.",
  };

  return {
    quality,
    detectedSkills: Object.keys(quest.skillsRewarded) as SkillName[],
    feedback: feedbacks[quality],
    xpMultiplier: multiplier,
    recommendedXp: Math.round(quest.xpReward * multiplier),
  };
}