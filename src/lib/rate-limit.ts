interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting by IP
const rateLimitMap = new Map<string, RateLimitEntry>();
const MAX_RATE_LIMIT_ENTRIES = 10000;

function cleanupExpiredEntries(now: number) {
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    cleanupExpiredEntries(Date.now());
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  limit?: number; // max requests per window
  windowMs?: number; // window size in milliseconds
}

export function checkRateLimit(
  clientIp: string,
  options: RateLimitOptions = {}
): { isAllowed: boolean; limit: number; remaining: number; resetTime: number } {
  const limit = options.limit || 60; // 60 requests default
  const windowMs = options.windowMs || 60 * 1000; // 1 minute default
  const now = Date.now();

  // Prevent memory exhaustion Denial of Service: if map exceeds max entries, clear expired entries
  if (rateLimitMap.size >= MAX_RATE_LIMIT_ENTRIES) {
    cleanupExpiredEntries(now);
    if (rateLimitMap.size >= MAX_RATE_LIMIT_ENTRIES) {
      rateLimitMap.clear();
    }
  }

  const entry = rateLimitMap.get(clientIp);

  if (!entry || now > entry.resetTime) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitMap.set(clientIp, newEntry);
    return {
      isAllowed: true,
      limit,
      remaining: limit - 1,
      resetTime: newEntry.resetTime,
    };
  }

  if (entry.count >= limit) {
    return {
      isAllowed: false,
      limit,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  entry.count += 1;
  rateLimitMap.set(clientIp, entry);

  return {
    isAllowed: true,
    limit,
    remaining: limit - entry.count,
    resetTime: entry.resetTime,
  };
}
