"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { resendVerificationClientAction } from "@/lib/actions/auth-actions";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage(null);

    const result = await resendVerificationClientAction(email);
    setLoading(false);

    if (result.success) {
      setMessage({ type: "success", text: result.message || "New verification email dispatched." });
    } else {
      setMessage({ type: "error", text: result.message || "Failed to resend verification email." });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E6] text-[#171717] font-sans selection:bg-[#E87525] selection:text-[#F5F0E6]">
      <Header user={null} onOpenAuth={() => {}} onSignOut={() => {}} />

      <main id="main-content" className="flex-1 py-12 md:py-20 flex items-center justify-center p-4 paper-grain">
        <div className="bg-[#F5F0E6] text-[#171717] max-w-md w-full p-6 sm:p-8 border border-[#171717]/20 shadow-2xl space-y-6 text-center">
          
          <div className="w-14 h-14 bg-[#E87525] text-[#F5F0E6] rounded-full flex items-center justify-center mx-auto border-2 border-[#171717] shadow-md">
            <Mail className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#171717] text-[#F5F0E6] font-condensed font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E87525]" />
              <span>EMAIL CONFIRMATION REQUIRED</span>
            </div>

            <h1 className="font-condensed text-3xl sm:text-4xl uppercase tracking-wider text-[#171717] pt-2">
              Check Your Email
            </h1>

            <p className="text-sm font-bold text-[#171717]/90 leading-relaxed bg-[#D7D0C4]/40 p-3 border border-[#171717]/15">
              Account created. Please check your email and confirm your account before signing in.
            </p>

            <p className="text-xs text-[#171717]/70 leading-relaxed pt-1">
              We have dispatched a secure verification link to your email address. Please click the link in your inbox to confirm registration and activate your profile.
            </p>
          </div>

          {message && (
            <div
              className={`p-3 text-xs font-bold flex items-start gap-2 text-left ${
                message.type === "success"
                  ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
                  : "bg-red-50 border border-red-300 text-red-700"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Resend Verification Form */}
          <form onSubmit={handleResend} className="space-y-3 pt-2 text-left" noValidate>
            <label htmlFor="resendEmail" className="block text-[11px] font-bold text-[#171717] uppercase tracking-wider">
              Didn&apos;t receive the email? Resend verification link:
            </label>
            <div className="flex gap-2">
              <input
                id="resendEmail"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
                required
              />
              <button
                type="submit"
                disabled={loading || !email}
                className="px-4 py-2 bg-[#E87525] hover:bg-[#171717] text-[#F5F0E6] font-condensed text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>Resend</span>
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-[#171717]/15 space-y-3">
            <Link
              href="/sign-in"
              className="w-full min-h-[44px] py-3 bg-[#171717] hover:bg-[#E87525] text-[#F5F0E6] font-condensed text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <span>Back to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="inline-block text-xs font-mono font-bold uppercase text-[#171717]/70 hover:text-[#E87525]"
            >
              Back to Homepage
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
