"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TurnstileCaptcha from "@/components/TurnstileCaptcha";
import { signInClientAction } from "@/lib/actions/auth-actions";
import { getSafeRedirect } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawNext = searchParams.get("next") || "/";
  const nextPath = getSafeRedirect(rawNext, "/");

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    document.title = "Sign In | Affan er Tong";

    async function checkExistingSession() {
      const supabase = createClient();
      if (supabase) {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          router.push(nextPath);
        }
      }
    }
    checkExistingSession();
  }, [router, nextPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const result = await signInClientAction(
      {
        email,
        password,
        captchaToken,
      },
      nextPath
    );

    if (!result.success) {
      setErrorMessage(result.message || "Unable to sign in with those credentials.");
      setPassword("");
      setLoading(false);
      return;
    }

    setLoading(false);
    if (result.redirectTo) {
      router.push(result.redirectTo);
    } else {
      router.push(nextPath);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E6] text-[#171717] font-sans selection:bg-[#E87525] selection:text-[#F5F0E6]">
      <Header user={null} onOpenAuth={() => {}} onSignOut={() => {}} />

      <main id="main-content" className="flex-1 py-12 md:py-20 flex items-center justify-center p-4 paper-grain">
        <div className="bg-[#F5F0E6] text-[#171717] max-w-md w-full p-6 sm:p-8 border border-[#171717]/20 shadow-2xl space-y-6">
          
          <div className="border-b border-[#171717]/15 pb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#171717] text-[#F5F0E6] font-condensed font-bold text-xs uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E87525]" />
              <span>SECURE SIGN IN</span>
            </div>

            <h1 className="font-condensed text-4xl uppercase tracking-wider text-[#171717]">
              MEMBER SIGN IN
            </h1>

            {nextPath !== "/" && (
              <p className="text-xs text-[#171717]/80 mt-2 font-medium bg-[#D7D0C4]/40 p-2.5 border border-[#171717]/15">
                Sign in to proceed to <strong className="text-[#E87525]">{nextPath}</strong>.
              </p>
            )}

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-300 text-red-700 text-xs font-bold mt-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs" noValidate>
            <div>
              <label htmlFor="email" className="block font-bold text-[#171717] mb-1 uppercase tracking-wider">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#171717]/60" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-white border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block font-bold text-[#171717] uppercase tracking-wider">
                  Password *
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-mono text-[#E87525] hover:underline uppercase"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#171717]/60" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-3 bg-[#ffffff] border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#171717]/60 hover:text-[#171717]"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <TurnstileCaptcha onVerify={(token) => setCaptchaToken(token)} />

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[44px] py-3.5 bg-[#E87525] hover:bg-[#171717] text-[#F5F0E6] font-condensed text-base font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <span>{loading ? "Authenticating..." : "Sign In"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-[#171717]/15 text-center text-xs">
            <span className="text-[#171717]/70">Don&apos;t have an account yet? </span>
            <Link href="/sign-up" className="text-[#E87525] hover:underline font-bold">
              Create Account Here ↗
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F0E6] flex items-center justify-center font-mono text-xs">Loading sign in...</div>}>
      <SignInContent />
    </Suspense>
  );
}
