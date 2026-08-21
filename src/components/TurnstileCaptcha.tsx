"use client";

import { useEffect, useRef } from "react";

interface TurnstileCaptchaProps {
  onVerify?: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

export default function TurnstileCaptcha({ onVerify, onError, onExpire }: TurnstileCaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    if (window.turnstile && containerRef.current) {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token: string) => {
          if (onVerify) onVerify(token);
        },
        "error-callback": () => {
          if (onError) onError();
        },
        "expired-callback": () => {
          if (onExpire) onExpire();
        },
        theme: "light",
      });
    }

    return () => {
      if (widgetIdRef.current && window.turnstile && typeof window.turnstile.remove === "function") {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, onVerify, onError, onExpire]);

  if (!siteKey) {
    return (
      <div className="p-2.5 bg-[#F5F0E6] border border-[#171717]/15 font-mono text-[11px] text-[#625E57] flex items-center justify-between">
        <span>Cloudflare Turnstile Bot Protection</span>
        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold uppercase text-[9px]">
          ACTIVE (DEV MODE)
        </span>
      </div>
    );
  }

  return <div ref={containerRef} className="my-3 min-h-[65px]" />;
}
