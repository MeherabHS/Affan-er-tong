"use client";

import Image from "next/image";
import { ArrowUpRight, Lock, Video } from "lucide-react";
import { LearningModule } from "@/content/learning-path";

interface ModuleRowProps {
  module: LearningModule;
  index: number;
}

export default function ModuleRow({ module, index }: ModuleRowProps) {
  const isEven = index % 2 === 1; // Alternating odd/even index
  const modNum = (index + 1).toString().padStart(2, "0");
  const isAvailable = module.status !== "coming-soon" && Boolean(module.youtubeUrl);

  const StatusBadge = () => {
    switch (module.status) {
      case "available":
        return (
          <span className="px-2.5 py-1 text-[11px] font-condensed font-bold uppercase tracking-wider border border-[#E87525] text-[#E87525]">
            AVAILABLE
          </span>
        );
      case "updated":
        return (
          <span className="px-2.5 py-1 text-[11px] font-condensed font-bold uppercase tracking-wider border border-[#E87525] text-[#E87525] bg-[#E87525]/10">
            UPDATED
          </span>
        );
      case "coming-soon":
      default:
        return (
          <span className={`px-2.5 py-1 text-[11px] font-condensed font-bold uppercase tracking-wider border ${
            isEven ? "border-[#F5F0E6]/30 text-[#F5F0E6]/60" : "border-[#171717]/30 text-[#171717]/60"
          }`}>
            COMING SOON
          </span>
        );
    }
  };

  const isSafeUrl = (url?: string) => {
    if (!url) return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const RowWrapper = ({ children }: { children: React.ReactNode }) => {
    if (isAvailable && module.youtubeUrl && isSafeUrl(module.youtubeUrl)) {
      return (
        <a
          href={module.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Watch ${module.title} on YouTube`}
          className={`block border border-[#171717]/15 transition-all group ${
            isEven
              ? "bg-[#171717] text-[#F5F0E6] hover:bg-[#222730]"
              : "bg-[#F5F0E6] text-[#171717] hover:bg-[#D7D0C4]/40"
          }`}
        >
          {children}
        </a>
      );
    }

    return (
      <div
        className={`block border border-[#171717]/15 opacity-80 ${
          isEven ? "bg-[#171717] text-[#F5F0E6]" : "bg-[#F5F0E6] text-[#171717]"
        }`}
      >
        {children}
      </div>
    );
  };

  return (
    <RowWrapper>
      <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Section: Number + Thumbnail + Title/Summary */}
        <div className="flex items-center gap-4 flex-1">
          
          {/* 56px Number */}
          <span className="font-condensed text-2xl sm:text-3xl font-extrabold w-10 sm:w-14 shrink-0 text-[#E87525]">
            {modNum}
          </span>

          {/* 72x72px Square Thumbnail */}
          <div className="relative w-16 h-16 sm:w-18 sm:h-18 shrink-0 border border-[#171717]/15 overflow-hidden bg-[#171717] flex items-center justify-center">
            {module.thumbnailUrl ? (
              <Image
                src={module.thumbnailUrl}
                alt={module.title}
                width={72}
                height={72}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-[#171717] flex items-center justify-center text-[#F5F0E6]">
                <Video className="w-6 h-6 opacity-40" />
              </div>
            )}
          </div>

          {/* Module Title & Short Summary */}
          <div className="space-y-1 flex-1 pr-2">
            <h3 className="font-condensed text-xl sm:text-2xl tracking-wider uppercase leading-snug group-hover:text-[#E87525] transition-colors">
              {module.title}
            </h3>
            <p className={`text-xs font-sans line-clamp-1 ${
              isEven ? "text-[#F5F0E6]/80" : "text-[#171717]/80"
            }`}>
              {module.summary}
            </p>
          </div>

        </div>

        {/* Right Section: Level + Duration + Source + Status + Arrow */}
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between md:justify-end gap-4 md:gap-6 font-sans text-xs shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[#171717]/15">
          
          {/* Level */}
          <div className="w-24 text-left">
            <span className="text-[10px] uppercase font-mono block text-[#171717]/50 dark:text-[#F5F0E6]/50 md:hidden">LEVEL</span>
            <span className="font-bold uppercase tracking-wider">{module.level || "General"}</span>
          </div>

          {/* Duration */}
          <div className="w-20 text-left">
            <span className="text-[10px] uppercase font-mono block text-[#171717]/50 dark:text-[#F5F0E6]/50 md:hidden">DURATION</span>
            <span className="font-mono">{module.duration || "--"}</span>
          </div>

          {/* Source */}
          <div className="w-32 text-left truncate">
            <span className="text-[10px] uppercase font-mono block text-[#171717]/50 dark:text-[#F5F0E6]/50 md:hidden">SOURCE</span>
            <span className="truncate">{module.sourceName || "Affan er Tong"}</span>
          </div>

          {/* Status Badge */}
          <div className="w-28 text-left">
            <StatusBadge />
          </div>

          {/* Arrow / Action */}
          <div className="w-10 flex items-center justify-end">
            {isAvailable ? (
              <ArrowUpRight className="w-5 h-5 text-[#E87525] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            ) : (
              <Lock className="w-4 h-4 text-[#171717]/40 dark:text-[#F5F0E6]/40" />
            )}
          </div>

        </div>

      </div>
    </RowWrapper>
  );
}
