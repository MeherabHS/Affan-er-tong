"use client";

import { useEffect, useState } from "react";

export default function BrowserDeterrents() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let toastTimeout: NodeJS.Timeout;

    const showToast = (msg: string) => {
      setToastMessage(msg);
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        setToastMessage(null);
      }, 2000);
    };

    // 1. Right-Click Context Menu Deterrent
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showToast("Right-click is disabled on this website.");
    };

    // 2. Inspection Keyboard Shortcut Deterrent
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;
      const isAlt = e.altKey;

      // F12
      if (key === "F12") {
        e.preventDefault();
        showToast("Developer inspection shortcuts are restricted.");
        return;
      }

      // Ctrl + Shift + I / J / C or Cmd + Option + I / J / C
      if (isCtrlOrCmd && (isShift || isAlt)) {
        const uppercaseKey = key.toUpperCase();
        if (["I", "J", "C"].includes(uppercaseKey)) {
          e.preventDefault();
          showToast("Developer inspection shortcuts are restricted.");
          return;
        }
      }

      // Ctrl + U or Cmd + Option + U (View Source)
      if (isCtrlOrCmd && (key === "u" || key === "U")) {
        e.preventDefault();
        showToast("View source is restricted.");
        return;
      }
    };

    // 3. Image Drag & Drop Protection
    const handleDragStart = (e: DragEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === "IMG") {
        e.preventDefault();
      }
    };

    // Add Listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);

    // Clean up to prevent memory leaks or duplicate listeners
    return () => {
      clearTimeout(toastTimeout);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  if (!toastMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-[#171717] text-[#F5F0E6] border border-[#E87525] px-4 py-2 text-xs font-mono uppercase tracking-wider shadow-2xl transition-all animate-fade-in"
    >
      {toastMessage}
    </div>
  );
}
