import { useMutation, useQueryClient } from '@tanstack/react-query'

import { getApiErrorMessage } from '@/shared/lib/api-error'
import { queryKeys } from '@/shared/lib/query-keys'
import { toast } from '@/shared/lib/toast'

import { updatePreferences, uploadWallpaperImage, type UpdatePreferencesPayload } from '@/features/appearance/api/appearance.api'
import { buttonStyleToCornerConfig, fontStyleToFontConfig, selectedThemeToWallpaperConfig, wallpaperToSelectedTheme } from '@/features/appearance/lib'
import { useAppearanceEditorStore, type EditorSnapshot } from '@/features/appearance/store/appearance-editor-store'

/**
 * Save Changes — reads live editor state at call time (not from a stale hook
 * closure) so it always saves exactly what's on screen. Uploads a staged
 * wallpaper image first if present, per the backend's documented two-step
 * contract, then sends one combined PUT.
 */
export function useSavePreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { current, pendingWallpaperFile, selectedThemeId } = useAppearanceEditorStore.getState()

      let wallpaperConfig = selectedThemeToWallpaperConfig(current.wallpaper)
      let finalSnapshot: EditorSnapshot = current

      if (pendingWallpaperFile) {
        const uploaded = await uploadWallpaperImage(pendingWallpaperFile)
        wallpaperConfig = { type: 'image', image: uploaded.data.url }
        finalSnapshot = { ...current, wallpaper: wallpaperToSelectedTheme(wallpaperConfig) }
      }

      const payload: UpdatePreferencesPayload = {
        font_config: fontStyleToFontConfig(current.fontStyle),
        corner_config: buttonStyleToCornerConfig(current.buttonStyle),
        wallpaper_config: wallpaperConfig,
        selected_theme: selectedThemeId,
      }

      const res = await updatePreferences(payload)
      return { res, finalSnapshot }
    },
    onSuccess: ({ res, finalSnapshot }) => {
      useAppearanceEditorStore.getState().markSaved(finalSnapshot)
      queryClient.setQueryData(queryKeys.settings, res.data)
      toast.success('Appearance saved', { description: 'Your profile now reflects these changes.' })
    },
    onError: (error) => {
      // Deliberately do not discard local edits on failure — the user's
      // in-progress customization stays intact so they can just retry Save.
      toast.error('Could not save changes', { description: getApiErrorMessage(error) })
    },
  })
}
