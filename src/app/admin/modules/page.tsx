"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  Archive,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { LEARNING_PATH_MODULES } from "@/content/learning-path";

export interface LearningModuleItem {
  id: string;
  module_number: number;
  slug: string;
  title: string;
  summary: string;
  level: string | null;
  duration: string | null;
  source_name: string | null;
  youtube_url: string | null;
  youtube_id: string | null;
  thumbnail_url: string | null;
  status: "draft" | "published" | "coming_soon" | "archived";
  is_featured: boolean;
  sort_order: number;
  published_at: string | null;
  created_at: string;
}

export default function AdminModulesListPage() {
  const [modules, setModules] = useState<LearningModuleItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  const [deleteTarget, setDeleteTarget] = useState<LearningModuleItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    fetchModules();
  }, []);

  async function fetchModules() {
    setLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("learning_modules")
          .select("*")
          .order("sort_order", { ascending: true });

        if (!error && data && data.length > 0) {
          setModules(data as LearningModuleItem[]);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error("Supabase modules load error", e);
      }
    }

    const converted: LearningModuleItem[] = LEARNING_PATH_MODULES.map((m) => ({
      id: m.id,
      module_number: m.order,
      slug: m.slug || m.id,
      title: m.title,
      summary: m.summary,
      level: m.level || null,
      duration: m.duration || null,
      source_name: m.sourceName || null,
      youtube_url: m.youtubeUrl || null,
      youtube_id: m.youtubeId || (m.youtubeUrl ? m.youtubeUrl.split("v=")[1] || null : null),
      thumbnail_url: m.thumbnailUrl || (m.youtubeUrl ? `https://i.ytimg.com/vi/${m.youtubeUrl.split("v=")[1]}/hqdefault.jpg` : null),
      status: m.status === "coming-soon" ? "coming_soon" : "published",
      is_featured: m.order <= 3,
      sort_order: m.order,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }));

    setModules(converted);
    setLoading(false);
  }

  const handleToggleStatus = async (mod: LearningModuleItem, newStatus: "draft" | "published" | "coming_soon" | "archived") => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("learning_modules")
          .update({
            status: newStatus,
            published_at: newStatus === "published" ? new Date().toISOString() : mod.published_at,
            updated_at: new Date().toISOString(),
          })
          .eq("id", mod.id);

        if (!error) {
          const { data: session } = await supabase.auth.getSession();
          if (session.session?.user) {
            await supabase.from("admin_audit_logs").insert({
              admin_id: session.session.user.id,
              action: `Module status changed to ${newStatus}`,
              entity_type: "learning_module",
              entity_id: mod.id,
              entity_title: mod.title,
            });
          }
          fetchModules();
          return;
        }
      } catch (err) {
        console.error("Status update error", err);
      }
    }

    setModules((prev) =>
      prev.map((item) => (item.id === mod.id ? { ...item, status: newStatus } : item))
    );
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("learning_modules")
          .delete()
          .eq("id", deleteTarget.id);

        if (!error) {
          const { data: session } = await supabase.auth.getSession();
          if (session.session?.user) {
            await supabase.from("admin_audit_logs").insert({
              admin_id: session.session.user.id,
              action: "Module deleted permanently",
              entity_type: "learning_module",
              entity_id: deleteTarget.id,
              entity_title: deleteTarget.title,
            });
          }
        }
      } catch (err) {
        console.error("Delete module error", err);
      }
    }

    setModules((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const filteredModules = modules.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    const matchesLevel = levelFilter === "all" || (m.level && m.level.toLowerCase() === levelFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesLevel;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="pb-6 border-b border-[#171717]/15 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#E87525] mb-1">
            CURRICULUM MANAGEMENT
          </div>
          <h1 className="font-condensed text-4xl uppercase tracking-wider text-[#171717]">
            LEARNING MODULES
          </h1>
          <p className="text-xs text-[#171717]/80 mt-1">
            Create, publish, edit, and reorder debate training modules for debaters.
          </p>
        </div>

        <Link
          href="/admin/modules/new"
          className="px-4 py-2.5 bg-[#E87525] text-[#F5F0E6] font-condensed text-xs uppercase font-bold tracking-wider hover:bg-[#171717] transition-colors border border-[#171717]/20 flex items-center justify-center gap-1.5 shrink-0 min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Module</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 border border-[#171717]/15 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#171717]/60" />
          <input
            type="text"
            placeholder="Search by title, summary, or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F5F0E6] border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#F5F0E6] border border-[#171717]/20 font-bold uppercase tracking-wider text-xs focus:outline-none focus:border-[#E87525] min-h-[40px]"
          >
            <option value="all">ALL STATUSES</option>
            <option value="published">PUBLISHED</option>
            <option value="draft">DRAFT</option>
            <option value="coming_soon">COMING SOON</option>
            <option value="archived">ARCHIVED</option>
          </select>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 bg-[#F5F0E6] border border-[#171717]/20 font-bold uppercase tracking-wider text-xs focus:outline-none focus:border-[#E87525] min-h-[40px]"
          >
            <option value="all">ALL LEVELS</option>
            <option value="beginner">BEGINNER</option>
            <option value="intermediate">INTERMEDIATE</option>
            <option value="advanced">ADVANCED</option>
          </select>
        </div>
      </div>

      {/* Modules Table */}
      {loading ? (
        <div className="p-12 text-center font-mono text-xs text-[#E87525] bg-white border border-[#171717]/15">
          Loading learning modules...
        </div>
      ) : filteredModules.length > 0 ? (
        <div className="bg-white border border-[#171717]/15 shadow-xs overflow-hidden">
          
          <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3.5 bg-[#171717] text-[#F5F0E6] font-mono text-xs font-bold uppercase tracking-wider border-b border-[#171717]">
            <div className="col-span-1">ORDER</div>
            <div className="col-span-4">TITLE &amp; SLUG</div>
            <div className="col-span-2">LEVEL</div>
            <div className="col-span-2">STATUS</div>
            <div className="col-span-3 text-right">ACTIONS</div>
          </div>

          <div className="divide-y divide-[#171717]/10">
            {filteredModules.map((mod) => (
              <div
                key={mod.id}
                className="p-4 sm:p-6 md:grid md:grid-cols-12 md:gap-4 md:items-center hover:bg-[#F5F0E6]/30 transition-colors"
              >
                
                <div className="md:col-span-1 font-condensed font-extrabold text-2xl text-[#E87525] flex items-center justify-between md:justify-start">
                  <span>{String(mod.module_number).padStart(2, "0")}</span>
                  <span className="md:hidden text-xs font-mono text-[#171717]/60">SORT: #{mod.sort_order}</span>
                </div>

                <div className="md:col-span-4 space-y-1 mt-2 md:mt-0">
                  <h3 className="font-condensed text-xl font-bold uppercase text-[#171717] leading-snug">
                    {mod.title}
                  </h3>
                  <div className="font-mono text-[11px] text-[#E87525] truncate">
                    /{mod.slug}
                  </div>
                  <p className="text-xs text-[#171717]/70 line-clamp-2">{mod.summary}</p>
                </div>

                <div className="md:col-span-2 mt-2 md:mt-0 font-mono text-xs space-y-1">
                  <span className="px-2 py-0.5 bg-[#171717]/5 border border-[#171717]/15 font-bold uppercase text-[10px]">
                    {mod.level || "ALL LEVELS"}
                  </span>
                  {mod.duration && <div className="text-[11px] text-[#625E57]">{mod.duration}</div>}
                </div>

                <div className="md:col-span-2 mt-2 md:mt-0">
                  {mod.status === "published" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#E87525]/10 text-[#E87525] border border-[#E87525] text-[10px] font-condensed font-bold uppercase tracking-wider">
                      <CheckCircle className="w-3 h-3" />
                      <span>PUBLISHED</span>
                    </span>
                  )}
                  {mod.status === "draft" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 border border-gray-300 text-[10px] font-condensed font-bold uppercase tracking-wider">
                      <Clock className="w-3 h-3" />
                      <span>DRAFT</span>
                    </span>
                  )}
                  {mod.status === "coming_soon" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-300 text-[10px] font-condensed font-bold uppercase tracking-wider">
                      <Clock className="w-3 h-3" />
                      <span>COMING SOON</span>
                    </span>
                  )}
                  {mod.status === "archived" && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-200 text-gray-600 border border-gray-400 text-[10px] font-condensed font-bold uppercase tracking-wider">
                      <Archive className="w-3 h-3" />
                      <span>ARCHIVED</span>
                    </span>
                  )}
                </div>

                <div className="md:col-span-3 mt-4 md:mt-0 flex flex-wrap md:justify-end items-center gap-2">
                  <Link
                    href={`/admin/modules/${mod.id}/edit`}
                    className="px-3 py-1.5 bg-[#171717] text-[#F5F0E6] text-xs font-bold font-condensed uppercase tracking-wider hover:bg-[#E87525] transition-colors flex items-center gap-1 min-h-[38px]"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>

                  {mod.status !== "published" ? (
                    <button
                      onClick={() => handleToggleStatus(mod, "published")}
                      className="px-3 py-1.5 bg-[#E87525] text-[#F5F0E6] text-xs font-bold font-condensed uppercase tracking-wider hover:bg-[#171717] transition-colors flex items-center gap-1 min-h-[38px]"
                    >
                      <span>Publish</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleStatus(mod, "draft")}
                      className="px-3 py-1.5 bg-gray-200 text-gray-800 text-xs font-bold font-condensed uppercase tracking-wider hover:bg-gray-300 transition-colors flex items-center gap-1 min-h-[38px]"
                    >
                      <span>Unpublish</span>
                    </button>
                  )}

                  <button
                    onClick={() => setDeleteTarget(mod)}
                    className="px-2.5 py-1.5 border border-red-300 text-red-600 hover:bg-red-600 hover:text-white transition-colors text-xs min-h-[38px]"
                    title="Delete Module"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      ) : (
        <div className="p-12 text-center bg-white border border-[#171717]/15 space-y-3">
          <BookOpen className="w-8 h-8 text-[#171717]/40 mx-auto" />
          <p className="text-sm font-bold uppercase tracking-wider text-[#171717]">No learning modules found</p>
          <p className="text-xs text-[#171717]/60">Try adjusting your search criteria or add a new module.</p>
        </div>
      )}

      {/* Safety Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#F5F0E6] max-w-md w-full p-6 border-2 border-[#171717] shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-600 border-b border-[#171717]/15 pb-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-condensed text-2xl uppercase font-bold text-[#171717]">
                PERMANENT DELETION WARNING
              </h3>
            </div>

            <p className="text-xs text-[#171717] leading-relaxed">
              Are you sure you want to permanently delete module <strong className="text-[#E87525]">&quot;{deleteTarget.title}&quot;</strong> (Slug: <code>{deleteTarget.slug}</code>)?
            </p>
            <p className="text-[11px] text-[#625E57] italic">
              This action cannot be undone and will be recorded in the security audit log.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#171717]/15">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 border border-[#171717]/30 text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors min-h-[44px]"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors flex items-center gap-1.5 min-h-[44px]"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? "Deleting..." : "Confirm Permanent Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
