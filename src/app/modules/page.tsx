"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import ModuleRow from "@/components/ModuleRow";
import { LEARNING_PATH_MODULES, LearningModule } from "@/content/learning-path";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface UserProfile {
  email: string;
  name: string;
}

export default function ModulesPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authIntent, setAuthIntent] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [modules, setModules] = useState<LearningModule[]>(LEARNING_PATH_MODULES);

  useEffect(() => {
    document.title = "Learning Path | Affan er Tong";

    async function checkUserAndLoadModules() {
      if (isSupabaseConfigured && supabase) {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session?.user) {
          const u = sessionData.session.user;
          setUser({
            email: u.email || "",
            name: u.user_metadata?.display_name || u.email?.split("@")[0] || "Debater",
          });
        }

        try {
          const { data: dbMods, error } = await supabase
            .from("learning_modules")
            .select("*")
            .in("status", ["published", "coming_soon"])
            .order("sort_order", { ascending: true });

          if (!error && dbMods && dbMods.length > 0) {
            const mapped: LearningModule[] = dbMods.map((m) => ({
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
          console.error("Fetch all modules error", e);
        }
      } else {
        try {
          const savedUser = localStorage.getItem("at_debate_user");
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        } catch (e) {
          console.error("Failed to load saved user", e);
        }
      }
    }

    checkUserAndLoadModules();
  }, []);

  const handleOpenAuth = (intent?: string) => {
    setAuthIntent(intent);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (u: UserProfile) => {
    setUser(u);
    try {
      localStorage.setItem("at_debate_user", JSON.stringify(u));
    } catch (e) {
      console.error("Failed to save local user", e);
    }
  };

  const handleSignOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    try {
      localStorage.removeItem("at_debate_user");
    } catch (e) {
      console.error("Failed to remove user", e);
    }
  };

  const filters = ["All", "Beginner", "Intermediate", "Advanced", "Available"];

  const filteredModules = modules.filter((mod) => {
    const matchesFilter =
      activeFilter === "All"
        ? true
        : activeFilter === "Available"
        ? mod.status !== "coming-soon"
        : mod.level === activeFilter;

    const matchesSearch =
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (mod.level && mod.level.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (mod.sourceName && mod.sourceName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E6] text-[#171717] font-sans selection:bg-[#E87525] selection:text-[#F5F0E6]">
      <Header
        user={user}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
      />

      <main id="main-content" className="flex-1 py-10 md:py-16 paper-grain">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
          
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-condensed font-bold uppercase tracking-wider text-[#171717] hover:text-[#E87525] transition-colors min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4 text-[#E87525]" />
              <span>Back to Homepage</span>
            </Link>
          </div>

          <div className="pb-6 border-b border-[#171717]/15 mb-8">
            <div className="text-xs font-condensed font-bold uppercase tracking-wider text-[#E87525] mb-2">
              FULL SYLLABUS ARCHIVE
            </div>
            <h1 className="font-condensed text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.88] uppercase text-[#171717]">
              ALL MODULES
            </h1>
            <p className="text-base sm:text-lg text-[#171717]/80 font-sans mt-3 font-medium max-w-2xl">
              Explore the current Affan er Tong learning path and choose a topic to begin.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row-reverse gap-4 justify-between items-stretch sm:items-center mb-8">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#171717]/60" />
              <input
                type="text"
                placeholder="Search modules…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#171717]/20 text-xs text-[#171717] placeholder-[#171717]/60 focus:outline-none focus:border-[#E87525]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3.5 py-2 font-condensed text-xs uppercase tracking-wider border border-[#171717]/15 transition-colors min-h-[44px] ${
                    activeFilter === filter
                      ? "bg-[#171717] text-[#F5F0E6]"
                      : "bg-[#F5F0E6] text-[#171717] hover:bg-[#171717]/10"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

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

          {filteredModules.length > 0 ? (
            <div className="space-y-2">
              {filteredModules.map((mod: LearningModule, idx: number) => (
                <ModuleRow key={mod.id} module={mod} index={idx} />
              ))}
            </div>
          ) : (
            <div className="p-12 border border-[#171717]/15 bg-white text-center text-[#171717] font-sans my-8">
              <p className="font-bold text-base">No learning modules match your search filter.</p>
            </div>
          )}

        </div>
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        actionIntent={authIntent}
      />

      <Footer />
    </div>
  );
}
