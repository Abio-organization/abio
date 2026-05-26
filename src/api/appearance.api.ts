import { apiClient } from '@/api/client'
import type { ApiResponse } from '@/types/api.types'
import type {
  AppearancePayload,
  CornerConfig,
  FillWallpaperConfig,
  FontConfig,
  GradientWallpaperConfig,
} from '@/types/appearance.types'

export async function getAppearancePreferences() {
  const { data } = await apiClient.get<ApiResponse<AppearancePayload>>('/user/preferences')
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
