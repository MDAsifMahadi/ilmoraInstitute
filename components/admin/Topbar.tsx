"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Bell, ExternalLink, LogOut } from "lucide-react";
import Link from "next/link";

export default function AdminTopbar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-line bg-white px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-grey transition-colors hover:bg-cream hover:text-ink lg:hidden"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm text-grey transition-colors hover:border-primary/30 hover:bg-primary-mist hover:text-primary"
        >
          <ExternalLink size={14} />
          <span className="hidden sm:inline">View Site</span>
        </Link>

        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-grey transition-colors hover:bg-cream hover:text-ink">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
          A
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-grey transition-colors hover:bg-red-50 hover:text-red-600"
          title="লগআউট"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
