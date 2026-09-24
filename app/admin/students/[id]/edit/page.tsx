import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditStudentForm from "@/components/admin/EditStudentForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = await prisma.student.findUnique({ where: { id } });
  return { title: `${student?.name || "Student"} — Edit` };
}

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      admissions: {
        include: {
          course: { include: { category: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!student) notFound();

  return <EditStudentForm student={student} />;
}
