"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Edit, X, Upload, Loader2 } from "lucide-react";
import TogglePublishButton from "./TogglePublishButton";
import DeleteButton from "./DeleteButton";
import { uploadImage } from "@/lib/image-upload-client";

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  image: string | null;
  sortOrder: number;
  isPublished: boolean;
  _count: { courses: number };
}

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-grey focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10";
const labelClass = "mb-1.5 block text-sm font-medium text-ink";

export default function CategoriesManager({
  initialCategories,
}: {
  initialCategories: CategoryData[];
}) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [prevCategories, setPrevCategories] = useState(initialCategories);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState<string | null>(null);

  if (prevCategories !== initialCategories) {
    setPrevCategories(initialCategories);
    setCategories(initialCategories);
  }

  function openCreate() {
    setEditingCategory(null);
    setImage(null);
    setError("");
    setShowModal(true);
  }

  function openEdit(category: CategoryData) {
    setEditingCategory(category);
    setImage(category.image);
    setError("");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingCategory(null);
    setImage(null);
    setError("");
  }

  function generateSlug(name: string) {
    return name
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
      name: form.get("name") as string,
      slug: form.get("slug") as string,
      shortDescription: (form.get("shortDescription") as string) || null,
      description: (form.get("description") as string) || null,
      image: image || null,
      sortOrder: parseInt(form.get("sortOrder") as string) || 0,
      isPublished: form.get("isPublished") === "on",
    };

    if (!data.name || !data.slug) {
      setError("Name and slug are required");
      setLoading(false);
      return;
    }

    try {
      const isEdit = !!editingCategory;
      const res = await fetch(
        isEdit ? `/api/categories/${editingCategory.id}` : "/api/categories",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save category");
      }

      closeModal();
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
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Categories</h1>
          <p className="mt-0.5 text-sm text-grey">
            Total {categories.length} categories
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          <Plus size={16} />
          Create New Category
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-line bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="whitespace-nowrap px-5 py-3 font-medium text-grey">
                  Order
                </th>
                <th className="whitespace-nowrap px-5 py-3 font-medium text-grey">
                  Name
                </th>
                <th className="whitespace-nowrap px-5 py-3 font-medium text-grey hidden sm:table-cell">
                  Slug
                </th>
                <th className="whitespace-nowrap px-5 py-3 font-medium text-grey">
                  Courses
                </th>
                <th className="whitespace-nowrap px-5 py-3 font-medium text-grey">
                  Status
                </th>
                <th className="whitespace-nowrap px-5 py-3 font-medium text-grey text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-line/50 last:border-0 hover:bg-cream/30"
                >
                  <td className="whitespace-nowrap px-5 py-3 text-grey">
                    {category.sortOrder}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <button
                      onClick={() => openEdit(category)}
                      className="font-medium text-ink hover:text-primary"
                    >
                      {category.name}
                    </button>
                    {category.shortDescription && (
                      <p className="mt-0.5 max-w-xs truncate text-xs text-grey">
                        {category.shortDescription}
                      </p>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-grey hidden sm:table-cell">
                    {category.slug}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-grey">
                    {category._count.courses}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3">
                    <TogglePublishButton
                      id={category.id}
                      isPublished={category.isPublished}
                      type="category"
                    />
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(category)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-grey transition-colors hover:bg-cream hover:text-ink"
                      >
                        <Edit size={16} />
                      </button>
                      <DeleteButton
                        id={category.id}
                        type="category"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white px-6 py-4">
              <h2 className="text-lg font-bold text-ink">
                {editingCategory ? "Edit Category" : "Create New Category"}
              </h2>
              <button
                onClick={closeModal}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-grey transition-colors hover:bg-cream hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                {/* Image */}
                <div>
                  <label className={labelClass}>Category Image</label>
                  {image ? (
                    <div className="relative">
                      <Image
                        src={image}
                        alt="Category"
                        width={256}
                        height={144}
                        className="h-36 w-full rounded-lg border border-line object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setImage(null)}
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-grey shadow-sm hover:text-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-line bg-cream/50 px-4 py-6 hover:border-primary/40 hover:bg-primary/5">
                      <Upload size={20} className="text-grey" />
                      <span className="text-xs text-grey">
                        Click to upload image
                      </span>
                      <span className="text-[10px] text-grey/60">
                        JPG, PNG, WebP (max 5MB)
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>

                {/* Name + Slug */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={labelClass}>
                      Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      defaultValue={editingCategory?.name || ""}
                      placeholder="e.g. Quran Education"
                      className={inputClass}
                      onChange={(e) => {
                        const slugInput = document.getElementById(
                          "slug"
                        ) as HTMLInputElement;
                        if (slugInput && !editingCategory) {
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
                      defaultValue={editingCategory?.slug || ""}
                      placeholder="e.g. quran-education"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Short Description */}
                <div>
                  <label htmlFor="shortDescription" className={labelClass}>
                    Short Description
                  </label>
                  <input
                    id="shortDescription"
                    name="shortDescription"
                    defaultValue={editingCategory?.shortDescription || ""}
                    placeholder="1-2 line category description"
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
                    defaultValue={editingCategory?.description || ""}
                    placeholder="Detailed category description..."
                    className={inputClass}
                  />
                </div>

                {/* Order + Publish */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="sortOrder" className={labelClass}>
                      Order
                    </label>
                    <input
                      id="sortOrder"
                      name="sortOrder"
                      type="number"
                      defaultValue={editingCategory?.sortOrder || 0}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="isPublished"
                        defaultChecked={editingCategory?.isPublished || false}
                        className="h-4 w-4 rounded border-line text-primary focus:ring-primary/20"
                      />
                      <span className="text-sm font-medium text-ink">
                        Publish
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
                >
                  {loading || uploading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : null}
                  {loading
                    ? "Saving..."
                    : uploading
                      ? "Uploading image..."
                      : editingCategory
                        ? "Update Category"
                        : "Save Category"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={uploading}
                  className="rounded-lg border border-line px-5 py-2.5 text-sm font-medium text-grey transition-colors hover:bg-cream hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
