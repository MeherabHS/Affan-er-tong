/**
 * Safe Site URL Helper
 * Returns canonical production site URL or local development URL for authentication redirects.
 */
export function getSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/$/, "");
  }

  if (process.env.URL) {
    return process.env.URL.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // Fallback to localhost for local testing if env is unset
  return "http://localhost:3000";
}
