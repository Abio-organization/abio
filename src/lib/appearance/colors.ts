/** Never send "none" to the API — map to valid hex values. */
export function toValidColor(color: string | undefined, fallback = '#000000'): string {
  if (!color || color === 'none') return fallback
  return color
}
