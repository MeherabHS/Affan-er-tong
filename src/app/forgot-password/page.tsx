"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { forgotPasswordClientAction } from "@/lib/actions/auth-actions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [neutralMessage, setNeutralMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setNeutralMessage("");
    setLoading(true);

    const result = await forgotPasswordClientAction({
      email,
    });

    if (!result.success) {
      setErrorMessage(result.message || "Failed to send reset instructions.");
      setLoading(false);
      return;
    }

    setNeutralMessage(result.message || "If an account exists for this email, password-reset instructions will be sent.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E6] text-[#171717] font-sans selection:bg-[#E87525] selection:text-[#F5F0E6]">
      <Header user={null} onOpenAuth={() => {}} onSignOut={() => {}} />

      <main id="main-content" className="flex-1 py-12 md:py-20 flex items-center justify-center p-4 paper-grain">
        <div className="bg-[#F5F0E6] text-[#171717] max-w-md w-full p-6 sm:p-8 border border-[#171717]/20 shadow-2xl space-y-6">
          
          <div className="border-b border-[#171717]/15 pb-4">
            <Link
              href="/sign-in"
              className="text-xs font-mono font-bold uppercase tracking-wider text-[#E87525] hover:underline flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#171717] text-[#F5F0E6] font-condensed font-bold text-xs uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E87525]" />
              <span>PASSWORD RECOVERY</span>
            </div>

            <h1 className="font-condensed text-4xl uppercase tracking-wider text-[#171717]">
              FORGOT PASSWORD
            </h1>

            <p className="text-xs text-[#171717]/80 mt-1">
              Enter your registered email address below. We will send you secure password reset instructions.
            </p>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-300 text-red-700 text-xs font-bold mt-3 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {neutralMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold mt-3 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{neutralMessage}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs" noValidate>
            <div>
              <label htmlFor="email" className="block font-bold text-[#171717] mb-1 uppercase tracking-wider">
                Registered Email Address *
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

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[44px] py-3.5 bg-[#E87525] hover:bg-[#171717] text-[#F5F0E6] font-condensed text-base font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <span>{loading ? "Sending Link..." : "Send Password Reset Link"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </main>

      <Footer />
    </div>
  );
}
