import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  BookOpenText,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Library,
  Mic,
  MonitorPlay,
  PenLine,
  ScrollText,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toCourseCardData } from "@/lib/course-utils";
import AdmissionCTA from "@/components/AdmissionCTA";
import CourseCard from "@/components/CourseCard";

export const dynamic = "force-dynamic";

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen,
  BookOpenText,
  ScrollText,
  Award,
  Sparkles,
  GraduationCap,
  Library,
  PenLine,
  Mic,
};

const courseSelect = {
  slug: true,
  title: true,
  tagline: true,
  shortDescription: true,
  description: true,
  badge: true,
  level: true,
  icon: true,
  image: true,
  duration: true,
  sessionsPerWeek: true,
  ageRange: true,
  format: true,
  price: true,
  outcomes: true,
  curriculum: true,
} as const;

const cardSelect = {
  slug: true,
  title: true,
  badge: true,
  level: true,
  duration: true,
  sessionsPerWeek: true,
  shortDescription: true,
  image: true,
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await prisma.course.findFirst({
    where: { slug, isPublished: true },
    select: { title: true, shortDescription: true },
  });
  if (!course) return { title: "কোর্স পাওয়া যায়নি" };
  return {
    title: course.title,
    description: course.shortDescription || undefined,
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [course, otherCourses] = await Promise.all([
    prisma.course.findFirst({
      where: { slug, isPublished: true },
      select: courseSelect,
    }),
    prisma.course.findMany({
      where: { isPublished: true, NOT: { slug } },
      orderBy: { sortOrder: "asc" },
      select: cardSelect,
      take: 3,
    }),
  ]);

  if (!course) notFound();

  const Icon = course.icon && ICON_MAP[course.icon] ? ICON_MAP[course.icon] : BookOpen;

  return (
    <>
      <section className="bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm font-medium text-ink/50">
            <Link href="/" className="hover:text-primary">
              হোম
            </Link>
            <span aria-hidden>/</span>
            <Link href="/courses" className="hover:text-primary">
              কোর্সসমূহ
            </Link>
            <span aria-hidden>/</span>
            <span className="text-primary">{course.title}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-primary-mist shadow-md">
              {course.image ? (
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <BookOpen size={64} className="text-primary/25" strokeWidth={1.5} />
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                {course.badge && (
                  <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink">
                    {course.badge}
                  </span>
                )}
                {course.level && (
                  <span className="rounded-full bg-primary-mist px-3 py-1 text-xs font-bold text-primary">
                    {course.level}
                  </span>
                )}
              </div>
              <h1 className="mt-4 flex items-center gap-3 text-3xl font-bold leading-tight text-ink sm:text-4xl">
                <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-primary-mist text-primary">
                  <Icon size={26} strokeWidth={2} />
                </span>
                {course.title}
              </h1>
              {course.tagline && (
                <p className="mt-3 text-lg font-semibold text-primary">
                  {course.tagline}
                </p>
              )}
              {course.description && (
                <p className="mt-4 text-base leading-relaxed text-grey">
                  {course.description}
                </p>
              )}

              <dl className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-line bg-cream p-5 sm:grid-cols-2">
                {course.duration && (
                  <div className="flex items-start gap-3">
                    <Clock3 size={18} className="mt-0.5 flex-none text-primary" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-grey">
                        সময়কাল
                      </dt>
                      <dd className="mt-0.5 font-bold text-ink">
                        {course.duration}
                      </dd>
                    </div>
                  </div>
                )}
                {course.sessionsPerWeek && (
                  <div className="flex items-start gap-3">
                    <CalendarDays size={18} className="mt-0.5 flex-none text-primary" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-grey">
                        সাপ্তাহিক ক্লাস
                      </dt>
                      <dd className="mt-0.5 font-bold text-ink">
                        {course.sessionsPerWeek}
                      </dd>
                    </div>
                  </div>
                )}
                {course.format && (
                  <div className="flex items-start gap-3">
                    <MonitorPlay size={18} className="mt-0.5 flex-none text-primary" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-grey">
                        ক্লাসের ধরন
                      </dt>
                      <dd className="mt-0.5 font-bold text-ink">
                        {course.format}
                      </dd>
                    </div>
                  </div>
                )}
                {course.ageRange && (
                  <div className="flex items-start gap-3">
                    <UserRound size={18} className="mt-0.5 flex-none text-primary" />
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-grey">
                        ভর্তির যোগ্যতা
                      </dt>
                      <dd className="mt-0.5 font-bold text-ink">
                        {course.ageRange}
                      </dd>
                    </div>
                  </div>
                )}
              </dl>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/admission"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-bold text-[#1c1400] shadow-md transition-all hover:-translate-y-0.5 hover:bg-gold-dark hover:shadow-xl"
                >
                  এই কোর্সে ভর্তি হোন
                  <ArrowRight size={18} strokeWidth={2.5} />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary px-8 py-4 text-base font-bold text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  জিজ্ঞাসা করুন
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
              <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
                <Target size={20} className="text-primary" />
                এই কোর্সে যা অর্জন করবেন
              </h2>
              <ul className="mt-4 space-y-3">
                {course.outcomes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-grey">
                    <CheckCircle2 size={18} className="mt-0.5 flex-none text-primary" />
                    <span className="text-ink/75">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
              <h2 className="flex items-center gap-2 text-xl font-bold text-ink">
                <Library size={20} className="text-primary" />
                কোর্স কারিকুলাম
              </h2>
              <ol className="mt-4 space-y-3">
                {course.curriculum.map((item, index) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-grey">
                    <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="text-ink/75">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-ink sm:text-3xl">
            আরও কিছু কোর্স
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherCourses.map((course) => (
              <CourseCard key={course.slug} course={toCourseCardData(course)} />
            ))}
          </div>
        </div>
      </section>

      <AdmissionCTA />
    </>
  );
}