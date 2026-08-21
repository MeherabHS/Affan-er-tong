export type LearningModule = {
  id: string;
  order: number;
  slug: string;
  title: string;
  summary: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
  duration?: string;
  sourceName?: string;
  youtubeUrl?: string;
  youtubeId?: string;
  thumbnailUrl?: string;
  status: "available" | "coming-soon" | "updated";
  publishedAt?: string;
};

export const LEARNING_PATH_MODULES: LearningModule[] = [
  {
    id: "mod-1",
    order: 1,
    slug: "prep-time-utilization",
    title: "15-MINUTE PREP-TIME UTILIZATION",
    summary: "Learn how to divide 15 minutes of preparation time to analyze motions, construct arguments, and structure speeches.",
    level: "Beginner",
    duration: "12 min",
    sourceName: "Affan er Tong",
    youtubeUrl: "https://www.youtube.com/watch?v=L_LUpnjgPso",
    youtubeId: "L_LUpnjgPso",
    thumbnailUrl: "https://img.youtube.com/vi/L_LUpnjgPso/hqdefault.jpg",
    status: "available",
    publishedAt: "2024"
  },
  {
    id: "mod-2",
    order: 2,
    slug: "premise-building-storytelling",
    title: "PREMISE BUILDING & CASE STORYTELLING",
    summary: "Focuses on developing clear core premises, moral framing, and compelling narratives that hold under opposition rebuttal.",
    level: "Intermediate",
    duration: "15 min",
    sourceName: "Affan er Tong",
    youtubeUrl: "https://www.youtube.com/watch?v=5qanlirrRWs",
    youtubeId: "5qanlirrRWs",
    thumbnailUrl: "https://img.youtube.com/vi/5qanlirrRWs/hqdefault.jpg",
    status: "updated",
    publishedAt: "2024"
  },
  {
    id: "mod-3",
    order: 3,
    slug: "rebuttals-poi-management",
    title: "REBUTTALS & POI MANAGEMENT",
    summary: "Mastering the 3-step rebuttal framework: identifying clashes, disproving core assumptions, and managing POIs under pressure.",
    level: "Advanced",
    duration: "18 min",
    sourceName: "Debate Resource Channel",
    youtubeUrl: "https://www.youtube.com/watch?v=L_LUpnjgPso",
    youtubeId: "L_LUpnjgPso",
    thumbnailUrl: "https://img.youtube.com/vi/L_LUpnjgPso/hqdefault.jpg",
    status: "available",
    publishedAt: "2024"
  },
  {
    id: "mod-4",
    order: 4,
    slug: "whip-speech-and-summary",
    title: "THE WHIP SPEECH & JUDGING CLASHES",
    summary: "How to summarize a complex debate, identify voting issues, and convince judges why your team won key clashes.",
    level: "Advanced",
    duration: "20 min",
    sourceName: "Affan er Tong",
    status: "coming-soon"
  },
  {
    id: "mod-5",
    order: 5,
    slug: "motion-analysis-heuristics",
    title: "ADVANCED MOTION ANALYSIS & HEURISTICS",
    summary: "Deconstructing policy vs principle motions and identifying implicit actor motivations.",
    level: "Intermediate",
    duration: "14 min",
    sourceName: "Affan er Tong",
    status: "coming-soon"
  }
];

export const featuredModules = LEARNING_PATH_MODULES
  .filter((module) => module.status !== "coming-soon")
  .sort((a, b) => a.order - b.order)
  .slice(0, 3);
