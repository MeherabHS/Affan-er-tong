"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F5F0E6] text-[#171717] flex flex-col justify-between font-sans paper-grain selection:bg-[#E87525] selection:text-[#F5F0E6]">
      
      {/* Top Brand Header */}
      <header className="py-6 px-6 sm:px-12 border-b border-[#171717]/10 flex items-center justify-between">
        <Link href="/" className="inline-block">
          <div className="w-[140px] sm:w-[170px] h-auto relative bg-[#F5F0E6] p-1.5 border border-[#171717]/20">
            <Image
              src="/logo.webp"
              alt="Affan er Tong Official Logo"
              width={170}
              height={90}
              priority
              className="object-contain w-full h-auto"
            />
          </div>
        </Link>
        <span className="font-mono text-xs font-bold text-[#E87525] uppercase tracking-wider">
          ERROR 500
        </span>
      </header>

      {/* Main 500 Error Hero Area */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-2xl w-full text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#171717] text-[#F5F0E6] font-condensed font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-[#E87525]" />
            <span>500 — TECHNICAL DISRUPTION</span>
          </div>

          <h1 className="font-condensed text-6xl sm:text-7xl lg:text-8xl leading-[0.88] uppercase text-[#171717]">
            UNEXPECTED SESSION DISRUPTION
          </h1>

          <p className="text-base sm:text-lg text-[#171717]/80 max-w-lg mx-auto font-sans font-medium leading-relaxed">
            An unexpected error occurred while processing this request. You can attempt to reload the session or return to the main floor.
          </p>

          {error?.digest && (
            <p className="font-mono text-[11px] text-[#171717]/50 bg-[#D7D0C4]/40 px-3 py-1.5 max-w-md mx-auto border border-[#171717]/10">
              Digest Code: {error.digest}
            </p>
          )}

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#E87525] text-[#F5F0E6] hover:bg-[#171717] font-condensed text-base font-bold uppercase tracking-wider transition-colors border border-[#171717]/20 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>RETRY SESSION</span>
            </button>

            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 bg-white text-[#171717] hover:bg-[#171717] hover:text-[#F5F0E6] font-condensed text-base font-bold uppercase tracking-wider transition-colors border border-[#171717]/20 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4 text-[#E87525]" />
              <span>RETURN TO HOMEPAGE</span>
            </Link>
          </div>

        </div>
      </main>

      {/* Footer Note */}
      <footer className="py-6 px-6 border-t border-[#171717]/10 text-center font-mono text-xs text-[#171717]/50">
        © {new Date().getFullYear()} Affan er Tong • Debate Learning Adda
      </footer>

    </div>
  );
}
