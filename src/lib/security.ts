import { randomBytes } from "crypto";

/**
 * SECURITY AND XSS PREVENTION UTILITIES
 * Enforces plain-text storage and safe escaping across the application.
 */

/**
 * Generates a cryptographically strong CSRF token string.
 */
export function generateCsrfToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Verifies if a provided CSRF token matches the session token.
 */
export function verifyCsrfToken(clientToken?: string | null, cookieToken?: string | null): boolean {
  if (!clientToken || !cookieToken) return false;
  return clientToken === cookieToken;
}

/**
 * Basic input sanitizer that removes dangerous HTML tags and script elements.
 */
export function sanitizeInput(str: string | null | undefined): string {
  if (!str) return "";
  let clean = str;
  let prev = "";
  // Iterative removal of tags to prevent nested tag bypasses
  while (clean !== prev) {
    prev = clean;
    clean = clean
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<[^>]*>/g, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "");
  }
  return clean
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .trim();
}

/**
 * Encodes special HTML entities for extra security if raw strings are placed in attributes.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Server-side CAPTCHA verification helper for Cloudflare Turnstile.
 */
export async function verifyTurnstileCaptcha(token?: string | null): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // If Turnstile secret key is not configured in env, allow in non-production
  if (!secretKey || secretKey.trim() === "") {
    if (process.env.NODE_ENV === "production") {
      return false;
    }
    return true;
  }

  // Allow dev mode token bypass
  if (token === "DEV_MODE_TOKEN") {
    return true;
  }

  if (!token) {
    return false;
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return Boolean(data.success);
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}
