"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import VideoLibrarySection from "@/components/VideoLibrarySection";
import Footer from "@/components/Footer";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const AuthModal = dynamic(() => import("@/components/AuthModal"), {
  ssr: false,
});

interface UserProfile {
  email: string;
  name: string;
  role?: string;
}

export default function VideoLibraryPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authIntent, setAuthIntent] = useState<string | undefined>(undefined);

  useEffect(() => {
    document.title = "Video Library | Affan er Tong";

    async function checkUser() {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          const u = data.user;
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", u.id)
            .single();

          setUser({
            email: u.email || "",
            name: u.user_metadata?.display_name || u.email?.split("@")[0] || "Debater",
            role: profile?.role,
          });
        }
      }
    }

    checkUser();
  }, []);

  const handleOpenAuth = (intent?: string) => {
    setAuthIntent(intent);
    setIsAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F0E6] text-[#171717] font-sans selection:bg-[#E87525] selection:text-[#F5F0E6]">
      <Header
        user={user}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
      />

      <main id="main-content" className="flex-1">
        <VideoLibrarySection />
      </main>

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={(u) => setUser(u)}
          actionIntent={authIntent}
        />
      )}

      <Footer />
    </div>
  );
}
