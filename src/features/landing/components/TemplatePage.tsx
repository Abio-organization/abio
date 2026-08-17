import { useNavigate } from '@tanstack/react-router'
import { motion, useInView } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useRef } from 'react'

import { useGetThemes } from '@/features/appearance'
import { themePreviewStyle } from '@/features/appearance/lib'
import type { AppearanceTheme } from '@/features/appearance/types'

import { defaultLinks, defaultProfile, staticTemplates } from '../data'
import type { TemplateConfig } from '../types'
import { Footer } from './Footer'
import { NavBar } from './NavBar'
import { TemplateCard, type TemplateCardTemplate } from './TemplateCard'

function themeToTemplateConfig(theme: AppearanceTheme, index: number): TemplateCardTemplate {
  const preview = themePreviewStyle(theme.wallpaper_config)
  const cc = theme.corner_config
  const buttonStyle: TemplateConfig['style']['buttonStyle'] = cc?.type === 'sharp' ? 'square' : cc?.type === 'round' ? 'pill' : 'rounded'
  const hasStroke = !!cc?.strokeColor

  return {
    id: `theme-${index}-${theme.name}`,
    name: theme.name,
    profile: defaultProfile,
    links: defaultLinks,
    corner_config: cc,
    font_config: theme.font_config,
    wallpaper_config: theme.wallpaper_config,
    style: {
      backgroundColor: preview.backgroundColor as string | undefined,
      backgroundImage: preview.backgroundImage as string | undefined,
      textColor: theme.font_config?.fillColor || '#333333',
      buttonColor: cc?.fillColor || '#ffffff',
      buttonTextColor: theme.font_config?.fillColor || '#333333',
      accentColor: cc?.strokeColor ?? undefined,
      fontFamily: theme.font_config?.name ? `'${theme.font_config.name}', sans-serif` : "'Inter', sans-serif",
      buttonStyle,
      buttonBorder: hasStroke,
      buttonEffect: cc?.shadow === 'hard' ? '3d' : 'flat',
    },
  }
}

const SkeletonCard = ({ delay }: { delay: number }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }} className="h-[22rem] w-full animate-pulse bg-[#5D2D2B]/06 md:h-[38rem]" />
)

const AnimatedCard = ({ template, index, onClick }: { template: TemplateCardTemplate; index: number; onClick: () => void }) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, rotate: index % 2 === 0 ? -1.5 : 1.5 }}
      animate={inView ? { opacity: 1, y: 0, rotate: 0 } : {}}
      transition={{ duration: 0.7, delay: (index % 3) * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -6, rotate: index % 2 === 0 ? 0.8 : -0.8 }}
      className="group relative cursor-pointer"
    >
      <div className="pointer-events-none absolute -top-3 -left-1 z-20 bg-[#FED45C] px-2 py-0.5 shadow-[2px_2px_0px_#000]">
        <span className="text-[9px] font-black tracking-[0.14em] text-[#5D2D2B]">{String(index + 1).padStart(2, '0')}</span>
      </div>

      <div
        className="pointer-events-none absolute -inset-1 rounded opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'linear-gradient(135deg, rgba(254,212,92,0.15), rgba(93,45,43,0.12))', filter: 'blur(8px)' }}
      />

      <TemplateCard template={template} onClick={onClick} />

      <motion.div initial={{ opacity: 0, y: 8 }} whileHover={{ opacity: 1, y: 0 }} className="pointer-events-none absolute right-0 bottom-3 left-0 flex justify-center group-hover:pointer-events-auto">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
          className="bg-[#5D2D2B] px-5 py-2 text-[10px] font-black tracking-[0.14em] text-[#FED45C] uppercase shadow-[3px_3px_0px_#000] transition-shadow duration-150 hover:shadow-[1px_1px_0px_#000]"
        >
          Use this template →
        </button>
      </motion.div>
    </motion.div>
  )
}

export function TemplatePage() {
  const navigate = useNavigate()
  const { data, isLoading } = useGetThemes()
  const heroRef = useRef(null)

  const apiThemes: AppearanceTheme[] = Array.isArray(data) ? data : []
  const rawCards: TemplateCardTemplate[] = apiThemes.length > 0 ? apiThemes.map(themeToTemplateConfig) : staticTemplates

  const handleTemplateClick = (index: number) => {
    const rawTheme = apiThemes[index]
    if (rawTheme) {
      localStorage.setItem('pending_template', JSON.stringify(rawTheme))
    }
    navigate({ to: '/auth/sign-up' })
  }

  return (
    <>
      <NavBar />

      <main className="min-h-screen overflow-x-hidden bg-[#FEF4EA] dark:bg-[#1C1611]">
        <section ref={heroRef} className="relative overflow-hidden pt-32 pb-0" style={{ minHeight: '0vh' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} className="pointer-events-none absolute top-36 right-[8%] hidden text-[#FED45C] select-none md:block">
            <Sparkles className="h-10 w-10" fill="currentColor" />
          </motion.div>
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }} className="pointer-events-none absolute bottom-10 left-[6%] hidden text-[#5D2D2B]/18 select-none md:block dark:text-[#F5EEE4]/18">
            <Sparkles className="h-14 w-14" fill="currentColor" />
          </motion.div>
        </section>

        <div className="px-4 pt-12 pb-24 sm:px-8 md:px-12 lg:px-20">
          <div className="container mx-auto">
            <div className="grid w-full grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-14">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} delay={i * 0.06} />)
                : rawCards.map((template, i) => <AnimatedCard key={template.id} template={template} index={i} onClick={() => handleTemplateClick(i)} />)}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-[#5D2D2B]/10 pt-12 dark:border-[#F5EEE4]/10 md:flex-row"
            >
              <div>
                <p className="mb-2 text-[10px] font-black tracking-[0.2em] text-[#5D2D2B]/38 uppercase dark:text-[#F5EEE4]/38">Can't find what you need?</p>
                <h3 className="font-display text-[28px] leading-tight font-[400] text-[#5D2D2B] dark:text-[#F5EEE4] md:text-[36px]">
                  Build yours from
                  <br className="hidden md:block" />
                  <span className="text-[#FF0000]">scratch.</span>
                </h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '6px 6px 0px #000' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  localStorage.removeItem('pending_template')
                  navigate({ to: '/auth/sign-up' })
                }}
                className="h-14 flex-shrink-0 bg-[#FED45C] px-10 text-sm font-black text-[#5D2D2B] shadow-[4px_4px_0px_#000] transition-shadow duration-200"
              >
                Start for free →
              </motion.button>
            </motion.div>
          </div>
        </div>

        <Footer />
      </main>
    </>
  )
}
