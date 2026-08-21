import type { FontConfig, FontStyle, FontWeight } from '@/features/appearance/types'

import { toValidColor } from './colors'

/** Extract API-safe font name from a CSS font stack. */
export function fontFamilyToApiName(fontFamily: string): string {
  const first = fontFamily.split(',')[0]?.trim() ?? fontFamily
  return first.replace(/['"]/g, '').replace(/[^a-zA-Z0-9-]/g, '') || 'Inter'
}

export const FONT_WEIGHT_CSS: Record<FontWeight, number> = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
}

export function fontConfigToFontStyle(config: FontConfig): FontStyle {
  return {
    fontFamily: config.name ? `'${config.name}', sans-serif` : 'Inter, sans-serif',
    fillColor: config.fillColor ?? '#ffffff',
    strokeColor: '#000000',
    opacity: 1,
    italic: config.italic ?? false,
    underline: config.underline ?? false,
    weight: config.weight ?? 'regular',
  }
}

export function fontStyleToFontConfig(style: FontStyle): FontConfig {
  return {
    name: fontFamilyToApiName(style.fontFamily),
    fillColor: toValidColor(style.fillColor),
    italic: style.italic ?? false,
    underline: style.underline ?? false,
    weight: style.weight ?? 'regular',
  }
}
