/**
 * getStrapiMedia — Canonical Strapi media URL builder
 *
 * Converts a Strapi media object (or a raw relative/absolute URL string)
 * into a fully-qualified browser URL for production use.
 *
 * Strapi 5 returns media in flat format:
 *   { url: "/uploads/image.webp", ... }
 *
 * Usage:
 *   getStrapiMedia(property.CoverImage)           → "https://...render.com/uploads/image.webp"
 *   getStrapiMedia("/uploads/image.webp")         → "https://...render.com/uploads/image.webp"
 *   getStrapiMedia("https://external.com/img.png")→ "https://external.com/img.png" (unchanged)
 *   getStrapiMedia(null)                           → null
 */

// Derive the base URL from the env var (strip /api suffix if present)
const STRAPI_BASE_URL = (() => {
  const raw =
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    "http://localhost:1337/api";
  // Remove trailing /api so we get: https://homehub-backend-kpfk.onrender.com
  return raw.replace(/\/api\/?$/, "").replace(/\/$/, "");
})();

/**
 * @param {object|string|null|undefined} mediaOrUrl
 *   - A Strapi media object: { url: "/uploads/..." } (Strapi 5 flat)
 *   - A Strapi 4 media object: { data: { attributes: { url: "/uploads/..." } } }
 *   - A raw relative path string: "/uploads/..."
 *   - An already-absolute URL string: "https://..."
 *   - null / undefined → returns null
 *
 * @returns {string|null} Fully-qualified image URL, or null if unavailable
 */
export function getStrapiMedia(mediaOrUrl) {
  if (!mediaOrUrl) return null;

  // Already a fully-qualified URL string
  if (typeof mediaOrUrl === "string") {
    if (mediaOrUrl.startsWith("http://") || mediaOrUrl.startsWith("https://")) {
      return mediaOrUrl;
    }
    // Relative path — prepend base
    return `${STRAPI_BASE_URL}${mediaOrUrl.startsWith("/") ? "" : "/"}${mediaOrUrl}`;
  }

  // Strapi 5 flat format: { url: "/uploads/..." }
  if (mediaOrUrl.url) {
    const url = mediaOrUrl.url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${STRAPI_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  }

  // Strapi 4 nested format: { data: { attributes: { url: "..." } } }
  if (mediaOrUrl?.data?.attributes?.url) {
    const url = mediaOrUrl.data.attributes.url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${STRAPI_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  }

  // Strapi 4 direct-data format: { data: { url: "..." } }
  if (mediaOrUrl?.data?.url) {
    const url = mediaOrUrl.data.url;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${STRAPI_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  }

  return null;
}

/**
 * getStrapiBase — Returns the bare Strapi base URL (no /api suffix)
 * Useful when constructing non-media URLs.
 */
export function getStrapiBase() {
  return STRAPI_BASE_URL;
}
