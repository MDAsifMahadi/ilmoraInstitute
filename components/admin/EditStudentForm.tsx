"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

interface StudentData {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  dateOfBirth: string | null;
  age: number | null;
  gender: string | null;
  guardianName: string | null;
  guardianPhone: string | null;
  address: string | null;
  country: string | null;
  notes: string | null;
  status: string;
  admissions: {
    preferredTime: string | null;
    course: {
      title: string;
      category: { name: string };
    } | null;
  }[];
}

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-grey focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10";
const labelClass = "mb-1.5 block text-sm font-medium text-ink";
const selectClass =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10";

export default function EditStudentForm({ student }: { student: StudentData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name") as string,
      phone: form.get("phone") as string,
      email: form.get("email") as string || null,
      dateOfBirth: form.get("dateOfBirth") as string || null,
      age: form.get("age") ? parseInt(form.get("age") as string) : null,
      gender: form.get("gender") as string || null,
      guardianName: form.get("guardianName") as string || null,
      guardianPhone: form.get("guardianPhone") as string || null,
      address: form.get("address") as string || null,
      country: form.get("country") as string || null,
      notes: form.get("notes") as string || null,
      status: form.get("status") as string,
    };

    try {
      const res = await fetch(`/api/students/${student.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update student");
      }

      router.push(`/admin/students/${student.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex items-center gap-3">
        <Link
          href={`/admin/students/${student.id}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-grey transition-colors hover:bg-cream hover:text-ink"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-ink">
            {student.name} — Edit
          </h1>
          <p className="mt-0.5 text-sm text-grey">
            Update student information
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-xl border border-line bg-white p-5">
          <h2 className="mb-4 text-sm font-bold text-ink">Basic Info</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className={labelClass}>
                Name *
              </label>
              <input
                id="name"
                name="name"
                required
                defaultValue={student.name}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>
                Phone *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                defaultValue={student.phone}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={student.email || ""}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="dateOfBirth" className={labelClass}>
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                defaultValue={student.dateOfBirth || ""}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="age" className={labelClass}>
                Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min={1}
                max={120}
                defaultValue={student.age || ""}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="gender" className={labelClass}>
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                defaultValue={student.gender || ""}
                className={selectClass}
              >
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className={labelClass}>
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={student.status}
                className={selectClass}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Guardian Info */}
        <div className="rounded-xl border border-line bg-white p-5">
          <h2 className="mb-4 text-sm font-bold text-ink">
            Guardian Info
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="guardianName" className={labelClass}>
                Guardian Name
              </label>
              <input
                id="guardianName"
                name="guardianName"
                defaultValue={student.guardianName || ""}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="guardianPhone" className={labelClass}>
                Guardian Phone
              </label>
              <input
                id="guardianPhone"
                name="guardianPhone"
                type="tel"
                defaultValue={student.guardianPhone || ""}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="rounded-xl border border-line bg-white p-5">
          <h2 className="mb-4 text-sm font-bold text-ink">Address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="address" className={labelClass}>
                Address
              </label>
              <input
                id="address"
                name="address"
                defaultValue={student.address || ""}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="country" className={labelClass}>
                Country
              </label>
              <input
                id="country"
                name="country"
                defaultValue={student.country || ""}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-xl border border-line bg-white p-5">
          <h2 className="mb-4 text-sm font-bold text-ink">Additional Info</h2>
          <div>
            <label htmlFor="notes" className={labelClass}>
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              defaultValue={student.notes || ""}
              className={inputClass}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
            <Save size={16} />
            {loading ? "Updating..." : "Update"}
          </button>
          <Link
            href={`/admin/students/${student.id}`}
            className="rounded-lg border border-line px-5 py-2.5 text-sm font-medium text-grey transition-colors hover:bg-cream hover:text-ink"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
