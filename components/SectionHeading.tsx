import type { ReactNode } from "react";

export default function SectionHeading({
  eyebrow,
  title,
  desc,
  align = "center",
  tone = "light",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  desc?: string;
  align?: "center" | "left";
  tone?: "light" | "dark";
  className?: string;
}) {
  const alignment =
    align === "center" ? "mx-auto text-center" : "text-left";
  const onDark = tone === "dark";

  return (
    <div className={`max-w-3xl ${alignment} ${className}`}>
      {eyebrow && (
        <p
          className={`inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[3px] ${
            onDark ? "text-gold" : "text-primary"
          } ${align === "center" ? "justify-center" : ""}`}
        >
          <span className="h-px w-7 bg-gold" aria-hidden />
          {eyebrow}
          {align === "center" && <span className="h-px w-7 bg-gold" aria-hidden />}
        </p>
      )}
      <h2
        className={`mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl ${
          onDark ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {desc && (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
            onDark ? "text-white/80" : "text-grey"
          }`}
        >
          {desc}
        </p>
      )}
    </div>
  );
}