export interface NavItem {
  label: string;
  href: string;
  type: "section" | "route";
  sectionId?: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Why Tong",
    href: "/#why-tong",
    type: "section",
    sectionId: "why-tong",
  },
  {
    label: "Learning Path",
    href: "/modules",
    type: "route",
  },
  {
    label: "Video Library",
    href: "/video-library",
    type: "route",
  },
  {
    label: "Open Floor",
    href: "/open-floor",
    type: "route",
  },
  {
    label: "About",
    href: "/#about",
    type: "section",
    sectionId: "about",
  },
];
