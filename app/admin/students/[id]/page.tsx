import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit, Phone, Mail, MapPin, User, Calendar } from "lucide-react";
import DeleteStudentButton from "@/components/admin/DeleteStudentButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = await prisma.student.findUnique({ where: { id } });
  return { title: student?.name || "Student" };
}

export default async function StudentDetailPage({
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
          course: {
            include: { category: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!student) notFound();

  const enrolledAt = student.admissions.find(
    (a) => a.status === "CONFIRMED"
  )?.createdAt;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/students"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-grey transition-colors hover:bg-cream hover:text-ink"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-ink">{student.name}</h1>
            <p className="mt-0.5 text-sm text-grey">
              Enrolled:{" "}
              {new Date(enrolledAt || student.createdAt).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/students/${student.id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-cream"
          >
            <Edit size={14} />
            Edit
          </Link>
          <DeleteStudentButton studentId={student.id} />
        </div>
      </div>

      {/* Status Badge */}
      <div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
            student.status === "ACTIVE"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-grey/10 text-grey"
          }`}
        >
          {student.status === "ACTIVE" ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Basic Info */}
      <div className="rounded-xl border border-line bg-white p-5">
        <h2 className="mb-4 text-sm font-bold text-ink">Basic Info</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <InfoRow icon={<User size={16} />} label="Name" value={student.name} />
          <InfoRow
            icon={<Phone size={16} />}
            label="Phone"
            value={student.phone}
          />
          {student.email && (
            <InfoRow
              icon={<Mail size={16} />}
              label="Email"
              value={student.email}
            />
          )}
          {student.gender && (
            <InfoRow
              icon={<User size={16} />}
              label="Gender"
              value={
                student.gender === "MALE"
                  ? "Male"
                  : student.gender === "FEMALE"
                  ? "Female"
                  : student.gender
              }
            />
          )}
          {student.age && (
            <InfoRow
              icon={<Calendar size={16} />}
              label="Age"
              value={`${student.age} years`}
            />
          )}
          {student.dateOfBirth && (
            <InfoRow
              icon={<Calendar size={16} />}
              label="Date of Birth"
              value={student.dateOfBirth}
            />
          )}
        </div>
      </div>

      {/* Guardian Info */}
      {(student.guardianName || student.guardianPhone) && (
        <div className="rounded-xl border border-line bg-white p-5">
          <h2 className="mb-4 text-sm font-bold text-ink">
            Guardian Info
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {student.guardianName && (
              <InfoRow
                icon={<User size={16} />}
                label="Guardian Name"
                value={student.guardianName}
              />
            )}
            {student.guardianPhone && (
              <InfoRow
                icon={<Phone size={16} />}
                label="Guardian Phone"
                value={student.guardianPhone}
              />
            )}
          </div>
        </div>
      )}

      {/* Address */}
      {(student.address || student.country) && (
        <div className="rounded-xl border border-line bg-white p-5">
          <h2 className="mb-4 text-sm font-bold text-ink">Address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {student.address && (
              <InfoRow
                icon={<MapPin size={16} />}
                label="Address"
                value={student.address}
              />
            )}
            {student.country && (
              <InfoRow
                icon={<MapPin size={16} />}
                label="Country"
                value={student.country}
              />
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {student.notes && (
        <div className="rounded-xl border border-line bg-white p-5">
          <h2 className="mb-4 text-sm font-bold text-ink">Notes</h2>
          <p className="text-sm text-grey">{student.notes}</p>
        </div>
      )}

      {/* Admissions */}
      <div className="rounded-xl border border-line bg-white p-5">
        <h2 className="mb-4 text-sm font-bold text-ink">Admissions</h2>
        {student.admissions.length === 0 ? (
          <p className="text-sm text-grey">No admissions yet</p>
        ) : (
          <div className="space-y-3">
            {student.admissions.map((admission) => (
              <div
                key={admission.id}
                className="flex items-center justify-between rounded-lg border border-line/50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-ink">
                    {admission.course?.title || "No course assigned"}
                  </p>
                  <p className="mt-0.5 text-xs text-grey">
                    {admission.course?.category?.name || ""}{" "}
                    {admission.preferredTime &&
                      `• ${admission.preferredTime}`}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      admission.status === "CONFIRMED"
                        ? "bg-emerald-50 text-emerald-700"
                        : admission.status === "PENDING"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-grey/10 text-grey"
                    }`}
                  >
                    {admission.status === "CONFIRMED"
                      ? "Confirmed"
                      : admission.status === "PENDING"
                      ? "Pending"
                      : "Cancelled"}
                  </span>
                  <p className="mt-1 text-xs text-grey">
                    {new Date(admission.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-grey">{icon}</span>
      <div>
        <p className="text-xs text-grey">{label}</p>
        <p className="text-sm font-medium text-ink">{value}</p>
      </div>
    </div>
  );
}
