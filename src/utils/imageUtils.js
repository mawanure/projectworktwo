/**
 * Resolves a product image URL to the correct absolute URL.
 *
 * - If the URL starts with "http" or "https", it is returned as-is (external URL).
 * - If the URL starts with "/uploads/", it is prefixed with the backend API base URL
 *   so the browser fetches the image from the backend server directly.
 * - Otherwise (legacy /images/... paths), a leading "/" is prepended if needed,
 *   so the browser fetches from the frontend's public directory.
 *
 * @param {string|null|undefined} imageUrl - The raw image URL from the API response.
 * @param {string} [fallback='/images/products/f1.jpg'] - Fallback URL if imageUrl is falsy.
 * @returns {string} The resolved URL ready for use in an <img> src attribute.
 */
export function resolveImageUrl(imageUrl, fallback = '/images/products/f1.jpg') {
  if (!imageUrl) return fallback;

  // Already a full URL (http / https)
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Uploaded image served from backend (/uploads/...)
  if (imageUrl.startsWith('/uploads/')) {
    const apiBase = import.meta.env.VITE_API_BASE_URL || '';
    return `${apiBase}${imageUrl}`;
  }

  // Legacy: relative path like "images/products/f1.jpg" or "/images/products/f1.jpg"
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }
  return `/${imageUrl}`;
}
