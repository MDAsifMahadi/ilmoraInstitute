import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  MonitorPlay,
  Quote,
  UserCheck,
  Users,
  Video,
} from "lucide-react";
import CourseCard from "@/components/CourseCard";
import TeacherCard from "@/components/TeacherCard";
import SectionHeading from "@/components/SectionHeading";
import AdmissionCTA from "@/components/AdmissionCTA";
import GalleryGrid from "@/components/GalleryGrid";
import VideoCard from "@/components/VideoCard";
import Reveal from "@/components/Reveal";
import StatsCounter from "@/components/StatsCounter";
import { prisma } from "@/lib/prisma";
import { toCourseCardData } from "@/lib/course-utils";
import { getSiteData } from "@/lib/site-data";
import { getIcon } from "@/lib/icons";

const PILLARS = [
  "০১ বাংলা",
  "০২ আরবি",
  "০৩ ইংরেজি",
];

export const dynamic = "force-dynamic";

export default async function Home() {
  const siteData = await getSiteData();
  const {
    SITE,
    TEACHERS,
    GALLERY,
    VIDEOS,
    TESTIMONIALS,
    STATS,
    FEATURES,
    ADMISSION_STEPS,
    FAQ,
    HERO_IMAGE,
  } = siteData;

  const featuredCourses = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: [{ pinOnHome: "desc" }, { sortOrder: "asc" }],
    select: {
      slug: true,
      title: true,
      badge: true,
      level: true,
      duration: true,
      sessionsPerWeek: true,
      shortDescription: true,
      image: true,
    },
    take: 3,
  });

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #f2b705, transparent 65%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-32 h-[520px] w-[520px] rounded-full opacity-[0.13] blur-3xl"
          style={{ background: "radial-gradient(circle, #0e6b3a, transparent 65%)" }}
        />
        {/* futuristic drifting gradient orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-[8%] top-[18%] h-40 w-40 rounded-full bg-gold/25 blur-3xl animate-[blob-drift_14s_ease-in-out_infinite]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-[42%] bottom-[18%] h-48 w-48 rounded-full bg-primary/15 blur-3xl animate-[blob-drift_18s_ease-in-out_infinite_reverse]"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div className="relative">
            {/* decorative dashed orbit ring */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-8 -top-10 hidden h-24 w-24 rounded-full border-2 border-dashed border-gold/40 md:block animate-[spin-slow_18s_linear_infinite]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-2 top-6 hidden h-3 w-3 rounded-full bg-gold/70 lg:block animate-[glow-pulse_3s_ease-in-out_infinite]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-3 bottom-16 hidden h-2.5 w-2.5 rounded-full bg-primary/60 lg:block animate-[float_5s_ease-in-out_infinite]"
            />

            <Reveal>
              <p className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white/70 px-5 py-2 text-[13px] font-semibold text-grey shadow-sm backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                {SITE.admissionOpen
                  ? "ভর্তি চলছে — বাংলাদেশ · আরব বিশ্ব · ইউরোপ"
                  : "নতুন ভর্তির তালিকা শীঘ্রই চালু হচ্ছে"}
              </p>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="mt-7 font-serif text-[42px] font-bold leading-[1.18] tracking-tight sm:text-5xl lg:text-[64px]">
                <span
                  dir="rtl"
                  lang="ar"
                  className="inline-block bg-gradient-to-r from-gold via-gold-dark to-primary bg-[length:250%_auto] bg-clip-text text-transparent animate-[shimmer_6s_linear_infinite]"
                >
                  {SITE.heroArabicText}
                </span>
                <span className="relative mt-5 block font-display text-base font-black uppercase tracking-[0.18em] text-primary sm:text-lg">
                  {SITE.tagline}
                  <svg
                    aria-hidden
                    viewBox="0 0 260 10"
                    fill="none"
                    className="absolute -bottom-3 left-0 h-2.5 w-full max-w-md"
                  >
                    <path
                      d="M2 6 C 60 -1, 200 12, 258 3"
                      stroke="var(--color-gold)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="240"
                      className="animate-[draw-underline_1.4s_ease-out_0.8s_forwards]"
                      style={{ strokeDashoffset: 240 }}
                    />
                  </svg>
                </span>
              </h1>
            </Reveal>

            <Reveal delay={180}>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-grey sm:text-lg">
                {SITE.description}
              </p>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-9 flex flex-col gap-3.5 sm:flex-row">
                <Link
                  href="/admission"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-dark px-9 py-4 text-base font-bold text-[#1c1400] shadow-lg shadow-gold/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/40 sm:w-auto"
                >
                  ভর্তি হোন
                  <ArrowRight
                    size={18}
                    strokeWidth={2.5}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  href="/courses"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink/20 bg-white/60 px-9 py-4 text-base font-semibold text-ink backdrop-blur-md transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white sm:w-auto"
                >
                  কোর্স দেখুন
                  <ArrowUpRight
                    size={18}
                    strokeWidth={2.5}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={340}>
              <div className="mt-12 flex flex-wrap items-center gap-x-9 gap-y-4">
                {PILLARS.map((pillar, i) => {
                  const [num, ...rest] = pillar.split(" ");
                  return (
                    <span
                      key={pillar}
                      className="group flex items-center gap-2.5 text-sm font-bold text-grey"
                    >
                      <span
                        className="flex h-9 w-12 items-center justify-center rounded-lg border-2 border-line bg-white/70 font-display text-[11px] font-black text-primary shadow-sm backdrop-blur-md transition-colors duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-[#1c1400]"
                        style={{ animation: `float 5s ease-in-out ${i * 0.6}s infinite` }}
                      >
                        {num}
                      </span>
                      {rest.join(" ")}
                    </span>
                  );
                })}
              </div>
            </Reveal>
          </div>

          <Reveal delay={200} className="relative">
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-6 -top-8 h-44 w-44 rounded-3xl bg-gold/20 sm:-right-10"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-primary/10 blur-2xl"
              />
              <div className="relative aspect-[8/5] overflow-hidden rounded-[2rem] border-[10px] border-white bg-white shadow-2xl">
                <Image
                  src={HERO_IMAGE}
                  alt={`${SITE.name}-এর hero image`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  className="object-cover"
                />
              </div>

              <div className="absolute -left-2 top-10 flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-xl sm:-left-8">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-gold text-[#1c1400]">
                  <Users size={20} />
                </span>
                <div>
                  <p className="font-display text-lg font-black leading-none text-ink">
                    {STATS[0]?.value || "—"}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-grey">
                    {STATS[0]?.label || "শিক্ষার্থী"}
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-6 right-4 flex animate-[float_6s_ease-in-out_infinite] items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-xl sm:right-8">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-primary-mist text-primary">
                  <MonitorPlay size={20} />
                </span>
                <div>
                  <p className="font-display text-sm font-black leading-none text-ink">
                    লাইভ ইন্টারেক্টিভ
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-grey">
                    প্রতি ক্লাস
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Stats strip */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary-dark via-primary to-[#0f7b42]">
          {/* geometric pattern overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='72' height='72' viewBox='0 0 72 72' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M36 6 L43 29 L66 36 L43 43 L36 66 L29 43 L6 36 L29 29 Z' fill='%23f2b705'/%3E%3Ccircle cx='36' cy='36' r='3' fill='%23f2b705'/%3E%3C/svg%3E\")",
            }}
          />
          {/* soft glow accents */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 top-0 h-full w-64 bg-gold/10 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 top-0 h-full w-64 bg-white/10 blur-3xl"
          />
          <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
            {STATS.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 100}>
                <div className="group relative text-center">
                  <StatsCounter value={stat.value} />
                  <p className="mt-2 text-sm font-semibold text-white/85">
                    {stat.label}
                  </p>
                  {/* hover accent underline */}
                  <span
                    aria-hidden
                    className="absolute -bottom-2 left-1/2 h-0.5 w-0 rounded-full bg-gold transition-all duration-500 group-hover:w-16"
                    style={{ transform: "translateX(-50%)" }}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="কেন ইলমুরা"
            title={
              <>
                শেখার জন্য সাজানো <span className="text-gold">সুন্দর কাঠামো</span>
              </>
            }
            desc="শিশু থেকে বৃদ্ধ — সবার জন্য সহজ, নমনীয় ও মানসম্মত কুরআন শিক্ষা।"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, index) => {
              const Icon = getIcon(feature.icon);
              return (
                <Reveal key={feature.title} delay={index * 80} as="div">
                  <div className="group h-full rounded-2xl border border-line bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/20 hover:shadow-lg">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-mist text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <Icon size={24} strokeWidth={2} />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-bold text-ink">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-grey">
                      {feature.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== COURSES ===== */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="আমাদের কোর্সসমূহ"
            title={
              <>
                কুরআন শেখার প্রতিটি <span className="text-gold">ধাপে</span> সাথে
                আছি
              </>
            }
            desc="ভর্তির জন্য আগ্রহী কোর্সটি বেছে নিন — প্রতিটি কোর্সই লাইভ ক্লাসে পরিচালিত হয়।"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course, index) => (
              <Reveal key={course.slug} delay={index * 80}>
                <CourseCard course={toCourseCardData(course)} />
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-12 text-center">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-8 py-3.5 text-base font-bold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                সকল কোর্স দেখুন
                <ArrowRight size={17} strokeWidth={2.5} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== ADMISSION STEPS ===== */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary-dark via-primary to-[#0f7b42] py-20 text-white sm:py-24">
        {/* star pattern overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='72' height='72' viewBox='0 0 72 72' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M36 6 L43 29 L66 36 L43 43 L36 66 L29 43 L6 36 L29 29 Z' fill='%23f2b705'/%3E%3Ccircle cx='36' cy='36' r='3' fill='%23f2b705'/%3E%3C/svg%3E\")",
          }}
        />
        {/* animated background orbs — breathing glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-1/4 h-64 w-64 rounded-full bg-gold/20 blur-3xl animate-[glow-breathe_7s_ease-in-out_infinite,blob-drift_16s_ease-in-out_infinite]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 bottom-1/4 h-72 w-72 rounded-full bg-white/15 blur-3xl animate-[glow-breathe_9s_ease-in-out_1.2s_infinite,blob-drift_20s_ease-in-out_infinite_reverse]"
        />
        {/* rotating dashed ring */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -left-16 hidden h-72 w-72 rounded-full border-[3px] border-dashed border-gold/25 lg:block animate-[spin-slow_42s_linear_infinite]"
        />
        {/* glowing particle with sonar ripple */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-[12%] top-10 h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_14px_rgba(242,183,5,0.9)] animate-[glow-breathe_4s_ease-in-out_infinite,float_7s_ease-in-out_infinite]"
        >
          <span className="absolute inset-0 rounded-full bg-gold animate-[ripple_2.6s_ease-out_0.6s_infinite]" />
          <span className="absolute inset-0 rounded-full bg-gold animate-[ripple_2.6s_ease-out_1.9s_infinite]" />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute right-[18%] top-16 hidden h-2 w-2 rounded-full bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.8)] sm:block animate-[glow-pulse_3.5s_ease-in-out_infinite]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-14 left-[30%] h-3 w-3 rounded-full bg-gold/60 blur-[2px] shadow-[0_0_16px_rgba(242,183,5,0.7)] animate-[glow-breathe_5s_ease-in-out_0.8s_infinite]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-12 right-[8%] hidden h-2 w-2 rounded-full bg-white/70 shadow-[0_0_10px_rgba(255,255,255,0.7)] sm:block animate-[glow-breathe_4.5s_ease-in-out_1.6s_infinite,float_6s_ease-in-out_infinite]"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tone="dark"
            eyebrow="ভর্তি প্রক্রিয়া"
            title={
              <>
                মাত্র <span className="text-gold">৩টি ধাপে</span> ভর্তি সম্পন্ন
              </>
            }
            desc="অনলাইনে আবেদনের মাধ্যমে ঘরে বসেই সম্পূর্ণ ভর্তি প্রক্রিয়া শেষ করুন।"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {ADMISSION_STEPS.map((step, index) => (
              <Reveal key={step.step} delay={index * 100}>
                <div className="group h-full rounded-2xl border border-white/15 bg-white/5 p-7 backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/70 hover:bg-white/10">
                  <p className="font-display text-4xl font-black text-gold">
                    {step.step}
                  </p>
                  <h3 className="mt-4 font-display text-lg font-bold">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70 transition-colors group-hover:text-white/95">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-12 text-center">
              <Link
                href="/admission"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-9 py-4 text-base font-bold text-[#1c1400] shadow-lg transition-all hover:-translate-y-1 hover:bg-gold-dark hover:shadow-xl"
              >
                ভর্তি ফরম পূরণ করুন
                <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== TEACHERS ===== */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="আমাদের শিক্ষকবৃন্দ"
            title={
              <>
                অভিজ্ঞ ও <span className="text-gold">সনদপ্রাপ্ত</span> শিক্ষকগণ
              </>
            }
            desc="প্রতিটি ক্লাসে আছেন যত্নশীল ও দক্ষ শিক্ষক, যাঁরা প্রতিটি শিক্ষার্থীর অগ্রগতি নিশ্চিত করেন।"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEACHERS.slice(0, 3).map((teacher, index) => (
              <Reveal key={teacher.name} delay={index * 80}>
                <TeacherCard teacher={teacher} index={index} />
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              {[
                { icon: UserCheck, label: "যত্নশীল তত্ত্বাবধান" },
                { icon: BadgeCheck, label: "সনদপ্রাপ্ত শিক্ষক" },
                { icon: MonitorPlay, label: "লাইভ ক্লাস" },
              ].map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-grey"
                >
                  <chip.icon size={15} className="text-primary" />
                  {chip.label}
                </span>
              ))}
              <Link
                href="/teachers"
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-7 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                সকল শিক্ষক
                <ArrowUpRight size={15} strokeWidth={2.5} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="গ্যালারি"
            title={
              <>
                আমাদের কার্যক্রমের কিছু <span className="text-gold">মুহূর্ত</span>
              </>
            }
            desc="ক্লাস, তিলাওয়াত ও বিভিন্ন আয়োজনের ছবি এক নজরে।"
          />
          <div className="mt-14">
            <GalleryGrid items={GALLERY.slice(0, 6)} />
          </div>
          <Reveal>
            <div className="mt-12 text-center">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-8 py-3.5 text-base font-bold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                সম্পূর্ণ গ্যালারি
                <ArrowRight size={17} strokeWidth={2.5} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== VIDEOS ===== */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="ভিডিও"
            title={
              <>
                দেখুন ও <span className="text-gold">অনুশীলন করুন</span>
              </>
            }
            desc="শিক্ষামূলক ভিডিও ও মনোমুগ্ধকর তিলাওয়াত — যেকোনো সময় দেখে অনুশীলন করতে পারবেন।"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {VIDEOS.slice(0, 2).map((video, index) => (
              <Reveal key={video.id} delay={index * 80}>
                <VideoCard video={video} />
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-12 text-center">
              <Link
                href="/videos"
                className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-8 py-3.5 text-base font-bold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                <Video size={17} />
                সকল ভিডিও
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="শিক্ষার্থীদের মতামত"
            title={
              <>
                তাঁরা যা <span className="text-gold">বলছেন</span>
              </>
            }
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((testimonial, index) => {
              const initials = testimonial.name
                .replace(/^ডেমো\s+/u, "")
                .trim()
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((word) => Array.from(word)[0])
                .join("");

              return (
                <Reveal key={testimonial.name} delay={index * 80}>
                  <figure className="flex h-full flex-col rounded-2xl border border-line bg-cream p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <Quote size={28} className="text-gold" fill="currentColor" />
                    <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink/75">
                      {testimonial.quote}
                    </blockquote>
                    <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                      <span className="relative flex h-10 w-10 flex-none items-center justify-center overflow-hidden rounded-full bg-primary font-display text-sm font-bold text-white">
                        {testimonial.image ? (
                          <Image
                            src={testimonial.image}
                            alt={`${testimonial.name}-এর ছবি`}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <span aria-hidden>{initials || "অ"}</span>
                        )}
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-ink">
                          {testimonial.name}
                        </span>
                        <span className="block text-xs text-grey">
                          {testimonial.relation}
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="bg-cream py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="সাধারণ জিজ্ঞাসা"
            title={
              <>
                যা-যা প্রায়ই <span className="text-gold">জিজ্ঞাসা</span> করা হয়
              </>
            }
          />
          <div className="mt-12 space-y-4">
            {FAQ.map((item, index) => (
              <Reveal key={item.q} delay={index * 60}>
                <details className="group rounded-2xl border border-line bg-white p-6 shadow-sm open:shadow-md">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-bold text-ink">
                    {item.q}
                    <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-primary-mist text-lg text-primary transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-grey">
                    {item.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
          <p className="mt-10 flex items-center justify-center gap-2 text-center text-sm text-grey">
            <Users size={15} className="text-primary" />
            আরও প্রশ্ন থাকলে{" "}
            <Link href="/contact" className="font-bold text-primary underline">
              যোগাযোগ
            </Link>{" "}
            করুন অথবা এখনই{" "}
            <Link href="/admission" className="font-bold text-primary underline">
              ভর্তি হোন
            </Link>
            ।
          </p>
        </div>
      </section>

      <AdmissionCTA />
    </>
  );
}