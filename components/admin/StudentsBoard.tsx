"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Download,
  X,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Users,
  UserCheck,
  UserX,
  Inbox,
  ChevronRight,
  LayoutGrid,
  List,
  SlidersHorizontal,
  BookOpen,
} from "lucide-react";

interface StudentData {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  age: number | null;
  guardianName: string | null;
  guardianPhone: string | null;
  address: string | null;
  country: string | null;
  notes: string | null;
  status: string;
  createdAt: Date;
  admissions: {
    id: string;
    status: string;
    createdAt: Date;
    course: {
      id: string;
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

const AVATAR_BANDS = [
  "from-emerald-50 to-teal-50",
  "from-sky-50 to-indigo-50",
  "from-violet-50 to-purple-50",
  "from-amber-50 to-orange-50",
  "from-rose-50 to-pink-50",
  "from-teal-50 to-emerald-50",
];

const VIEW_OPTIONS = [
  { key: "grid", label: "Grid", icon: <LayoutGrid size={16} /> },
  { key: "list", label: "List", icon: <List size={16} /> },
] as const;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function avatarColor(name: string): string {
  return AVATAR_COLORS[hashName(name) % AVATAR_COLORS.length];
}

function avatarBand(name: string): string {
  return AVATAR_BANDS[hashName(name) % AVATAR_BANDS.length];
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const active = status === "ACTIVE";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        active ? "bg-emerald-50 text-emerald-700" : "bg-grey/10 text-grey"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-grey/50"}`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function AvatarCircle({
  name,
  size = "h-9 w-9 text-xs",
}: {
  name: string;
  size?: string;
}) {
  return (
    <span
      className={`flex flex-none items-center justify-center rounded-full font-bold ${size} ${avatarColor(
        name
      )}`}
    >
      {getInitials(name)}
    </span>
  );
}

function CoursePill({ course }: { course: string }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-primary-mist px-2.5 py-0.5 text-xs font-medium text-primary">
      <BookOpen size={11} className="flex-none" />
      <span className="truncate">{course}</span>
    </span>
  );
}

export default function StudentsBoard({
  students,
  pendingCount,
}: {
  students: StudentData[];
  pendingCount: number;
}) {
  const [items, setItems] = useState<StudentData[]>(students);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [sort, setSort] = useState<"newest" | "name">("newest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<StudentData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StudentData | null>(null);
  const [deleting, setDeleting] = useState(false);

  const exportUrl = useMemo(() => {
    const params = new URLSearchParams({
      search: query,
      status: statusFilter,
    }).toString();
    return `/api/export/students?${params}`;
  }, [query, statusFilter]);

  const courseOptions = useMemo(() => {
    const map = new Map<string, string>();
    students.forEach((s) => {
      s.admissions.forEach((a) => {
        if (a.course) map.set(a.course.id, a.course.title);
      });
    });
    return Array.from(map.values()).sort((a, b) => a.localeCompare(b));
  }, [students]);

  const filtered = useMemo(() => {
    let list = items;

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.phone.toLowerCase().includes(q) ||
          (s.email || "").toLowerCase().includes(q) ||
          (s.guardianName || "").toLowerCase().includes(q)
      );
    }

    if (statusFilter) {
      list = list.filter((s) => s.status === statusFilter);
    }

    if (courseFilter) {
      list = list.filter((s) =>
        s.admissions.some((a) => a.course?.title === courseFilter)
      );
    }

    if (sort === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [items, query, statusFilter, courseFilter, sort]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelected(null);
        setDeleteTarget(null);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/students/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setItems((prev) => prev.filter((s) => s.id !== deleteTarget.id));
        setDeleteTarget(null);
        if (selected?.id === deleteTarget.id) setSelected(null);
      }
    } finally {
      setDeleting(false);
    }
  }

  const activeCount = items.filter((s) => s.status === "ACTIVE").length;
  const inactiveCount = items.length - activeCount;
  const hasFilters = Boolean(query || statusFilter || courseFilter);

  const stats = [
    {
      label: "Total Students",
      value: items.length,
      icon: <Users size={20} />,
      color: "bg-primary-mist text-primary",
    },
    {
      label: "Active",
      value: activeCount,
      icon: <UserCheck size={20} />,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Inactive",
      value: inactiveCount,
      icon: <UserX size={20} />,
      color: "bg-grey/10 text-grey",
    },
    {
      label: "Pending Requests",
      value: pendingCount,
      icon: <Inbox size={20} />,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const latestAdmission = (s: StudentData) => s.admissions[0];
  const courseLabel = (s: StudentData) =>
    latestAdmission(s)?.course?.title || "—";
  const categoryLabel = (s: StudentData) =>
    latestAdmission(s)?.course?.category?.name || "—";

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 transition-shadow hover:shadow-md"
          >
            <span
              className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl ${stat.color}`}
            >
              {stat.icon}
            </span>
            <div className="min-w-0">
              <p className="text-2xl font-bold leading-tight text-ink">
                {stat.value}
              </p>
              <p className="truncate text-xs text-grey">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-grey"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, phone, email, or guardian..."
            className="w-full rounded-xl border border-line bg-white py-2.5 pl-9 pr-10 text-sm text-ink shadow-sm transition-colors placeholder:text-grey focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-grey hover:text-ink"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors ${
              showFilters || hasFilters
                ? "border-primary/40 bg-primary-mist text-primary"
                : "border-line bg-white text-ink shadow-sm hover:border-primary/30"
            }`}
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasFilters && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-white">
                {(query ? 1 : 0) +
                  (statusFilter ? 1 : 0) +
                  (courseFilter ? 1 : 0)}
              </span>
            )}
          </button>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "newest" | "name")}
            className="rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink shadow-sm focus:border-primary focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="name">Name (A-Z)</option>
          </select>

          <div className="flex items-center rounded-xl border border-line bg-white p-1 shadow-sm">
            {VIEW_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setView(opt.key)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  view === opt.key
                    ? "bg-primary text-white"
                    : "text-grey hover:text-ink"
                }`}
              >
                {opt.icon}
                <span className="hidden sm:inline">{opt.label}</span>
              </button>
            ))}
          </div>

          <a
            href={exportUrl}
            aria-disabled={items.length === 0}
            className={`inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary-mist px-3.5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10 ${
              items.length === 0
                ? "pointer-events-none cursor-not-allowed opacity-50"
                : ""
            }`}
          >
            <Download size={16} />
            <span className="hidden sm:inline">Excel</span>
          </a>

          <Link
            href="/admin/students/new"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-md"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span className="hidden sm:inline">Add Student</span>
            <span className="sm:hidden">Add</span>
          </Link>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="rounded-2xl border border-line bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-semibold text-grey">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
              >
                <option value="">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-semibold text-grey">
                Course
              </label>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="w-full rounded-xl border border-line bg-cream px-3 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
              >
                <option value="">All courses</option>
                {courseOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                setStatusFilter("");
                setCourseFilter("");
              }}
              disabled={!statusFilter && !courseFilter}
              className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-grey transition-colors hover:bg-cream hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={15} />
              Clear filters
            </button>
          </div>
        </div>
      )}

      {/* Content count */}
      <div className="px-1 text-xs text-grey">
        {filtered.length === 0
          ? "No students found"
          : `${filtered.length} student${filtered.length === 1 ? "" : "s"} found`}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white px-5 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream text-grey">
            <Users size={24} />
          </span>
          <p className="mt-4 text-base font-bold text-ink">
            No students found
          </p>
          <p className="mt-1 text-sm text-grey">
            {hasFilters
              ? "Try changing your filters and search again"
              : "Add your first student"}
          </p>
          {hasFilters && (
            <button
              onClick={() => {
                setQuery("");
                setStatusFilter("");
                setCourseFilter("");
              }}
              className="mt-4 text-sm font-semibold text-primary hover:underline"
            >
              Clear all filters
            </button>
          )}
          {!hasFilters && (
            <Link
              href="/admin/students/new"
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 hover:bg-primary-dark"
            >
              <Plus size={16} />
              Add student
            </Link>
          )}
        </div>
      )}

      {/* GRID VIEW */}
      {view === "grid" && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((student) => {
            const admitted = latestAdmission(student)?.createdAt || student.createdAt;
            return (
              <div
                key={student.id}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
                onClick={() => setSelected(student)}
              >
                <div
                  className={`relative flex h-24 flex-col items-end bg-gradient-to-br p-3 ${avatarBand(
                    student.name
                  )}`}
                >
                  <StatusBadge status={student.status} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <AvatarCircle
                      name={student.name}
                      size="h-14 w-14 text-lg ring-4 ring-white"
                    />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="truncate text-center text-base font-bold text-ink">
                    {student.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-center gap-1.5">
                    <CoursePill course={courseLabel(student)} />
                    {categoryLabel(student) !== "—" && (
                      <span className="flex-none truncate rounded-full bg-cream px-2.5 py-0.5 text-xs font-medium text-grey">
                        {categoryLabel(student)}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs text-grey">
                    <div className="flex items-center gap-1.5">
                      <Phone size={12} className="flex-none" />
                      <span className="truncate">{student.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="flex-none" />
                      <span className="truncate">
                        Enrolled: {formatDate(admitted)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-1 border-t border-line/60 pt-3">
                    <Link
                      href={`/admin/students/${student.id}/edit`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-semibold text-ink transition-colors hover:bg-cream"
                    >
                      <Edit size={13} />
                      Edit
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(student);
                      }}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-grey transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {view === "list" && filtered.length > 0 && (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-line bg-white shadow-sm md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-cream/60">
                  <th className="whitespace-nowrap px-5 py-3 font-semibold text-grey">
                    Student
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 font-semibold text-grey">
                    Phone
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 font-semibold text-grey">
                    Category
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 font-semibold text-grey">
                    Course
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 font-semibold text-grey">
                    Enrolled Date
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 font-semibold text-grey">
                    Status
                  </th>
                  <th className="whitespace-nowrap px-5 py-3 text-right font-semibold text-grey">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student) => {
                  const admitted =
                    latestAdmission(student)?.createdAt || student.createdAt;
                  return (
                    <tr
                      key={student.id}
                      className="group border-b border-line/50 last:border-0 transition-colors hover:bg-primary-mist/40"
                    >
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <AvatarCircle name={student.name} />
                          <div className="min-w-0">
                            <button
                              onClick={() => setSelected(student)}
                              className="block max-w-[200px] truncate text-left font-semibold text-ink transition-colors hover:text-primary"
                            >
                              {student.name}
                            </button>
                            {student.email && (
                              <p className="max-w-[200px] truncate text-xs text-grey">
                                {student.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-grey">
                        {student.phone}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-grey">
                        {categoryLabel(student)}
                      </td>
                      <td className="max-w-[240px] truncate px-5 py-3.5 text-grey">
                        {courseLabel(student)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-grey">
                        {formatDate(admitted)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <StatusBadge status={student.status} />
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelected(student)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-grey transition-colors hover:bg-primary-mist hover:text-primary"
                            title="Preview"
                          >
                            <Eye size={16} />
                          </button>
                          <Link
                            href={`/admin/students/${student.id}/edit`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-grey transition-colors hover:bg-amber-50 hover:text-amber-600"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(student)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-grey transition-colors hover:bg-red-50 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {filtered.map((student) => {
              const admitted =
                latestAdmission(student)?.createdAt || student.createdAt;
              return (
                <div
                  key={student.id}
                  className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm"
                >
                  <button
                    onClick={() => setSelected(student)}
                    className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-cream/50"
                  >
                    <AvatarCircle name={student.name} size="h-11 w-11 text-sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-semibold text-ink">
                          {student.name}
                        </p>
                        <StatusBadge status={student.status} />
                      </div>
                      <p className="mt-0.5 truncate text-xs text-grey">
                        <CoursePill course={courseLabel(student)} />
                      </p>
                      <p className="mt-0.5 text-[11px] text-grey">
                        Enrolled: {formatDate(admitted)} • {student.phone}
                      </p>
                    </div>
                    <ChevronRight size={18} className="flex-none text-grey" />
                  </button>
                  <div className="flex items-center justify-end gap-1 border-t border-line/60 bg-cream/40 px-3 py-2">
                    <Link
                      href={`/admin/students/${student.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-grey transition-colors hover:bg-white hover:text-ink"
                    >
                      <Eye size={14} />
                      Profile
                    </Link>
                    <Link
                      href={`/admin/students/${student.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-grey transition-colors hover:bg-white hover:text-ink"
                    >
                      <Edit size={14} />
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(student)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-white"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Quick view modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div
              className={`relative overflow-hidden bg-gradient-to-br px-5 pb-5 pt-6 ${avatarBand(
                selected.name
              )}`}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white/70 text-grey backdrop-blur transition-colors hover:bg-white hover:text-ink"
              >
                <X size={18} />
              </button>
              <div className="flex items-end gap-4">
                <AvatarCircle
                  name={selected.name}
                  size="h-16 w-16 text-xl shadow-md"
                />
                <div className="min-w-0 pb-0.5">
                  <h2 className="truncate text-xl font-bold text-ink">
                    {selected.name}
                  </h2>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <StatusBadge status={selected.status} />
                    <span className="text-xs font-medium text-grey">
                      Enrolled:{" "}
                      {formatDate(
                        latestAdmission(selected)?.createdAt || selected.createdAt
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5 px-5 py-5">
              {/* Courses */}
              <section>
                <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-grey">
                  <BookOpen size={13} />
                  Courses & Categories
                </h3>
                {selected.admissions.length === 0 ? (
                  <p className="text-sm text-grey">No courses</p>
                ) : (
                  <div className="space-y-2">
                    {selected.admissions.map((a) => (
                      <div
                        key={a.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-line/60 bg-cream/50 px-3.5 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-ink">
                            {a.course?.title || "No courses"}
                          </p>
                          {a.course?.category?.name && (
                            <p className="mt-0.5 text-xs text-grey">
                              {a.course.category.name}
                            </p>
                          )}
                        </div>
                        <div className="flex-none text-right">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                              a.status === "CONFIRMED"
                                ? "bg-emerald-50 text-emerald-700"
                                : a.status === "PENDING"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-grey/10 text-grey"
                            }`}
                          >
                            {a.status === "CONFIRMED"
                              ? "Confirmed"
                              : a.status === "PENDING"
                              ? "Pending"
                              : "Cancelled"}
                          </span>
                          <p className="mt-0.5 text-[11px] text-grey">
                            {formatDate(a.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Contact */}
              <section>
                <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-grey">
                  <Phone size={13} />
                  Contact
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <InfoItem
                    icon={<Phone size={15} />}
                    label="Phone"
                    value={selected.phone}
                    href={`tel:${selected.phone}`}
                  />
                  {selected.email && (
                    <InfoItem
                      icon={<Mail size={15} />}
                      label="Email"
                      value={selected.email}
                      href={`mailto:${selected.email}`}
                    />
                  )}
                  {selected.address && (
                    <InfoItem
                      icon={<MapPin size={15} />}
                      label="Address"
                      value={selected.address}
                    />
                  )}
                  {selected.country && (
                    <InfoItem
                      icon={<MapPin size={15} />}
                      label="Country"
                      value={selected.country}
                    />
                  )}
                </div>
              </section>

              {/* Personal */}
              <section>
                <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-grey">
                  <User size={13} />
                  Personal Details
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {selected.gender && (
                    <InfoItem
                      icon={<User size={15} />}
                      label="Gender"
                      value={
                        selected.gender === "MALE"
                          ? "Male"
                          : selected.gender === "FEMALE"
                          ? "Female"
                          : selected.gender
                      }
                    />
                  )}
                  {selected.age != null && (
                    <InfoItem
                      icon={<Calendar size={15} />}
                      label="Age"
                      value={`${selected.age} years`}
                    />
                  )}
                  {selected.dateOfBirth && (
                    <InfoItem
                      icon={<Calendar size={15} />}
                      label="Date of Birth"
                      value={selected.dateOfBirth}
                    />
                  )}
                  {selected.guardianName && (
                    <InfoItem
                      icon={<User size={15} />}
                      label="Guardian"
                      value={selected.guardianName}
                    />
                  )}
                  {selected.guardianPhone && (
                    <InfoItem
                      icon={<Phone size={15} />}
                      label="Guardian's Phone"
                      value={selected.guardianPhone}
                      href={`tel:${selected.guardianPhone}`}
                    />
                  )}
                </div>
              </section>

              {/* Notes */}
              {selected.notes && (
                <section>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-grey">
                    Notes
                  </h3>
                  <p className="rounded-xl border border-line/60 bg-cream/50 px-3.5 py-2.5 text-sm text-grey">
                    {selected.notes}
                  </p>
                </section>
              )}
            </div>

            {/* Footer actions */}
            <div className="sticky bottom-0 flex items-center gap-2 border-t border-line bg-white px-5 py-4">
              <Link
                href={`/admin/students/${selected.id}`}
                onClick={() => setSelected(null)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                <Eye size={15} />
                Full Profile
              </Link>
              <Link
                href={`/admin/students/${selected.id}/edit`}
                onClick={() => setSelected(null)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-cream"
              >
                <Edit size={15} />
                Edit
              </Link>
              <button
                onClick={() => {
                  setDeleteTarget(selected);
                  setSelected(null);
                }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 text-red-600 transition-colors hover:bg-red-50"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={22} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-ink">
              Delete this student?
            </h3>
            <p className="mt-1 text-sm text-grey">
              <span className="font-medium text-ink">{deleteTarget.name}</span>{" "}
              and all their enrollment records will be permanently removed. This
              action cannot be undone.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-cream disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-line/60 bg-cream/50 px-3.5 py-2.5">
      <span className="mt-0.5 flex-none text-grey">{icon}</span>
      <div className="min-w-0">
        <p className="text-[11px] text-grey">{label}</p>
        {href ? (
          <a
            href={href}
            className="break-words text-sm font-medium text-ink hover:text-primary"
          >
            {value}
          </a>
        ) : (
          <p className="break-words text-sm font-medium text-ink">{value}</p>
        )}
      </div>
    </div>
  );
}