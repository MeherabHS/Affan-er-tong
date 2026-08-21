import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSafeRedirect } from "@/lib/validations/auth";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextRaw = searchParams.get("next");
  const safeNext = getSafeRedirect(nextRaw, "/");

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        // Redirection cleanses the code parameter from the browser address bar
        return NextResponse.redirect(`${origin}${safeNext}`);
      }
    }
  }

  // Return to sign-in page safely if code exchange failed or expired
  return NextResponse.redirect(`${origin}/sign-in?error=auth_callback_failed`);
}
