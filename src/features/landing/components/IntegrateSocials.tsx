import { animate, motion, useAnimationFrame, useMotionValue, type MotionValue } from 'framer-motion'
import { useEffect, useState } from 'react'

type Phase = 'orbit' | 'absorb' | 'grow' | 'emit'

const ALL_INNER_ICONS = [
  { name: 'Instagram', size: 32 },
  { name: 'TikTok', size: 32 },
  { name: 'YouTube', size: 32 },
  { name: 'Spotify', size: 32 },
  { name: 'WhatsApp', size: 32 },
  { name: 'Snapchat', size: 32 },
]

// Note: "Github" (lowercase h) matches the actual asset filename — the old
// app used "GitHub" here, which would 404 against the real file on disk.
const OUTER_ICONS_ALL = [
  { name: 'X ex Twitter', size: 32 },
  { name: 'Pinterest', size: 32 },
  { name: 'Figma', size: 32 },
  { name: 'Behance', size: 32 },
  { name: 'Twitch', size: 32 },
  { name: 'Discord', size: 32 },
  { name: 'Reddit', size: 32 },
  { name: 'SoundCloud', size: 32 },
  { name: 'Telegram', size: 32 },
  { name: 'Dribbble', size: 32 },
  { name: 'Github', size: 32 },
  { name: 'Slack', size: 32 },
  { name: 'Facebook', size: 32 },
  { name: 'Quora', size: 32 },
]

const DURATIONS: Record<Phase, number> = { orbit: 12000, absorb: 2200, grow: 1000, emit: 900 }
const NEXT: Record<Phase, Phase> = { orbit: 'absorb', absorb: 'grow', grow: 'emit', emit: 'orbit' }

interface OrbitIconProps {
  icon: { name: string; size: number }
  slotIndex: number
  total: number
  radius: number
  phase: Phase
  globalRot: MotionValue<number>
  emitSnap: number
  bgColor: string
  direction?: 1 | -1
  iconScale: number
}

function OrbitIcon({ icon, slotIndex, total, radius, phase, globalRot, emitSnap, bgColor, direction = 1, iconScale }: OrbitIconProps) {
  const baseAngle = slotIndex * (360 / total)
  const scaledSize = Math.round(icon.size * iconScale)
  const pad = Math.round(12 * iconScale)
  const box = scaledSize + pad

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const opacity = useMotionValue(0)
  const scale = useMotionValue(0.1)

  useAnimationFrame(() => {
    if (phase === 'orbit') {
      const r = globalRot.get() * direction
      const angle = ((baseAngle + r) * Math.PI) / 180
      x.set(Math.cos(angle) * radius)
      y.set(Math.sin(angle) * radius)
    }
  })

  useEffect(() => {
    const d = slotIndex * 0.08

    if (phase === 'emit') {
      const snap = emitSnap * direction
      const angle = ((baseAngle + snap) * Math.PI) / 180
      animate(opacity, 1, { duration: 0.3, delay: d })
      animate(scale, 1, { type: 'spring', stiffness: 90, damping: 14, delay: d })
      animate(x, Math.cos(angle) * radius, { type: 'spring', stiffness: 90, damping: 14, delay: d })
      animate(y, Math.sin(angle) * radius, { type: 'spring', stiffness: 90, damping: 14, delay: d })
    }

    if (phase === 'absorb') {
      animate(x, 0, { duration: 0.9, ease: [0.4, 0, 1, 1], delay: d })
      animate(y, 0, { duration: 0.9, ease: [0.4, 0, 1, 1], delay: d })
      animate(opacity, 0, { duration: 0.6, delay: d })
      animate(scale, 0.1, { duration: 0.7, delay: d })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  return (
    <motion.div
      className="absolute flex items-center justify-center"
      style={{ width: box, height: box, marginLeft: -box / 2, marginTop: -box / 2, borderRadius: '50%', background: bgColor, backdropFilter: 'blur(4px)', x, y, opacity, scale }}
    >
      <img
        src={`/assets/platform-icons/colored/Social=${icon.name},Style=Original.svg`}
        alt={icon.name}
        width={scaledSize}
        height={scaledSize}
        className="h-full w-full object-contain p-1"
      />
    </motion.div>
  )
}

interface ResponsiveConfig {
  inner: number
  outer: number
  size: number
  iconScale: number
  innerCount: number
  outerCount: number
}

function useResponsiveRadii(): ResponsiveConfig {
  const [cfg, setCfg] = useState<ResponsiveConfig>({ inner: 110, outer: 195, size: 500, iconScale: 1.0, innerCount: 6, outerCount: 8 })

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w < 380) setCfg({ inner: 76, outer: 138, size: 340, iconScale: 0.78, innerCount: 6, outerCount: 8 })
      else if (w < 480) setCfg({ inner: 84, outer: 150, size: 370, iconScale: 0.84, innerCount: 6, outerCount: 8 })
      else if (w < 768) setCfg({ inner: 96, outer: 168, size: 410, iconScale: 0.9, innerCount: 6, outerCount: 8 })
      else setCfg({ inner: 110, outer: 195, size: 500, iconScale: 1.0, innerCount: 6, outerCount: 8 })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return cfg
}

function OrbitScene() {
  const [phase, setPhase] = useState<Phase>('emit')
  const [outerGroupIndex, setOuterGroup] = useState(0)
  const [emitSnap, setEmitSnap] = useState(0)
  const globalRot = useMotionValue(0)

  const ringScale = useMotionValue(1)
  const ringOpacity = useMotionValue(1)

  const { inner: INNER_RADIUS, outer: OUTER_RADIUS, size: SIZE, iconScale, innerCount, outerCount } = useResponsiveRadii()

  const innerIcons = ALL_INNER_ICONS.slice(0, innerCount)
  const totalOuterGroups = Math.ceil(OUTER_ICONS_ALL.length / outerCount)

  useAnimationFrame((_, delta) => {
    if (phase === 'orbit') {
      globalRot.set((globalRot.get() + delta * 0.005) % 360)
    }
  })

  useEffect(() => {
    if (phase === 'absorb') {
      setEmitSnap(globalRot.get())
      animate(ringScale, 0.25, { duration: 0.85, ease: [0.4, 0, 1, 1] })
      animate(ringOpacity, 0, { duration: 0.6 })
    }

    if (phase === 'emit') {
      animate(ringScale, 1, { type: 'spring', stiffness: 80, damping: 14, delay: 0.05 })
      animate(ringOpacity, 1, { duration: 0.35, delay: 0.05 })
    }

    if (phase === 'orbit') {
      animate(ringScale, 1, { duration: 0.3 })
      animate(ringOpacity, 1, { duration: 0.25 })
    }

    const t = setTimeout(() => {
      if (phase === 'absorb') setOuterGroup((p) => (p + 1) % totalOuterGroups)
      setPhase(NEXT[phase])
    }, DURATIONS[phase])

    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, outerCount])

  const start = (outerGroupIndex * outerCount) % OUTER_ICONS_ALL.length
  const outerGroup = Array.from({ length: outerCount }, (_, i) => OUTER_ICONS_ALL[(start + i) % OUTER_ICONS_ALL.length])

  return (
    <div className="relative mx-auto flex flex-shrink-0 items-center justify-center" style={{ width: SIZE, height: SIZE }}>
      <motion.div className="pointer-events-none absolute inset-0" style={{ scale: ringScale, opacity: ringOpacity, transformOrigin: 'center center' }}>
        <svg className="absolute inset-0" width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <circle cx={SIZE / 2} cy={SIZE / 2} r={INNER_RADIUS} fill="none" stroke="rgba(93,45,43,0.55)" strokeWidth="1.8" strokeDasharray="5 6" strokeLinecap="round" />
          <circle cx={SIZE / 2} cy={SIZE / 2} r={OUTER_RADIUS} fill="none" stroke="rgba(93,45,43,0.38)" strokeWidth="1.8" strokeDasharray="5 8" strokeLinecap="round" />
          {innerIcons.map((_, i) => {
            const angle = (i * (360 / innerIcons.length) * Math.PI) / 180
            return <circle key={i} cx={SIZE / 2 + Math.cos(angle) * INNER_RADIUS} cy={SIZE / 2 + Math.sin(angle) * INNER_RADIUS} r="3" fill="rgba(93,45,43,0.55)" />
          })}
          {outerGroup.map((_, i) => {
            const angle = (i * (360 / outerCount) * Math.PI) / 180
            return <circle key={i} cx={SIZE / 2 + Math.cos(angle) * OUTER_RADIUS} cy={SIZE / 2 + Math.sin(angle) * OUTER_RADIUS} r="3" fill="rgba(93,45,43,0.38)" />
          })}
        </svg>
      </motion.div>

      {innerIcons.map((icon, i) => (
        <OrbitIcon
          key={`inner-${icon.name}-${innerCount}`}
          icon={icon}
          slotIndex={i}
          total={innerIcons.length}
          radius={INNER_RADIUS}
          phase={phase}
          globalRot={globalRot}
          emitSnap={emitSnap}
          direction={1}
          bgColor="rgba(255,255,255,0.22)"
          iconScale={iconScale}
        />
      ))}

      {outerGroup.map((icon, i) => (
        <OrbitIcon
          key={`outer-${icon.name}-${outerGroupIndex}-${outerCount}`}
          icon={icon}
          slotIndex={i}
          total={outerCount}
          radius={OUTER_RADIUS}
          phase={phase}
          globalRot={globalRot}
          emitSnap={emitSnap}
          direction={-1}
          bgColor="rgba(254,212,92,0.18)"
          iconScale={iconScale}
        />
      ))}

      <motion.div
        className="relative z-10 flex items-center justify-center rounded-2xl"
        animate={{ scale: phase === 'grow' ? 1.28 : phase === 'absorb' ? 1.1 : 1 }}
        transition={{ type: 'spring', stiffness: 80, damping: 16 }}
        style={{ width: 64, height: 64 }}
      >
        <img src="/icons/A.Bio.png" alt="A.Bio Logo" width={48} height={48} className="h-8 w-8 object-contain md:h-11 md:w-11" />
      </motion.div>
    </div>
  )
}

export function IntegrateSocials() {
  return (
    <section className="w-full overflow-hidden bg-[#FFDCE3] px-4 py-10 sm:px-8 md:px-12 md:py-24 lg:px-20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="flex flex-col items-center gap-6 text-center md:items-start md:text-left"
          >
            <div>
              <h2 className="font-display text-[32px] leading-[0.9] font-[400] tracking-tight text-[#5D2D2B] sm:text-[44px] xl:text-[50px]">
                Connect all <br /> your Platforms.
                <br />
                From Spotify <br /> to Whatsapp.
              </h2>
            </div>
            <p className="-mt-2 max-w-xs text-left text-sm leading-relaxed font-light text-[#5D2D2B]/55 md:mt-0">
              All your favourite platforms already on abio, manage every link from one clean dashboard with new features added every week.
            </p>
          </motion.div>

          <div className="flex w-full items-center justify-center overflow-visible py-4">
            <OrbitScene />
          </div>
        </div>
      </div>
    </section>
  )
}
