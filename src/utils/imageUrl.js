const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function resolveImageUrl(image) {
  if (!image) return null;
  // GridFS object { fileId, filename, contentType }
  if (typeof image === 'object' && image.fileId) {
    return `${API_URL}/api/images/${image.fileId}`;
  }
  // Plain string URL
  if (typeof image === 'string') {
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    if (image.startsWith('/')) return `${API_URL}${image}`;
  }
  return null;
}
