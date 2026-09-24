import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Breadcrumb = {
  label: string;
  href?: string;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs = [],
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-[#0f7b42] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-gold/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-gold/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='72' height='72' viewBox='0 0 72 72' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M36 6 L43 29 L66 36 L43 43 L36 66 L29 43 L6 36 L29 29 Z' fill='%23f2b705'/%3E%3Ccircle cx='36' cy='36' r='3' fill='%23f2b705'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {breadcrumbs.length > 0 && (
          <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-[13px] font-semibold text-white/75">
            {breadcrumbs.map((crumb, index) => (
              <span key={crumb.label} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight size={14} className="text-gold" />}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="transition-colors hover:text-gold"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gold">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && (
          <p className="mb-4 inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[3px]">
            <span className="h-px w-8 bg-gold" aria-hidden />
            {eyebrow}
            <span className="h-px w-8 bg-gold" aria-hidden />
          </p>
        )}
        <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}