import { Check, Sparkles } from 'lucide-react'

import { useGetThemes } from '@/features/appearance/hooks/use-themes'
import { themePreviewStyle } from '@/features/appearance/lib'
import type { DisplayTheme } from '@/features/appearance/types'
import { cn } from '@/shared/lib/utils'

interface ThemeSelectorProps {
  selectedThemeId: string | null
  onSelect: (theme: DisplayTheme) => void
}

function ThemeCard({ theme, isSelected, onSelect }: { theme: DisplayTheme; isSelected: boolean; onSelect: () => void }) {
  const preview = themePreviewStyle(theme.wallpaper_config)
  const buttonRadius = theme.corner_config?.type === 'sharp' ? 4 : theme.corner_config?.type === 'round' ? 9999 : 10

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      aria-label={`Select theme: ${theme.name}`}
      className="flex flex-col items-center gap-1.5"
    >
      <div
        className={cn('relative aspect-square w-full overflow-hidden', isSelected ? 'ring-2 ring-[#331400] dark:ring-[#F5EEE4]' : 'ring-1 ring-black/10')}
        style={{ ...preview, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {isSelected && (
          <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#331400] dark:bg-[#F5EEE4]">
            <Check className="h-3 w-3 text-white dark:text-[#331400]" strokeWidth={3} />
          </span>
        )}
        <span
          className="absolute top-2 left-2 text-sm font-bold text-white drop-shadow"
          style={{ fontFamily: theme.font_config?.name ? `'${theme.font_config.name}', sans-serif` : 'inherit' }}
        >
          Aa
        </span>
        <div className="absolute right-2 bottom-2 left-2">
          <div
            className="flex h-6 items-center justify-center px-2 text-[10px] font-medium"
            style={{
              borderRadius: buttonRadius,
              backgroundColor: theme.corner_config?.fillColor ?? 'rgba(255,255,255,0.9)',
              color: theme.font_config?.fillColor ?? '#333333',
            }}
          >
            Link
          </div>
        </div>
      </div>
      <p className="w-full truncate text-center text-xs font-semibold text-[#331400] dark:text-[#F5EEE4]">{theme.name}</p>
    </button>
  )
}

function SkeletonCard() {
  return <div className="aspect-square w-full animate-pulse bg-[#331400]/5 dark:bg-white/5" />
}

export function ThemeSelector({ selectedThemeId, onSelect }: ThemeSelectorProps) {
  const { data, isLoading, isError } = useGetThemes()
  const themes = data ?? []

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (isError) {
    return <p className="py-8 text-center text-sm text-red-600">Could not load themes.</p>
  }

  if (themes.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-center text-[#666464] dark:text-[#F5EEE4]/50">
        <Sparkles className="h-6 w-6" />
        <p className="text-sm">No preset themes yet — customize your own below.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {themes.map((theme) => (
        <ThemeCard key={theme.id} theme={theme} isSelected={selectedThemeId === theme.id} onSelect={() => onSelect(theme)} />
      ))}
    </div>
  )
}
