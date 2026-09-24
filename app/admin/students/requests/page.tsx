import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Inbox } from "lucide-react";
import AdmissionRequestsTable from "@/components/admin/AdmissionRequestsTable";

export const metadata = {
  title: "Admission Requests",
};

export const dynamic = "force-dynamic";

export default async function AdmissionRequestsPage() {
  const requests = await prisma.admission.findMany({
    where: { status: "PENDING" },
    include: {
      student: true,
      course: {
        include: { category: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Admission Requests</h1>
          <p className="mt-0.5 text-sm text-grey">
            Requests submitted through the public admission form —{" "}
            {requests.length} pending
          </p>
        </div>
        <Link
          href="/admin/students"
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-cream"
        >
          <Inbox size={16} />
          Enrolled Students
        </Link>
      </div>

      <div className="rounded-xl border border-line bg-white">
        <AdmissionRequestsTable requests={requests} />
      </div>
    </div>
  );
}