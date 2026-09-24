import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyRequestAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { destroyCloudinaryImage } from "@/lib/cloudinary";
import {
  InvalidSiteContentError,
  normalizeOptionalImageValue,
} from "@/lib/site-content";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      return NextResponse.json({ settings: null });
    }
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("GET /api/site/settings error:", error);
    return NextResponse.json(
      { error: "Failed to load site settings" },
      { status: 500 }
    );
  }
}

const SETTINGS_FIELDS = new Set([
  "name",
  "nameLatin",
  "tagline",
  "description",
  "phone",
  "whatsapp",
  "email",
  "address",
  "facebook",
  "youtube",
  "heroArabicText",
  "admissionOpen",
  "logo",
  "logoNav",
  "logoHero",
  "heroImage",
]);

function optionalText(value: unknown, field: string, maxLength = 5000): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string") {
    throw new InvalidSiteContentError(`${field} must be a string`);
  }
  const normalized = value.trim();
  if (!normalized) return null;
  if (normalized.length > maxLength) {
    throw new InvalidSiteContentError(`${field} is too long`);
  }
  return normalized;
}

function optionalUrl(value: unknown, field: string): string | null {
  const normalized = optionalText(value, field, 2048);
  if (!normalized) return null;
  try {
    const url = new URL(normalized);
    if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error();
  } catch {
    throw new InvalidSiteContentError(`${field} must be a valid URL`);
  }
  return normalized;
}

export async function PUT(request: NextRequest) {
  const user = await verifyRequestAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Request body must be an object" },
        { status: 400 }
      );
    }
    for (const field of Object.keys(body)) {
      if (!SETTINGS_FIELDS.has(field)) {
        return NextResponse.json({ error: `Unknown field: ${field}` }, { status: 400 });
      }
    }

    const input = body as Record<string, unknown>;
    const name = optionalText(input.name, "name", 160);
    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    const email = optionalText(input.email, "email", 320);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "email is invalid" }, { status: 400 });
    }

    const data = {
      name,
      nameLatin: optionalText(input.nameLatin, "nameLatin", 160),
      tagline: optionalText(input.tagline, "tagline", 300),
      description: optionalText(input.description, "description", 1000),
      phone: optionalText(input.phone, "phone", 50),
      whatsapp: optionalText(input.whatsapp, "whatsapp", 50),
      email,
      address: optionalText(input.address, "address", 300),
      facebook: optionalUrl(input.facebook, "facebook"),
      youtube: optionalUrl(input.youtube, "youtube"),
      heroArabicText: optionalText(input.heroArabicText, "heroArabicText", 200),
      admissionOpen: input.admissionOpen === true || input.admissionOpen === "true",
      logo: normalizeOptionalImageValue(input.logo, "Header logo"),
      logoNav: normalizeOptionalImageValue(input.logoNav, "Footer logo"),
      logoHero: normalizeOptionalImageValue(input.logoHero, "Legacy hero logo"),
      heroImage: normalizeOptionalImageValue(input.heroImage, "Hero image"),
    };

    const existing = await prisma.siteSettings.findFirst();

    const settings = existing
      ? await prisma.siteSettings.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.siteSettings.create({ data });

    if (existing) {
      const nextImageValues = new Set(
        [data.logo, data.logoNav, data.logoHero, data.heroImage].filter(
          (value): value is string => typeof value === "string"
        )
      );
      for (const field of [
        "logo",
        "logoNav",
        "logoHero",
        "heroImage",
      ] as const) {
        const oldValue = existing[field];
        const nextValue = data[field];
        if (oldValue && oldValue !== nextValue && !nextImageValues.has(oldValue)) {
          await destroyCloudinaryImage(oldValue);
        }
      }
    }

    revalidatePath("/", "layout");
    return NextResponse.json({ settings });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    if (error instanceof InvalidSiteContentError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("PUT /api/site/settings error:", error);
    return NextResponse.json(
      { error: "Failed to save site settings" },
      { status: 500 }
    );
  }
}