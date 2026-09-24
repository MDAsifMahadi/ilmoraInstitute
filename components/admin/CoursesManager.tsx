"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Plus,
  X,
  Upload,
  Loader2,
  Search,
  SlidersHorizontal,
  Clock3,
  Users,
  BookOpen,
  CalendarDays,
  GraduationCap,
  MonitorPlay,
  Tag,
  Pencil,
  Eye,
  EyeOff,
  Sparkles,
  FolderOpen,
  Inbox,
  ArrowUpDown,
  ChevronDown,
  Pin,
} from "lucide-react";
import TogglePublishButton from "./TogglePublishButton";
import DeleteButton from "./DeleteButton";
import PinButton from "./PinButton";
import { COURSE_ICON_OPTIONS } from "@/lib/course-utils";
import { uploadImage } from "@/lib/image-upload-client";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CourseData {
  id: string;
  categoryId: string;
  title: string;
  slug: string;
  tagline: string | null;
  shortDescription: string | null;
  description: string | null;
  badge: string | null;
  level: string | null;
  icon: string | null;
  image: string | null;
  outcomes: string[];
  curriculum: string[];
  duration: string | null;
  sessionsPerWeek: string | null;
  ageRange: string | null;
  format: string | null;
  price: string | null;
  sortOrder: number;
  isPublished: boolean;
  pinOnHome: boolean;
  category: Category;
  _count: { admissions: number };
}

type ViewMode = "grid" | "list";
type SortKey = "order" | "title" | "newest" | "enrollments";

const inputClass =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-grey focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10";
const labelClass = "mb-1.5 block text-sm font-medium text-ink";

export default function CoursesManager({
  initialCourses,
  categories,
}: {
  initialCourses: CourseData[];
  categories: Category[];
}) {
  const router = useRouter();
  const [courses, setCourses] = useState(initialCourses);
  const [prevCourses, setPrevCourses] = useState(initialCourses);
  const [search, setSearch] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("order");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseData | null>(null);
  const [viewingCourse, setViewingCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState<string | null>(null);

  if (prevCourses !== initialCourses) {
    setPrevCourses(initialCourses);
    setCourses(initialCourses);
  }

  const filteredCourses = useMemo(() => {
    let result = courses;

    // Search
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((c) =>
        [
          c.title,
          c.slug,
          c.tagline,
          c.shortDescription,
          c.badge,
          c.category.name,
        ]
          .filter(Boolean)
          .some((v) => (v as string).toLowerCase().includes(q))
      );
    }

    // Category filter
    if (filterCategoryId) {
      result = result.filter((c) => c.categoryId === filterCategoryId);
    }

    // Status filter
    if (filterStatus !== "all") {
      const published = filterStatus === "published";
      result = result.filter((c) => c.isPublished === published);
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "newest":
          return a.id.localeCompare(b.id);
        case "enrollments":
          return b._count.admissions - a._count.admissions;
        default:
          return a.sortOrder - b.sortOrder;
      }
    });

    return result;
  }, [courses, search, filterCategoryId, filterStatus, sortBy]);

  const hasActiveFilters =
    search.trim() !== "" ||
    filterCategoryId !== "" ||
    filterStatus !== "all";

  function resetFilters() {
    setSearch("");
    setFilterCategoryId("");
    setFilterStatus("all");
    setSortBy("order");
  }

  function openCreate() {
    setEditingCourse(null);
    setImage(null);
    setError("");
    setShowFormModal(true);
  }

  function openEdit(course: CourseData) {
    setViewingCourse(null);
    setEditingCourse(course);
    setImage(course.image);
    setError("");
    setShowFormModal(true);
  }

  function closeFormModal() {
    setShowFormModal(false);
    setEditingCourse(null);
    setImage(null);
    setError("");
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (uploading) return;
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data = {
      categoryId: form.get("categoryId") as string,
      title: form.get("title") as string,
      slug: form.get("slug") as string,
      tagline: (form.get("tagline") as string) || null,
      shortDescription: (form.get("shortDescription") as string) || null,
      description: (form.get("description") as string) || null,
      badge: (form.get("badge") as string) || null,
      level: (form.get("level") as string) || null,
      icon: (form.get("icon") as string) || null,
      image: image || null,
      outcomes: ((form.get("outcomes") as string) || "")
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean),
      curriculum: ((form.get("curriculum") as string) || "")
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean),
      duration: (form.get("duration") as string) || null,
      sessionsPerWeek: (form.get("sessionsPerWeek") as string) || null,
      ageRange: (form.get("ageRange") as string) || null,
      format: (form.get("format") as string) || null,
      price: (form.get("price") as string) || null,
      sortOrder: parseInt(form.get("sortOrder") as string) || 0,
      isPublished: form.get("isPublished") === "on",
      pinOnHome: form.get("pinOnHome") === "on",
    };

    if (!data.categoryId || !data.title || !data.slug) {
      setError("Category, title and slug are required");
      setLoading(false);
      return;
    }

    try {
      const isEdit = !!editingCourse;
      const res = await fetch(
        isEdit ? `/api/courses/${editingCourse.id}` : "/api/courses",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save course");
      }

      closeFormModal();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const file = input.files?.[0];
    if (!file || uploading) return;

    setUploading(true);
    setError("");
    try {
      setImage(await uploadImage(file));
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Image upload failed. Please try again."
      );
    } finally {
      input.value = "";
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-mist text-primary">
              <BookOpen size={20} />
            </span>
            <div>
              <h1 className="text-xl font-bold text-ink">Courses</h1>
              <p className="mt-0.5 text-sm text-grey">
                {courses.length} total · {courses.filter((c) => c.isPublished).length} published
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-md"
        >
          <Plus size={16} strokeWidth={2.5} />
          Create New Course
        </button>
      </div>

      {/* Toolbar: Search + Filters */}
      <div className="rounded-2xl border border-line bg-white p-4 shadow-sm">
        {/* Row 1: search + view toggle */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-grey"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses by title, tagline, category..."
              className="w-full rounded-xl border border-line bg-cream/50 py-2.5 pl-10 pr-9 text-sm text-ink placeholder:text-grey focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-grey transition-colors hover:text-ink"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors ${
                hasActiveFilters || showFilters
                  ? "border-primary/30 bg-primary-mist text-primary"
                  : "border-line bg-white text-grey hover:bg-cream hover:text-ink"
              }`}
            >
              <SlidersHorizontal size={15} />
              Filters
              {hasActiveFilters && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                  {[search.trim(), filterCategoryId, filterStatus !== "all" ? "1" : ""].filter(Boolean).length}
                </span>
              )}
            </button>
            <div className="flex overflow-hidden rounded-xl border border-line">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex h-10 w-10 items-center justify-center transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary text-white"
                    : "bg-white text-grey hover:bg-cream"
                }`}
                title="Grid view"
              >
                <Sparkles size={15} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex h-10 w-10 items-center justify-center border-l border-line transition-colors ${
                  viewMode === "list"
                    ? "bg-primary text-white"
                    : "bg-white text-grey hover:bg-cream"
                }`}
                title="List view"
              >
                <Inbox size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: filter controls + sort */}
        {(showFilters || hasActiveFilters) && (
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-grey">
                Category
              </label>
              <select
                value={filterCategoryId}
                onChange={(e) => setFilterCategoryId(e.target.value)}
                className={inputClass}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-grey">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={inputClass}
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-grey">
                Sort By
              </label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortKey)}
                  className={`${inputClass} appearance-none pr-9`}
                >
                  <option value="order">Sort Order</option>
                  <option value="title">Title (A–Z)</option>
                  <option value="enrollments">Most Enrolled</option>
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-grey"
                />
              </div>
            </div>
            <div className="flex items-end">
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-line px-3.5 py-2.5 text-sm font-medium text-grey transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <X size={14} />
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-grey">
        <span>
          Showing <span className="font-semibold text-ink">{filteredCourses.length}</span> of{" "}
          {courses.length} courses
        </span>
      </div>

      {/* Course cards / list */}
      {filteredCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white py-20 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream text-grey">
            <Inbox size={24} />
          </span>
          <h3 className="mt-4 font-display text-lg font-bold text-ink">
            No courses found
          </h3>
          <p className="mt-1 max-w-sm text-sm text-grey">
            {hasActiveFilters
              ? "Try adjusting your search or filters to find what you're looking for."
              : "Get started by creating your first course."}
          </p>
          {hasActiveFilters ? (
            <button
              onClick={resetFilters}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-cream"
            >
              <X size={14} />
              Clear all filters
            </button>
          ) : (
            <button
              onClick={openCreate}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              <Plus size={14} />
              Create your first course
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onView={() => setViewingCourse(course)}
              onEdit={() => openEdit(course)}
            />
          ))}
        </div>
      ) : (
        <CourseList
          courses={filteredCourses}
          onView={(c) => setViewingCourse(c)}
          onEdit={(c) => openEdit(c)}
        />
      )}

      {/* Detail overview modal */}
      {viewingCourse && (
        <CourseDetailModal
          course={viewingCourse}
          onClose={() => setViewingCourse(null)}
          onEdit={() => openEdit(viewingCourse)}
        />
      )}

      {/* Create / Edit form modal */}
      {showFormModal && (
        <CourseFormModal
          editingCourse={editingCourse}
          categories={categories}
          image={image}
          loading={loading}
          uploading={uploading}
          error={error}
          generateSlug={generateSlug}
          onImageChange={setImage}
          onImageUpload={handleImageUpload}
          onClose={closeFormModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

/* ------------------------- Course Card ------------------------- */

function CourseCard({
  course,
  onView,
  onEdit,
}: {
  course: CourseData;
  onView: () => void;
  onEdit: () => void;
}) {
  return (
    <div
      onClick={onView}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-primary-mist to-cream">
        {course.image ? (
          <Image
            src={course.image}
            alt={course.title}
            fill
            sizes="(min-width: 1536px) 25vw, (min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen size={40} className="text-primary/30" strokeWidth={1.5} />
          </div>
        )}
        {/* Badge */}
        {course.badge && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-[#1c1400] shadow-sm">
            <Tag size={10} strokeWidth={3} />
            {course.badge}
          </span>
        )}
        {/* Status */}
        <span
          className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur ${
            course.isPublished
              ? "bg-emerald-500/90 text-white"
              : "bg-white/90 text-grey"
          }`}
        >
          {course.isPublished ? <Eye size={10} /> : <EyeOff size={10} />}
          {course.isPublished ? "Published" : "Draft"}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-primary-mist px-2 py-0.5 text-xs font-medium text-primary">
            <FolderOpen size={11} />
            {course.category.name}
          </span>
          {course.level && (
            <span className="rounded-md bg-cream px-2 py-0.5 text-xs font-medium text-grey">
              {course.level}
            </span>
          )}
        </div>

        <h3 className="mt-2.5 font-display text-lg font-bold leading-snug text-ink transition-colors group-hover:text-primary">
          {course.title}
        </h3>

        {course.shortDescription && (
          <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-grey">
            {course.shortDescription}
          </p>
        )}

        <div className="mt-4 flex items-center gap-4 text-xs text-grey">
          {course.duration && (
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={13} className="text-primary/60" />
              {course.duration}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Users size={13} className="text-primary/60" />
            {course._count.admissions} enrolled
          </span>
        </div>

        {/* Pin to home */}
        <div
          className="mt-3"
          onClick={(e) => e.stopPropagation()}
        >
          <PinButton id={course.id} pinned={course.pinOnHome} />
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
          <span className="text-xs font-semibold text-primary">
            View details →
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-grey transition-colors hover:bg-primary-mist hover:text-primary"
              title="Edit course"
            >
              <Pencil size={15} />
            </button>
            <div onClick={(e) => e.stopPropagation()}>
              <DeleteButton id={course.id} type="course" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------- Course List ------------------------- */

function CourseList({
  courses,
  onView,
  onEdit,
}: {
  courses: CourseData[];
  onView: (c: CourseData) => void;
  onEdit: (c: CourseData) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      <div className="divide-y divide-line/60">
        {courses.map((course) => (
          <div
            key={course.id}
            onClick={() => onView(course)}
            className="flex cursor-pointer items-center gap-4 px-5 py-4 transition-colors hover:bg-cream/50"
          >
            <div className="relative h-12 w-16 flex-none overflow-hidden rounded-lg bg-gradient-to-br from-primary-mist to-cream">
              {course.image ? (
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <BookOpen size={18} className="text-primary/30" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-ink">{course.title}</p>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-grey">
                <span>{course.category.name}</span>
                {course.badge && (
                  <>
                    <span className="text-line">•</span>
                    <span>{course.badge}</span>
                  </>
                )}
                {course.level && (
                  <>
                    <span className="text-line">•</span>
                    <span>{course.level}</span>
                  </>
                )}
              </div>
            </div>
            <div className="hidden items-center gap-4 text-xs text-grey sm:flex">
              {course.duration && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={13} /> {course.duration}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Users size={13} /> {course._count.admissions}
              </span>
            </div>
            <span
              className={`hidden flex-none rounded-full px-2.5 py-1 text-[11px] font-semibold md:inline-flex ${
                course.isPublished
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-grey/10 text-grey"
              }`}
            >
              {course.isPublished ? "Published" : "Draft"}
            </span>
            <div
              className="flex-none"
              onClick={(e) => e.stopPropagation()}
            >
              <PinButton
                id={course.id}
                pinned={course.pinOnHome}
                label=""
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(course);
              }}
              className="flex-none rounded-lg p-2 text-grey transition-colors hover:bg-primary-mist hover:text-primary"
              title="Edit"
            >
              <Pencil size={15} />
            </button>
            <div
              className="flex-none"
              onClick={(e) => e.stopPropagation()}
            >
              <DeleteButton id={course.id} type="course" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------- Detail Overview Modal ------------------------- */

function CourseDetailModal({
  course,
  onClose,
  onEdit,
}: {
  course: CourseData;
  onClose: () => void;
  onEdit: () => void;
}) {
  const infoItems = [
    { icon: FolderOpen, label: "Category", value: course.category.name },
    { icon: GraduationCap, label: "Level", value: course.level || "—" },
    { icon: Clock3, label: "Duration", value: course.duration || "—" },
    { icon: CalendarDays, label: "Sessions/Week", value: course.sessionsPerWeek || "—" },
    { icon: Users, label: "Age Range", value: course.ageRange || "—" },
    { icon: MonitorPlay, label: "Format", value: course.format || "—" },
    { icon: Tag, label: "Badge", value: course.badge || "—" },
    { icon: Users, label: "Enrolled", value: String(course._count.admissions) },
    { icon: BookOpen, label: "Price", value: course.price || "—" },
    { icon: ArrowUpDown, label: "Sort Order", value: String(course.sortOrder) },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        {/* Header image */}
        <div className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-primary-mist to-cream sm:h-64">
          {course.image && (
            <Image
              src={course.image}
              alt={course.title}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-grey shadow-sm transition-colors hover:bg-white hover:text-ink"
          >
            <X size={18} />
          </button>
          <div className="absolute bottom-4 left-5 right-5">
            <div className="flex flex-wrap items-center gap-2">
              {course.badge && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-[#1c1400] shadow-sm">
                  <Tag size={10} strokeWidth={3} />
                  {course.badge}
                </span>
              )}
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm ${
                  course.isPublished
                    ? "bg-emerald-500/90 text-white"
                    : "bg-white/90 text-grey"
                }`}
              >
                {course.isPublished ? <Eye size={10} /> : <EyeOff size={10} />}
                {course.isPublished ? "Published" : "Draft"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-mist px-2.5 py-1 text-[11px] font-medium text-primary">
                <FolderOpen size={10} />
                {course.category.name}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {course.tagline && (
            <p className="text-sm font-medium text-primary">{course.tagline}</p>
          )}
          <h2 className="mt-1 font-display text-2xl font-bold text-ink">
            {course.title}
          </h2>
          <p className="mt-1 text-xs text-grey">Slug: /courses/{course.slug}</p>

          {course.description && (
            <div className="mt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-grey">
                Description
              </h3>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-grey">
                {course.description}
              </p>
            </div>
          )}

          {/* Info grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {infoItems.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-line bg-cream/40 p-3"
              >
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-grey">
                  <item.icon size={12} className="text-primary/60" />
                  {item.label}
                </div>
                <p className="mt-1 truncate text-sm font-medium text-ink">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {course.shortDescription && (
            <div className="mt-5 rounded-xl border border-line bg-primary-mist/40 p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                Summary
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/80">
                {course.shortDescription}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:border-t sm:border-line sm:pt-5">
            <div className="flex flex-wrap items-center gap-3">
              <div onClick={(e) => e.stopPropagation()}>
                <PinButton id={course.id} pinned={course.pinOnHome} />
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <TogglePublishButton
                  id={course.id}
                  isPublished={course.isPublished}
                  type="course"
                />
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <DeleteButton id={course.id} type="course" />
              </div>
            </div>
            <button
              onClick={onEdit}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              <Pencil size={15} />
              Edit Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------- Create/Edit Form Modal ------------------------- */

interface FormModalProps {
  editingCourse: CourseData | null;
  categories: Category[];
  image: string | null;
  loading: boolean;
  uploading: boolean;
  error: string;
  generateSlug: (title: string) => string;
  onImageChange: (url: string | null) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

function CourseFormModal({
  editingCourse,
  categories,
  image,
  loading,
  uploading,
  error,
  generateSlug,
  onImageChange,
  onImageUpload,
  onClose,
  onSubmit,
}: FormModalProps) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white/95 px-6 py-4 backdrop-blur">
          <div>
            <h2 className="text-lg font-bold text-ink">
              {editingCourse ? "Edit Course" : "Create New Course"}
            </h2>
            <p className="mt-0.5 text-xs text-grey">
              {editingCourse
                ? "Update course information"
                : "Fill in the course details"}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={uploading}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-grey transition-colors hover:bg-cream hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6">
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Image */}
            <div>
              <label className={labelClass}>Course Image</label>
              {image ? (
                <div className="relative overflow-hidden rounded-xl border border-line">
                  {uploading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/40 backdrop-blur-sm">
                      <Loader2 size={24} className="animate-spin text-white" />
                      <span className="text-xs font-semibold text-white">
                        Uploading image...
                      </span>
                    </div>
                  )}
                  <Image
                    src={image}
                    alt="Course"
                    width={640}
                    height={360}
                    className="h-44 w-full object-cover"
                  />
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => onImageChange(null)}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-grey shadow-sm transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 transition-colors ${
                    uploading
                      ? "cursor-wait border-primary/40 bg-primary/5"
                      : "cursor-pointer border-line bg-cream/40 hover:border-primary/40 hover:bg-primary/5"
                  }`}
                >
                  {uploading ? (
                    <>
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-mist text-primary">
                        <Loader2 size={20} className="animate-spin" />
                      </span>
                      <span className="text-sm font-medium text-ink">
                        Uploading image...
                      </span>
                      <span className="h-1 w-44 overflow-hidden rounded-full bg-primary/15">
                        <span className="block h-full w-full animate-pulse rounded-full bg-primary" />
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-mist text-primary">
                        <Upload size={20} />
                      </span>
                      <span className="text-sm font-medium text-ink">
                        Click to upload image
                      </span>
                      <span className="text-xs text-grey">
                        JPG, PNG, WebP or GIF — max 5MB
                      </span>
                    </>
                  )}
                  <span className="text-xs font-medium text-primary">
                    Recommended size: 1600×1000 (16:10) — min 1200×750
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    disabled={uploading}
                    className="hidden"
                    onChange={onImageUpload}
                  />
                </label>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="categoryId" className={labelClass}>
                Category *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                required
                defaultValue={editingCourse?.categoryId || ""}
                className={inputClass}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Title + Slug */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="title" className={labelClass}>
                  Title *
                </label>
                <input
                  id="title"
                  name="title"
                  required
                  defaultValue={editingCourse?.title || ""}
                  placeholder="Course title"
                  className={inputClass}
                  onChange={(e) => {
                    const slugInput = document.getElementById(
                      "slug"
                    ) as HTMLInputElement;
                    if (slugInput && !editingCourse) {
                      slugInput.value = generateSlug(e.target.value);
                    }
                  }}
                />
              </div>
              <div>
                <label htmlFor="slug" className={labelClass}>
                  Slug *
                </label>
                <input
                  id="slug"
                  name="slug"
                  required
                  defaultValue={editingCourse?.slug || ""}
                  placeholder="course-slug"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Tagline */}
            <div>
              <label htmlFor="tagline" className={labelClass}>
                Tagline
              </label>
              <input
                id="tagline"
                name="tagline"
                defaultValue={editingCourse?.tagline || ""}
                placeholder="Short course tagline"
                className={inputClass}
              />
            </div>

            {/* Badge + Level */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="badge" className={labelClass}>
                  Badge
                </label>
                <input
                  id="badge"
                  name="badge"
                  defaultValue={editingCourse?.badge || ""}
                  placeholder="e.g. Beginner"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="level" className={labelClass}>
                  Level
                </label>
                <input
                  id="level"
                  name="level"
                  defaultValue={editingCourse?.level || ""}
                  placeholder="e.g. Level 1"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Icon */}
            <div>
              <label htmlFor="icon" className={labelClass}>
                Icon
              </label>
              <select
                id="icon"
                name="icon"
                defaultValue={editingCourse?.icon || ""}
                className={inputClass}
              >
                <option value="">No icon</option>
                {COURSE_ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Short Description */}
            <div>
              <label htmlFor="shortDescription" className={labelClass}>
                Short Description
              </label>
              <input
                id="shortDescription"
                name="shortDescription"
                defaultValue={editingCourse?.shortDescription || ""}
                placeholder="1-2 line course description"
                className={inputClass}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className={labelClass}>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={editingCourse?.description || ""}
                placeholder="Detailed course description..."
                className={inputClass}
              />
            </div>

            {/* Outcomes */}
            <div>
              <label htmlFor="outcomes" className={labelClass}>
                Outcomes (এই কোর্সে যা অর্জন করবেন)
              </label>
              <textarea
                id="outcomes"
                name="outcomes"
                rows={4}
                defaultValue={editingCourse?.outcomes.join("\n") || ""}
                placeholder={"একটি লাইনে একটি করে লিখুন:\nসঠিক উচ্চারণে কুরআন পড়া\nতাজবীদ নিয়ম প্রয়োগ"}
                className={inputClass}
              />
            </div>

            {/* Curriculum */}
            <div>
              <label htmlFor="curriculum" className={labelClass}>
                Curriculum (কোর্স কারিকুলাম)
              </label>
              <textarea
                id="curriculum"
                name="curriculum"
                rows={4}
                defaultValue={editingCourse?.curriculum.join("\n") || ""}
                placeholder={"একটি লাইনে একটি করে লিখুন:\nনূরানী মশক পরিচিতি\nহরফ শেখা"}
                className={inputClass}
              />
            </div>

            {/* Duration + Sessions + Age */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="duration" className={labelClass}>
                  Duration
                </label>
                <input
                  id="duration"
                  name="duration"
                  defaultValue={editingCourse?.duration || ""}
                  placeholder="e.g. 6 months"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="sessionsPerWeek" className={labelClass}>
                  Sessions/Week
                </label>
                <input
                  id="sessionsPerWeek"
                  name="sessionsPerWeek"
                  defaultValue={editingCourse?.sessionsPerWeek || ""}
                  placeholder="e.g. 5 days/week"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="ageRange" className={labelClass}>
                  Age
                </label>
                <input
                  id="ageRange"
                  name="ageRange"
                  defaultValue={editingCourse?.ageRange || ""}
                  placeholder="e.g. 6+"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Format + Price + Order */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="format" className={labelClass}>
                  Format
                </label>
                <input
                  id="format"
                  name="format"
                  defaultValue={editingCourse?.format || ""}
                  placeholder="e.g. Online"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="price" className={labelClass}>
                  Price
                </label>
                <input
                  id="price"
                  name="price"
                  defaultValue={editingCourse?.price || ""}
                  placeholder="e.g. Demo price"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="sortOrder" className={labelClass}>
                  Order
                </label>
                <input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  defaultValue={editingCourse?.sortOrder || 0}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Publish */}
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isPublished"
                  defaultChecked={editingCourse?.isPublished || false}
                  className="h-4 w-4 rounded border-line text-primary focus:ring-primary/20"
                />
                <span className="text-sm font-medium text-ink">
                  Publish this course
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="pinOnHome"
                  defaultChecked={editingCourse?.pinOnHome || false}
                  className="h-4 w-4 rounded border-line text-primary accent-primary focus:ring-primary/20"
                />
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink">
                  <Pin
                    size={14}
                    className={editingCourse?.pinOnHome ? "fill-primary text-primary" : "text-grey"}
                  />
                  <span className={editingCourse?.pinOnHome ? "text-primary" : ""}>
                    Pin to home page
                  </span>
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
            <button
              type="submit"
              disabled={loading || uploading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {(loading || uploading) && (
                <Loader2 size={16} className="animate-spin" />
              )}
              {loading
                ? "Saving..."
                : uploading
                  ? "Uploading image..."
                  : editingCourse
                    ? "Update Course"
                    : "Save Course"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="rounded-xl border border-line px-5 py-2.5 text-sm font-medium text-grey transition-colors hover:bg-cream hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}