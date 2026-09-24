import { prisma } from "@/lib/prisma";
import CoursesManager from "@/components/admin/CoursesManager";

export const metadata = {
  title: "Courses",
};

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const [courses, categories] = await Promise.all([
    prisma.course.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        category: true,
        _count: { select: { admissions: true } },
      },
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <CoursesManager
      initialCourses={courses as never}
      categories={categories}
    />
  );
}