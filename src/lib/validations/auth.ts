import { z } from "zod";

/**
 * EMAIL SANITIZATION SCHEMA
 * - Require string
 * - Trim whitespace
 * - Convert domain and address to lowercase
 * - Max length 254
 * - Standard email validation
 * - Reject control characters, carriage returns, newlines, and HTML brackets
 */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, { message: "Email address exceeds maximum length of 254 characters." })
  .email({ message: "Please provide a valid email address." })
  .refine(
    (val) => !/[\x00-\x1F\x7F-\x9F\r\n<>]/.test(val),
    { message: "Email address contains invalid or control characters." }
  );

/**
 * PASSWORD HANDLING SCHEMA
 * - Minimum 12 characters
 * - Maximum 128 characters
 * - NO SILENT TRIMMING. Return explicit error if leading/trailing spaces exist.
 */
export const passwordSchema = z
  .string()
  .min(12, { message: "Password must be at least 12 characters long." })
  .max(128, { message: "Password cannot exceed 128 characters." })
  .refine(
    (val) => val.trim() === val,
    { message: "Password must not begin or end with whitespace." }
  );

/**
 * DISPLAY NAME SANITIZATION SCHEMA
 * - Trim surrounding whitespace
 * - Collapse excessive consecutive spaces
 * - Apply Unicode NFC normalization
 * - Length 2-60 characters
 * - Permit Bangla (\u0980-\u09FF) & international letters
 * - Reject control characters and direction-control abuse (\u200E\u200F\u202A-\u202E\u2066-\u2069)
 */
export const displayNameSchema = z
  .string()
  .trim()
  .transform((val) => val.replace(/\s+/g, " "))
  .transform((val) => val.normalize("NFC"))
  .pipe(
    z
      .string()
      .min(2, { message: "Display name must be at least 2 characters long." })
      .max(60, { message: "Display name cannot exceed 60 characters." })
      .refine(
        (val) => !/[\x00-\x1F\x7F-\x9F\u200E\u200F\u202A-\u202E\u2066-\u2069]/.test(val),
        { message: "Display name contains invalid control or direction characters." }
      )
  );

/**
 * SIGN UP FORM SCHEMA
 */
export const signUpSchema = z
  .object({
    displayName: displayNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

/**
 * SIGN IN FORM SCHEMA
 */
export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/**
 * FORGOT PASSWORD SCHEMA
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

/**
 * RESET PASSWORD SCHEMA
 */
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

/**
 * PASSWORD STRENGTH EVALUATOR
 * Returns rating for visual feedback UI (Client side)
 */
export function evaluatePasswordStrength(password: string): {
  score: number; // 0 to 4
  label: "Too Weak" | "Fair" | "Good" | "Strong" | "Very Strong";
  hasMinLength: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  hasUpperAndLower: boolean;
} {
  const hasMinLength = password.length >= 12;
  const hasUpperAndLower = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);

  let score = 0;
  if (hasMinLength) score += 1;
  if (password.length >= 16) score += 1;
  if (hasUpperAndLower) score += 1;
  if (hasNumber || hasSpecialChar) score += 1;

  const labels: Array<"Too Weak" | "Fair" | "Good" | "Strong" | "Very Strong"> = [
    "Too Weak",
    "Fair",
    "Good",
    "Strong",
    "Very Strong",
  ];

  return {
    score,
    label: labels[score] || "Fair",
    hasMinLength,
    hasNumber,
    hasSpecialChar,
    hasUpperAndLower,
  };
}

/**
 * SAFE REDIRECT HELPER
 * Ensures only safe internal application paths are permitted.
 * Rejects absolute external URLs, protocol-relative //, /\, backslashes, line breaks, control characters, and URL-encoded bypasses.
 */
export function getSafeRedirect(value: unknown, fallback = "/"): string {
  if (typeof value !== "string" || !value) {
    return fallback;
  }

  // Reject control characters, newlines, carriage returns, tabs
  if (/[\x00-\x1F\x7F-\x9F\r\n\t]/.test(value)) {
    return fallback;
  }

  // Trim whitespace
  const sanitized = value.trim();

  // Must begin with a single forward slash and reject //, /\, /\\, \
  if (!sanitized.startsWith("/") || sanitized.startsWith("//") || sanitized.startsWith("/\\") || sanitized.startsWith("\\")) {
    return fallback;
  }

  // Reject backslashes anywhere to prevent Windows/browser path normalization bypasses
  if (sanitized.includes("\\")) {
    return fallback;
  }

  // Reject schemes like javascript:, data:, vbscript:, http:, https:
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(sanitized)) {
    return fallback;
  }

  // Reject encoded external redirects and bypass patterns (%2f, %5c, %25)
  if (/%2f%2f|%2f%5c|%5c%2f|%5c%5c|%5c|%25/i.test(sanitized)) {
    return fallback;
  }

  // Decode URI component to check for nested or encoded bypass attempts
  try {
    const decoded = decodeURIComponent(sanitized);
    if (
      !decoded.startsWith("/") ||
      decoded.startsWith("//") ||
      decoded.startsWith("/\\") ||
      decoded.includes("\\") ||
      /[\x00-\x1F\x7F-\x9F\r\n\t]/.test(decoded)
    ) {
      return fallback;
    }
  } catch {
    return fallback;
  }

  // Validate internal path against base origin to prevent host header injection & external redirects
  try {
    const parsed = new URL(sanitized, "http://localhost");
    if (parsed.origin !== "http://localhost" || parsed.hostname !== "localhost") {
      return fallback;
    }

    if (!parsed.pathname.startsWith("/") || parsed.pathname.startsWith("//") || parsed.pathname.startsWith("/\\")) {
      return fallback;
    }

    return sanitized;
  } catch {
    return fallback;
  }
}
