"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import AdminSidebar from "@/components/admin/AdminSidebar";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [accessDenied, setAccessDenied] = useState<boolean>(false);

  useEffect(() => {
    async function verifyAdminAccess() {
      if (isSupabaseConfigured && supabase) {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError || !userData.user) {
          router.push("/sign-in?next=/admin");
          return;
        }

        const authUser = userData.user;

        const { data: profile } = await supabase
          .from("profiles")
          .select("id, display_name, role, account_status")
          .eq("id", authUser.id)
          .single();

        if (!profile || profile.role !== "admin" || profile.account_status !== "active") {
          setAccessDenied(true);
          setLoading(false);
          return;
        }

        setUser({
          id: profile.id,
          email: authUser.email || "",
          name: profile.display_name || authUser.email?.split("@")[0] || "Administrator",
          role: profile.role,
        });
        setLoading(false);
      } else {
        // Fail Closed: If Supabase is unconfigured, do NOT grant admin access via localStorage.
        setAccessDenied(true);
        setLoading(false);
      }
    }

    verifyAdminAccess();
  }, [router]);

  const handleSignOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    router.push("/sign-in");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E6] text-[#171717] flex flex-col items-center justify-center font-mono text-xs space-y-3">
        <div className="w-8 h-8 border-4 border-[#E87525] border-t-transparent animate-spin rounded-full" />
        <p className="font-bold text-[#E87525] uppercase tracking-wider">Verifying Administrator Authorization...</p>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-[#F5F0E6] text-[#171717] flex flex-col justify-between font-sans selection:bg-[#E87525] selection:text-[#F5F0E6]">
        <header className="py-6 px-6 sm:px-12 border-b border-[#171717]/10 flex items-center justify-between">
          <Link href="/" className="inline-block">
            <div className="w-[140px] sm:w-[170px] h-auto relative bg-[#F5F0E6] p-1.5 border border-[#171717]/20">
              <Image
                src="/logo.webp"
                alt="Affan er Tong Official Logo"
                width={170}
                height={90}
                priority
                className="object-contain w-full h-auto"
              />
            </div>
          </Link>
          <span className="font-mono text-xs font-bold text-[#E87525] uppercase tracking-wider">
            ERROR 403
          </span>
        </header>

        <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="max-w-md w-full text-center space-y-6 bg-white p-8 border border-[#171717]/20 shadow-xl">
            <div className="w-14 h-14 rounded-full bg-[#E87525]/10 text-[#E87525] flex items-center justify-center mx-auto border border-[#E87525]/30">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h1 className="font-condensed text-4xl uppercase tracking-wider text-[#171717]">
                ACCESS DENIED
              </h1>
              <p className="text-sm text-[#171717]/80 leading-relaxed font-sans font-medium">
                Your account is currently registered as a standard debater. Only authorized administrators can access the <strong className="text-[#E87525]">/admin</strong> control panel.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-3 font-condensed text-sm uppercase">
              <Link
                href="/"
                className="w-full py-3 bg-[#E87525] text-[#F5F0E6] font-bold uppercase tracking-wider hover:bg-[#171717] transition-colors flex items-center justify-center gap-2 border border-[#171717]/20 min-h-[44px]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Public Website</span>
              </Link>
            </div>
          </div>
        </main>

        <footer className="py-6 px-6 border-t border-[#171717]/10 text-center font-mono text-xs text-[#171717]/50">
          © {new Date().getFullYear()} Affan er Tong Security System
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E6] text-[#171717] flex flex-col lg:flex-row font-sans selection:bg-[#E87525] selection:text-[#F5F0E6]">
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <AdminSidebar
        userName={user?.name}
        userEmail={user?.email}
        onSignOut={handleSignOut}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
