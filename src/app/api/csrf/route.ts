import { NextResponse } from "next/server";
import { generateCsrfToken } from "@/lib/security";

export async function GET() {
  const csrfToken = generateCsrfToken();
  const response = NextResponse.json({ csrfToken });

  response.cookies.set("csrf_token", csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return response;
}
