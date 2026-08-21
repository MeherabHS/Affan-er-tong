import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SITE_DATA } from "@/content/site";

export default function Footer() {
  return (
    <footer className="bg-[#171717] text-[#F5F0E6] py-12 sm:py-16 border-t-4 border-[#E87525] relative overflow-hidden">
      
      {/* Subtle Steam-line Accent Motif at top edge */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30 pointer-events-none">
        <svg width="120" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 20 C 15 10, 20 15, 25 5" stroke="#E87525" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M40 22 C 45 12, 50 17, 55 7" stroke="#E87525" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M70 20 C 75 10, 80 15, 85 5" stroke="#E87525" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M100 22 C 105 12, 110 17, 115 7" stroke="#E87525" strokeWidth="2" strokeDasharray="3 3" />
        </svg>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        
        {/* 2-Column Responsive Layout for Mobile/Tablet/Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 items-start pb-10 border-b border-[#F5F0E6]/15">
          
          {/* Left Main Column: Brand Logo & Tagline (~6 Cols on Desktop) */}
          <div className="lg:col-span-6 space-y-4">
            <Link href="/" className="inline-block">
              <div className="w-[150px] sm:w-[180px] h-auto relative bg-[#F5F0E6] p-2 border border-[#F5F0E6]/30">
                <Image
                  src="/logo.webp"
                  alt="Affan er Tong Official Logo"
                  width={180}
                  height={95}
                  className="object-contain w-full h-auto"
                />
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-[#F5F0E6]/75 max-w-md leading-relaxed font-sans font-medium">
              {SITE_DATA.footer.tagline}
            </p>
          </div>

          {/* Right Column: Quick Navigation & Community Links Grid (~6 Cols on Desktop split 2-col) */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-6 sm:gap-8">
            
            {/* Nav Links */}
            <div className="space-y-3 font-condensed text-xs sm:text-sm uppercase tracking-wider">
              <div className="text-xs font-mono text-[#E87525] font-bold">NAVIGATION</div>
              <ul className="space-y-2">
                <li>
                  <a href="#why-tong" className="hover:text-[#E87525] transition-colors">Why Tong</a>
                </li>
                <li>
                  <a href="#learning-path" className="hover:text-[#E87525] transition-colors">Learning Path</a>
                </li>
                <li>
                  <a href="#video-library" className="hover:text-[#E87525] transition-colors">Video Library</a>
                </li>
                <li>
                  <a href="#open-floor" className="hover:text-[#E87525] transition-colors">Open Floor</a>
                </li>
                <li>
                  <a href="#about" className="hover:text-[#E87525] transition-colors">About</a>
                </li>
              </ul>
            </div>

            {/* Community Info */}
            <div className="space-y-3 font-sans text-xs">
              <div className="font-mono text-[#E87525] font-bold text-xs uppercase">COMMUNITY</div>
              <p className="text-[#F5F0E6]/70 leading-relaxed text-[11px] sm:text-xs">
                Connect with debaters and stay updated on upcoming learning sessions.
              </p>
              <a
                href={SITE_DATA.brand.facebookPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-2 border border-[#F5F0E6]/40 text-[#F5F0E6] hover:bg-[#E87525] hover:border-[#E87525] transition-colors font-condensed text-[11px] sm:text-xs uppercase font-bold tracking-wider"
              >
                <span>Facebook Page</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#F5F0E6]/60 gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Affan er Tong. {SITE_DATA.footer.copyrightNote}</p>
          
          <div className="flex items-center gap-1.5 justify-center sm:justify-end">
            <span>Engineered &amp; Managed by</span>
            <a
              href="https://meherabhs.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E87525] hover:underline font-bold inline-flex items-center gap-0.5"
            >
              <span>MHS</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
