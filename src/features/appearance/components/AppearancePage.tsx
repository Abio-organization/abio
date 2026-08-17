import { useBlocker } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { PhoneDisplay } from '@/shared/components/PhoneDisplay'
import { cn } from '@/shared/lib/utils'

import { useGetSettings } from '@/features/appearance/hooks/use-settings'
import { cornerConfigToButtonStyle, fontConfigToFontStyle, wallpaperToSelectedTheme } from '@/features/appearance/lib'
import { useAppearanceEditorStore } from '@/features/appearance/store/appearance-editor-store'
import type { DisplayTheme } from '@/features/appearance/types'
import { usePhoneDisplayProps } from '@/shared/hooks/usePhoneDisplayProps'

import { ButtonAndFontTabs } from './ButtonAndFontTabs'
import { SaveBar } from './SaveBar'
import { ThemeSelector } from './ThemeSelector'
import { UndoRedoControls } from './UndoRedoControls'
import { WallpaperSelector } from './WallpaperSelector'

type AppearanceTab = 'style' | 'themes' | 'wallpaper'
const TABS: { id: AppearanceTab; label: string }[] = [
  { id: 'style', label: 'Style' },
  { id: 'themes', label: 'Themes' },
  { id: 'wallpaper', label: 'Wallpaper' },
]

export function AppearancePage() {
  const settingsQuery = useGetSettings()
  const { profile, links, isLoading: previewLoading } = usePhoneDisplayProps()
  const [tab, setTab] = useState<AppearanceTab>('style')
  const hasHydrated = useRef(false)

  const current = useAppearanceEditorStore((s) => s.current)
  const selectedThemeId = useAppearanceEditorStore((s) => s.selectedThemeId)
  const isDirty = useAppearanceEditorStore((s) => s.isDirty)
  const hydrate = useAppearanceEditorStore((s) => s.hydrate)
  const update = useAppearanceEditorStore((s) => s.update)
  const applyPreset = useAppearanceEditorStore((s) => s.applyPreset)
  const setPendingWallpaperFile = useAppearanceEditorStore((s) => s.setPendingWallpaperFile)
  const undo = useAppearanceEditorStore((s) => s.undo)
  const redo = useAppearanceEditorStore((s) => s.redo)

  // Hydrate the editor once, on first load of the server's saved preferences.
  useEffect(() => {
    if (hasHydrated.current || !settingsQuery.data) return
    hasHydrated.current = true
    const settings = settingsQuery.data
    hydrate(
      {
        buttonStyle: cornerConfigToButtonStyle(settings.corner_config),
        fontStyle: fontConfigToFontStyle(settings.font_config),
        wallpaper: wallpaperToSelectedTheme(settings.wallpaper_config),
      },
      settings.selected_theme,
    )
  }, [settingsQuery.data, hydrate])

  // Cmd/Ctrl+Z undo, Cmd/Ctrl+Shift+Z or Cmd/Ctrl+Y redo — ignored while typing in a field.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const isTyping = target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      if (isTyping) return

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo])

  // Warn before leaving with unsaved changes — both in-app navigation and tab close/refresh.
  useBlocker({
    shouldBlockFn: () => {
      if (!isDirty) return false
      return !window.confirm('You have unsaved appearance changes. Leave without saving?')
    },
    enableBeforeUnload: () => isDirty,
  })

  const handleThemeSelect = (theme: DisplayTheme) => {
    applyPreset(
      {
        buttonStyle: cornerConfigToButtonStyle(theme.corner_config),
        fontStyle: fontConfigToFontStyle(theme.font_config),
        wallpaper: wallpaperToSelectedTheme(theme.wallpaper_config),
      },
      theme.id,
    )
  }

  if (settingsQuery.isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#331400] dark:text-[#F5EEE4]" />
      </div>
    )
  }

  if (settingsQuery.isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-red-600">Could not load your appearance settings.</p>
        <button
          type="button"
          onClick={() => settingsQuery.refetch()}
          className="bg-[#331400] px-4 py-2 text-sm font-semibold text-[#FED45C] hover:bg-[#4a2c1a]"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <section className="min-w-0">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-[#331400] dark:text-[#F5EEE4]">Appearance</h1>
          <div className="flex items-center gap-3">
            <UndoRedoControls />
            <SaveBar />
          </div>
        </div>

        <div className="mb-6 flex gap-2 border-b border-[#331400]/10 dark:border-[#F5EEE4]/10">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                'relative px-1 py-3 text-sm font-semibold',
                tab === t.id ? 'text-[#331400] dark:text-[#F5EEE4]' : 'text-[#666464] dark:text-[#F5EEE4]/50',
              )}
            >
              {t.label}
              {tab === t.id && <span className="absolute right-0 bottom-0 left-0 h-0.5 bg-red-500" />}
            </button>
          ))}
        </div>

        {tab === 'style' && (
          <ButtonAndFontTabs
            buttonStyle={current.buttonStyle}
            fontStyle={current.fontStyle}
            onButtonStyleChange={(buttonStyle) => update({ buttonStyle })}
            onFontStyleChange={(fontStyle) => update({ fontStyle })}
          />
        )}
        {tab === 'themes' && <ThemeSelector selectedThemeId={selectedThemeId} onSelect={handleThemeSelect} />}
        {tab === 'wallpaper' && (
          <WallpaperSelector
            wallpaper={current.wallpaper}
            onWallpaperChange={(wallpaper) => update({ wallpaper })}
            onFileChange={setPendingWallpaperFile}
          />
        )}
      </section>

      <aside className="flex justify-center lg:sticky lg:top-8 lg:h-fit">
        {previewLoading ? (
          <Loader2 className="h-6 w-6 animate-spin text-[#331400]/50 dark:text-[#F5EEE4]/50" />
        ) : (
          <PhoneDisplay buttonStyle={current.buttonStyle} fontStyle={current.fontStyle} selectedTheme={current.wallpaper} profile={profile} links={links} />
        )}
      </aside>
    </div>
  )
}
