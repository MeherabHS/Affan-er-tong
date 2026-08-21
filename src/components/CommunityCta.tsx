import Image from "next/image";
import { ArrowUpRight, Users } from "lucide-react";
import { SITE_DATA } from "@/content/site";

export default function CommunityCta() {
  const { communityCta } = SITE_DATA;

  return (
    <section className="bg-[#F5F0E6] py-10 md:py-16 border-b border-[#171717]/10 paper-grain overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        
        {/* Logo-Orange Poster Panel CTA */}
        <div className="bg-[#E87525] text-[#F5F0E6] border border-[#171717]/20 p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-md">
          
          {/* Subtle Halftone Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#171717_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

          {/* Balanced 1-Col on Mobile/Tablet (<1024px), 2-Col on Desktop */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column Copy & Actions */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#171717] text-[#F5F0E6] font-condensed font-bold text-xs uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-[#E87525]" />
                <span>{communityCta.badge}</span>
              </div>

              <h2 className="font-condensed text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.88] uppercase text-[#F5F0E6]">
                {communityCta.heading}
              </h2>

              <p className="text-base sm:text-lg text-[#F5F0E6]/90 font-sans font-medium leading-relaxed max-w-2xl">
                {communityCta.subtext}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <a
                  href={communityCta.facebookGroupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#171717] text-[#F5F0E6] hover:bg-[#F5F0E6] hover:text-[#171717] font-condensed text-base sm:text-lg font-bold uppercase tracking-wider transition-colors border border-[#171717]/20 flex items-center justify-center gap-2 group min-h-[44px]"
                >
                  <span>{communityCta.primaryButtonText}</span>
                  <ArrowUpRight className="w-5 h-5 text-[#E87525] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>

                <a
                  href={SITE_DATA.brand.facebookPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3.5 border border-[#F5F0E6]/40 text-[#F5F0E6] hover:bg-[#F5F0E6] hover:text-[#171717] font-condensed text-base sm:text-lg font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <span>OFFICIAL FACEBOOK PAGE ↗</span>
                </a>
              </div>
            </div>

            {/* Right Column Natural Tong Adda Illustration */}
            <div className="lg:col-span-5 flex justify-center items-center mt-6 lg:mt-0">
              <div className="relative w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[420px] bg-[#F5F0E6] p-3 sm:p-4 border border-[#171717]/20 shadow-xs transform rotate-[0.5deg] hover:rotate-0 transition-transform duration-300">
                <div className="relative aspect-square w-full flex items-center justify-center select-none">
                  <Image
                    src="/community-adda-illustration.webp"
                    alt="Young debaters sharing ideas around a tong table"
                    width={420}
                    height={420}
                    sizes="(max-width: 768px) 280px, (max-width: 1200px) 340px, 420px"
                    loading="lazy"
                    draggable={false}
                    className="object-contain w-full h-full select-none pointer-events-none"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
