import { apiClient } from '@/shared/lib/api-client'
import type { ApiResponse } from '@/shared/types'
import type {
  AppearancePayload,
  CornerConfig,
  DisplayTheme,
  FontConfig,
  WallpaperConfig,
} from '@/features/appearance/types'

export async function getAppearancePreferences() {
  const { data } = await apiClient.get<ApiResponse<AppearancePayload>>('/user/preferences')
  return data
}

export interface UpdatePreferencesPayload {
  font_config?: FontConfig
  corner_config?: CornerConfig
  wallpaper_config?: WallpaperConfig
  selected_theme?: string | null
}

/** Save Changes — single combined PUT, sections omitted are left unchanged server-side. */
export async function updatePreferences(payload: UpdatePreferencesPayload) {
  const { data } = await apiClient.put<ApiResponse<AppearancePayload>>('/user/preferences', payload)
  return data
}

export interface UploadWallpaperImageResult {
  url: string
  publicId: string
}

/** Returns a CDN URL — include it in a follow-up updatePreferences({ wallpaper_config: { type: 'image', image: url } }) call. */
export async function uploadWallpaperImage(file: File, signal?: AbortSignal) {
  const formData = new FormData()
  formData.append('image', file)

  const { data } = await apiClient.post<ApiResponse<UploadWallpaperImageResult>>(
    '/user/preferences/wallpaper/image',
    formData,
    { signal },
  )
  return data
}

/** Preset theme gallery — used by both the dashboard Themes tab and the marketing template page. */
export async function getThemes() {
  const { data } = await apiClient.get<ApiResponse<DisplayTheme[]>>('/themes')
  return data
}
