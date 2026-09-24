"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FolderOpen,
  Settings,
  Globe,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useState, useRef } from "react";
import type { SiteInfo } from "@/lib/site";
import Image from "next/image";

interface NavItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: "Students",
    icon: <Users size={18} />,
    children: [
      { label: "Enrolled Students", href: "/admin/students" },
      { label: "Admission Requests", href: "/admin/students/requests" },
    ],
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: <FolderOpen size={18} />,
  },
  {
    label: "Courses",
    href: "/admin/courses",
    icon: <BookOpen size={18} />,
  },
  {
    label: "Site Content",
    href: "/admin/site",
    icon: <Globe size={18} />,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: <Settings size={18} />,
  },
];

export default function AdminSidebar({
  isOpen,
  onClose,
  collapsed,
  onToggleCollapse,
  site,
  logoNav,
}: {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  site: SiteInfo;
  logoNav: string;
}) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [flyout, setFlyout] = useState<{
    label: string;
    top: number;
    left: number;
  } | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const isChildActive = (children: { href: string }[]) =>
    children.some((child) => pathname.startsWith(child.href));

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setFlyout(null), 120);
  }

  function cancelClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function openFlyout(
    e: React.MouseEvent<HTMLButtonElement>,
    label: string
  ) {
    cancelClose();
    const rect = e.currentTarget.getBoundingClientRect();
    setFlyout({ label, top: rect.top, left: rect.right + 10 });
    setOpenMenus((prev) => ({ ...prev, [label]: true }));
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-line bg-white transition-all duration-200 lg:static lg:z-auto ${
          collapsed ? "w-[68px]" : "w-64"
        } ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div
          className={`flex h-16 flex-none items-center border-b border-line ${
            collapsed ? "justify-center px-2" : "gap-3 px-5"
          }`}
        >
          {collapsed ? (
            <div className="relative h-9 w-9 flex-none overflow-hidden rounded-lg">
              <Image
                src={logoNav}
                alt={`${site.name} logo`}
                fill
                className="object-contain"
                priority
              />
            </div>
          ) : (
            <>
              <Image
                src={logoNav}
                alt={`${site.name} logo`}
                height={44}
                width={44}
                className="h-11 w-auto flex-none"
                priority
              />
              <div className="min-w-0">
                <span className="flex flex-col leading-none">
                  <span className="font-display text-lg font-extrabold tracking-tight text-ink">
                    {site.nameLatin?.split(" ")[0] || "Ilmora"}
                  </span>
                  <span className="mt-0.5 text-[8px] font-bold uppercase tracking-[3px] text-gold-dark">
                    {site.nameLatin?.split(" ").slice(1).join(" ") || "Institute"}
                  </span>
                </span>
                <p className="mt-1 text-[10px] text-grey">Admin Panel</p>
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const menuOpen =
                openMenus[item.label] ?? isChildActive(item.children || []);
              const active = item.href
                ? isActive(item.href)
                : isChildActive(item.children || []);

              // ---------- Item with submenu ----------
              if (hasChildren) {
                return (
                  <div
                    key={item.label}
                    className={collapsed ? "relative" : undefined}
                  >
                    <button
                      onClick={() => toggleMenu(item.label)}
                      onMouseEnter={
                        collapsed
                          ? (e) => openFlyout(e, item.label)
                          : undefined
                      }
                      onMouseLeave={collapsed ? scheduleClose : undefined}
                      className={`relative flex w-full items-center gap-3 rounded-lg text-sm transition-colors ${
                        collapsed
                          ? "justify-center px-0 py-2.5"
                          : "px-3 py-2.5"
                      } ${
                        active
                          ? "bg-primary-mist font-semibold text-primary"
                          : "text-grey hover:bg-cream hover:text-ink"
                      }`}
                    >
                      <span className="flex-none">{item.icon}</span>
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">
                            {item.label}
                          </span>
                          <ChevronDown
                            size={14}
                            className={`flex-none transition-transform duration-150 ${
                              menuOpen ? "rotate-180" : ""
                            }`}
                          />
                        </>
                      )}
                      {collapsed && active && (
                        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </button>

                    {/* Expanded mode: inline submenu (click to toggle) */}
                    {!collapsed && menuOpen && (
                      <div className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-line pl-3">
                        {item.children!.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={onClose}
                            className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                              isActive(child.href)
                                ? "bg-primary/10 font-medium text-primary"
                                : "text-grey hover:bg-cream hover:text-ink"
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Collapsed mode: hover flyout popover with labels */}
                    {collapsed && flyout?.label === item.label && (
                      <div
                        className="fixed z-[70] w-52 rounded-xl border border-line bg-white py-1.5 shadow-2xl"
                        style={{ top: flyout.top, left: flyout.left }}
                        onMouseEnter={cancelClose}
                        onMouseLeave={scheduleClose}
                      >
                        <p className="px-3 pb-1 pt-0.5 text-[10px] font-bold uppercase tracking-wider text-grey">
                          {item.label}
                        </p>
                        <div className="space-y-0.5">
                          {item.children!.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={onClose}
                              className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                                isActive(child.href)
                                  ? "bg-primary/10 font-medium text-primary"
                                  : "text-grey hover:bg-cream hover:text-ink"
                              }`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // ---------- Plain link item ----------
              return (
                <Link
                  key={item.href}
                  href={item.href!}
                  onClick={onClose}
                  title={collapsed ? item.label : undefined}
                  className={`relative flex items-center gap-3 rounded-lg text-sm transition-colors ${
                    collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5"
                  } ${
                    isActive(item.href!)
                      ? "bg-primary-mist font-semibold text-primary"
                      : "text-grey hover:bg-cream hover:text-ink"
                  }`}
                >
                  <span className="flex-none">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                  {collapsed && isActive(item.href!) && (
                    <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Collapse toggle (desktop only) */}
        <div className="hidden border-t border-line px-2 py-2 lg:block">
          <button
            onClick={onToggleCollapse}
            className="flex w-full items-center justify-center rounded-lg py-2 text-grey transition-colors hover:bg-cream hover:text-ink"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronsRight size={18} />
            ) : (
              <ChevronsLeft size={18} />
            )}
          </button>
        </div>

        {/* Footer — only when expanded */}
        {!collapsed && (
          <div className="hidden border-t border-line px-5 py-4 lg:block">
            <p className="text-xs text-grey">
              &copy; {new Date().getFullYear()} {site.name}
            </p>
          </div>
        )}
      </aside>
    </>
  );
}