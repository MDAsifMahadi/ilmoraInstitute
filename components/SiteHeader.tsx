"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import type { SiteInfo } from "@/lib/site";

const NAV_LINKS = [
  { href: "/", label: "হোম" },
  { href: "/courses", label: "কোর্সসমূহ" },
  { href: "/teachers", label: "শিক্ষকবৃন্দ" },
  { href: "/gallery", label: "গ্যালারি" },
  { href: "/videos", label: "ভিডিও" },
  { href: "/about", label: "আমাদের সম্পর্কে" },
  { href: "/contact", label: "যোগাযোগ" },
];

export default function SiteHeader({
  site,
  logo,
}: {
  site: SiteInfo;
  logo: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-3"
            onClick={() => setOpen(false)}
          >
            <span className="relative block h-12 w-36 flex-none sm:w-44">
              <Image
                src={logo}
                alt={`${site.name} লোগো`}
                fill
                sizes="176px"
                className="object-contain object-left"
                priority
              />
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative pb-1 text-sm font-semibold transition-colors ${
                    active ? "text-primary" : "text-grey hover:text-primary"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-gold transition-all ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/admission"
              className="hidden items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-sm font-bold text-[#1c1400] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-gold-dark hover:shadow-md sm:inline-flex"
            >
              ভর্তি হোন
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
            <button
              type="button"
              aria-label="মেনু খুলুন"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink lg:hidden"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div
          data-sidebar-backdrop
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-ink/60 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          role="dialog"
          aria-modal="true"
          aria-label="মোবাইল মেনু"
          className={`absolute right-0 top-0 flex h-full w-[84%] max-w-sm flex-col bg-cream shadow-2xl transition-transform duration-300 ease-out will-change-transform ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3"
            >
              <span className="relative block h-11 w-32 flex-none">
                <Image
                  src={logo}
                  alt={`${site.name} লোগো`}
                  fill
                  sizes="128px"
                  className="object-contain object-left"
                />
              </span>
            </Link>
            <button
              type="button"
              aria-label="মেনু বন্ধ করুন"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-lg border border-line text-ink transition-colors hover:bg-primary-mist hover:text-primary"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-4">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-primary text-white"
                        : "text-grey hover:bg-primary-mist hover:text-primary"
                    }`}
                  >
                    {link.label}
                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="border-t border-line px-5 py-5">
            <Link
              href="/admission"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-full bg-gold px-4 py-3.5 text-sm font-bold text-[#1c1400] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-gold-dark hover:shadow-md"
            >
              ভর্তি হোন
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
            <p className="mt-3 text-center text-xs text-grey">
              ইউরোপ · আরব বিশ্ব · বাংলাদেশ
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}