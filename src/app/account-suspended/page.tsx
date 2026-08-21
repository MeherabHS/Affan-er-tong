"use client";

import React from "react";
import Link from "next/link";
import { UserX, Mail, Home } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AccountSuspendedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E6] text-[#171717] font-sans selection:bg-[#E87525] selection:text-[#F5F0E6]">
      <Header user={null} onOpenAuth={() => {}} onSignOut={() => {}} />

      <main id="main-content" className="flex-1 py-16 md:py-24 flex items-center justify-center p-4 paper-grain">
        <div className="bg-[#F5F0E6] text-[#171717] max-w-md w-full p-6 sm:p-8 border-2 border-red-700 shadow-2xl space-y-6 text-center">
          
          <div className="w-16 h-16 bg-red-700 text-white rounded-full flex items-center justify-center mx-auto border-2 border-[#171717]">
            <UserX className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 bg-red-100 text-red-800 font-mono text-xs uppercase font-bold tracking-wider">
              ACCOUNT STATUS • SUSPENDED
            </span>

            <h1 className="font-condensed text-4xl uppercase tracking-wider text-[#171717] pt-2">
              Account Suspended
            </h1>

            <p className="text-xs text-[#171717]/80 leading-relaxed font-medium">
              Your debater account is currently suspended from performing actions or accessing internal community features.
            </p>
            <p className="text-[11px] text-[#625E57] italic">
              If you believe this suspension is in error or wish to request account reactivation, please contact the Affan er Tong management team.
            </p>
          </div>

          <div className="pt-4 border-t border-[#171717]/15 space-y-3">
            <a
              href="https://www.facebook.com/people/Affan-er-Tong/61568027547475/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#171717] hover:bg-[#E87525] text-[#F5F0E6] font-condensed text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
            >
              <Mail className="w-4 h-4 text-[#E87525]" />
              <span>Contact Affan er Tong Admin</span>
            </a>

            <Link
              href="/"
              className="w-full py-3 border border-[#171717]/30 text-[#171717] hover:bg-[#171717] hover:text-[#F5F0E6] font-condensed text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
            >
              <Home className="w-4 h-4" />
              <span>Back to Public Homepage</span>
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
