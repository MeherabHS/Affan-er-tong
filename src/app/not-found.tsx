import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Home, BookOpen } from "lucide-react";
import { SITE_DATA } from "@/content/site";

export const metadata: Metadata = {
  title: "404 - Page Left The Adda | Affan er Tong",
  description:
    "The page you were looking for may have moved, changed, or never made it to the table.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex flex-col justify-between bg-[#F5F0E6] text-[#171717] font-sans paper-grain selection:bg-[#E87525] selection:text-[#F5F0E6]">
      {/* Simplified Branded Header */}
      <header className="py-5 px-4 sm:px-8 lg:px-16 border-b border-[rgba(23,23,23,0.08)] bg-[#F5F0E6]">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center hover:opacity-90 transition-opacity shrink-0 focus-visible:outline-2 focus-visible:outline-[#E87525]"
            aria-label="Affan er Tong Home"
          >
            <div className="w-[140px] sm:w-[170px] h-auto relative">
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
          <div className="font-mono text-xs font-bold text-[#E87525] uppercase tracking-wider border border-[#E87525]/30 px-3 py-1 bg-[#F5F0E6]">
            ERROR 404
          </div>
        </div>
      </header>

      {/* Main Error Content */}
      <main id="main-content" className="flex-1 flex items-center py-10 md:py-16">
        <div className="max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Error Message & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#E87525] bg-[#E87525]/10 px-3 py-1 border border-[#E87525]/20">
                <span>ERROR / 404</span>
              </div>

              <h1 className="font-condensed text-[clamp(2.5rem,7vw,5rem)] leading-[0.88] uppercase text-[#171717] tracking-tight">
                THIS PAGE <br className="hidden sm:inline" />
                LEFT THE <br />
                <span className="text-[#E87525]">ADDA.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#171717]/80 max-w-xl font-sans font-medium leading-relaxed">
                The page you were looking for may have moved, changed, or never made it to the table. Take a seat, grab some tea, and find your way back.
              </p>

              {/* Action Links */}
              <div className="pt-2 space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 max-w-md sm:max-w-none">
                  {/* Primary Action: Back to Home */}
                  <Link
                    href="/"
                    className="min-h-[48px] px-6 py-3 bg-[#171717] text-[#F5F0E6] hover:bg-[#E87525] transition-colors font-condensed text-base font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#171717] focus-visible:outline-2 focus-visible:outline-[#E87525]"
                  >
                    <Home className="w-4 h-4 text-[#E87525]" />
                    <span>BACK TO HOME</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>

                  {/* Secondary Action: Explore Modules */}
                  <Link
                    href="/modules"
                    className="min-h-[48px] px-6 py-3 bg-transparent text-[#171717] hover:bg-[#171717] hover:text-[#F5F0E6] transition-colors font-condensed text-base font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#171717]/25 focus-visible:outline-2 focus-visible:outline-[#E87525]"
                  >
                    <BookOpen className="w-4 h-4 text-[#E87525]" />
                    <span>EXPLORE MODULES</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>

                {/* Small Optional Link */}
                <div className="pt-1">
                  <Link
                    href="/video-library"
                    className="inline-flex items-center gap-1 font-mono text-xs font-bold text-[#171717]/70 hover:text-[#E87525] transition-colors uppercase tracking-wider underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-[#E87525]"
                  >
                    <span>VISIT VIDEO LIBRARY</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#E87525]" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Tong Adda Illustration */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[380px] aspect-square relative bg-[#F5F0E6] p-6 border border-[#171717]/15 paper-grain shadow-sm flex items-center justify-center">
                
                {/* Custom SVG: Empty Stool, Tea Glass, Speech Lines & Question Paper */}
                <svg
                  viewBox="0 0 320 320"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full text-[#171717]"
                  aria-hidden="true"
                >
                  {/* Subtle Background Pattern Circle */}
                  <circle cx="160" cy="160" r="130" stroke="#171717" strokeOpacity="0.08" strokeWidth="1.5" strokeDasharray="4 4" />
                  
                  {/* Fading Speech Lines in Background */}
                  <path d="M70 90 Q120 70 170 90" stroke="#F0B868" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
                  <path d="M190 100 Q240 85 270 110" stroke="#F0B868" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />

                  {/* Rising Tea Steam Forming Subtle "404" Shapes */}
                  <g opacity="0.6">
                    {/* Steam Line 1: '4' shape */}
                    <path d="M148 115 C145 95 140 85 145 70" stroke="#E87525" strokeWidth="2" strokeLinecap="round" />
                    {/* Steam Line 2: '0' shape */}
                    <path d="M160 112 C165 92 165 80 160 65" stroke="#E87525" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" />
                    {/* Steam Line 3: '4' shape */}
                    <path d="M172 115 C175 95 180 85 175 70" stroke="#E87525" strokeWidth="2" strokeLinecap="round" />
                  </g>

                  {/* Wooden Tong Table / Bench Top */}
                  <ellipse cx="160" cy="230" rx="110" ry="24" fill="#F5F0E6" stroke="#171717" strokeWidth="2.5" />
                  <ellipse cx="160" cy="234" rx="110" ry="24" stroke="#171717" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.4" />
                  
                  {/* Table Legs */}
                  <path d="M75 240 L65 290" stroke="#171717" strokeWidth="3" strokeLinecap="round" />
                  <path d="M110 248 L105 295" stroke="#171717" strokeWidth="3" strokeLinecap="round" />
                  <path d="M210 248 L215 295" stroke="#171717" strokeWidth="3" strokeLinecap="round" />
                  <path d="M245 240 L255 290" stroke="#171717" strokeWidth="3" strokeLinecap="round" />
                  <path d="M70 280 L250 280" stroke="#171717" strokeWidth="2" strokeOpacity="0.3" strokeDasharray="4 4" />

                  {/* Loose Paper Note with Hand-Drawn Question Mark */}
                  <g transform="translate(85, 175) rotate(-8)">
                    <rect x="0" y="0" width="55" height="42" fill="#F5F0E6" stroke="#171717" strokeWidth="1.5" />
                    <path d="M5 5 L50 5" stroke="#171717" strokeWidth="1" opacity="0.2" />
                    <path d="M5 12 L40 12" stroke="#171717" strokeWidth="1" opacity="0.2" />
                    {/* Big Question Mark */}
                    <text x="22" y="32" fontFamily="Barlow Condensed, sans-serif" fontSize="26" fontWeight="bold" fill="#E87525">?</text>
                  </g>

                  {/* Traditional Bengali Tea Glass on Table */}
                  <g transform="translate(142, 125)">
                    {/* Glass Body Rim & Sides */}
                    <path d="M5 10 L31 10 L28 85 L8 85 Z" fill="#F5F0E6" stroke="#171717" strokeWidth="2" />
                    {/* Tea Fluid Level (Orange fill) */}
                    <path d="M7 32 L29 32 L27.2 83 L8.8 83 Z" fill="#E87525" opacity="0.85" />
                    {/* Glass Vertical Ridges */}
                    <line x1="12" y1="12" x2="11" y2="83" stroke="#171717" strokeWidth="1" opacity="0.3" />
                    <line x1="18" y1="12" x2="18" y2="83" stroke="#171717" strokeWidth="1" opacity="0.3" />
                    <line x1="24" y1="12" x2="25" y2="83" stroke="#171717" strokeWidth="1" opacity="0.3" />
                    {/* Top Oval Rim */}
                    <ellipse cx="18" cy="10" rx="13" ry="4" fill="#F5F0E6" stroke="#171717" strokeWidth="2" />
                  </g>

                  {/* Empty Stool Silhouette on Left */}
                  <g transform="translate(30, 195) rotate(-5)">
                    <rect x="0" y="0" width="40" height="8" rx="2" fill="#171717" opacity="0.15" stroke="#171717" strokeWidth="1.5" />
                    <line x1="6" y1="8" x2="2" y2="40" stroke="#171717" strokeWidth="2" />
                    <line x1="34" y1="8" x2="38" y2="40" stroke="#171717" strokeWidth="2" />
                  </g>
                </svg>

                {/* Caption Badge below SVG */}
                <div className="absolute bottom-3 right-3 font-mono text-[10px] text-[#171717]/50 uppercase tracking-widest bg-[#F5F0E6] px-2 py-0.5 border border-[#171717]/10">
                  EMPTY BENCH
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Minimal Branded Footer */}
      <footer className="py-5 px-4 sm:px-8 border-t border-[rgba(23,23,23,0.08)] bg-[#F5F0E6]">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left font-sans text-xs text-[#171717]/60">
          <div>
            © {new Date().getFullYear()} Affan er Tong • Debate learning over conversation and tea.
          </div>
          <div>
            <a
              href={SITE_DATA.brand.facebookPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#E87525] transition-colors inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-[#171717]/70"
            >
              <span>FACEBOOK COMMUNITY</span>
              <ArrowUpRight className="w-3 h-3 text-[#E87525]" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
