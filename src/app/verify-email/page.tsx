"use client";

import React from "react";
import Link from "next/link";
import { Mail, ArrowRight, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E6] text-[#171717] font-sans selection:bg-[#E87525] selection:text-[#F5F0E6]">
      <Header user={null} onOpenAuth={() => {}} onSignOut={() => {}} />

      <main id="main-content" className="flex-1 py-16 md:py-24 flex items-center justify-center p-4 paper-grain">
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

            <p className="text-sm font-bold text-[#171717]/90 leading-relaxed">
              &quot;Check your email to confirm your account.&quot;
            </p>

            <p className="text-xs text-[#171717]/70 leading-relaxed pt-1">
              We have dispatched a secure verification link to your email address. Please click the link in your inbox to confirm registration and activate your debater profile.
            </p>
          </div>

          <div className="pt-4 border-t border-[#171717]/15 space-y-3">
            <Link
              href="/sign-in"
              className="w-full min-h-[44px] py-3 bg-[#171717] hover:bg-[#E87525] text-[#F5F0E6] font-condensed text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <span>Return to Sign In</span>
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
