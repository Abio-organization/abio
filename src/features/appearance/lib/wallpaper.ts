import type { CSSProperties } from 'react'

import type { WallpaperConfig } from '@/features/appearance/types'

const DEFAULT_THEME = 'fill:#331400'

/** String-encoded wallpaper used by the live editor + PhoneDisplay: `fill:#hex`, `gradient:#a:#b`, or a plain image URL. */
export function wallpaperToSelectedTheme(config: WallpaperConfig | undefined | null): string {
  if (!config || !config.type) return DEFAULT_THEME

  const type = config.type === 'solid' ? 'fill' : config.type

  if (type === 'fill' && typeof config.backgroundColor === 'string') {
    return `fill:${config.backgroundColor}`
  }

  if (type === 'gradient' && Array.isArray(config.backgroundColor)) {
    const [a, b] = config.backgroundColor
    return `gradient:${a?.color ?? '#000000'}:${b?.color ?? '#ffffff'}`
  }

  if (type === 'image' && config.image) {
    return config.image
  }

  return DEFAULT_THEME
}

/** Inverse of wallpaperToSelectedTheme — used when building the PUT /preferences body. */
export function selectedThemeToWallpaperConfig(selectedTheme: string): WallpaperConfig {
  if (selectedTheme.startsWith('fill:')) {
    return { type: 'fill', backgroundColor: selectedTheme.slice('fill:'.length) }
  }
  if (selectedTheme.startsWith('gradient:')) {
    const [, a, b] = selectedTheme.split(':')
    return {
      type: 'gradient',
      backgroundColor: [
        { color: a || '#000000', amount: 0.5 },
        { color: b || '#ffffff', amount: 1 },
      ],
    }
  }
  return { type: 'image', image: selectedTheme }
}

/** Inline-style version of the same mapping, for theme preview cards (gallery/grid). */
export function themePreviewStyle(config: WallpaperConfig | undefined | null): CSSProperties {
  if (!config || !config.type) return {}

  const type = config.type === 'solid' ? 'fill' : config.type

  if (type === 'fill' && typeof config.backgroundColor === 'string') {
    return { backgroundColor: config.backgroundColor }
  }

  if (type === 'gradient' && Array.isArray(config.backgroundColor) && config.backgroundColor.length >= 2) {
    const [a, b] = config.backgroundColor
    return { backgroundImage: `linear-gradient(to bottom, ${a.color}, ${b.color})` }
  }

  if (type === 'image' && config.image) {
    return {
      backgroundImage: `url(${config.image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }

  return {}
}
