export type CourseCardData = {
  slug: string;
  title: string;
  badge: string | null;
  level: string | null;
  duration: string | null;
  sessionsPerWeek: string | null;
  shortDescription: string | null;
  image: string | null;
};

export function toCourseCardData(
  course: {
    slug: string;
    title: string;
    badge: string | null;
    level: string | null;
    duration: string | null;
    sessionsPerWeek: string | null;
    shortDescription: string | null;
    image: string | null;
  }
): CourseCardData {
  return {
    slug: course.slug,
    title: course.title,
    badge: course.badge,
    level: course.level,
    duration: course.duration,
    sessionsPerWeek: course.sessionsPerWeek,
    shortDescription: course.shortDescription,
    image: course.image,
  };
}

export const COURSE_ICON_OPTIONS = [
  { value: "BookOpen", label: "বই (BookOpen)" },
  { value: "BookOpenText", label: "খোলা বই (BookOpenText)" },
  { value: "ScrollText", label: "স্ক্রল (ScrollText)" },
  { value: "Award", label: "অ্যাওয়ার্ড (Award)" },
  { value: "Sparkles", label: "স্পার্কলস (Sparkles)" },
  { value: "GraduationCap", label: "গ্র্যাজুয়েশন (GraduationCap)" },
  { value: "Library", label: "লাইব্রেরি (Library)" },
  { value: "PenLine", label: "কলম (PenLine)" },
  { value: "Mic", label: "মাইক্রোফোন (Mic)" },
] as const;