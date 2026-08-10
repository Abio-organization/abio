import type { ButtonStyle, CornerConfig } from '@/features/appearance/types'

const RADIUS_BY_STYLE: Record<NonNullable<CornerConfig['style']>, string> = {
  sharp: '0px',
  round: '9999px',
  curved: '12px',
}

function shadowFromSize(size: CornerConfig['shadowSize']): string {
  return size === 'hard'
    ? '4px 4px 0 0 rgba(0,0,0,0.25)'
    : '0 4px 14px rgba(0,0,0,0.15)'
}

export function cornerConfigToButtonStyle(config: CornerConfig): ButtonStyle {
  const style = config.style ?? 'curved'
  return {
    borderRadius: config.borderRadius ?? RADIUS_BY_STYLE[style],
    backgroundColor: config.backgroundColor ?? '#ffffff',
    borderColor: config.borderColor ?? 'transparent',
    opacity: config.opacity ?? 1,
    boxShadow: config.boxShadow ?? shadowFromSize(config.shadowSize ?? 'soft'),
  }
}

export function buttonStyleToCornerConfig(style: ButtonStyle): CornerConfig {
  return {
    borderRadius: style.borderRadius,
    backgroundColor: style.backgroundColor,
    borderColor: style.borderColor,
    opacity: style.opacity,
    boxShadow: style.boxShadow,
  }
}
