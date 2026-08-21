"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SITE_DATA } from "@/content/site";
import { featuredModules, LearningModule } from "@/content/learning-path";
import ModuleRow from "@/components/ModuleRow";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function LearningPathSection() {
  const { learningPath } = SITE_DATA;
  const [modules, setModules] = useState<LearningModule[]>(featuredModules);

  useEffect(() => {
    async function loadPublishedModules() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from("learning_modules")
            .select("id, module_number, slug, title, summary, level, duration, source_name, youtube_url, youtube_id, thumbnail_url, status, sort_order")
            .in("status", ["published", "coming_soon"])
            .order("sort_order", { ascending: true })
            .limit(3);

          if (!error && data && data.length > 0) {
            const mapped: LearningModule[] = data.map((m) => ({
              id: m.slug || m.id,
              order: m.module_number,
              slug: m.slug || m.id,
              title: m.title,
              summary: m.summary,
              level: (m.level as "Beginner" | "Intermediate" | "Advanced") || "Beginner",
              duration: m.duration || "15 min",
              sourceName: m.source_name || "Affan er Tong",
              youtubeUrl: m.youtube_url || "",
              youtubeId: m.youtube_id || "",
              thumbnailUrl: m.thumbnail_url || "",
              status: m.status === "coming_soon" ? "coming-soon" : "available",
              badgeText: m.status === "coming_soon" ? "COMING SOON" : "AVAILABLE",
            }));
            setModules(mapped);
          }
        } catch (e) {
          console.error("Fetch homepage modules error", e);
        }
      }
    }

    loadPublishedModules();
  }, []);

  return (
    <section
      id="learning-path"
      className="bg-[#F5F0E6] text-[#171717] py-16 md:py-24 border-b border-[#171717]/10 paper-grain scroll-mt-20 relative"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-[#171717]/15">
          <div>
            <div className="text-xs font-condensed font-bold uppercase tracking-wider text-[#E87525] mb-2">
              {learningPath.sectionLabel}
            </div>
            <h2 className="font-condensed text-6xl sm:text-7xl lg:text-8xl leading-[0.88] uppercase text-[#171717]">
              {learningPath.title}
            </h2>
            <p className="text-base sm:text-lg text-[#171717]/80 font-sans mt-3 font-medium">
              {learningPath.supportingText}
            </p>
          </div>
        </div>

        {/* Desktop Editorial Table Header */}
        <div className="hidden md:flex items-center justify-between px-5 py-2.5 bg-[#171717] text-[#F5F0E6] font-mono text-[11px] uppercase tracking-wider font-bold mb-2 border border-[#171717]/15">
          <div className="flex items-center gap-4 flex-1">
            <span className="w-14 shrink-0">#</span>
            <span className="w-18 shrink-0">THUMB</span>
            <span>MODULE</span>
          </div>
          <div className="flex items-center justify-end gap-6 text-right shrink-0">
            <span className="w-24 text-left">LEVEL</span>
            <span className="w-20 text-left">DURATION</span>
            <span className="w-32 text-left">SOURCE</span>
            <span className="w-28 text-left">STATUS</span>
            <span className="w-10 text-right">LINK</span>
          </div>
        </div>

        {/* Compact Table/List Rows (Exactly 3 Published Modules) */}
        <div className="space-y-2">
          {modules.map((mod: LearningModule, idx: number) => (
            <ModuleRow key={mod.id} module={mod} index={idx} />
          ))}
        </div>

        {/* Bottom Action: SEE ALL MODULES Link */}
        <div className="mt-8 pt-6 border-t border-[#171717]/15">
          <Link
            href="/modules"
            className="inline-flex items-center justify-between w-full p-4 border border-[#171717]/20 bg-[#F5F0E6] hover:bg-[#171717] hover:text-[#F5F0E6] font-condensed text-xl uppercase font-bold tracking-wider transition-colors group min-h-[44px]"
          >
            <span>SEE ALL MODULES ↗</span>
            <div className="flex items-center gap-2 text-[#E87525] group-hover:text-[#F5F0E6]">
              <span className="text-sm font-sans uppercase font-bold tracking-wider">Full Syllabus Archive</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </Link>
        </div>

      </div>
    </section>
  );
}
