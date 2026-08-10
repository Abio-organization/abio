import { apiClient } from '@/shared/lib/api-client'
import type { ApiResponse } from '@/shared/types'
import type {
  AppearancePayload,
  AppearanceTheme,
  CornerConfig,
  FillWallpaperConfig,
  FontConfig,
  GradientWallpaperConfig,
} from '@/features/appearance/types'

export async function getAppearancePreferences() {
  const { data } = await apiClient.get<ApiResponse<AppearancePayload>>('/user/preferences')
  return data
}

/** Public preset theme gallery — used by the marketing template page. */
export async function getThemes() {
  const { data } = await apiClient.get<ApiResponse<AppearanceTheme[]>>('/themes')
  return data
}

export async function updateAppearanceCorners(payload: CornerConfig) {
  const { data } = await apiClient.put<ApiResponse<AppearancePayload>>(
    '/user/preferences/corners',
    payload,
  )
  return data
}

export async function updateAppearanceFont(payload: FontConfig) {
  const { data } = await apiClient.put<ApiResponse<AppearancePayload>>(
    '/user/preferences/fonts',
    payload,
  )
  return data
}

export async function updateAppearanceWallpaper(
  payload: FillWallpaperConfig | GradientWallpaperConfig,
) {
  const { data } = await apiClient.put<ApiResponse<AppearancePayload>>(
    '/user/preferences/background',
    payload,
  )
  return data
}

export async function updateAppearanceImage(file: File, signal?: AbortSignal) {
  const formData = new FormData()
  formData.append('type', 'image')
  formData.append('image', file)

  const { data } = await apiClient.put<ApiResponse<AppearancePayload>>(
    '/user/preferences/background',
    formData,
    { signal },
  )
  return data
}
