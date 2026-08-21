/**
 * YouTube Utility for Affan er Tong Admin System
 * Handles URL parsing, ID extraction, thumbnail generation, and URL normalization.
 */

export interface ParsedYouTubeInfo {
  isValid: boolean;
  videoId: string | null;
  normalizedUrl: string | null;
  thumbnailUrl: string | null;
  error?: string;
}

/**
 * Extracts YouTube video ID from various YouTube URL formats.
 */
export function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== "string") return null;

  const trimmed = url.trim();

  // Standard watch URL: youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.*&v=)([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) {
    return watchMatch[1];
  }

  // Short URL: youtu.be/VIDEO_ID
  const shortMatch = trimmed.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (shortMatch && shortMatch[1]) {
    return shortMatch[1];
  }

  // Embed URL: youtube.com/embed/VIDEO_ID
  const embedMatch = trimmed.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1];
  }

  // Direct 11-character Video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Parses and validates a YouTube URL string.
 */
export function parseYouTubeUrl(url: string): ParsedYouTubeInfo {
  if (!url || !url.trim()) {
    return {
      isValid: false,
      videoId: null,
      normalizedUrl: null,
      thumbnailUrl: null,
      error: "YouTube URL is required.",
    };
  }

  const videoId = extractYouTubeId(url);

  if (!videoId) {
    return {
      isValid: false,
      videoId: null,
      normalizedUrl: null,
      thumbnailUrl: null,
      error: "Invalid YouTube URL format. Please provide a valid youtube.com/watch?v=... or youtu.be/... link.",
    };
  }

  return {
    isValid: true,
    videoId,
    normalizedUrl: `https://www.youtube.com/watch?v=${videoId}`,
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  };
}
