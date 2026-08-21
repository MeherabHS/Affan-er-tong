import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSafeRedirect } from "@/lib/validations/auth";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextRaw = requestUrl.searchParams.get("next");
  const safeNext = getSafeRedirect(nextRaw, "/modules");

  if (!code) {
    return NextResponse.redirect(
      new URL("/sign-in?error=missing_code", request.url)
    );
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.redirect(
      new URL("/sign-in?error=service_unavailable", request.url)
    );
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Auth callback code exchange error:", error);
    return NextResponse.redirect(
      new URL("/sign-in?error=verification_failed", request.url)
    );
  }

  // Successfully exchanged session code - redirect safely to internal next route
  return NextResponse.redirect(new URL(safeNext, request.url));
}
