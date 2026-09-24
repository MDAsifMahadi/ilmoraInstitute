import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { getSiteInfo } from "@/lib/site-data";

export default async function AdmissionCTA({
  title = "আজই শুরু হোক কুরআন শিক্ষার পবিত্র যাত্রা",
  description,
}: {
  title?: string;
  description?: string;
}) {
  const { SITE } = await getSiteInfo();
  const admissionOpen = SITE.admissionOpen;
  const ctaDescription =
    description ??
    (admissionOpen
      ? "ভর্তি চলছে! ফরম পূরণ করতে সময় লাগবে মাত্র কয়েক মিনিট। সীমিত আসন — দেরি করলে অপেক্ষা লম্বা হবে।"
      : "নতুন ভর্তির তালিকা শীঘ্রই চালু হচ্ছে। চালু হলে এখানে সরাসরি ভর্তির ফরম পাবেন।");

  return (
    <section className="bg-navy py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-dark via-primary to-[#0f7b42] px-6 py-14 text-center text-white shadow-2xl sm:px-12 sm:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-14 -top-14 h-56 w-56 rounded-full bg-gold/25 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-gold/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='72' height='72' viewBox='0 0 72 72' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M36 6 L43 29 L66 36 L43 43 L36 66 L29 43 L6 36 L29 29 Z' fill='%23f2b705'/%3E%3Ccircle cx='36' cy='36' r='3' fill='%23f2b705'/%3E%3C/svg%3E\")",
            }}
          />
          <div className="relative">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide text-[#1c1400]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1c1400] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1c1400]" />
              </span>
              {admissionOpen ? "ভর্তি চলছে" : "ভর্তি শীঘ্রই চালু হচ্ছে"}
            </p>
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold leading-snug tracking-tight sm:text-4xl">
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/85">
              {ctaDescription}
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/admission"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-bold text-[#1c1400] shadow-lg transition-all hover:-translate-y-1 hover:bg-gold-dark hover:shadow-xl"
              >
                {admissionOpen ? "অনলাইনে ভর্তি ফরম" : "ভর্তির তথ্য দেখুন"}
                <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/60 px-8 py-4 text-base font-semibold text-white transition-colors hover:border-gold hover:text-gold"
              >
                <BookOpen size={17} />
                কোর্স সম্পর্কে জানুন
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}