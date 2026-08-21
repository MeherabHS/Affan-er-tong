"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Video,
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { VERIFIED_VIDEOS } from "@/content/video-library";

export interface VideoResourceItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  youtube_url: string;
  youtube_id: string;
  thumbnail_url: string | null;
  source_name: string;
  status: "draft" | "published" | "archived";
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

export default function AdminVideosListPage() {
  const [videos, setVideos] = useState<VideoResourceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);

  const [deleteTarget, setDeleteTarget] = useState<VideoResourceItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  async function fetchVideos() {
    setLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("video_resources")
          .select("*")
          .order("sort_order", { ascending: true });

        if (!error && data && data.length > 0) {
          setVideos(data as VideoResourceItem[]);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error("Supabase videos load error", e);
      }
    }

    const converted: VideoResourceItem[] = VERIFIED_VIDEOS.map((v, idx) => ({
      id: v.id,
      title: v.title,
      slug: v.id,
      description: v.description,
      category: v.category,
      youtube_url: v.youtubeUrl,
      youtube_id: v.youtubeId,
      thumbnail_url: v.thumbnailUrl || `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`,
      source_name: v.sourceName,
      status: "published",
      is_featured: idx < 3,
      sort_order: idx + 1,
      created_at: new Date().toISOString(),
    }));

    setVideos(converted);
    setLoading(false);
  }

  const handleToggleStatus = async (video: VideoResourceItem, newStatus: "draft" | "published" | "archived") => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("video_resources")
          .update({
            status: newStatus,
            updated_at: new Date().toISOString(),
          })
          .eq("id", video.id);

        if (!error) {
          const { data: session } = await supabase.auth.getSession();
          if (session.session?.user) {
            await supabase.from("admin_audit_logs").insert({
              admin_id: session.session.user.id,
              action: `Video status changed to ${newStatus}`,
              entity_type: "video_resource",
              entity_id: video.id,
              entity_title: video.title,
            });
          }
          fetchVideos();
          return;
        }
      } catch (err) {
        console.error("Video status update error", err);
      }
    }

    setVideos((prev) =>
      prev.map((item) => (item.id === video.id ? { ...item, status: newStatus } : item))
    );
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("video_resources")
          .delete()
          .eq("id", deleteTarget.id);

        if (!error) {
          const { data: session } = await supabase.auth.getSession();
          if (session.session?.user) {
            await supabase.from("admin_audit_logs").insert({
              admin_id: session.session.user.id,
              action: "Video deleted permanently",
              entity_type: "video_resource",
              entity_id: deleteTarget.id,
              entity_title: deleteTarget.title,
            });
          }
        }
      } catch (err) {
        console.error("Delete video error", err);
      }
    }

    setVideos((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const filteredVideos = videos.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.source_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.description && v.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === "all" || v.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="pb-6 border-b border-[#171717]/15 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#E87525] mb-1">
            RESOURCE DIRECTORY
          </div>
          <h1 className="font-condensed text-4xl uppercase tracking-wider text-[#171717]">
            VIDEO LIBRARY RESOURCES
          </h1>
          <p className="text-xs text-[#171717]/80 mt-1">
            Add, edit, reorder, and publish verified YouTube debate videos and lectures.
          </p>
        </div>

        <Link
          href="/admin/videos/new"
          className="px-4 py-2.5 bg-[#E87525] text-[#F5F0E6] font-condensed text-xs uppercase font-bold tracking-wider hover:bg-[#171717] transition-colors border border-[#171717]/20 flex items-center justify-center gap-1.5 shrink-0 min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Video Resource</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 border border-[#171717]/15 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#171717]/60" />
          <input
            type="text"
            placeholder="Search by title, source, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F5F0E6] border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-[#F5F0E6] border border-[#171717]/20 font-bold uppercase tracking-wider text-xs focus:outline-none focus:border-[#E87525] min-h-[40px]"
          >
            <option value="all">ALL CATEGORIES</option>
            <option value="Format & Rules">FORMAT &amp; RULES</option>
            <option value="Matter Building">MATTER BUILDING</option>
            <option value="Strategy">STRATEGY</option>
            <option value="Reply Speeches">REPLY SPEECHES</option>
            <option value="Demonstration">DEMONSTRATION</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#F5F0E6] border border-[#171717]/20 font-bold uppercase tracking-wider text-xs focus:outline-none focus:border-[#E87525] min-h-[40px]"
          >
            <option value="all">ALL STATUSES</option>
            <option value="published">PUBLISHED</option>
            <option value="draft">DRAFT</option>
            <option value="archived">ARCHIVED</option>
          </select>
        </div>
      </div>

      {/* Video Cards Grid */}
      {loading ? (
        <div className="p-12 text-center font-mono text-xs text-[#E87525] bg-white border border-[#171717]/15">
          Loading video resources...
        </div>
      ) : filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="bg-white border border-[#171717]/15 flex flex-col justify-between overflow-hidden shadow-xs hover:border-[#E87525] transition-colors"
            >
              <div>
                <div className="relative aspect-video bg-[#171717] border-b border-[#171717]/15 overflow-hidden group">
                  {video.thumbnail_url ? (
                    <Image
                      src={video.thumbnail_url}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#F5F0E6]/40 font-mono text-xs">
                      NO THUMBNAIL
                    </div>
                  )}

                  <div className="absolute top-2 left-2">
                    {video.status === "published" && (
                      <span className="px-2 py-0.5 bg-[#E87525] text-[#F5F0E6] font-condensed text-[10px] font-bold uppercase tracking-wider">
                        PUBLISHED
                      </span>
                    )}
                    {video.status === "draft" && (
                      <span className="px-2 py-0.5 bg-gray-800 text-white font-condensed text-[10px] font-bold uppercase tracking-wider">
                        DRAFT
                      </span>
                    )}
                    {video.status === "archived" && (
                      <span className="px-2 py-0.5 bg-gray-500 text-white font-condensed text-[10px] font-bold uppercase tracking-wider">
                        ARCHIVED
                      </span>
                    )}
                  </div>

                  <a
                    href={video.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-2 right-2 px-2 py-1 bg-[#171717]/80 hover:bg-[#E87525] text-[#F5F0E6] text-[10px] font-mono flex items-center gap-1 transition-colors"
                  >
                    <span>{video.youtube_id}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#E87525]">
                    <span className="font-bold uppercase tracking-wider">{video.category}</span>
                    <span className="text-[#171717]/60">{video.source_name}</span>
                  </div>

                  <h3 className="font-condensed text-xl font-bold uppercase text-[#171717] line-clamp-2 leading-snug">
                    {video.title}
                  </h3>

                  {video.description && (
                    <p className="text-xs text-[#171717]/70 line-clamp-2">{video.description}</p>
                  )}
                </div>
              </div>

              <div className="p-4 bg-[#F5F0E6]/30 border-t border-[#171717]/10 flex items-center justify-between gap-2">
                <Link
                  href={`/admin/videos/${video.id}/edit`}
                  className="px-3 py-1.5 bg-[#171717] text-[#F5F0E6] text-xs font-bold font-condensed uppercase tracking-wider hover:bg-[#E87525] transition-colors flex items-center gap-1 min-h-[38px]"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </Link>

                <div className="flex items-center gap-2">
                  {video.status !== "published" ? (
                    <button
                      onClick={() => handleToggleStatus(video, "published")}
                      className="px-3 py-1.5 bg-[#E87525] text-[#F5F0E6] text-xs font-bold font-condensed uppercase tracking-wider hover:bg-[#171717] transition-colors min-h-[38px]"
                    >
                      Publish
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleStatus(video, "draft")}
                      className="px-3 py-1.5 bg-gray-200 text-gray-800 text-xs font-bold font-condensed uppercase tracking-wider hover:bg-gray-300 transition-colors min-h-[38px]"
                    >
                      Unpublish
                    </button>
                  )}

                  <button
                    onClick={() => setDeleteTarget(video)}
                    className="px-2.5 py-1.5 border border-red-300 text-red-600 hover:bg-red-600 hover:text-white transition-colors text-xs min-h-[38px]"
                    title="Delete Video"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white border border-[#171717]/15 space-y-3">
          <Video className="w-8 h-8 text-[#171717]/40 mx-auto" />
          <p className="text-sm font-bold uppercase tracking-wider text-[#171717]">No video resources found</p>
          <p className="text-xs text-[#171717]/60">Try adjusting your filters or add a new video resource.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
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
              Are you sure you want to permanently delete video resource <strong className="text-[#E87525]">&quot;{deleteTarget.title}&quot;</strong>?
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
