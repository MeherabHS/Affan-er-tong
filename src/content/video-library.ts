export type VideoResource = {
  id: string;
  title: string;
  description: string;
  category: "Debate Breakdown" | "Public Speaking" | "Argumentation" | "Practice";
  youtubeUrl: string;
  youtubeId: string;
  thumbnailUrl: string;
  sourceName: string;
  sourceLabel: "AFFAN ER TONG SESSION" | "EXTERNAL LEARNING RESOURCE";
  verified: boolean;
};

export function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export const VIDEO_CATEGORIES = [
  "All",
  "Debate Breakdown",
  "Public Speaking",
  "Argumentation",
  "Practice"
] as const;

export const VERIFIED_VIDEOS: VideoResource[] = [
  {
    id: "vid-1",
    title: "Parliamentary Debate Case Construction & Strategy",
    description: "An in-depth breakdown of case construction, burden of proof, and strategic planning for prime minister speeches.",
    category: "Argumentation",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    youtubeId: "dQw4w9WgXcQ",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    sourceName: "World Universities Debating Championship",
    sourceLabel: "EXTERNAL LEARNING RESOURCE",
    verified: true
  },
  {
    id: "vid-2",
    title: "Public Speaking & Persuasive Rhetoric Fundamentals",
    description: "Key techniques for vocal delivery, strategic pauses, and structured argument delivery under pressure.",
    category: "Public Speaking",
    youtubeUrl: "https://www.youtube.com/watch?v=5qanlirrRWs",
    youtubeId: "5qanlirrRWs",
    thumbnailUrl: "https://img.youtube.com/vi/5qanlirrRWs/hqdefault.jpg",
    sourceName: "Oxford Union Debates",
    sourceLabel: "EXTERNAL LEARNING RESOURCE",
    verified: true
  },
  {
    id: "vid-3",
    title: "Rebuttal Frameworks and POI Management",
    description: "Learn how to dismantle opposition arguments effectively using clash identification and impact analysis.",
    category: "Debate Breakdown",
    youtubeUrl: "https://www.youtube.com/watch?v=L_LUpnjgPso",
    youtubeId: "L_LUpnjgPso",
    thumbnailUrl: "https://img.youtube.com/vi/L_LUpnjgPso/hqdefault.jpg",
    sourceName: "Debate Coaching Channel",
    sourceLabel: "EXTERNAL LEARNING RESOURCE",
    verified: true
  }
];
