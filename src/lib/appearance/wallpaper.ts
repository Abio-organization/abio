import type { WallpaperConfig } from '@/types/appearance.types'

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
