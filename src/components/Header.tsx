"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, LogIn, LogOut, HelpCircle, ShieldCheck } from "lucide-react";
import { SITE_DATA } from "@/content/site";
import { NAV_ITEMS, NavItem } from "@/config/navigation";

interface UserProfile {
  email: string;
  name: string;
  role?: string;
}

interface HeaderProps {
  user: UserProfile | null;
  onOpenAuth?: (intent?: string) => void;
  onSignOut: () => void;
  onFilterMyQuestions?: () => void;
}

export default function Header({ user, onOpenAuth: _onOpenAuth, onSignOut, onFilterMyQuestions }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Lock background scroll when mobile drawer is open & handle Escape key
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setAccountMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // Homepage Section Intersection Observer
  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(null);
      return;
    }

    const sectionIds = ["why-tong", "learning-path", "video-library", "open-floor", "about"];
    const sectionElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-20% 0px -65% 0px",
        threshold: 0,
      }
    );

    sectionElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  const isNavItemActive = (item: NavItem) => {
    const normalizedPathname = pathname.replace(/\/$/, "") || "/";

    if (item.href.startsWith("/#")) {
      return normalizedPathname === "/" && activeSection === item.sectionId;
    }

    const normalizedHref = item.href.replace(/\/$/, "") || "/";
    if (normalizedHref === "/") {
      return normalizedPathname === "/";
    }

    return (
      normalizedPathname === normalizedHref ||
      normalizedPathname.startsWith(`${normalizedHref}/`)
    );
  };

  const getCleanDisplayName = (name: string, email: string) => {
    if (name && name.trim() && !name.includes("test") && name.length <= 25) {
      return name.trim();
    }
    if (email && email.includes("@")) {
      return email.split("@")[0];
    }
    return "ACCOUNT";
  };

  const getInitials = (name: string, email: string) => {
    const clean = getCleanDisplayName(name, email);
    const parts = clean.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  };

  const displayName = user ? getCleanDisplayName(user.name, user.email) : "";

  return (
    <header className="sticky top-0 z-50 bg-[#F5F0E6] border-b border-[rgba(23,23,23,0.08)] text-[#171717] h-18 sm:h-20 flex items-center">
      {/* Skip to Content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-[#E87525] focus:text-[#F5F0E6] focus:px-4 focus:py-2 focus:z-50 font-bold"
      >
        Skip to content
      </a>

      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between flex-nowrap">
          
          {/* Left: Official Affan er Tong Logo */}
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity shrink-0">
            <div className="w-[120px] xs:w-[135px] sm:w-[145px] min-[900px]:w-[200px] h-auto relative">
              <Image
                src="/logo.webp"
                alt="Affan er Tong Official Logo"
                width={200}
                height={110}
                priority
                sizes="(max-width: 900px) 145px, 200px"
                className="object-contain w-full h-auto"
              />
            </div>
          </Link>

          {/* Right: Desktop Navigation (Restored at ≥ 900px) */}
          <nav className="hidden min-[900px]:flex items-center space-x-7 text-xs font-bold uppercase tracking-wider">
            {NAV_ITEMS.map((item) => {
              const active = isNavItemActive(item);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  data-active={active ? "true" : "false"}
                  aria-current={active ? (item.type === "section" ? "location" : "page") : undefined}
                  className={`nav-link ${active ? "nav-link--active" : "nav-link--inactive"} font-condensed text-sm tracking-wider`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Desktop Account Control */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 border border-[#171717]/20 bg-[#F5F0E6] hover:bg-[#171717] hover:text-[#F5F0E6] transition-colors text-xs font-bold min-h-[44px]"
                >
                  <span className="w-6 h-6 rounded-full bg-[#E87525] text-[#F5F0E6] text-[10px] flex items-center justify-center font-condensed">
                    {getInitials(user.name, user.email)}
                  </span>
                  <span className="max-w-[100px] truncate">{displayName}</span>
                </button>

                {/* Account Dropdown */}
                {accountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#F5F0E6] border border-[#171717]/20 shadow-xl py-2 z-50 text-xs font-sans">
                    <div className="px-4 py-2 border-b border-[#171717]/10">
                      <p className="font-bold text-[#171717] truncate">{displayName}</p>
                      <p className="text-[11px] text-[#625E57] truncate">{user.email}</p>
                    </div>

                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setAccountMenuOpen(false)}
                        className="w-full text-left px-4 py-2.5 bg-[#171717] text-[#F5F0E6] hover:bg-[#E87525] transition-colors flex items-center gap-2 font-bold uppercase tracking-wider text-[11px] min-h-[44px]"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#E87525]" />
                        <span>Admin Control</span>
                      </Link>
                    )}

                    <Link
                      href="/open-floor"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        if (onFilterMyQuestions) onFilterMyQuestions();
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-[#171717] hover:text-[#F5F0E6] flex items-center gap-2 font-bold uppercase tracking-wider text-[11px] min-h-[44px]"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>My Questions</span>
                    </Link>

                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        onSignOut();
                      }}
                      className="w-full text-left px-4 py-2.5 text-[#E87525] hover:bg-[#E87525] hover:text-[#F5F0E6] flex items-center gap-2 font-bold uppercase tracking-wider text-[11px] min-h-[44px]"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="text-xs font-bold border border-[#171717]/20 px-4 py-2 hover:bg-[#171717] hover:text-[#F5F0E6] transition-colors flex items-center gap-1.5 uppercase tracking-wider min-h-[44px]"
              >
                <LogIn className="w-3.5 h-3.5 text-[#E87525]" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Desktop Facebook Button */}
            <a
              href={SITE_DATA.brand.facebookPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#171717]/20 hover:bg-[#171717] hover:text-[#F5F0E6] text-[#171717] font-bold text-xs px-4 py-2 transition-colors uppercase flex items-center gap-1 min-h-[44px]"
              aria-label="Visit official Affan er Tong Facebook page"
            >
              <span>Facebook</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#E87525]" />
            </a>
          </nav>

          {/* Right: Mobile Menu Toggle Button (< 900px) */}
          <div className="flex min-[900px]:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-h-[48px] min-w-[48px] p-2.5 text-[#171717] flex items-center justify-center border border-[#171717]/15 bg-[#F5F0E6] focus:outline-none focus:ring-2 focus:ring-[#E87525]"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer Panel (< 900px) */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="min-[900px]:hidden fixed inset-x-0 top-18 sm:top-20 bottom-0 bg-[#F5F0E6] border-b border-[#171717]/20 px-6 py-6 space-y-3 font-condensed text-xl uppercase tracking-wider shadow-2xl z-50 overflow-y-auto"
        >
          {NAV_ITEMS.map((item) => {
            const active = isNavItemActive(item);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                data-active={active ? "true" : "false"}
                aria-current={active ? (item.type === "section" ? "location" : "page") : undefined}
                className={`mobile-nav-link ${active ? "mobile-nav-link--active" : ""} font-condensed text-xl uppercase tracking-wider`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="pt-4 font-sans text-sm space-y-4">
            {user ? (
              <div className="p-4 bg-white border border-[#171717]/15 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#171717]">{displayName}</span>
                  <span className="text-[11px] font-mono text-[#E87525]">LOGGED IN</span>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full min-h-[44px] py-2.5 bg-[#171717] text-[#F5F0E6] text-xs font-bold uppercase text-center flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#E87525]" />
                      <span>Admin Control Dashboard</span>
                    </Link>
                  )}

                  <div className="flex gap-2">
                    <Link
                      href="/open-floor"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        if (onFilterMyQuestions) onFilterMyQuestions();
                      }}
                      className="flex-1 min-h-[44px] py-2 text-xs border border-[#171717]/20 font-bold uppercase text-center flex items-center justify-center"
                    >
                      My Questions
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onSignOut();
                      }}
                      className="flex-1 min-h-[44px] py-2 text-xs bg-[#E87525] text-[#F5F0E6] font-bold uppercase text-center"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full min-h-[48px] py-3 border border-[#171717]/20 bg-[#E87525] text-[#F5F0E6] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Create Account</span>
              </Link>
            )}

            <a
              href={SITE_DATA.brand.facebookPageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full min-h-[48px] py-3 bg-[#171717] text-[#F5F0E6] font-bold text-center text-xs uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <span>Visit Official Facebook Page</span>
              <ArrowUpRight className="w-4 h-4 text-[#E87525]" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
