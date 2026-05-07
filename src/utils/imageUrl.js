const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function resolveImageUrl(url) {
  if (!url) return null;
  // Cloudinary URLs, external URLs — use as-is
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  // Legacy local uploads — prefix with backend URL (works locally; falls back to fallback img in prod)
  if (url.startsWith('/uploads')) return `${API_URL}${url}`;
  return url;
}
