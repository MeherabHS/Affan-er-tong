"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MotionStrip from "@/components/MotionStrip";
import WhyTongSection from "@/components/WhyTongSection";
import LearningPathSection from "@/components/LearningPathSection";
import VideoLibrarySection from "@/components/VideoLibrarySection";
import QnASection from "@/components/QnASection";
import CommunityCTA from "@/components/CommunityCta";
import AboutSection from "@/components/AboutSection";
import FAQAccordion from "@/components/FAQAccordion";
import Footer from "@/components/Footer";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const AuthModal = dynamic(() => import("@/components/AuthModal"), {
  ssr: false,
});

interface UserProfile {
  email: string;
  name: string;
}

export default function Home() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authIntent, setAuthIntent] = useState<string | undefined>(undefined);
  const [showOnlyMyQuestions, setShowOnlyMyQuestions] = useState<boolean>(false);

  useEffect(() => {
    async function checkUser() {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          const u = data.session.user;
          setUser({
            email: u.email || "",
            name: u.user_metadata?.display_name || u.email?.split("@")[0] || "Debater"
          });
        }

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user) {
            setUser({
              email: session.user.email || "",
              name: session.user.user_metadata?.display_name || session.user.email?.split("@")[0] || "Debater"
            });
          } else {
            setUser(null);
          }
        });

        return () => {
          authListener.subscription.unsubscribe();
        };
      } else {
        try {
          const savedUser = localStorage.getItem("at_debate_user");
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        } catch (e) {
          console.error("Failed to load saved user session", e);
        }
      }
    }

    checkUser();
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
    setShowOnlyMyQuestions(false);
    try {
      localStorage.removeItem("at_debate_user");
    } catch (e) {
      console.error("Failed to remove user", e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E6] text-[#171717] font-sans selection:bg-[#E87525] selection:text-[#F5F0E6]">
      
      {/* 1. Header */}
      <Header
        user={user}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
        onFilterMyQuestions={() => setShowOnlyMyQuestions(true)}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        {/* 2. Hero */}
        <HeroSection />

        {/* 3. Motion Strip */}
        <MotionStrip />

        {/* 4. Why Tong */}
        <WhyTongSection />

        {/* 5. Learning Path */}
        <LearningPathSection />

        {/* 6. Video Library */}
        <VideoLibrarySection />

        {/* 7. Open Floor */}
        <QnASection
          user={user}
          onRequireAuth={(intent) => handleOpenAuth(intent)}
          showOnlyMyQuestions={showOnlyMyQuestions}
        />

        {/* 8. Join the Adda CTA */}
        <CommunityCTA />

        {/* 9. About */}
        <AboutSection />

        {/* 10. FAQ */}
        <FAQAccordion />
      </main>

      {/* Auth Modal (Dynamically Imported) */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
          actionIntent={authIntent}
        />
      )}

      {/* 11. Footer */}
      <Footer />
    </div>
  );
}
