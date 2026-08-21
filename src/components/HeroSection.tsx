import Image from "next/image";
import { SITE_DATA } from "@/content/site";

export default function HeroSection() {
  return (
    <section className="bg-[#F5F0E6] text-[#171717] py-10 md:py-16 border-b border-[#171717]/10 relative paper-grain overflow-hidden">
      
      {/* Left side Vertical Label "TONG" - Only on Desktop */}
      <div className="hidden lg:flex flex-col items-center justify-center absolute left-6 top-1/2 -translate-y-1/2 space-y-4 pointer-events-none">
        <div className="w-[1px] h-12 bg-[#171717]/20" />
        <span className="font-condensed text-xs text-[#E87525] tracking-widest uppercase origin-center -rotate-90 py-4 border border-[#E87525]/30 px-2 bg-[#F5F0E6]">
          TONG
        </span>
        <div className="w-[1px] h-12 bg-[#171717]/20" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column Content: Headline & Subheading */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            {/* Orange Brushstroke Accent */}
            <div className="origin-left">
              <svg width="90" height="9" viewBox="0 0 100 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 5C30 2 70 2 98 5C75 8 35 8 2 5Z" fill="#E87525" />
              </svg>
            </div>

            {/* Main Headline with Responsive Fluid Clamp */}
            <h1 className="font-condensed text-[clamp(2.5rem,11vw,5.5rem)] leading-[0.86] tracking-tight uppercase text-[#171717] break-words">
              {SITE_DATA.brand.headlineFirst}<br />
              {SITE_DATA.brand.headlineSecond}<br />
              <span className="text-[#E87525]">{SITE_DATA.brand.headlineThird.slice(0, -1)}</span>
              <span className="text-[#171717]">.</span>
            </h1>

            {/* Supporting Line */}
            <div className="pt-1 space-y-2">
              <p className="text-base sm:text-xl font-semibold text-[#171717] tracking-tight font-sans leading-snug">
                {SITE_DATA.brand.subheading}
              </p>
              
              {/* Hand-drawn underline */}
              <svg width="150" height="10" viewBox="0 0 160 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-w-full">
                <path d="M4 7 C 45 2, 105 10, 156 5" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 156 5 L 146 3" stroke="#171717" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>

          </div>

          {/* Right Column Megaphone Artwork (inlined) */}
          <div className="lg:col-span-5 flex justify-center py-2 lg:py-0">
            <div className="w-full max-w-[260px] sm:max-w-[320px] lg:max-w-none">
              <div className="relative w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[340px] aspect-square flex items-center justify-center p-2 mx-auto">
                <div className="relative w-full h-full transform -rotate-6 hover:rotate-0 transition-transform duration-300 flex items-center justify-center">
                  <Image
                    src="/hero-megaphone.webp"
                    alt="" // Purely decorative background artwork
                    width={340}
                    height={340}
                    priority
                    sizes="(max-width: 768px) 280px, (max-width: 1024px) 320px, 340px"
                    className="object-contain w-full h-full mix-blend-multiply"
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
