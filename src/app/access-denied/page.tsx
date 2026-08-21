"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E6] text-[#171717] font-sans selection:bg-[#E87525] selection:text-[#F5F0E6]">
      <Header user={null} onOpenAuth={() => {}} onSignOut={() => {}} />

      <main id="main-content" className="flex-1 py-16 md:py-24 flex items-center justify-center p-4 paper-grain">
        <div className="bg-[#F5F0E6] text-[#171717] max-w-md w-full p-6 sm:p-8 border-2 border-[#171717] shadow-2xl space-y-6 text-center">
          
          <div className="w-16 h-16 bg-[#171717] text-[#E87525] rounded-full flex items-center justify-center mx-auto border-2 border-[#E87525]">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 bg-red-100 text-red-800 font-mono text-xs uppercase font-bold tracking-wider">
              HTTP 403 • FORBIDDEN
            </span>

            <h1 className="font-condensed text-4xl uppercase tracking-wider text-[#171717] pt-2">
              Access Denied
            </h1>

            <p className="text-xs text-[#171717]/80 leading-relaxed font-medium">
              You do not have administrative authorization to access the internal control panel at <code>/admin</code>.
            </p>
            <p className="text-[11px] text-[#625E57] italic">
              Administrator privileges must be confirmed by database Row Level Security.
            </p>
          </div>

          <div className="pt-4 border-t border-[#171717]/15 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/"
              className="w-full sm:flex-1 py-3 bg-[#E87525] hover:bg-[#171717] text-[#F5F0E6] font-condensed text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Link>

            <Link
              href="/sign-in"
              className="w-full sm:flex-1 py-3 border border-[#171717]/30 text-[#171717] hover:bg-[#171717] hover:text-[#F5F0E6] font-condensed text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Sign In as Admin</span>
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
