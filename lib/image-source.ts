const LOCAL_IMAGE_PATH =
  /^\/(?!\/)[^\s?#]+\.(?:avif|gif|jpe?g|png|webp)(?:\?[^\s#]*)?$/i;

export function isApprovedImageSource(value: unknown): value is string {
  if (typeof value !== "string" || !value.trim()) return false;
  if (LOCAL_IMAGE_PATH.test(value)) return true;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return false;

  try {
    const url = new URL(value);
    const marker = `/${cloudName}/image/upload/`;
    const segments = url.pathname
      .slice(marker.length)
      .split("/")
      .filter(Boolean);
    if (segments[0]?.startsWith("v") && /^v\d+$/.test(segments[0])) {
      segments.shift();
    }
    return (
      url.protocol === "https:" &&
      url.hostname === "res.cloudinary.com" &&
      url.pathname.startsWith(marker) &&
      segments[0] === "ilmora-institute" &&
      !url.search &&
      !url.hash
    );
  } catch {
    return false;
  }
}

export function safeImageSource(
  value: string | null | undefined,
  fallback = ""
): string {
  return isApprovedImageSource(value) ? value : fallback;
}
