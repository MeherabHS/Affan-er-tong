"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, AlertCircle, CheckCircle } from "lucide-react";
import { parseYouTubeUrl } from "@/lib/youtube";
import { sanitizeInput } from "@/lib/security";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function AdminEditModulePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const moduleId = resolvedParams.id;
  const router = useRouter();

  const [moduleNumber, setModuleNumber] = useState<number>(1);
  const [title, setTitle] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [level, setLevel] = useState<string>("Beginner");
  const [duration, setDuration] = useState<string>("15 min");
  const [sourceName, setSourceName] = useState<string>("Affan er Tong");
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [status, setStatus] = useState<"draft" | "published" | "coming_soon" | "archived">("published");
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<number>(1);

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  const youtubeInfo = parseYouTubeUrl(youtubeUrl);

  useEffect(() => {
    async function loadModule() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from("learning_modules")
            .select("*")
            .eq("id", moduleId)
            .single();

          if (!error && data) {
            setModuleNumber(data.module_number || 1);
            setTitle(data.title || "");
            setSlug(data.slug || "");
            setSummary(data.summary || "");
            setLevel(data.level || "Beginner");
            setDuration(data.duration || "15 min");
            setSourceName(data.source_name || "Affan er Tong");
            setYoutubeUrl(data.youtube_url || "");
            setStatus(data.status || "published");
            setIsFeatured(data.is_featured || false);
            setSortOrder(data.sort_order || 1);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Load module error", e);
        }
      }

      setLoading(false);
    }

    loadModule();
  }, [moduleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setSaving(true);

    const cleanTitle = sanitizeInput(title);
    const cleanSlug = sanitizeInput(slug);
    const cleanSummary = sanitizeInput(summary);
    const cleanSource = sanitizeInput(sourceName);

    if (!cleanTitle || !cleanSlug || !cleanSummary) {
      setErrorMessage("Title, Slug, and Summary are required fields.");
      setSaving(false);
      return;
    }

    let finalYoutubeId = null;
    let finalThumbnail = null;

    if (youtubeUrl) {
      if (!youtubeInfo.isValid) {
        setErrorMessage(youtubeInfo.error || "Invalid YouTube URL provided.");
        setSaving(false);
        return;
      }
      finalYoutubeId = youtubeInfo.videoId;
      finalThumbnail = youtubeInfo.thumbnailUrl;
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: session } = await supabase.auth.getSession();
        const adminId = session.session?.user?.id;

        const payload = {
          module_number: moduleNumber,
          slug: cleanSlug,
          title: cleanTitle,
          summary: cleanSummary,
          level,
          duration: sanitizeInput(duration),
          source_name: cleanSource || "Affan er Tong",
          youtube_url: youtubeInfo.normalizedUrl || youtubeUrl,
          youtube_id: finalYoutubeId,
          thumbnail_url: finalThumbnail,
          status,
          is_featured: isFeatured,
          sort_order: sortOrder,
          updated_at: new Date().toISOString(),
          updated_by: adminId || null,
        };

        const { error } = await supabase
          .from("learning_modules")
          .update(payload)
          .eq("id", moduleId);

        if (error) {
          setErrorMessage(error.message);
          setSaving(false);
          return;
        }

        if (adminId) {
          await supabase.from("admin_audit_logs").insert({
            admin_id: adminId,
            action: "Module updated",
            entity_type: "learning_module",
            entity_id: moduleId,
            entity_title: cleanTitle,
          });
        }

        setSuccessMessage("Module updated successfully!");
        setSaving(false);
        setTimeout(() => router.push("/admin/modules"), 1200);
        return;
      } catch (err: unknown) {
        const error = err as Error;
        setErrorMessage(error.message || "Failed to update module.");
        setSaving(false);
        return;
      }
    }

    setSuccessMessage("Module updated locally!");
    setSaving(false);
    setTimeout(() => router.push("/admin/modules"), 1200);
  };

  if (loading) {
    return (
      <div className="p-12 text-center font-mono text-xs text-[#E87525] bg-white border border-[#171717]/15">
        Loading module details...
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="pb-6 border-b border-[#171717]/15 flex items-center justify-between">
        <div>
          <Link
            href="/admin/modules"
            className="text-xs font-mono font-bold uppercase tracking-wider text-[#E87525] hover:underline flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Module List</span>
          </Link>
          <h1 className="font-condensed text-4xl uppercase tracking-wider text-[#171717]">
            EDIT MODULE #{moduleNumber}
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
          
          {/* Module Number */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1">
              Module Number *
            </label>
            <input
              type="number"
              required
              min={1}
              value={moduleNumber}
              onChange={(e) => setModuleNumber(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2.5 bg-[#F5F0E6] border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
            />
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1">
              Display Sort Order *
            </label>
            <input
              type="number"
              required
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2.5 bg-[#F5F0E6] border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
            />
          </div>

          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1">
              Module Title *
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
              URL Slug * (Unique)
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2.5 bg-[#171717] text-[#F5F0E6] font-mono text-xs border border-r-0 border-[#171717]">
                /modules/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                className="w-full px-3 py-2.5 bg-[#F5F0E6] border border-[#171717]/20 text-xs text-[#171717] font-mono focus:outline-none focus:border-[#E87525]"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1">
              Module Summary *
            </label>
            <textarea
              required
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#F5F0E6] border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
            />
          </div>

          {/* Level */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1">
              Difficulty Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#F5F0E6] border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1">
              Estimated Duration
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#F5F0E6] border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
            />
          </div>

          {/* YouTube Link */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1">
              YouTube Resource Link
            </label>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#F5F0E6] border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
            />
          </div>

          {/* Real-time YouTube Thumbnail Preview */}
          {youtubeUrl && (
            <div className="md:col-span-2 p-4 bg-[#F5F0E6]/50 border border-[#171717]/15 space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase text-[#E87525] block">
                YOUTUBE PREVIEW
              </span>
              {youtubeInfo.isValid ? (
                <div className="flex items-center gap-4">
                  {youtubeInfo.thumbnailUrl && (
                    <div className="w-32 h-20 relative bg-[#171717] border border-[#171717]/20 shrink-0">
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

          {/* Source Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171717] mb-1">
              Source / Channel Name
            </label>
            <input
              type="text"
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
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
              onChange={(e) => setStatus(e.target.value as "draft" | "published" | "coming_soon" | "archived")}
              className="w-full px-3 py-2.5 bg-[#F5F0E6] border border-[#171717]/20 text-xs text-[#171717] focus:outline-none focus:border-[#E87525]"
            >
              <option value="published">PUBLISHED (Visible to Debaters)</option>
              <option value="draft">DRAFT (Admin Only)</option>
              <option value="coming_soon">COMING SOON</option>
              <option value="archived">ARCHIVED</option>
            </select>
          </div>

        </div>

        {/* Action Controls */}
        <div className="pt-6 border-t border-[#171717]/15 flex items-center justify-end gap-3">
          <Link
            href="/admin/modules"
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
            <span>{saving ? "Updating Module..." : "Update Module"}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
