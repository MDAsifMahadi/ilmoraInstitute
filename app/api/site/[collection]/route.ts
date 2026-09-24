import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyRequestAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  InvalidSiteContentError,
  normalizeSiteCollectionData,
  validateSiteCollectionData,
} from "@/lib/site-content";

// ============================================================
// Generic CRUD API for site content collections
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
  findMany: (args?: unknown) => Promise<unknown[]>;
  findUnique: (args: { where: { id: string } }) => Promise<Record<string, unknown> | null>;
  create: (args: { data: unknown }) => Promise<unknown>;
};

function getCollectionModel(collection: SiteCollection): CollectionModel {
  return (
    prisma as unknown as Record<string, CollectionModel>
  )[COLLECTION_MODEL[collection]];
}

// GET /api/site/[collection]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params;
  if (!isCollection(collection)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }

  try {
    const model = getCollectionModel(collection);
    const items = await model.findMany({ orderBy: { createdAt: "asc" } });
    return NextResponse.json({ items });
  } catch (error) {
    console.error(`GET /api/site/${collection} error:`, error);
    return NextResponse.json({ error: "Failed to load items" }, { status: 500 });
  }
}

// POST /api/site/[collection]
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  const user = await verifyRequestAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { collection } = await params;
  if (!isCollection(collection)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }

  try {
    const rawBody = await request.json();
    const body = normalizeSiteCollectionData(
      collection,
      validateSiteCollectionData(collection, rawBody, "create")
    );
    const model = getCollectionModel(collection);
    const item = await model.create({ data: body });
    revalidatePath("/", "layout");
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    if (error instanceof InvalidSiteContentError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error(`POST /api/site/${collection} error:`, error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}