import type { FontConfig, FontStyle } from '@/types/appearance.types'

import { toValidColor } from './colors'

/** Extract API-safe font name from a CSS font stack. */
export function fontFamilyToApiName(fontFamily: string): string {
  const first = fontFamily.split(',')[0]?.trim() ?? fontFamily
  return first.replace(/['"]/g, '').replace(/[^a-zA-Z0-9-]/g, '') || 'Inter'
}

export function fontConfigToFontStyle(config: FontConfig): FontStyle {
  return {
    fontFamily: config.name ? `'${config.name}', sans-serif` : 'Inter, sans-serif',
    fillColor: config.fillColor ?? '#ffffff',
    strokeColor: config.strokeColor ?? '#000000',
    opacity: config.opacity ?? 1,
  }
}

export function fontStyleToFontConfig(style: FontStyle): FontConfig {
  return {
    name: fontFamilyToApiName(style.fontFamily),
    fillColor: toValidColor(style.fillColor),
    strokeColor: toValidColor(style.strokeColor, '#00000000'),
    opacity: style.opacity,
  }
}
