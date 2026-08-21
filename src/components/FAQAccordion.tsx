"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { FAQ_ITEMS, FAQItem } from "@/content/faq";

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      className="bg-[#F5F0E6] text-[#171717] py-12 md:py-20 border-b border-[#171717]/10 paper-grain scroll-mt-20 relative"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Header */}
          <div className="lg:col-span-4 space-y-2">
            <h2 className="font-condensed text-[clamp(2.5rem,8vw,5.5rem)] uppercase text-[#171717] leading-none">
              FAQ
            </h2>
            <div className="w-16 h-1.5 bg-[#E87525] mt-2 mb-3" />
            <p className="text-sm sm:text-base text-[#171717]/80 font-sans leading-relaxed">
              Find answers to common questions about joining our open debate-learning community.
            </p>
          </div>

          {/* Accordion List */}
          <div className="lg:col-span-8 space-y-2">
            {FAQ_ITEMS.map((item: FAQItem, idx: number) => {
              const isOpen = openIndex === idx;
              const contentId = `faq-content-${idx}`;
              const buttonId = `faq-button-${idx}`;

              return (
                <div
                  key={idx}
                  className="border-b border-[#171717]/15 pb-2 transition-colors"
                >
                  <button
                    id={buttonId}
                    aria-controls={contentId}
                    aria-expanded={isOpen}
                    onClick={() => toggleAccordion(idx)}
                    className="w-full text-left flex items-center justify-between py-4 font-sans font-bold text-base sm:text-xl text-[#171717] hover:text-[#E87525] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E87525] px-1 min-h-[48px] pr-2"
                  >
                    <span className="pr-4 leading-snug break-words">{item.question}</span>
                    <div className="w-8 h-8 border border-[#171717]/20 flex items-center justify-center shrink-0 ml-2 bg-white">
                      {isOpen ? <Minus className="w-4 h-4 text-[#E87525]" /> : <Plus className="w-4 h-4 text-[#171717]" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      id={contentId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="overflow-hidden transition-all duration-200"
                    >
                      <p className="text-sm sm:text-base text-[#171717]/80 pt-1 pb-4 leading-relaxed font-sans pr-4">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
