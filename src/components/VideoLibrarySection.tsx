"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Play, X, ExternalLink, ShieldCheck } from "lucide-react";
import { SITE_DATA } from "@/content/site";
import { VERIFIED_VIDEOS, VideoResource } from "@/content/video-library";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function VideoLibrarySection() {
  const { videoLibrary } = SITE_DATA;
  const [videos, setVideos] = useState<VideoResource[]>(VERIFIED_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<VideoResource | null>(null);

  useEffect(() => {
    async function loadPublishedVideos() {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from("video_resources")
            .select("id, slug, title, category, youtube_id, youtube_url, thumbnail_url, description, source_name, status, sort_order")
            .eq("status", "published")
            .order("sort_order", { ascending: true })
            .limit(3);

          if (!error && data && data.length > 0) {
            const mapped: VideoResource[] = data.map((v) => ({
              id: v.slug || v.id,
              title: v.title,
              category: v.category || "Debate Breakdown",
              youtubeId: v.youtube_id || "",
              youtubeUrl: v.youtube_url || "",
              thumbnailUrl: v.thumbnail_url || `https://i.ytimg.com/vi/${v.youtube_id}/hqdefault.jpg`,
              description: v.description || "",
              sourceName: v.source_name || "Affan er Tong",
              sourceLabel: "EXTERNAL LEARNING RESOURCE",
              verified: true,
            }));
            setVideos(mapped);
          }
        } catch (e) {
          console.error("Fetch homepage videos error", e);
        }
      }
    }

    loadPublishedVideos();
  }, []);

  return (
    <section
      id="video-library"
      className="bg-[#171717] text-[#F5F0E6] py-16 md:py-24 border-b border-[#F5F0E6]/10 scroll-mt-20 relative overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-[#F5F0E6]/15">
          <div>
            <div className="text-xs font-condensed font-bold uppercase tracking-wider text-[#E87525] mb-2">
              {videoLibrary.sectionLabel}
            </div>
            <h2 className="font-condensed text-6xl sm:text-7xl lg:text-8xl leading-[0.88] uppercase text-[#F5F0E6]">
              {videoLibrary.title}
            </h2>
            <p className="text-base sm:text-lg text-[#F5F0E6]/80 font-sans mt-3 font-medium max-w-2xl">
              {videoLibrary.supportingText}
            </p>
          </div>
        </div>

        {/* 3-Column Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {videos.map((video: VideoResource) => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="bg-[#232323] border border-[#F5F0E6]/15 hover:border-[#E87525] transition-all cursor-pointer group flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Thumbnail Container */}
                <div className="relative aspect-video bg-[#171717] overflow-hidden border-b border-[#F5F0E6]/15">
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading="lazy"
                    className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                  />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                    <div className="w-12 h-12 rounded-full bg-[#E87525] text-[#F5F0E6] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-[#171717]/90 text-[#E87525] font-mono text-[10px] uppercase font-bold tracking-wider border border-[#E87525]/30">
                      {video.category}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#E87525]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="uppercase font-bold">{video.sourceName}</span>
                  </div>

                  <h3 className="font-condensed text-xl font-bold uppercase text-[#F5F0E6] group-hover:text-[#E87525] transition-colors leading-snug line-clamp-2">
                    {video.title}
                  </h3>

                  <p className="text-xs text-[#F5F0E6]/70 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="p-4 bg-[#171717]/50 border-t border-[#F5F0E6]/10 flex items-center justify-between text-xs font-condensed font-bold uppercase tracking-wider text-[#E87525] group-hover:bg-[#E87525] group-hover:text-[#F5F0E6] transition-colors">
                <span>WATCH LESSON</span>
                <Play className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Video Player Modal - Click-to-Play Facade */}
        {selectedVideo && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#171717] border border-[#F5F0E6]/20 max-w-4xl w-full overflow-hidden shadow-2xl space-y-4 p-4 sm:p-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#F5F0E6]/15">
                <div className="space-y-0.5">
                  <span className="text-xs font-mono font-bold uppercase text-[#E87525]">
                    {selectedVideo.category} • {selectedVideo.sourceName}
                  </span>
                  <h3 className="font-condensed text-2xl uppercase font-bold text-[#F5F0E6]">
                    {selectedVideo.title}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-2 text-[#F5F0E6]/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Responsive Iframe Container */}
              <div className="relative aspect-video bg-black border border-[#F5F0E6]/10">
                {/^[a-zA-Z0-9_-]{11}$/.test(selectedVideo.youtubeId) ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(selectedVideo.youtubeId)}?autoplay=1`}
                    title={selectedVideo.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-mono text-[#E87525]">
                    Invalid video identifier.
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 text-xs font-mono">
                <p className="text-[#F5F0E6]/70 line-clamp-1">{selectedVideo.description}</p>
                <a
                  href={selectedVideo.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#E87525] text-[#F5F0E6] font-bold uppercase flex items-center gap-1.5 shrink-0 hover:bg-white hover:text-[#171717] transition-colors"
                >
                  <span>Open YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
