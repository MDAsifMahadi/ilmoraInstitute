"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { deleteUploadedImage, uploadImage } from "@/lib/image-upload-client";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Loader2,
  Inbox,
} from "lucide-react";

// ============================================================
// Types
// ============================================================

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "checkbox"
  | "select"
  | "image";

export interface FieldConfig {
  name: string; // API field name
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
  hint?: string;
  half?: boolean; // render in 2-col grid
}

export interface CollectionConfig {
  key: string; // API collection name
  title: string;
  description: string;
  fields: FieldConfig[];
  renderItem: (item: Record<string, unknown>) => {
    title: string;
    subtitle?: string;
    image?: string | null;
  };
}

// ============================================================
// Shared styles (theme-aware)
// ============================================================

export const inputClass =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-grey focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10";
export const labelClass = "mb-1.5 block text-sm font-medium text-ink";

// ============================================================
// Generic Collection Manager
// ============================================================

export default function CollectionManager({
  config,
  initialItems,
}: {
  config: CollectionConfig;
  initialItems: Record<string, unknown>[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [prevItems, setPrevItems] = useState(initialItems);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [pendingImageUrls, setPendingImageUrls] = useState<string[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (prevItems !== initialItems) {
    setPrevItems(initialItems);
    setItems(initialItems);
  }

  async function cleanupPendingImages(urls: string[] = pendingImageUrls) {
    if (urls.length === 0) return;
    await Promise.allSettled(
      urls.map(async (url) => {
        try {
          await deleteUploadedImage(url);
        } catch (cleanupError) {
          console.warn("Could not clean up an uncommitted image:", cleanupError);
        }
      })
    );
    setPendingImageUrls((current) =>
      current.filter((url) => !urls.includes(url))
    );
  }

  function openCreate() {
    setEditing(null);
    setImage(null);
    setPendingImageUrls([]);
    setError("");
    setShowModal(true);
  }

  function openEdit(item: Record<string, unknown>) {
    setEditing(item);
    const imageField = config.fields.find((f) => f.type === "image");
    setImage(
      imageField ? ((item[imageField.name] as string) || null) : null
    );
    setPendingImageUrls([]);
    setError("");
    setShowModal(true);
  }

  function closeModal(discardPending = false) {
    if (discardPending) {
      void cleanupPendingImages();
    }
    setShowModal(false);
    setEditing(null);
    setImage(null);
    setPendingImageUrls([]);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (uploading) return;
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {};

    for (const field of config.fields) {
      const raw = form.get(field.name);
      if (field.type === "checkbox") {
        data[field.name] = raw === "on";
      } else if (field.type === "number") {
        data[field.name] = raw ? Number(raw) : null;
      } else if (field.type === "image") {
        data[field.name] = image || null;
      } else {
        data[field.name] = (raw as string)?.trim() || null;
      }
    }

    // Validate required
    for (const field of config.fields) {
      if (field.required && !data[field.name]) {
        setError(`${field.label} is required`);
        setLoading(false);
        return;
      }
    }

    try {
      const isEdit = !!editing;
      const res = await fetch(
        isEdit
          ? `/api/site/${config.key}/${(editing as { id: string }).id}`
          : `/api/site/${config.key}`,
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }

      const unusedUploads = pendingImageUrls.filter(
        (url) => url !== image
      );
      await cleanupPendingImages(unusedUploads);
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
      const uploadedUrl = await uploadImage(file);
      setImage(uploadedUrl);
      setPendingImageUrls((current) => [...current, uploadedUrl]);
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

  async function handleDelete(id: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/site/${config.key}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete");
      }
      setConfirmDeleteId(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink">{config.title}</h2>
          <p className="mt-0.5 text-sm text-grey">{config.description}</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-dark"
        >
          <Plus size={16} strokeWidth={2.5} />
          Add {config.title.replace(/s$/, "")}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* List */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cream text-grey">
            <Inbox size={24} />
          </span>
          <h3 className="mt-4 font-display text-base font-bold text-ink">
            No {config.title.toLowerCase()} yet
          </h3>
          <p className="mt-1 max-w-sm text-sm text-grey">
            Click “Add” to create your first item.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <div className="divide-y divide-line/60">
            {items.map((item) => {
              const { title, subtitle, image: itemImage } = config.renderItem(
                item
              );
              const id = (item as { id: string }).id;
              return (
                <div
                  key={id}
                  className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-cream/50 sm:px-5"
                >
                  {config.fields.some((f) => f.type === "image") && (
                    <div className="relative h-12 w-16 flex-none overflow-hidden rounded-lg bg-gradient-to-br from-primary-mist to-cream">
                      {itemImage ? (
                        <Image
                          src={itemImage}
                          alt={title}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-primary/30">
                          <ImageIcon size={18} />
                        </div>
                      )}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink">{title}</p>
                    {subtitle && (
                      <p className="mt-0.5 truncate text-xs text-grey">
                        {subtitle}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-none items-center gap-1">
                    <button
                      onClick={() => openEdit(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-grey transition-colors hover:bg-primary-mist hover:text-primary"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    {confirmDeleteId === id ? (
                      <div className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2 py-1">
                        <span className="text-xs font-medium text-red-600">
                          Delete?
                        </span>
                        <button
                          onClick={() => handleDelete(id)}
                          disabled={loading}
                          className="rounded bg-red-600 px-2 py-0.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          {loading ? "..." : "Yes"}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="rounded border border-line bg-white px-2 py-0.5 text-xs text-grey hover:bg-cream"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-grey transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white/95 px-6 py-4 backdrop-blur">
              <div>
                <h2 className="text-lg font-bold text-ink">
                  {editing ? `Edit ${config.title.replace(/s$/, "")}` : `Add ${config.title.replace(/s$/, "")}`}
                </h2>
                <p className="mt-0.5 text-xs text-grey">{config.description}</p>
              </div>
              <button
                onClick={() => closeModal(true)}
                disabled={uploading}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-grey transition-colors hover:bg-cream hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                {config.fields.map((field) => (
                  <FieldInput
                    key={field.name}
                    field={field}
                    editing={editing}
                    image={image}
                    uploading={uploading}
                    onImageChange={setImage}
                    onImageUpload={handleImageUpload}
                  />
                ))}
              </div>

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
                      : editing
                        ? "Update"
                        : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => closeModal(true)}
                  disabled={uploading}
                  className="rounded-xl border border-line px-5 py-2.5 text-sm font-medium text-grey transition-colors hover:bg-cream hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
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

/* ------------------------- Field Input ------------------------- */

function FieldInput({
  field,
  editing,
  image,
  uploading,
  onImageChange,
  onImageUpload,
}: {
  field: FieldConfig;
  editing: Record<string, unknown> | null;
  image: string | null;
  uploading: boolean;
  onImageChange: (url: string | null) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const value = editing ? (editing[field.name] as string | number | boolean | null) : "";

  if (field.type === "image") {
    return (
      <div className={field.half ? "sm:col-span-2" : undefined}>
        <label className={labelClass}>{field.label}</label>
        {image ? (
          <div className="overflow-hidden rounded-xl border border-line">
            <div className="relative h-44">
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
                alt={field.label}
                width={640}
                height={360}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => onImageChange(null)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-grey shadow-sm transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Remove image"
              >
                <X size={16} />
              </button>
            </div>
            <label
              className={`flex items-center justify-center gap-2 border-t border-line bg-cream/40 px-4 py-3 text-sm font-medium ${
                uploading
                  ? "cursor-wait text-grey"
                  : "cursor-pointer text-primary hover:bg-primary-mist"
              }`}
            >
              {uploading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Upload size={16} />
              )}
              {uploading ? "Uploading image..." : "Change image"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                disabled={uploading}
                className="hidden"
                onChange={onImageUpload}
              />
            </label>
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
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              disabled={uploading}
              className="hidden"
              onChange={onImageUpload}
            />
          </label>
        )}
        {field.hint && (
          <p className="mt-1.5 text-xs text-grey">{field.hint}</p>
        )}
      </div>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name={field.name}
          defaultChecked={Boolean(value)}
          className="h-4 w-4 rounded border-line text-primary focus:ring-primary/20"
        />
        <span className="text-sm font-medium text-ink">{field.label}</span>
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <div className={field.half ? undefined : undefined}>
        <label htmlFor={field.name} className={labelClass}>
          {field.label}
          {field.required && <span className="text-red-500"> *</span>}
        </label>
        <select
          id={field.name}
          name={field.name}
          required={field.required}
          defaultValue={(value as string) || ""}
          className={inputClass}
        >
          <option value="">Select...</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className={field.half ? "sm:col-span-2" : undefined}>
        <label htmlFor={field.name} className={labelClass}>
          {field.label}
          {field.required && <span className="text-red-500"> *</span>}
        </label>
        <textarea
          id={field.name}
          name={field.name}
          rows={field.rows || 4}
          required={field.required}
          defaultValue={(value as string) || ""}
          placeholder={field.placeholder}
          className={inputClass}
        />
        {field.hint && (
          <p className="mt-1.5 text-xs text-grey">{field.hint}</p>
        )}
      </div>
    );
  }

  // text / number
  return (
    <div className={field.half ? undefined : undefined}>
      <label htmlFor={field.name} className={labelClass}>
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </label>
      <input
        id={field.name}
        name={field.name}
        type={field.type === "number" ? "number" : "text"}
        required={field.required}
        defaultValue={(value as string) || ""}
        placeholder={field.placeholder}
        className={inputClass}
      />
      {field.hint && (
        <p className="mt-1.5 text-xs text-grey">{field.hint}</p>
      )}
    </div>
  );
}

// Small helper icon (kept local to avoid extra imports)
function ImageIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}