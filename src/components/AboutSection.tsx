import { SITE_DATA } from "@/content/site";

export default function AboutSection() {
  const { about } = SITE_DATA;

  return (
    <section
      id="about"
      className="bg-[#F5F0E6] text-[#171717] py-12 md:py-20 border-b border-[#171717]/10 paper-grain scroll-mt-20 relative"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Heading & Label */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-condensed font-bold uppercase tracking-wider text-[#E87525]">
              {about.sectionLabel}
            </div>
            <h2 className="font-condensed text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.88] uppercase text-[#171717]">
              {about.title}
            </h2>
          </div>

          {/* Right Column: Verified Story */}
          <div className="lg:col-span-7 space-y-5 font-sans text-base sm:text-lg text-[#171717]/90 leading-relaxed font-medium">
            <p className="border-l-4 border-[#E87525] pl-4 sm:pl-6 text-base sm:text-xl font-semibold text-[#171717]">
              {about.paragraphs[0]}
            </p>

            {about.paragraphs.slice(1).map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}

            <div className="pt-4 border-t border-[#171717]/15 flex flex-wrap items-center justify-between gap-2 text-xs font-mono uppercase tracking-wider text-[#625E57] min-h-[44px]">
              <span>Official Community Link</span>
              <a
                href={SITE_DATA.brand.facebookPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E87525] font-bold hover:underline min-h-[44px] flex items-center"
              >
                facebook.com/Affan-er-Tong ↗
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
