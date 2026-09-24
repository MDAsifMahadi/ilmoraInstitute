const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function uploadImage(file: File): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Please choose a JPG, PNG, WebP, or GIF image.");
  }
  if (file.size === 0 || file.size > MAX_IMAGE_FILE_SIZE) {
    throw new Error("Image size must be between 1 byte and 5MB.");
  }

  const formData = new FormData();
  formData.append("file", file);

  let response: Response;
  try {
    response = await fetch("/api/upload", { method: "POST", body: formData });
  } catch {
    throw new Error("Could not reach the upload service. Please try again.");
  }

  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      data &&
      typeof data === "object" &&
      "error" in data &&
      typeof data.error === "string"
        ? data.error
        : "Image upload failed. Please try again.";
    throw new Error(message);
  }

  if (
    !data ||
    typeof data !== "object" ||
    !("url" in data) ||
    typeof data.url !== "string" ||
    !data.url
  ) {
    throw new Error("The upload service returned an invalid response.");
  }

  return data.url;
}

export async function deleteUploadedImage(url: string): Promise<void> {
  const response = await fetch("/api/upload", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const data: unknown = await response.json().catch(() => null);
    const message =
      data &&
      typeof data === "object" &&
      "error" in data &&
      typeof data.error === "string"
        ? data.error
        : "Image cleanup failed.";
    throw new Error(message);
  }
}
