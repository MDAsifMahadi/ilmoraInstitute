import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyRequestAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { destroyCloudinaryImage } from "@/lib/cloudinary";
import {
  InvalidSiteContentError,
  getSiteImageField,
  normalizeSiteCollectionData,
  validateSiteCollectionData,
} from "@/lib/site-content";

// ============================================================
// Generic CRUD for single item: PATCH / DELETE /api/site/[collection]/[id]
// ============================================================

export type SiteCollection =
  | "teachers"
  | "gallery"
  | "videos"
  | "testimonials"
  | "stats"
  | "features"
  | "steps"
  | "faq";

const COLLECTION_MODEL: Record<SiteCollection, string> = {
  teachers: "teacher",
  gallery: "galleryItem",
  videos: "video",
  testimonials: "testimonial",
  stats: "stat",
  features: "feature",
  steps: "admissionStep",
  faq: "fAQ",
};

function isCollection(value: string): value is SiteCollection {
  return Object.hasOwn(COLLECTION_MODEL, value);
}

type CollectionModel = {
  findUnique: (args: { where: { id: string } }) => Promise<Record<string, unknown> | null>;
  findFirst: (args: unknown) => Promise<Record<string, unknown> | null>;
  update: (args: {
    where: { id: string };
    data: unknown;
  }) => Promise<unknown>;
  delete: (args: { where: { id: string } }) => Promise<unknown>;
};

function getCollectionModel(collection: SiteCollection): CollectionModel {
  return (
    prisma as unknown as Record<string, CollectionModel>
  )[COLLECTION_MODEL[collection]];
}

async function isImageStillReferenced(
  model: CollectionModel,
  field: string,
  value: unknown,
  excludedId?: string
): Promise<boolean> {
  if (typeof value !== "string" || !value) return false;
  const where: Record<string, unknown> = { [field]: value };
  if (excludedId) where.id = { not: excludedId };
  return Boolean(await model.findFirst({ where }));
}

// PATCH /api/site/[collection]/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  const user = await verifyRequestAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { collection, id } = await params;
  if (!isCollection(collection)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }

  try {
    const rawBody = await request.json();
    const body = normalizeSiteCollectionData(
      collection,
      validateSiteCollectionData(collection, rawBody, "update")
    );
    const model = getCollectionModel(collection);
    const existing = await model.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const imageField = getSiteImageField(collection);
    const data =
      body && typeof body === "object"
        ? (body as Record<string, unknown>)
        : {};
    const imageWasProvided = imageField
      ? Object.hasOwn(data, imageField)
      : false;
    const oldImage = imageField ? existing[imageField] : null;
    const nextImage = imageField ? data[imageField] : undefined;

    const item = await model.update({ where: { id }, data: body });
    try {
      if (
        imageWasProvided &&
        oldImage &&
        oldImage !== nextImage &&
        imageField &&
        !(await isImageStillReferenced(model, imageField, oldImage, id))
      ) {
        await destroyCloudinaryImage(oldImage);
      }
    } catch (cleanupError) {
      console.error("Image cleanup after update failed:", cleanupError);
    }
    revalidatePath("/", "layout");
    return NextResponse.json({ item });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    if (error instanceof InvalidSiteContentError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error(`PATCH /api/site/${collection}/${id} error:`, error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

// DELETE /api/site/[collection]/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  const user = await verifyRequestAuth(_request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { collection, id } = await params;
  if (!isCollection(collection)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }

  try {
    const model = getCollectionModel(collection);
    const existing = await model.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    await model.delete({ where: { id } });
    const imageField = getSiteImageField(collection);
    try {
      if (
        imageField &&
        existing[imageField] &&
        !(await isImageStillReferenced(model, imageField, existing[imageField]))
      ) {
        await destroyCloudinaryImage(existing[imageField]);
      }
    } catch (cleanupError) {
      console.error("Image cleanup after delete failed:", cleanupError);
    }
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`DELETE /api/site/${collection}/${id} error:`, error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}