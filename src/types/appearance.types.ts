export interface AppearancePayload {
  id: string
  userId: string
  profileId: string
  selected_theme: string | null
  font_config: FontConfig
  corner_config: CornerConfig
  wallpaper_config: WallpaperConfig
  createdAt: string
  updatedAt: string
}

export interface CornerConfig {
  borderRadius?: string
  backgroundColor?: string
  borderColor?: string
  opacity?: number
  boxShadow?: string
  shadowSize?: 'hard' | 'soft'
  style?: 'sharp' | 'round' | 'curved'
}

export interface FontConfig {
  name?: string
  fillColor?: string
  strokeColor?: string
  opacity?: number
}

export type WallpaperConfig =
  | Record<string, never>
  | FillWallpaperConfig
  | GradientWallpaperConfig
  | ImageWallpaperConfig

export interface FillWallpaperConfig {
  type: 'fill'
  backgroundColor: Array<{ color: string; amount: number }>
}

export interface GradientWallpaperConfig {
  type: 'gradient'
  backgroundColor: Array<{ color: string; amount: number }>
}

export interface ImageWallpaperConfig {
  type: 'image'
  imageUrl?: string
}

/** UI model for link button styling (maps to CornerConfig). */
export interface ButtonStyle {
  borderRadius: string
  backgroundColor: string
  borderColor: string
  opacity: number
  boxShadow: string
}

/** UI model for text styling (maps to FontConfig). */
export interface FontStyle {
  fontFamily: string
  fillColor: string
  strokeColor: string
  opacity: number
}
