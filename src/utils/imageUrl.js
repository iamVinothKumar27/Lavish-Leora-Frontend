const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function resolveImageUrl(url) {
  if (!url) return null;
  // Full URLs (Cloudinary, Unsplash, or any https:// legacy) — use as-is
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // Any server-relative path (/api/uploads/... or legacy /uploads/...) — prefix with backend URL
  if (url.startsWith('/')) return `${API_URL}${url}`;
  return url;
}
