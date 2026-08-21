/** Curated, fully-supported font list for user-customizable profile text — distinct from the app's own brand typography. */
export const FONT_OPTIONS = ['Inter', 'Poppins', 'Roboto', 'Montserrat', 'Lato', 'Open Sans', 'Raleway', 'Playfair Display'] as const

let injected = false

/** Lazily loads the curated font set — only called once, only when the Appearance editor mounts. */
export function ensureGoogleFontsLoaded() {
  if (injected || typeof document === 'undefined') return
  injected = true

  const families = FONT_OPTIONS.map((name) => `family=${name.replace(/ /g, '+')}:wght@400;500;600;700`).join('&')
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`
  document.head.appendChild(link)
}
