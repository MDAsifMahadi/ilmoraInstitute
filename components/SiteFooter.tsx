import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import type { SiteInfo } from "@/lib/site";
import FooterCourseLinks from "@/components/FooterCourseLinks";

const FOOTER_LINKS = [
  { label: "কোর্সসমূহ", href: "/courses" },
  { label: "শিক্ষকবৃন্দ", href: "/teachers" },
  { label: "গ্যালারি", href: "/gallery" },
  { label: "ভিডিও", href: "/videos" },
  { label: "আমাদের সম্পর্কে", href: "/about" },
  { label: "যোগাযোগ", href: "/contact" },
  { label: "ভর্তি তথ্য", href: "/admission" },
];

function FacebookIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.62.77-1.62 1.56V12h2.76l-.44 2.89h-2.32v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M5.2 3.5A2.2 2.2 0 1 1 .8 3.5a2.2 2.2 0 0 1 4.4 0ZM1.1 8.4h4.2V23H1.1V8.4Zm7.1 0h4v2h.1c.6-1.1 2-2.3 4.2-2.3 4.5 0 5.3 2.9 5.3 6.7V23h-4.2v-7.1c0-1.7 0-3.9-2.4-3.9s-2.8 1.9-2.8 3.8V23H8.2V8.4Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L1.6 2H8l4.4 5.8L18.9 2Zm-1.1 17.8h1.7L7.1 4.1H5.2l12.6 15.7Z" />
    </svg>
  );
}

// Props come from the public layout (loaded from DB via getSiteInfo)
export default function SiteFooter({
  site,
  logoNav,
}: {
  site: SiteInfo;
  logoNav: string;
}) {
  return (
    <footer className="bg-navy text-[#cfd6e4]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src={logoNav}
                alt={`${site.name} লোগো`}
                height={58}
                width={58}
                className="h-[58px] w-auto"
              />
              <span className="flex flex-col leading-none">
                <span className="font-display text-2xl font-extrabold tracking-tight text-white">
                  {site.nameLatin?.split(" ")[0] || "Ilmora"}
                </span>
                <span className="mt-1 text-[9px] font-bold uppercase tracking-[3.5px] text-gold">
                  {site.nameLatin?.split(" ").slice(1).join(" ") || "Institute"}
                </span>
              </span>
            </div>
            <p className="font-serif text-xl text-gold/90" dir="ltr" lang="ar">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p className="max-w-sm text-sm leading-relaxed text-[#9aa6bd]">
              Knowledge that connects —{" "}
              <span className="font-serif" dir="ltr" lang="ar">
                العلم الذي يربط
              </span>{" "}
              — জ্ঞান যা সংযোগ করে। একেবারে হরফ থেকে তাজবীদসহ শুদ্ধ তিলাওয়াত
              পর্যন্ত, ধাপে ধাপে।
            </p>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[2px] text-white">
              দরকারি লিংক
            </h3>
            <ul className="grid grid-cols-1 gap-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#9aa6bd] transition-colors hover:pl-1 hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[2px] text-white">
              কোর্সসমূহ
            </h3>
            <FooterCourseLinks />
          </div>

          <div>
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[2px] text-white">
              যোগাযোগ
            </h3>
            <ul className="space-y-3.5 text-sm text-[#9aa6bd]">
              <li className="flex items-center gap-3">
                <Phone size={16} className="flex-none text-gold" />
                {site.phone}
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="flex-none text-gold" />
                {site.email}
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} className="flex-none text-gold" />
                {site.address}
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              {site.facebook && (
                <a
                  href={site.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[#9aa6bd] transition-all hover:-translate-y-0.5 hover:bg-gold hover:text-[#1c1400]"
                  aria-label="Facebook"
                >
                  <FacebookIcon />
                </a>
              )}
              {site.youtube && (
                <a
                  href={site.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[#9aa6bd] transition-all hover:-translate-y-0.5 hover:bg-gold hover:text-[#1c1400]"
                  aria-label="YouTube"
                >
                  <YoutubeIcon />
                </a>
              )}
              {site.linkedin && (
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[#9aa6bd] transition-all hover:-translate-y-0.5 hover:bg-gold hover:text-[#1c1400]"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon />
                </a>
              )}
              {site.x && (
                <a
                  href={site.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[#9aa6bd] transition-all hover:-translate-y-0.5 hover:bg-gold hover:text-[#1c1400]"
                  aria-label="X"
                >
                  <XIcon />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-[#8b97ad] sm:flex-row sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} {site.name}. সর্বস্বত্ব সংরক্ষিত।</span>
          <Link
            href="/admission"
            className="inline-flex items-center gap-1.5 font-bold text-gold transition-colors hover:text-white"
          >
            এখনই ভর্তি হোন
            <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </footer>
  );
}