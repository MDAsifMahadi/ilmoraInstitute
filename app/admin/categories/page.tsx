import { prisma } from "@/lib/prisma";
import CategoriesManager from "@/components/admin/CategoriesManager";

export const metadata = {
  title: "Categories",
};

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { courses: true } },
    },
  });

  return <CategoriesManager initialCategories={categories as never} />;
}
