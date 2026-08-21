import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, BookOpen, ArrowRight, HelpCircle } from "lucide-react";

export default function NotFound() {
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
          ERROR 404
        </span>
      </header>

      {/* Main 404 Hero Area */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-2xl w-full text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#171717] text-[#F5F0E6] font-condensed font-bold text-xs uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-[#E87525]" />
            <span>404 — PAGE NOT FOUND</span>
          </div>

          <h1 className="font-condensed text-7xl sm:text-8xl lg:text-9xl leading-[0.85] uppercase text-[#171717]">
            MOTION NOT FOUND
          </h1>

          <p className="text-base sm:text-lg text-[#171717]/80 max-w-lg mx-auto font-sans font-medium leading-relaxed">
            The debate topic, session recording, or page you were looking for does not exist, has been moved, or was never placed on the floor.
          </p>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#E87525] text-[#F5F0E6] hover:bg-[#171717] font-condensed text-base font-bold uppercase tracking-wider transition-colors border border-[#171717]/20 flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>RETURN TO HOMEPAGE</span>
            </Link>

            <Link
              href="/modules"
              className="w-full sm:w-auto px-6 py-3.5 bg-white text-[#171717] hover:bg-[#171717] hover:text-[#F5F0E6] font-condensed text-base font-bold uppercase tracking-wider transition-colors border border-[#171717]/20 flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-[#E87525]" />
              <span>BROWSE ALL MODULES</span>
              <ArrowRight className="w-4 h-4" />
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
