import { NextRequest, NextResponse } from "next/server";
import { verifyRequestAuth } from "@/lib/auth";
import {
  cloudinary,
  destroyCloudinaryImage,
  getCloudinaryPublicId,
  isCloudinaryConfigured,
  missingCloudinaryConfigVariables,
} from "@/lib/cloudinary";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_REQUEST_SIZE = MAX_FILE_SIZE + 128 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function hasValidSignature(bytes: Uint8Array, type: string): boolean {
  if (type === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (type === "image/png") {
    return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every(
      (value, index) => bytes[index] === value
    );
  }
  if (type === "image/gif") {
    const header = new TextDecoder().decode(bytes.slice(0, 6));
    return header === "GIF87a" || header === "GIF89a";
  }
  if (type === "image/webp") {
    return (
      new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" &&
      new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP"
    );
  }
  return false;
}

function isCloudinaryError(
  error: unknown
): error is { http_code?: number; error?: { message?: string } } {
  return (
    typeof error === "object" &&
    error !== null &&
    ("http_code" in error || "error" in error)
  );
}

export async function POST(request: NextRequest) {
  const user = await verifyRequestAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_SIZE) {
    return NextResponse.json(
      { error: "File must be 5MB or smaller" },
      { status: 413 }
    );
  }

  if (!isCloudinaryConfigured) {
    const missing = missingCloudinaryConfigVariables.join(", ");
    return NextResponse.json(
      {
        error: `Image uploads are not configured. Missing environment variable${missingCloudinaryConfigVariables.length === 1 ? "" : "s"}: ${missing}.`,
        code: "UPLOAD_NOT_CONFIGURED",
      },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: "Invalid or missing multipart form data" },
        { status: 400 }
      );
    }

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPG, PNG, WebP, GIF" },
        { status: 400 }
      );
    }
    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File must be between 1 byte and 5MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!hasValidSignature(buffer, file.type)) {
      return NextResponse.json(
        { error: "File content does not match its declared image type" },
        { status: 400 }
      );
    }

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "ilmora-institute",
            resource_type: "image",
            allowed_formats: ["jpg", "png", "webp", "gif"],
            overwrite: false,
          },
          (error, uploadResult) => {
            if (error || !uploadResult) {
              reject(error ?? new Error("Cloudinary returned no result"));
            } else {
              resolve({
                secure_url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
              });
            }
          }
        );
        uploadStream.end(buffer);
      }
    );

    return NextResponse.json(
      { url: result.secure_url, publicId: result.public_id },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    if (isCloudinaryError(error)) {
      console.error("Cloudinary image upload failed", error);
      return NextResponse.json(
        {
          error:
            "Cloudinary rejected the image upload. Check CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET, and confirm that image uploads are enabled for the account.",
          code: "UPLOAD_PROVIDER_ERROR",
        },
        { status: 502, headers: { "Cache-Control": "no-store" } }
      );
    }

    console.error("Image upload failed", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const user = await verifyRequestAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const url = typeof body?.url === "string" ? body.url : null;
    if (!url || !getCloudinaryPublicId(url)) {
      return NextResponse.json(
        { error: "A managed Cloudinary image URL is required" },
        { status: 400 }
      );
    }

    const deleted = await destroyCloudinaryImage(url);
    return NextResponse.json({ ok: true, deleted });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    console.error("Image cleanup failed:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
