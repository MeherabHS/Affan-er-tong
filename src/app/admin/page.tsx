"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Video,
  Users,
  Plus,
  ArrowUpRight,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { LEARNING_PATH_MODULES } from "@/content/learning-path";
import { VERIFIED_VIDEOS } from "@/content/video-library";

interface AdminStats {
  publishedModules: number;
  draftModules: number;
  comingSoonModules: number;
  publishedVideos: number;
  draftVideos: number;
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  adminUsers: number;
}

interface AuditItem {
  id: string;
  action: string;
  entity_type: string;
  entity_title: string;
  created_at: string;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats>({
    publishedModules: 0,
    draftModules: 0,
    comingSoonModules: 0,
    publishedVideos: 0,
    draftVideos: 0,
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    adminUsers: 0,
  });
  const [recentLogs, setRecentLogs] = useState<AuditItem[]>([]);

  useEffect(() => {
    async function loadOverviewStats() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: modules } = await supabase
            .from("learning_modules")
            .select("status");

          const { data: videos } = await supabase
            .from("video_resources")
            .select("status");

          const { data: profiles } = await supabase
            .from("profiles")
            .select("role, account_status");

          const { data: logs } = await supabase
            .from("admin_audit_logs")
            .select("id, action, entity_type, entity_title, created_at")
            .order("created_at", { ascending: false })
            .limit(5);

          if (modules || videos || profiles) {
            const modArr = modules || [];
            const vidArr = videos || [];
            const profArr = profiles || [];

            setStats({
              publishedModules: modArr.filter((m) => m.status === "published").length,
              draftModules: modArr.filter((m) => m.status === "draft").length,
              comingSoonModules: modArr.filter((m) => m.status === "coming_soon").length,
              publishedVideos: vidArr.filter((v) => v.status === "published").length,
              draftVideos: vidArr.filter((v) => v.status === "draft").length,
              totalUsers: profArr.length,
              activeUsers: profArr.filter((p) => p.account_status === "active").length,
              suspendedUsers: profArr.filter((p) => p.account_status === "suspended").length,
              adminUsers: profArr.filter((p) => p.role === "admin").length,
            });

            if (logs) {
              setRecentLogs(logs as AuditItem[]);
            }
            return;
          }
        } catch (e) {
          console.error("Supabase overview load error", e);
        }
      }

      const staticMods = LEARNING_PATH_MODULES;
      const staticVids = VERIFIED_VIDEOS;

      setStats({
        publishedModules: staticMods.filter((m) => m.status === "available" || m.status === "updated").length,
        draftModules: 0,
        comingSoonModules: staticMods.filter((m) => m.status === "coming-soon").length,
        publishedVideos: staticVids.length,
        draftVideos: 0,
        totalUsers: 1,
        activeUsers: 1,
        suspendedUsers: 0,
        adminUsers: 1,
      });
    }

    loadOverviewStats();
  }, []);

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="pb-6 border-b border-[#171717]/15 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#E87525] mb-1">
            CONTROL CENTER OVERVIEW
          </div>
          <h1 className="font-condensed text-4xl sm:text-5xl uppercase tracking-wider text-[#171717]">
            ADMIN DASHBOARD
          </h1>
          <p className="text-sm text-[#171717]/80 font-sans mt-1">
            Manage learning path modules, video library resources, user permissions, and audit logs.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/modules/new"
            className="px-4 py-2.5 bg-[#E87525] text-[#F5F0E6] font-condensed text-xs uppercase font-bold tracking-wider hover:bg-[#171717] transition-colors border border-[#171717]/20 flex items-center gap-1.5 min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Module</span>
          </Link>

          <Link
            href="/admin/videos/new"
            className="px-4 py-2.5 bg-[#171717] text-[#F5F0E6] font-condensed text-xs uppercase font-bold tracking-wider hover:bg-[#E87525] transition-colors border border-[#171717]/20 flex items-center gap-1.5 min-h-[44px]"
          >
            <Plus className="w-4 h-4 text-[#E87525]" />
            <span>Add Video Resource</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
        
        {/* Published Modules */}
        <div className="bg-white border border-[#171717]/15 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#171717]/60 font-mono">
            <span>LEARNING PATH</span>
            <BookOpen className="w-4 h-4 text-[#E87525]" />
          </div>
          <div className="text-3xl font-condensed font-extrabold text-[#171717]">
            {stats.publishedModules} <span className="text-xs font-sans text-[#E87525]">PUBLISHED</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#171717]/70 pt-2 border-t border-[#171717]/10 font-mono text-[11px]">
            <span>Drafts: {stats.draftModules}</span>
            <span>•</span>
            <span>Coming Soon: {stats.comingSoonModules}</span>
          </div>
        </div>

        {/* Published Videos */}
        <div className="bg-white border border-[#171717]/15 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#171717]/60 font-mono">
            <span>VIDEO LIBRARY</span>
            <Video className="w-4 h-4 text-[#E87525]" />
          </div>
          <div className="text-3xl font-condensed font-extrabold text-[#171717]">
            {stats.publishedVideos} <span className="text-xs font-sans text-[#E87525]">PUBLISHED</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#171717]/70 pt-2 border-t border-[#171717]/10 font-mono text-[11px]">
            <span>Draft Videos: {stats.draftVideos}</span>
          </div>
        </div>

        {/* Registered Users */}
        <div className="bg-white border border-[#171717]/15 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#171717]/60 font-mono">
            <span>REGISTERED USERS</span>
            <Users className="w-4 h-4 text-[#E87525]" />
          </div>
          <div className="text-3xl font-condensed font-extrabold text-[#171717]">
            {stats.totalUsers} <span className="text-xs font-sans text-[#E87525]">DEBATERS</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#171717]/70 pt-2 border-t border-[#171717]/10 font-mono text-[11px]">
            <span>Active: {stats.activeUsers}</span>
            <span>•</span>
            <span>Suspended: {stats.suspendedUsers}</span>
          </div>
        </div>

        {/* Administrators */}
        <div className="bg-white border border-[#171717]/15 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#171717]/60 font-mono">
            <span>ADMINISTRATORS</span>
            <ShieldCheck className="w-4 h-4 text-[#E87525]" />
          </div>
          <div className="text-3xl font-condensed font-extrabold text-[#171717]">
            {stats.adminUsers} <span className="text-xs font-sans text-[#E87525]">ADMINS</span>
          </div>
          <div className="pt-2 border-t border-[#171717]/10 font-mono text-[11px] text-[#625E57]">
            Database RLS Protected
          </div>
        </div>

      </div>

      {/* Quick Navigation Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
        
        <div className="bg-white border border-[#171717]/15 p-6 space-y-4">
          <h2 className="font-condensed text-2xl uppercase tracking-wider text-[#171717] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#E87525]" />
            <span>Content Management</span>
          </h2>
          <p className="text-xs text-[#171717]/80 leading-relaxed">
            Create, edit, publish, or reorder learning path modules and YouTube video resources. All changes take effect live on the public site via Supabase.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link
              href="/admin/modules"
              className="p-3.5 border border-[#171717]/15 hover:border-[#E87525] transition-colors flex items-center justify-between font-condensed text-sm font-bold uppercase"
            >
              <span>Manage Modules</span>
              <ArrowUpRight className="w-4 h-4 text-[#E87525]" />
            </Link>

            <Link
              href="/admin/videos"
              className="p-3.5 border border-[#171717]/15 hover:border-[#E87525] transition-colors flex items-center justify-between font-condensed text-sm font-bold uppercase"
            >
              <span>Manage Videos</span>
              <ArrowUpRight className="w-4 h-4 text-[#E87525]" />
            </Link>
          </div>
        </div>

        <div className="bg-white border border-[#171717]/15 p-6 space-y-4">
          <h2 className="font-condensed text-2xl uppercase tracking-wider text-[#171717] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#E87525]" />
            <span>User Directory &amp; Security</span>
          </h2>
          <p className="text-xs text-[#171717]/80 leading-relaxed">
            View registered debaters, manage role promotions, suspend accounts, and inspect chronological administrative audit logs.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link
              href="/admin/users"
              className="p-3.5 border border-[#171717]/15 hover:border-[#E87525] transition-colors flex items-center justify-between font-condensed text-sm font-bold uppercase"
            >
              <span>User Directory</span>
              <ArrowUpRight className="w-4 h-4 text-[#E87525]" />
            </Link>

            <Link
              href="/admin/audit-logs"
              className="p-3.5 border border-[#171717]/15 hover:border-[#E87525] transition-colors flex items-center justify-between font-condensed text-sm font-bold uppercase"
            >
              <span>Audit Logs</span>
              <ArrowUpRight className="w-4 h-4 text-[#E87525]" />
            </Link>
          </div>
        </div>

      </div>

      {/* Recent Audit Logs Preview */}
      <div className="bg-white border border-[#171717]/15 p-6 space-y-4 font-sans">
        <div className="flex items-center justify-between pb-3 border-b border-[#171717]/10">
          <h2 className="font-condensed text-2xl uppercase tracking-wider text-[#171717] flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-[#E87525]" />
            <span>Recent Administrative Activity</span>
          </h2>

          <Link
            href="/admin/audit-logs"
            className="text-xs font-mono font-bold text-[#E87525] hover:underline uppercase"
          >
            View All Logs ↗
          </Link>
        </div>

        {recentLogs.length > 0 ? (
          <div className="divide-y divide-[#171717]/10 text-xs">
            {recentLogs.map((log) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#171717] text-[#F5F0E6] font-mono text-[10px] uppercase font-bold">
                    {log.action}
                  </span>
                  <span className="font-bold text-[#171717]">{log.entity_title || log.entity_type}</span>
                </div>
                <span className="text-[#171717]/50 font-mono text-[11px]">
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#171717]/60 italic py-2">
            No administrative actions recorded yet. All content creations, updates, role changes, and suspensions will be audited here.
          </p>
        )}
      </div>

    </div>
  );
}
