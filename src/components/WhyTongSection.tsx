import { SITE_DATA } from "@/content/site";

export default function WhyTongSection() {
  const { whyTong } = SITE_DATA;

  return (
    <section
      id="why-tong"
      className="bg-[#F5F0E6] text-[#171717] py-12 md:py-20 border-b border-[#171717]/10 paper-grain scroll-mt-20 relative"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        
        {/* Section Header */}
        <div className="pb-6 border-b border-[#171717]/15 mb-8 md:mb-12">
          <div className="text-xs font-condensed font-bold uppercase tracking-wider text-[#E87525] mb-2">
            {whyTong.sectionLabel}
          </div>
          <h2 className="font-condensed text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.88] uppercase text-[#171717]">
            {whyTong.title}
          </h2>
          <p className="text-base sm:text-lg text-[#171717]/80 font-sans mt-3 font-medium max-w-3xl">
            {whyTong.supportingText}
          </p>
        </div>

        {/* 3 Core Pillars: 1-col on mobile, 3-col on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {whyTong.pillars.map((pillar, idx) => (
            <div
              key={pillar.id}
              className="border border-[#171717]/15 p-6 bg-[#F5F0E6] flex flex-col justify-between space-y-6 hover:bg-[#D7D0C4]/30 transition-colors shadow-xs"
            >
              <div className="space-y-4">
                {/* Step Badge */}
                <div className="inline-block px-3 py-1 bg-[#171717] text-[#F5F0E6] font-condensed font-bold text-xs uppercase tracking-wider">
                  PILLAR 0{idx + 1}
                </div>
                
                <h3 className="font-condensed text-2xl sm:text-3xl uppercase tracking-wider text-[#171717] leading-tight">
                  {pillar.title}
                </h3>

                <p className="text-sm text-[#171717]/80 leading-relaxed font-sans">
                  {pillar.description}
                </p>
              </div>

              {/* Accent Line */}
              <div className="pt-4 border-t border-[#171717]/10 flex items-center justify-between font-mono text-[11px] text-[#E87525] uppercase tracking-wider">
                <span>Core Pillar 0{idx + 1}</span>
                <span className="text-[#171717]">→</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
