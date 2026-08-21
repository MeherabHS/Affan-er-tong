"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, AlertCircle, CheckCircle } from "lucide-react";
import { parseYouTubeUrl } from "@/lib/youtube";
import { sanitizeInput } from "@/lib/security";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function AdminEditVideoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const videoId = resolvedParams.id;
  const router = useRouter();

  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("Format & Rules");
  const [sourceName, setSourceName] = useState<string>("Affan er Tong");
  const [status, setStatus] = useState<"draft" | "published" | "archived">("published");
  const [sortOrder, setSortOrder] = useState<number>(1);

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const youtubeInfo = parseYouTubeUrl(youtubeUrl);

  useEffect(() => {
    async function loadVideo() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from("video_resources")
            .select("*")
            .eq("id", videoId)
            .single();

          if (!error && data) {
            setYoutubeUrl(data.youtube_url || "");
            setTitle(data.title || "");
            setSlug(data.slug || "");
            setDescription(data.description || "");
            setCategory(data.category || "Format & Rules");
            setSourceName(data.source_name || "Affan er Tong");
            setStatus(data.status || "published");
            setSortOrder(data.sort_order || 1);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Load video error", e);
        }
      }

      setLoading(false);
    }

    loadVideo();
  }, [videoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setSaving(true);

    if (!youtubeInfo.isValid || !youtubeInfo.videoId) {
      setErrorMessage(youtubeInfo.error || "Please enter a valid YouTube video URL before saving.");
      setSaving(false);
      return;
    }

    const cleanTitle = sanitizeInput(title);
    const cleanSlug = sanitizeInput(slug);
    const cleanDesc = sanitizeInput(description);
    const cleanSource = sanitizeInput(sourceName);

    if (!cleanTitle || !cleanSlug || !cleanSource) {
      setErrorMessage("Title, Slug, and Channel Source Name are required fields.");
      setSaving(false);
      return;
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: session } = await supabase.auth.getSession();
        const adminId = session.session?.user?.id;

        const payload = {
          title: cleanTitle,
          slug: cleanSlug,
          description: cleanDesc,
          category,
          youtube_url: youtubeInfo.normalizedUrl || youtubeUrl,
          youtube_id: youtubeInfo.videoId,
          thumbnail_url: youtubeInfo.thumbnailUrl,
          source_name: cleanSource,
          status,
          sort_order: sortOrder,
          updated_at: new Date().toISOString(),
          updated_by: adminId || null,
        };

        const { error } = await supabase
          .from("video_resources")
          .update(payload)
          .eq("id", videoId);

        if (error) {
          setErrorMessage(error.message);
          setSaving(false);
          return;
        }

        if (adminId) {
          await supabase.from("admin_audit_logs").insert({
            admin_id: adminId,
            action: "Video resource updated",
            entity_type: "video_resource",
            entity_id: videoId,
            entity_title: cleanTitle,
          });
        }

        setSuccessMessage("Video resource updated successfully!");
        setSaving(false);
        setTimeout(() => router.push("/admin/videos"), 1200);
        return;
      } catch (err: unknown) {
        const error = err as Error;
        setErrorMessage(error.message || "Failed to update video resource.");
        setSaving(false);
        return;
      }
    }

    setSuccessMessage("Video resource updated locally!");
    setSaving(false);
    setTimeout(() => router.push("/admin/videos"), 1200);
  };

  if (loading) {
    return (
      <div className="p-12 text-center font-mono text-xs text-[#E87525] bg-white border border-[#171717]/15">
        Loading video resource details...
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="pb-6 border-b border-[#171717]/15 flex items-center justify-between">
        <div>
          <Link
            href="/admin/videos"
            className="text-xs font-mono font-bold uppercase tracking-wider text-[#E87525] hover:underline flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Video Library</span>
          </Link>
          <h1 className="font-condensed text-4xl uppercase tracking-wider text-[#171717]">
            EDIT VIDEO RESOURCE
          </h1>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-300 text-red-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#171717]/15 p-6 sm:p-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* YouTube Link */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1">
              YouTube Video URL *
            </label>
            <input
              type="url"
              required
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#F5F0E6] border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
            />
          </div>

          {/* YouTube Preview Card */}
          {youtubeUrl && (
            <div className="md:col-span-2 p-4 bg-[#F5F0E6]/50 border border-[#171717]/15 space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase text-[#E87525] block">
                EXTRACTED YOUTUBE METADATA PREVIEW
              </span>
              {youtubeInfo.isValid ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {youtubeInfo.thumbnailUrl && (
                    <div className="w-40 h-24 relative bg-[#171717] border border-[#171717]/20 shrink-0 overflow-hidden">
                      <Image
                        src={youtubeInfo.thumbnailUrl}
                        alt="YouTube Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="space-y-1 font-mono text-xs">
                    <p className="font-bold text-[#171717]">Video ID: {youtubeInfo.videoId}</p>
                    <p className="text-[11px] text-[#625E57] truncate">{youtubeInfo.normalizedUrl}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-red-600 font-bold">{youtubeInfo.error}</p>
              )}
            </div>
          )}

          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1">
              Video Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#F5F0E6] border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
            />
          </div>

          {/* Slug */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              className="w-full px-3 py-2.5 bg-[#F5F0E6] border border-[#171717]/20 text-xs text-[#171717] font-mono focus:outline-none focus:border-[#E87525]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1">
              Resource Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#F5F0E6] border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
            >
              <option value="Format & Rules">Format &amp; Rules</option>
              <option value="Matter Building">Matter Building</option>
              <option value="Strategy">Strategy</option>
              <option value="Reply Speeches">Reply Speeches</option>
              <option value="Demonstration">Demonstration</option>
            </select>
          </div>

          {/* Source / Channel Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1">
              Source / YouTube Channel Name *
            </label>
            <input
              type="text"
              required
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#F5F0E6] border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1">
              Resource Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#F5F0E6] border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1">
              Publication Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published" | "archived")}
              className="w-full px-3 py-2.5 bg-[#F5F0E6] border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
            >
              <option value="published">PUBLISHED (Visible to Debaters)</option>
              <option value="draft">DRAFT (Admin Only)</option>
              <option value="archived">ARCHIVED</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1">
              Sort Order
            </label>
            <input
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2.5 bg-[#F5F0E6] border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
            />
          </div>

        </div>

        {/* Action Controls */}
        <div className="pt-6 border-t border-[#171717]/15 flex items-center justify-end gap-3">
          <Link
            href="/admin/videos"
            className="px-5 py-3 border border-[#171717]/20 text-xs font-bold uppercase tracking-wider hover:bg-[#171717] hover:text-[#F5F0E6] transition-colors min-h-[44px] flex items-center justify-center"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#E87525] text-[#F5F0E6] text-xs font-bold uppercase tracking-wider hover:bg-[#171717] transition-colors flex items-center gap-2 min-h-[44px] disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Updating Video..." : "Update Video Resource"}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
