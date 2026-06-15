const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function downloadImage(imageUrl, filename = 'image') {
  if (!imageUrl) return;

  // Resolve relative paths to absolute
  const url =
    typeof imageUrl === 'string' && imageUrl.startsWith('/') && !imageUrl.startsWith('//')
      ? `${API_URL}${imageUrl}`
      : imageUrl;

  const cleanName = (filename || 'image').replace(/[^a-z0-9]/gi, '-').toLowerCase().replace(/-+/g, '-');

  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    const rawExt = blob.type.split('/')[1] || 'jpg';
    const ext = rawExt === 'jpeg' ? 'jpg' : rawExt.split('+')[0];
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${cleanName}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  } catch {
    // Fallback: open image in new tab so user can save manually
    window.open(url, '_blank');
  }
}
