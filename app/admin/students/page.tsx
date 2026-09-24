import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Users, Inbox } from "lucide-react";
import StudentsBoard from "@/components/admin/StudentsBoard";

export const metadata = {
  title: "Student Enrollment",
};

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const students = await prisma.student.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      admissions: {
        where: { status: "CONFIRMED" },
        include: {
          course: {
            include: { category: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const [pendingAdmissions, activeCount] = await Promise.all([
    prisma.admission.count({ where: { status: "PENDING" } }),
    prisma.student.count({ where: { status: "ACTIVE" } }),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-mist text-primary">
              <Users size={20} />
            </span>
            <div>
              <h1 className="text-xl font-bold text-ink">Student Enrollment</h1>
              <p className="mt-0.5 text-sm text-grey">
                {students.length} total · {activeCount} active ·{" "}
                {pendingAdmissions} pending requests
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/students/requests"
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <Inbox size={16} />
            Requests
            {pendingAdmissions > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-100 px-1.5 text-xs font-bold text-amber-700">
                {pendingAdmissions}
              </span>
            )}
          </Link>
          <Link
            href="/admin/students/new"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-md"
          >
            <Plus size={16} strokeWidth={2.5} />
            Add Student
          </Link>
        </div>
      </div>

      <StudentsBoard students={students} pendingCount={pendingAdmissions} />
    </div>
  );
}