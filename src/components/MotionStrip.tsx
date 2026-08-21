import { SITE_DATA } from "@/content/site";

const MARQUEE_ITEMS = [
  "DEBATE WITHOUT THE GATEKEEPING",
  "COMMUNITY LEARNING ADDA",
  "DEBATE EDUCATION FOR ALL",
  "OPEN FLOOR Q&A",
  "BANGLADESH DEBATE COMMUNITY"
];
const REPEATED_ITEMS = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

export default function MotionStrip() {

  return (
    <div className="bg-[#171717] text-[#F5F0E6] h-12 sm:h-14 border-y border-[#171717]/10 overflow-hidden select-none flex items-center font-condensed tracking-wider">
      {/* Compact Fixed Label on Left */}
      <div className="shrink-0 bg-[#E87525] text-[#F5F0E6] px-3 sm:px-4 py-1.5 font-bold text-[11px] sm:text-xs uppercase z-10 border-r border-[#171717]/20 flex items-center">
        <span>{SITE_DATA.brand.marqueeLabel}</span>
      </div>

      {/* Single-Line Marquee Ticker */}
      <div className="animate-marquee-slow flex items-center whitespace-nowrap text-xs sm:text-sm font-bold uppercase">
        {REPEATED_ITEMS.map((item, idx) => (
          <span key={idx} className="mx-4 sm:mx-6 flex items-center gap-4 sm:gap-6 shrink-0">
            <span>{item}</span>
            <span className="text-[#E87525] font-bold">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
