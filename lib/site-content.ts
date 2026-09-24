import { isApprovedImageSource } from "@/lib/image-source";

export class InvalidSiteContentError extends Error {}

const IMAGE_FIELDS: Record<string, { field: string; label: string }> = {
  teachers: { field: "image", label: "Teacher photo" },
  testimonials: { field: "image", label: "Student or guardian photo" },
  gallery: { field: "url", label: "Gallery image" },
};

const COLLECTION_FIELDS: Record<string, string[]> = {
  teachers: ["name", "subject", "image", "experience", "bio", "grad"],
  gallery: ["alt", "url"],
  videos: ["title", "youtubeId", "category", "description"],
  testimonials: ["quote", "name", "relation", "image"],
  stats: ["label", "value"],
  features: ["title", "description", "icon"],
  steps: ["step", "title", "description"],
  faq: ["question", "answer"],
};

const REQUIRED_CREATE_FIELDS: Record<string, string[]> = {
  teachers: ["name", "subject"],
  gallery: ["alt", "url"],
  videos: ["title", "youtubeId"],
  testimonials: ["quote", "name"],
  stats: ["label", "value"],
  features: ["title", "description"],
  steps: ["step", "title"],
  faq: ["question", "answer"],
};

const FEATURE_ICONS = new Set([
  "Route",
  "MonitorPlay",
  "Home",
  "CalendarDays",
  "ClipboardCheck",
  "Award",
  "BookOpen",
  "BookOpenText",
  "ScrollText",
  "Sparkles",
  "GraduationCap",
  "Library",
  "PenLine",
  "Mic",
]);

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function getSiteImageField(collection: string): string | null {
  return IMAGE_FIELDS[collection]?.field ?? null;
}

export function normalizeOptionalImageValue(
  value: unknown,
  label: string
): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (!isApprovedImageSource(value)) {
    throw new InvalidSiteContentError(
      `${label} must be an approved Cloudinary URL or a local image path`
    );
  }
  return value;
}

export function validateSiteCollectionData(
  collection: string,
  body: unknown,
  mode: "create" | "update" = "update"
): Record<string, unknown> {
  const allowedFields = COLLECTION_FIELDS[collection];
  if (!allowedFields) {
    throw new InvalidSiteContentError("Unknown site-content collection");
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new InvalidSiteContentError("Request body must be an object");
  }

  const data = body as Record<string, unknown>;
  for (const [field, value] of Object.entries(data)) {
    if (!allowedFields.includes(field)) {
      throw new InvalidSiteContentError(`Unknown field: ${field}`);
    }
    if (value !== null && value !== undefined && typeof value !== "string") {
      throw new InvalidSiteContentError(`${field} must be a string`);
    }
  }

  if (mode === "create") {
    for (const field of REQUIRED_CREATE_FIELDS[collection] || []) {
      if (!isNonEmptyString(data[field])) {
        throw new InvalidSiteContentError(`${field} is required`);
      }
    }
  }

  if (
    collection === "videos" &&
    data.youtubeId !== undefined &&
    data.youtubeId !== null &&
    (typeof data.youtubeId !== "string" ||
      !/^[A-Za-z0-9_-]{11}$/.test(data.youtubeId))
  ) {
    throw new InvalidSiteContentError(
      "youtubeId must be an 11-character YouTube video ID"
    );
  }

  if (
    collection === "features" &&
    data.icon !== undefined &&
    data.icon !== null &&
    (typeof data.icon !== "string" || !FEATURE_ICONS.has(data.icon))
  ) {
    throw new InvalidSiteContentError("Unknown feature icon");
  }

  return data;
}

export function normalizeSiteCollectionData(
  collection: string,
  body: unknown
): unknown {
  const imageConfig = IMAGE_FIELDS[collection];
  if (!imageConfig || !body || typeof body !== "object") {
    return body;
  }

  const data = body as Record<string, unknown>;
  if (!Object.hasOwn(data, imageConfig.field)) return data;

  if (
    collection === "gallery" &&
    (data[imageConfig.field] === null || data[imageConfig.field] === "")
  ) {
    throw new InvalidSiteContentError("Gallery image is required");
  }

  const image = normalizeOptionalImageValue(
    data[imageConfig.field],
    imageConfig.label
  );
  return { ...data, [imageConfig.field]: image };
}
