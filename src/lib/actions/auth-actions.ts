"use client";

import { createClient } from "@/lib/supabase/client";
import {
  signUpSchema,
  signInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  emailSchema,
  getSafeRedirect,
} from "@/lib/validations/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { getSiteUrl } from "@/lib/site-url";

export interface ActionResult {
  success: boolean;
  message?: string;
  redirectTo?: string;
  errors?: Record<string, string>;
}

/**
 * SIGN UP ACTION
 */
export async function signUpClientAction(formData: unknown): Promise<ActionResult> {
  const result = signUpSchema.safeParse(formData);

  if (!result.success) {
    const formattedErrors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const key = String(issue.path[0] || "general");
      formattedErrors[key] = issue.message;
    });
    return {
      success: false,
      message: "Please fix the validation errors below.",
      errors: formattedErrors,
    };
  }

  const { email, password, displayName } = result.data;

  const rateResult = checkRateLimit(email);
  if (!rateResult.isAllowed) {
    return {
      success: false,
      message: "Too many requests. Please try again later.",
    };
  }

  const supabase = createClient();

  if (!supabase) {
    return {
      success: false,
      message: "Authentication service is unavailable.",
    };
  }

  try {
    const siteUrl = getSiteUrl();
    const emailRedirectTo = `${siteUrl}/auth/callback?next=/modules`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo,
        data: {
          display_name: displayName,
          // SECURITY: Role and account status are strictly forced by DB trigger / default schema
        },
      },
    });

    if (error) {
      // Neutral enumeration response or explicit rate-limit handling
      if (error.status === 429) {
        return {
          success: false,
          message: "Too many attempts. Please wait and try again later.",
        };
      }

      // Neutral account registration message to prevent enumeration leakage
      return {
        success: true,
        message: "Check your email to confirm your account.",
        redirectTo: "/verify-email",
      };
    }

    if (data.user) {
      return {
        success: true,
        message: "Check your email to confirm your account.",
        redirectTo: "/verify-email",
      };
    }

    return {
      success: true,
      message: "Check your email to confirm your account.",
      redirectTo: "/verify-email",
    };
  } catch (err) {
    console.error("Auth sign-up error occurred", err);
    return {
      success: true,
      message: "Check your email to confirm your account.",
      redirectTo: "/verify-email",
    };
  }
}

/**
 * SIGN IN ACTION
 */
export async function signInClientAction(formData: unknown, requestedNext?: string): Promise<ActionResult> {
  const result = signInSchema.safeParse(formData);

  if (!result.success) {
    const formattedErrors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const key = String(issue.path[0] || "general");
      formattedErrors[key] = issue.message;
    });
    return {
      success: false,
      message: "Please fix the validation errors below.",
      errors: formattedErrors,
    };
  }

  const { email, password } = result.data;

  const rateResult = checkRateLimit(email);
  if (!rateResult.isAllowed) {
    return {
      success: false,
      message: "Too many requests. Please try again later.",
    };
  }

  const safeNext = getSafeRedirect(requestedNext, "/");
  const supabase = createClient();

  if (!supabase) {
    return {
      success: false,
      message: "Authentication service is unavailable.",
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.status === 429) {
        return {
          success: false,
          message: "Too many attempts. Please wait and try again later.",
        };
      }

      // NEUTRAL AUTHENTICATION ERROR MESSAGE FOR ACCOUNT ENUMERATION SECURITY
      return {
        success: false,
        message: "Unable to sign in with those credentials.",
      };
    }

    if (data.user) {
      // Check profile status and role server-side
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, account_status")
        .eq("id", data.user.id)
        .single();

      if (profile?.account_status === "suspended") {
        await supabase.auth.signOut();
        return {
          success: false,
          message: "Your account has been suspended. Redirecting...",
          redirectTo: "/account-suspended",
        };
      }

      if (safeNext.startsWith("/admin") && profile?.role !== "admin") {
        return {
          success: false,
          message: "Access Denied: Administrator privileges required.",
          redirectTo: "/access-denied",
        };
      }

      return {
        success: true,
        message: "Signed in successfully.",
        redirectTo: safeNext,
      };
    }

    return {
      success: false,
      message: "Unable to sign in with those credentials.",
    };
  } catch (err) {
    console.error("Auth sign-in error occurred", err);
    return {
      success: false,
      message: "Unable to sign in with those credentials.",
    };
  }
}

/**
 * FORGOT PASSWORD ACTION
 */
export async function forgotPasswordClientAction(formData: unknown): Promise<ActionResult> {
  const result = forgotPasswordSchema.safeParse(formData);

  if (!result.success) {
    const formattedErrors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const key = String(issue.path[0] || "general");
      formattedErrors[key] = issue.message;
    });
    return {
      success: false,
      message: "Please provide a valid email address.",
      errors: formattedErrors,
    };
  }

  const { email } = result.data;

  const supabase = createClient();

  if (!supabase) {
    return {
      success: false,
      message: "Authentication service is unavailable.",
    };
  }

  try {
    const siteUrl = getSiteUrl();
    const redirectTo = `${siteUrl}/auth/callback?next=/reset-password`;

    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
  } catch (err) {
    console.error("Forgot password error", err);
  }

  // ALWAYS RETURN A NEUTRAL RESPONSE TO PREVENT ACCOUNT ENUMERATION
  return {
    success: true,
    message: "If an account exists for this email, password-reset instructions will be sent.",
  };
}

/**
 * RESEND VERIFICATION ACTION
 */
export async function resendVerificationClientAction(email: string): Promise<ActionResult> {
  const result = emailSchema.safeParse(email);

  if (!result.success) {
    return {
      success: false,
      message: "Please provide a valid email address.",
    };
  }

  const validEmail = result.data;
  const rateResult = checkRateLimit(validEmail);
  if (!rateResult.isAllowed) {
    return {
      success: false,
      message: "Too many requests. Please try again later.",
    };
  }

  const supabase = createClient();
  if (!supabase) {
    return {
      success: false,
      message: "Authentication service is unavailable.",
    };
  }

  try {
    const siteUrl = getSiteUrl();
    const emailRedirectTo = `${siteUrl}/auth/callback?next=/modules`;

    await supabase.auth.resend({
      type: "signup",
      email: validEmail,
      options: {
        emailRedirectTo,
      },
    });
  } catch (err) {
    console.error("Resend verification error", err);
  }

  return {
    success: true,
    message: "If the account is eligible, a new verification email has been sent.",
  };
}

/**
 * RESET PASSWORD ACTION
 */
export async function resetPasswordClientAction(formData: unknown): Promise<ActionResult> {
  const result = resetPasswordSchema.safeParse(formData);

  if (!result.success) {
    const formattedErrors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const key = String(issue.path[0] || "general");
      formattedErrors[key] = issue.message;
    });
    return {
      success: false,
      message: "Please fix the validation errors below.",
      errors: formattedErrors,
    };
  }

  const { password } = result.data;
  const supabase = createClient();

  if (!supabase) {
    return {
      success: false,
      message: "Authentication service is unavailable.",
    };
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return {
        success: false,
        message: error.message || "Failed to reset password. Recovery link may be expired.",
      };
    }

    return {
      success: true,
      message: "Password updated successfully. You may now sign in.",
      redirectTo: "/sign-in",
    };
  } catch (err) {
    console.error("Reset password error", err);
    return {
      success: false,
      message: "Failed to reset password. Recovery link may be expired.",
    };
  }
}

/**
 * SIGN OUT ACTION
 */
export async function signOutClientAction(): Promise<ActionResult> {
  const supabase = createClient();
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Sign out error", err);
    }
  }

  return {
    success: true,
    message: "Signed out successfully.",
    redirectTo: "/sign-in",
  };
}
