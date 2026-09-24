import { v2 as cloudinary } from "cloudinary";

const config = {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY?.trim(),
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET?.trim(),
};

export const missingCloudinaryConfigVariables = Object.entries(config)
  .filter(([, value]) => !value)
  .map(([name]) => name);

export const isCloudinaryConfigured =
  missingCloudinaryConfigVariables.length === 0;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/** Extracts a public ID from a secure Cloudinary delivery URL. */
export function getCloudinaryPublicId(value: unknown): string | null {
  if (typeof value !== "string" || !value || !config.CLOUDINARY_CLOUD_NAME) {
    return null;
  }

  try {
    const url = new URL(value);
    const marker = `/${config.CLOUDINARY_CLOUD_NAME}/image/upload/`;
    if (
      url.protocol !== "https:" ||
      url.hostname !== "res.cloudinary.com" ||
      !url.pathname.startsWith(marker)
    ) {
      return null;
    }

    const segments = decodeURIComponent(url.pathname.slice(marker.length))
      .split("/")
      .filter(Boolean);
    if (segments[0]?.startsWith("v") && /^v\d+$/.test(segments[0])) {
      segments.shift();
    }
    if (segments[0] !== "ilmora-institute") return null;
    const fileName = segments.pop();
    if (!fileName) return null;
    const lastDot = fileName.lastIndexOf(".");
    const publicId = lastDot > 0 ? fileName.slice(0, lastDot) : fileName;
    return [...segments, publicId].join("/") || null;
  } catch {
    return null;
  }
}

/**
 * Best-effort cleanup for an image removed from a content record.
 * Database mutations must not fail just because Cloudinary cleanup fails.
 */
export async function destroyCloudinaryImage(value: unknown): Promise<boolean> {
  const publicId = getCloudinaryPublicId(value);
  if (!publicId) return false;
  if (!isCloudinaryConfigured) {
    console.warn(
      `[cloudinary] Cannot delete ${publicId}: Cloudinary is not configured.`
    );
    return false;
  }

  try {
    const result = await new Promise<unknown>((resolve, reject) => {
      cloudinary.uploader.destroy(
        publicId,
        { resource_type: "image", invalidate: true },
        (error, destroyResult) => {
          if (error) reject(error);
          else resolve(destroyResult);
        }
      );
    });
    const resultValue =
      typeof result === "object" && result !== null && "result" in result
        ? result.result
        : result;
    if (resultValue !== "ok" && resultValue !== "not found") {
      console.warn(
        `[cloudinary] Unexpected delete result for ${publicId}:`,
        result
      );
    }
    return true;
  } catch (error) {
    console.error(`[cloudinary] Failed to delete ${publicId}:`, error);
    return false;
  }
}

export { cloudinary };
