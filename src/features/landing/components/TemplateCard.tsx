import { motion, type Variants } from 'framer-motion'
import type { CSSProperties } from 'react'

import { shadowFromType, themePreviewStyle } from '@/features/appearance/lib'
import type { CornerConfig, FontConfig, WallpaperConfig } from '@/features/appearance/types'
import { cn } from '@/shared/lib/utils'

import type { TemplateConfig } from '../types'

export interface TemplateCardTemplate extends TemplateConfig {
  corner_config?: CornerConfig
  font_config?: FontConfig
  wallpaper_config?: WallpaperConfig
  isPremium?: boolean
}

interface TemplateCardProps {
  template: TemplateCardTemplate
  onClick: () => void
  isSelected?: boolean
}

const LightningBadge = () => (
  <span
    className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full shadow-md"
    style={{ backgroundColor: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)' }}
    aria-hidden
  >
    <svg width="11" height="14" viewBox="0 0 11 14" fill="none">
      <path d="M6.5 1L1 7.8H5.5L4.5 13L10 6.2H5.5L6.5 1Z" fill="white" stroke="white" strokeWidth="0.5" strokeLinejoin="round" />
    </svg>
  </span>
)

const cardVariants: Variants = {
  initial: { scale: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' },
  hover: { scale: 1.02, boxShadow: '0 8px 24px rgba(0,0,0,0.18)', transition: { type: 'spring', stiffness: 300, damping: 20 } },
  tap: { scale: 0.98, transition: { type: 'spring', stiffness: 400, damping: 25 } },
}

export function TemplateCard({ template, onClick, isSelected }: TemplateCardProps) {
  const { style, links, isPremium, corner_config: cc, font_config, wallpaper_config } = template

  const wallpaperStyle: CSSProperties = wallpaper_config
    ? { ...themePreviewStyle(wallpaper_config), backgroundSize: 'cover', backgroundPosition: 'center' }
    : style?.backgroundImage
      ? { backgroundImage: style.backgroundImage, backgroundSize: 'cover', backgroundPosition: 'center' }
      : { backgroundColor: style?.backgroundColor || '#c4b5d0' }

  const buttonBarStyle: CSSProperties = !cc
    ? { borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.9)', border: '1.5px solid rgba(255,255,255,0.5)' }
    : {
        borderRadius: cc.type === 'sharp' ? 4 : cc.type === 'round' ? 9999 : 10,
        boxShadow: shadowFromType(cc.shadow),
        border: `1.5px solid ${cc.strokeColor ?? 'rgba(255,255,255,0.5)'}`,
        backgroundColor: cc.fillColor ?? 'rgba(255,255,255,0.9)',
        opacity: cc.opacity ?? 1,
      }

  const fontFamily = font_config?.name ? `'${font_config.name}', sans-serif` : style?.fontFamily || 'inherit'
  const textColor = font_config?.fillColor || style?.textColor || '#333333'

  return (
    <motion.button
      className={cn('group flex w-full flex-col items-center gap-1.5 transition-all duration-200 focus:outline-none')}
      onClick={onClick}
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      aria-label={`Select theme: ${template.name}`}
      aria-pressed={isSelected}
    >
      <motion.div
        className="relative w-full overflow-hidden transition-all duration-200"
        style={{
          aspectRatio: '4/4',
          ...wallpaperStyle,
          outline: isSelected ? '3px solid #000000' : '3px solid transparent',
          outlineOffset: '2px',
          boxShadow: isSelected ? '0 0 0 1px #00000020' : '0 2px 8px rgba(0,0,0,0.12)',
        }}
      >
        {isPremium && <LightningBadge />}

        <div className="absolute top-3 left-3 z-10">
          <span className="text-xl leading-none font-bold drop-shadow-sm" style={{ fontFamily, color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
            Aa
          </span>
        </div>

        <div className="absolute right-3 bottom-3 left-3 z-10 shadow-xl">
          <div className="flex h-8 w-full items-center justify-center px-3" style={buttonBarStyle}>
            <span className="truncate text-xs font-medium opacity-70" style={{ fontFamily, color: textColor }}>
              {links?.[0]?.text || 'linktr.ee'}
            </span>
          </div>
        </div>
      </motion.div>

      <p className="w-full truncate px-1 text-center text-sm font-bold" style={{ color: '#6b7280' }}>
        {template.name || 'Untitled Theme'}
      </p>
    </motion.button>
  )
}
