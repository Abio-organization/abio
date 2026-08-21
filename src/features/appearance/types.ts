// Mirrors the real backend contract exactly — see
// Abio-Backend/src/modules/preferences/preferences.schemas.ts and
// GET /api/v1/docs (Preferences section) for the authoritative shapes.

export type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold'

export interface FontConfig {
  name: string
  italic?: boolean
  underline?: boolean
  fillColor?: string
  weight?: FontWeight
}

export type CornerType = 'sharp' | 'curved' | 'round'
export type ShadowType = 'none' | 'soft' | 'hard'

export interface CornerConfig {
  type: CornerType
  fillColor?: string
  strokeColor?: string | null
  /** 0–1 */
  opacity?: number
  shadow?: ShadowType
}

export interface GradientStop {
  color: string
  /** 0–1 */
  amount: number
}

export type WallpaperType = 'fill' | 'solid' | 'gradient' | 'image'

export interface WallpaperConfig {
  type: WallpaperType
  image?: string
  /** hex string for fill/solid, stop array for gradient */
  backgroundColor?: string | GradientStop[]
}

export interface AppearancePayload {
  id: string
  userId: string
  profileId: string
  /** Themes tab selection — a DisplayTheme id, or null. */
  selected_theme: string | null
  font_config: FontConfig
  corner_config: CornerConfig
  wallpaper_config: WallpaperConfig
  createdAt: string
  updatedAt: string
}

export interface DisplayTheme {
  id: string
  name: string
  active: boolean
  font_config: FontConfig
  corner_config: CornerConfig
  wallpaper_config: WallpaperConfig
  createdAt: string
  updatedAt: string
}

/** @deprecated use DisplayTheme — kept temporarily for landing-page template gallery call sites being migrated. */
export type AppearanceTheme = DisplayTheme

// ─── UI-facing types consumed by PhoneDisplay + the editor ───
// Kept stable/minimal so the shared preview component doesn't need to know
// about the backend's config shapes — lib/corners.ts and lib/font.ts convert
// to and from these.

export interface ButtonStyle {
  borderRadius: string
  backgroundColor: string
  borderColor: string
  opacity: number
  boxShadow: string
}

export interface FontStyle {
  fontFamily: string
  fillColor: string
  strokeColor: string
  opacity: number
  italic?: boolean
  underline?: boolean
  weight?: FontWeight
}
