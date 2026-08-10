import type { CSSProperties } from 'react'

import type { WallpaperConfig } from '@/features/appearance/types'

/** Preview theme string used by PhoneDisplay. */
export function wallpaperToSelectedTheme(config: WallpaperConfig): string {
  if (!config || Object.keys(config).length === 0) {
    return '/themes/theme1.png'
  }

  if ('type' in config && config.type === 'fill') {
    const color = config.backgroundColor[0]?.color ?? '#ffffff'
    return `fill:${color}`
  }

  if ('type' in config && config.type === 'gradient') {
    const [a, b] = config.backgroundColor
    return `gradient:${a?.color ?? '#fff'}:${b?.color ?? '#000'}`
  }

  if ('type' in config && config.type === 'image' && config.imageUrl) {
    return config.imageUrl
  }

  return '/themes/theme1.png'
}

/** Inline-style version of the same mapping, for theme preview cards (gallery/grid). */
export function themePreviewStyle(config: WallpaperConfig | undefined | null): CSSProperties {
  if (!config || !('type' in config)) return {}

  if (config.type === 'fill' && config.backgroundColor[0]) {
    return { backgroundColor: config.backgroundColor[0].color }
  }

  if (config.type === 'gradient' && config.backgroundColor.length >= 2) {
    const [a, b] = config.backgroundColor
    return { backgroundImage: `linear-gradient(to bottom, ${a.color}, ${b.color})` }
  }

  if (config.type === 'image' && config.imageUrl) {
    return {
      backgroundImage: `url(${config.imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }

  return {}
}
