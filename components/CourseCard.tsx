import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock3, BookOpen } from "lucide-react";
import type { CourseCardData } from "@/lib/course-utils";

export default function CourseCard({ course }: { course: CourseCardData }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-primary-mist">
        {course.image ? (
          <Image
            src={course.image}
            alt={course.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen size={48} className="text-primary/25" strokeWidth={1.5} />
          </div>
        )}
        {course.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-[#1c1400] shadow-sm">
            {course.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
          {course.level || "কোর্স"} {course.duration ? `• ${course.duration}` : ""}
        </p>
        <h3 className="mt-2 font-display text-lg font-bold leading-snug text-ink transition-colors group-hover:text-primary">
          {course.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-grey">
          {course.shortDescription}
        </p>
        <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
            বিস্তারিত দেখুন
            <ArrowRight
              size={15}
              strokeWidth={2.5}
              className="transition-transform group-hover:translate-x-1"
            />
          </span>
          {course.sessionsPerWeek && (
            <span className="inline-flex items-center gap-1.5 text-xs text-grey">
              <Clock3 size={13} />
              {course.sessionsPerWeek}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}