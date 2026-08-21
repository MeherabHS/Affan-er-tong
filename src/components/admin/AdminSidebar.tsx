"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Video,
  Users,
  ClipboardList,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";

interface AdminSidebarProps {
  userEmail?: string;
  userName?: string;
  onSignOut: () => void;
}

export default function AdminSidebar({ userEmail, userName, onSignOut }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Modules", href: "/admin/modules", icon: BookOpen },
    { label: "Video Library", href: "/admin/videos", icon: Video },
    { label: "Users Directory", href: "/admin/users", icon: Users },
    { label: "Audit Log", href: "/admin/audit-logs", icon: ClipboardList },
  ];

  return (
    <>
      {/* Top Header Bar for Mobile (< 1024px) */}
      <header className="lg:hidden bg-[#171717] text-[#F5F0E6] p-4 flex items-center justify-between border-b border-[#E87525] sticky top-0 z-40">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-28 h-auto relative bg-[#F5F0E6] p-1 border border-[#F5F0E6]/30">
            <Image
              src="/logo.webp"
              alt="Affan er Tong Logo"
              width={120}
              height={60}
              className="object-contain w-full h-auto"
            />
          </div>
          <span className="font-mono text-[10px] font-bold text-[#E87525] uppercase tracking-widest border border-[#E87525] px-1.5 py-0.5">
            ADMIN
          </span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="min-h-[44px] min-w-[44px] p-2 text-[#F5F0E6] border border-[#F5F0E6]/20 flex items-center justify-center"
          aria-label="Toggle Admin Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-xs"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 bottom-0 z-50 w-64 bg-[#171717] text-[#F5F0E6] flex flex-col justify-between border-r-2 border-[#E87525] transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } h-screen`}
      >
        <div className="p-6 space-y-6">
          
          {/* Logo & Admin Badge */}
          <div className="pb-6 border-b border-[#F5F0E6]/15 space-y-3">
            <Link href="/" className="inline-block">
              <div className="w-[160px] h-auto relative bg-[#F5F0E6] p-2 border border-[#F5F0E6]/30">
                <Image
                  src="/logo.webp"
                  alt="Affan er Tong Logo"
                  width={160}
                  height={80}
                  className="object-contain w-full h-auto"
                />
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#E87525]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#E87525]">
                ADMIN CONTROL CENTER
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 font-condensed text-base uppercase tracking-wider">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 border transition-colors min-h-[44px] ${
                    isActive
                      ? "bg-[#E87525] text-[#F5F0E6] border-[#E87525] font-bold"
                      : "border-transparent text-[#F5F0E6]/80 hover:bg-[#F5F0E6]/10 hover:text-[#F5F0E6]"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions & Profile Info */}
        <div className="p-6 border-t border-[#F5F0E6]/15 space-y-4 font-sans text-xs">
          {userName && (
            <div className="px-3 py-2 bg-[#F5F0E6]/5 border border-[#F5F0E6]/10">
              <p className="font-bold text-[#F5F0E6] truncate">{userName}</p>
              {userEmail && <p className="text-[11px] text-[#F5F0E6]/60 truncate">{userEmail}</p>}
            </div>
          )}

          <div className="space-y-2 font-condensed uppercase tracking-wider text-xs">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2.5 border border-[#F5F0E6]/30 text-[#F5F0E6] hover:bg-[#F5F0E6]/10 transition-colors min-h-[44px]"
            >
              <span>View Public Website</span>
              <ExternalLink className="w-4 h-4 text-[#E87525]" />
            </Link>

            <button
              onClick={onSignOut}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-[#E87525] text-[#F5F0E6] hover:bg-white hover:text-[#171717] transition-colors font-bold min-h-[44px]"
            >
              <span>Sign Out Admin</span>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
