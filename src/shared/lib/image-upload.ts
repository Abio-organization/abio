export function validateImage(file: File) {
  if (!file.type.startsWith('image/')) throw new Error('Select an image file.')
  if (file.size > 5 * 1024 * 1024) throw new Error('Images must be 5MB or smaller.')
}
export function requireUploadedImage(value: string) {
  try {
    const url = new URL(value)
    if (url.protocol === 'https:' && url.hostname === 'res.cloudinary.com' && url.pathname.split('/').filter(Boolean).length > 1) return value
  } catch { /* reject external and local preview URLs */ }
  throw new Error('Image must be uploaded through Abio first (Cloudinary URL required)')
}
