import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface StudentWithAdmission {
  id: string;
  name: string;
  phone: string;
  gender: string | null;
  status: string;
  createdAt: Date;
  admissions: {
    createdAt: Date;
    course: {
      title: string;
      category: {
        name: string;
      };
    } | null;
  }[];
}

const AVATAR_COLORS = [
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-teal-100 text-teal-700",
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function StudentAvatar({ name }: { name: string }) {
  return (
    <span
      className={`flex h-9 w-9 flex-none items-center justify-center rounded-full text-xs font-bold ${avatarColor(
        name
      )}`}
    >
      {getInitials(name)}
    </span>
  );
}

export default function RecentStudentsTable({
  students,
}: {
  students: StudentWithAdmission[];
}) {
  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
        <p className="text-sm text-grey">No students yet</p>
        <Link
          href="/admin/students/new"
          className="mt-3 text-sm font-medium text-primary hover:underline"
        >
          Add First Student
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="whitespace-nowrap px-5 py-2.5 font-medium text-grey">
                Name
              </th>
              <th className="whitespace-nowrap px-5 py-2.5 font-medium text-grey">
                Phone
              </th>
              <th className="whitespace-nowrap px-5 py-2.5 font-medium text-grey">
                Course
              </th>
              <th className="whitespace-nowrap px-5 py-2.5 font-medium text-grey">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const latestAdmission = student.admissions[0];
              return (
                <tr
                  key={student.id}
                  className="border-b border-line/50 last:border-0 hover:bg-cream/50"
                >
                  <td className="whitespace-nowrap px-5 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <StudentAvatar name={student.name} />
                      <Link
                        href={`/admin/students/${student.id}`}
                        className="font-medium text-ink hover:text-primary hover:underline"
                      >
                        {student.name}
                      </Link>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-2.5 text-grey">
                    {student.phone}
                  </td>
                  <td className="max-w-[220px] truncate px-5 py-2.5 text-grey">
                    <span className="block truncate">
                      {latestAdmission?.course?.title || "—"}
                    </span>
                    {latestAdmission?.course?.category?.name && (
                      <span className="block text-xs text-grey/70">
                        {latestAdmission.course.category.name}
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-5 py-2.5 text-grey">
                    {new Date(
                      latestAdmission?.createdAt || student.createdAt
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="divide-y divide-line/60 md:hidden">
        {students.map((student) => {
          const latestAdmission = student.admissions[0];
          const admitted = latestAdmission?.createdAt || student.createdAt;
          return (
            <Link
              key={student.id}
              href={`/admin/students/${student.id}`}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-cream/50"
            >
              <StudentAvatar name={student.name} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">
                  {student.name}
                </p>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-grey">
                  <span
                    className={`flex-none rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      student.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-grey/10 text-grey"
                    }`}
                  >
                    {student.status === "ACTIVE" ? "Active" : "Inactive"}
                  </span>
                  <span className="truncate">
                    {latestAdmission?.course?.title || "—"}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-grey/70">
                  {student.phone} ·{" "}
                  {new Date(admitted).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <ChevronRight size={16} className="flex-none text-grey" />
            </Link>
          );
        })}
      </div>
    </>
  );
}