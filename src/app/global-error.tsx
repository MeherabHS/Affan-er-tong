"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { RefreshCw, AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global System Error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-[#F5F0E6] text-[#171717] min-h-screen flex flex-col justify-between font-sans selection:bg-[#E87525] selection:text-[#F5F0E6]">
        
        {/* Top Header */}
        <header className="py-6 px-6 sm:px-12 border-b border-[#171717]/10 flex items-center justify-between">
          <div className="w-[140px] sm:w-[170px] h-auto relative bg-[#F5F0E6] p-1.5 border border-[#171717]/20">
            <Image
              src="/logo.webp"
              alt="Affan er Tong Official Logo"
              width={170}
              height={90}
              className="object-contain w-full h-auto"
            />
          </div>
          <span className="font-mono text-xs font-bold text-[#E87525] uppercase tracking-wider">
            CRITICAL ERROR
          </span>
        </header>

        {/* Hero Area */}
        <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="max-w-2xl w-full text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#171717] text-[#F5F0E6] font-mono text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5 text-[#E87525]" />
              <span>SYSTEM BREAKDOWN</span>
            </div>

            <h1 className="font-sans font-black text-5xl sm:text-6xl uppercase tracking-tight text-[#171717]">
              CRITICAL SYSTEM DISRUPTION
            </h1>

            <p className="text-base text-[#171717]/80 max-w-lg mx-auto font-sans font-medium leading-relaxed">
              A critical layout error occurred. Please click below to reload the application shell.
            </p>

            <button
              onClick={() => reset()}
              className="px-6 py-3.5 bg-[#E87525] text-[#F5F0E6] hover:bg-[#171717] font-mono text-sm font-bold uppercase tracking-wider transition-colors border border-[#171717]/20 inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>RELOAD APPLICATION</span>
            </button>

          </div>
        </main>

        <footer className="py-6 px-6 border-t border-[#171717]/10 text-center font-mono text-xs text-[#171717]/50">
          © {new Date().getFullYear()} Affan er Tong
        </footer>

      </body>
    </html>
  );
}
