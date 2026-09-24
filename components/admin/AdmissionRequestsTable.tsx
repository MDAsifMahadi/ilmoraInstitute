"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Check,
  X,
  Trash2,
  Phone,
  Clock,
  ShieldAlert,
  User,
} from "lucide-react";

interface RequestData {
  id: string;
  preferredTime: string | null;
  createdAt: Date;
  student: {
    id: string;
    name: string;
    phone: string;
    guardianName: string | null;
    guardianPhone: string | null;
    address: string | null;
  };
  course: {
    title: string;
    category: {
      name: string;
    };
  } | null;
}

export default function AdmissionRequestsTable({
  requests,
}: {
  requests: RequestData[];
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  async function updateStatus(id: string, status: "CONFIRMED" | "REJECTED") {
    setBusyId(id);
    try {
      await fetch(`/api/admissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } catch {
      // ignore
    } finally {
      setBusyId(null);
    }
  }

  async function deleteRequest(id: string) {
    setBusyId(id);
    try {
      await fetch(`/api/admissions/${id}`, { method: "DELETE" });
      router.refresh();
    } catch {
      // ignore
    } finally {
      setBusyId(null);
      setConfirmDeleteId(null);
    }
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-mist text-primary">
          <ShieldAlert size={22} />
        </span>
        <p className="mt-4 text-sm font-medium text-ink">
          No admission requests
        </p>
        <p className="mt-1 text-xs text-grey">
          Requests submitted through the public admission form will appear here
        </p>
        <Link
          href="/admin/students"
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Go to Enrolled Students
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line">
            <th className="whitespace-nowrap px-5 py-3 font-medium text-grey">
              Student
            </th>
            <th className="whitespace-nowrap px-5 py-3 font-medium text-grey hidden md:table-cell">
              Category
            </th>
            <th className="whitespace-nowrap px-5 py-3 font-medium text-grey hidden lg:table-cell">
              Course
            </th>
            <th className="whitespace-nowrap px-5 py-3 font-medium text-grey hidden sm:table-cell">
              Preferred Time
            </th>
            <th className="whitespace-nowrap px-5 py-3 font-medium text-grey hidden xl:table-cell">
              Requested
            </th>
            <th className="whitespace-nowrap px-5 py-3 font-medium text-grey text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr
              key={request.id}
              className="border-b border-line/50 last:border-0 hover:bg-cream/30"
            >
              <td className="whitespace-nowrap px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-mist text-primary">
                    <User size={14} />
                  </span>
                  <div>
                    <p className="font-medium text-ink">{request.student.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-grey">
                      <Phone size={11} />
                      {request.student.guardianPhone || request.student.phone}
                      {request.student.guardianName && (
                        <span className="ml-1">
                          ({request.student.guardianName})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-5 py-3 text-grey hidden md:table-cell">
                {request.course?.category?.name || "—"}
              </td>
              <td className="whitespace-nowrap px-5 py-3 text-grey hidden lg:table-cell">
                {request.course?.title || "—"}
              </td>
              <td className="whitespace-nowrap px-5 py-3 text-grey hidden sm:table-cell">
                {request.preferredTime ? (
                  <span className="inline-flex items-center gap-1">
                    <Clock size={11} />
                    {request.preferredTime}
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td className="whitespace-nowrap px-5 py-3 text-grey hidden xl:table-cell">
                {new Date(request.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="whitespace-nowrap px-5 py-3 text-right">
                <div className="inline-flex items-center gap-1.5">
                  <button
                    onClick={() => updateStatus(request.id, "CONFIRMED")}
                    disabled={busyId === request.id}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Check size={13} />
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(request.id, "REJECTED")}
                    disabled={busyId === request.id}
                    className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X size={13} />
                    Reject
                  </button>
                  <button
                    onClick={() =>
                      setConfirmDeleteId(
                        confirmDeleteId === request.id ? null : request.id
                      )
                    }
                    disabled={busyId === request.id}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-grey transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    title="Delete request"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                {confirmDeleteId === request.id && (
                  <div className="mt-2 flex items-center justify-end gap-2">
                    <span className="text-xs text-grey">
                      Delete this request?
                    </span>
                    <button
                      onClick={() => deleteRequest(request.id)}
                      disabled={busyId === request.id}
                      className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="rounded-lg border border-line px-2.5 py-1 text-xs text-ink transition-colors hover:bg-cream"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}