"use client";

import { useState, useSyncExternalStore } from "react";
import AdminSidebar from "@/components/admin/Sidebar";
import AdminTopbar from "@/components/admin/Topbar";
import type { SiteInfo } from "@/lib/site";

const STORAGE_KEY = "ilmora-admin-sidebar-collapsed";

const listeners = new Set<() => void>();
let cached: boolean | null = null;

function getSnapshot(): boolean {
  if (cached === null) {
    try {
      cached =
        typeof window !== "undefined" &&
        window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      cached = false;
    }
  }
  return cached;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function handleStorage() {
  cached = null;
  listeners.forEach((l) => l());
}

export default function AdminLayoutClient({
  children,
  site,
  logoNav,
}: {
  children: React.ReactNode;
  site: SiteInfo;
  logoNav: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const collapsed = useSyncExternalStore(subscribe, getSnapshot, () => false);

  function toggleCollapsed() {
    const next = !collapsed;
    cached = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      // ignore quota / privacy mode errors
    }
    listeners.forEach((l) => l());
  }

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapsed}
        site={site}
        logoNav={logoNav}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}