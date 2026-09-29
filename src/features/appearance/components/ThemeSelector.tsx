import { Check, Sparkles } from 'lucide-react'

import { useGetThemes } from '@/features/appearance/hooks/use-themes'
import { themePreviewStyle } from '@/features/appearance/lib'
import type { DisplayTheme, FontWeight } from '@/features/appearance/types'
import { cn } from '@/shared/lib/utils'

interface ThemeSelectorProps {
  selectedThemeId: string | null
  onSelect: (theme: DisplayTheme) => void
}

function getFontWeight(weight?: FontWeight) {
  switch (weight) {
    case 'regular':
      return 400
    case 'medium':
      return 500
    case 'semibold':
      return 600
    case 'bold':
      return 700
    default:
      return 400
  }
}

function getButtonRadius(type: DisplayTheme['corner_config']['type']) {
  switch (type) {
    case 'sharp':
      return '2px'
    case 'round':
      return '9999px'
    case 'curved':
    default:
      return '8px'
  }
}

function getButtonShadow(
  shadow: DisplayTheme['corner_config']['shadow'],
) {
  switch (shadow) {
    case 'soft':
      return '0 2px 8px rgba(0, 0, 0, 0.18)'
    case 'hard':
      return '3px 3px 0 rgba(0, 0, 0, 0.3)'
    case 'none':
    default:
      return 'none'
  }
}

function ThemeCard({
  theme,
  isSelected,
  onSelect,
}: {
  theme: DisplayTheme
  isSelected: boolean
  onSelect: () => void
}) {
  const preview = themePreviewStyle(theme.wallpaper_config)

  const font = theme.font_config
  const corner = theme.corner_config

  const fontColor = font.fillColor ?? '#333333'

  const buttonBackground = corner.fillColor ?? 'rgba(255, 255, 255, 0.9)'

  const buttonBorderColor = corner.strokeColor ?? 'transparent'

  const buttonOpacity = corner.opacity ?? 1

  const buttonRadius = getButtonRadius(corner.type)

  const buttonShadow = getButtonShadow(corner.shadow)

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      aria-label={`Select theme: ${theme.name}`}
      className="flex w-full min-w-0 flex-col items-center gap-1"
    >
      {/* Theme preview */}
      <div
        className={cn(
          'relative aspect-square w-full overflow-hidden',
          isSelected
            ? 'ring-2 ring-[#331400] dark:ring-[#F5EEE4]'
            : 'ring-1 ring-black/10 dark:ring-white/10',
        )}
        style={{
          ...preview,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Selected indicator */}
        {isSelected && (
          <span className="absolute top-1.5 right-1.5 z-20 flex h-4 w-4 items-center justify-center rounded-full bg-[#331400] dark:bg-[#F5EEE4]">
            <Check
              className="h-2.5 w-2.5 text-white dark:text-[#331400]"
              strokeWidth={3}
            />
          </span>
        )}

        {/* Font preview */}
        
        {/* Button preview */}
        <div className="absolute right-0 top-25 left-25">
          <div
            className="flex  h-10 items-center justify-center px-2 text-[9px] leading-none"
            style={{
              fontFamily: font.name
                ? `'${font.name}', sans-serif`
                : 'inherit',

              fontWeight: getFontWeight(font.weight),

              borderRadius: buttonRadius,

              backgroundColor: buttonBackground,

              border:
                corner.strokeColor
                  ? `1px solid ${buttonBorderColor}`
                  : undefined,

              opacity: buttonOpacity,

              boxShadow: buttonShadow,

              color: fontColor,

              fontStyle: font.italic ? 'italic' : 'normal',

              textDecoration: font.underline
                ? 'underline'
                : 'none',
            }}
          >
            <span
          className="absolute top-2 left-2 z-10 text-xl leading-none"
          style={{
            fontFamily: font.name
              ? `'${font.name}', sans-serif`
              : 'inherit',

            fontWeight: getFontWeight(font.weight),

            fontStyle: font.italic ? 'italic' : 'normal',

            textDecoration: font.underline
              ? 'underline'
              : 'none',

            color: fontColor,
          }}
        >
          Aa
        </span>

          </div>
        </div>
      </div>

      {/* Theme name */}
      <p className="w-full truncate text-center text-[10px] font-semibold text-[#331400] dark:text-[#F5EEE4]">
        {theme.name}
      </p>
    </button>
  )
}

function SkeletonCard() {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="aspect-square w-full animate-pulse bg-[#331400]/5 dark:bg-white/5" />

      <div className="h-2.5 w-14 animate-pulse rounded bg-[#331400]/5 dark:bg-white/5" />
    </div>
  )
}

export function ThemeSelector({
  selectedThemeId,
  onSelect,
}: ThemeSelectorProps) {
  const { data, isLoading, isError } = useGetThemes()

  const themes = data ?? []

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-x-2 gap-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <p className="py-8 text-center text-sm text-red-600">
        Could not load themes.
      </p>
    )
  }

  if (themes.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-center text-[#666464] dark:text-[#F5EEE4]/50">
        <Sparkles className="h-6 w-6" />

        <p className="text-sm">
          No preset themes yet — customize your own below.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-x-2 gap-y-3">
      {themes.map((theme) => (
        <ThemeCard
          key={theme.id}
          theme={theme}
          isSelected={selectedThemeId === theme.id}
          onSelect={() => onSelect(theme)}
        />
      ))}
    </div>
  )
}