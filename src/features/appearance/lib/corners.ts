import type { ButtonStyle, CornerConfig, CornerType, ShadowType } from '@/features/appearance/types'

const RADIUS_BY_TYPE: Record<CornerType, string> = {
  sharp: '0px',
  curved: '12px',
  round: '9999px',
}

function typeFromRadius(radius: string): CornerType {
  if (radius === '0px') return 'sharp'
  if (radius === '9999px') return 'round'
  return 'curved'
}

/** Backend has no shadow-color field — shadows are always neutral black at a fixed alpha. */
export function shadowFromType(shadow: ShadowType | undefined): string {
  if (shadow === 'hard') return '4px 4px 0px 0px rgba(0,0,0,0.35)'
  if (shadow === 'soft') return '2px 4px 10px rgba(0,0,0,0.18)'
  return 'none'
}

function shadowTypeFromBoxShadow(boxShadow: string): ShadowType {
  if (boxShadow === 'none') return 'none'
  if (boxShadow.includes('4px 4px 0px')) return 'hard'
  return 'soft'
}

export function cornerConfigToButtonStyle(config: CornerConfig): ButtonStyle {
  return {
    borderRadius: RADIUS_BY_TYPE[config.type] ?? RADIUS_BY_TYPE.curved,
    backgroundColor: config.fillColor ?? '#331400',
    borderColor: config.strokeColor || 'transparent',
    opacity: config.opacity ?? 1,
    boxShadow: shadowFromType(config.shadow),
  }
}

export function buttonStyleToCornerConfig(style: ButtonStyle): CornerConfig {
  return {
    type: typeFromRadius(style.borderRadius),
    fillColor: style.backgroundColor,
    strokeColor: style.borderColor === 'transparent' ? null : style.borderColor,
    opacity: style.opacity,
    shadow: shadowTypeFromBoxShadow(style.boxShadow),
  }
}
