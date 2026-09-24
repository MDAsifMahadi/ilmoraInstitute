"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CourseLink {
  slug: string;
  title: string;
}

export default function FooterCourseLinks() {
  const [courses, setCourses] = useState<CourseLink[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/courses?published=true")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: CourseLink[]) => {
        if (!cancelled) setCourses(Array.isArray(data) ? data.slice(0, 5) : []);
      })
      .catch(() => {
        if (!cancelled) setCourses([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (courses.length === 0) {
    return (
      <ul className="grid grid-cols-1 gap-3">
        {[0, 1, 2].map((i) => (
          <li
            key={i}
            className="h-4 w-32 animate-pulse rounded bg-white/10"
            aria-hidden
          />
        ))}
      </ul>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-3">
      {courses.map((course) => (
        <li key={course.slug}>
          <Link
            href={`/courses/${course.slug}`}
            className="text-sm text-[#9aa6bd] transition-colors hover:pl-1 hover:text-gold"
          >
            {course.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}