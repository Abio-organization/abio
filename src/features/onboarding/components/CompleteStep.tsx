import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from '@tanstack/react-router'
import { Check, Loader2 } from 'lucide-react'
import { FaFacebook, FaWhatsapp, FaXTwitter } from 'react-icons/fa6'

import { Button } from '@/shared/components/ui/button'
import { PhoneDisplay } from '@/shared/components/PhoneDisplay'
import { usePhoneDisplayProps } from '@/shared/hooks/usePhoneDisplayProps'
import { toast } from '@/shared/lib/toast'

import { OnboardingLayout } from '@/features/onboarding/components/OnboardingLayout'

const SHARE_TARGETS = [
  { platform: 'whatsapp', icon: FaWhatsapp, label: 'WhatsApp' },
  { platform: 'twitter', icon: FaXTwitter, label: 'X' },
  { platform: 'facebook', icon: FaFacebook, label: 'Facebook' },
] as const

// Warm palette pulled from the ink/paper/gold brand system, plus two festive
// accents so the burst doesn't read as monochrome.
const CONFETTI_COLORS = ['#FED45C', '#E1604A', '#3FA9A0', '#B98BDB', '#331400']

type ConfettiVariant = 'launch' | 'pop'

interface ConfettiParticle {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  rotationSpeed: number
  size: number
  color: string
  shape: 0 | 1
  opacity: number
}

interface ConfettiBurstProps {
  originX: number
  originY: number
  variant: ConfettiVariant
  onComplete: () => void
}

/** Self-contained canvas particle burst. No dependency — mounts once, runs, unmounts itself. */
function ConfettiBurst({ originX, originY, variant, onComplete }: ConfettiBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onCompleteRef.current()
      return
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = window.innerWidth
    const height = window.innerHeight
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    const isLaunch = variant === 'launch'
    const count = isLaunch ? (width < 640 ? 90 : 150) : 26
    const gravity = 0.18
    const drag = 0.985
    const maxFrames = isLaunch ? 260 : 130

    const particles: ConfettiParticle[] = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = isLaunch ? 4 + Math.random() * 7 : 2 + Math.random() * 4
      return {
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (isLaunch ? 2.5 : 1),
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 14,
        size: 5 + Math.random() * 6,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        shape: Math.random() > 0.5 ? 1 : 0,
        opacity: 1,
      }
    })

    let raf = 0
    let frame = 0

    const tick = () => {
      frame += 1
      ctx.clearRect(0, 0, width, height)
      let alive = false

      for (const p of particles) {
        p.vy += gravity
        p.vx *= drag
        p.vy *= drag
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed
        if (frame > maxFrames * 0.6) {
          p.opacity = Math.max(0, p.opacity - 0.02)
        }
        if (p.opacity > 0 && p.y < height + 40) {
          alive = true
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate((p.rotation * Math.PI) / 180)
          ctx.globalAlpha = p.opacity
          ctx.fillStyle = p.color
          if (p.shape === 1) {
            ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.6)
          } else {
            ctx.beginPath()
            ctx.arc(0, 0, p.size / 2.4, 0, Math.PI * 2)
            ctx.fill()
          }
          ctx.restore()
        }
      }

      if (alive && frame < maxFrames) {
        raf = requestAnimationFrame(tick)
      } else {
        ctx.clearRect(0, 0, width, height)
        onCompleteRef.current()
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [originX, originY, variant])

  // Portal to <body> so this always covers the true viewport, regardless of
  // any transformed/overflow-hidden ancestor in the layout tree.
  if (typeof document === 'undefined') return null
  return createPortal(
    <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true" />,
    document.body,
  )
}

interface Burst {
  id: number
  originX: number
  originY: number
  variant: ConfettiVariant
}

export function CompleteStep() {
  const navigate = useNavigate()
  const { buttonStyle, fontStyle, selectedTheme, profile, links, isLoading } = usePhoneDisplayProps()

  const [stamped, setStamped] = useState(false)
  const [bursts, setBursts] = useState<Burst[]>([])
  const stampRef = useRef<HTMLDivElement>(null)
  const copyButtonRef = useRef<HTMLButtonElement>(null)
  const burstIdRef = useRef(0)
  const hasLaunchedRef = useRef(false)

  const profileLink = profile.username ? `${window.location.origin}/${profile.username}` : null

  const addBurst = useCallback((originX: number, originY: number, variant: ConfettiVariant) => {
    burstIdRef.current += 1
    setBursts((prev) => [...prev, { id: burstIdRef.current, originX, originY, variant }])
  }, [])

  const removeBurst = useCallback((id: number) => {
    setBursts((prev) => prev.filter((burst) => burst.id !== id))
  }, [])

  // Fires once, right when the real content (not the loader) is on screen:
  // the stamp drops in and the confetti cannon fires from its center.
  useEffect(() => {
    if (isLoading || hasLaunchedRef.current) return
    hasLaunchedRef.current = true

    const id = requestAnimationFrame(() => {
      const rect = stampRef.current?.getBoundingClientRect()
      setStamped(true)
      addBurst(
        rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
        rect ? rect.top + rect.height / 2 : window.innerHeight / 3,
        'launch',
      )
    })

    return () => cancelAnimationFrame(id)
  }, [isLoading, addBurst])

  const handleShare = async (platform: string) => {
    if (!profileLink) return
    const shareUrl = encodeURIComponent(profileLink)
    const shareText = encodeURIComponent('Check out my Abio profile!')

    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${shareText}%20${shareUrl}`, '_blank', 'noopener,noreferrer')
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`, '_blank', 'noopener,noreferrer')
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank', 'noopener,noreferrer')
    }
  }

  const handleCopyLink = async () => {
    if (!profileLink) return
    try {
      await navigator.clipboard.writeText(profileLink)
      toast.success('Profile link copied to clipboard!')
      const rect = copyButtonRef.current?.getBoundingClientRect()
      if (rect) {
        addBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 'pop')
      }
    } catch {
      toast.error('Failed to copy profile link')
    }
  }

  if (isLoading) {
    return (
      <OnboardingLayout>
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#331400] dark:text-[#F5EEE4]" />
          <p className="text-sm font-semibold text-[#331400] dark:text-[#F5EEE4]">Loading your profile…</p>
        </div>
      </OnboardingLayout>
    )
  }

  return (
    <OnboardingLayout>
      {bursts.map((burst) => (
        <ConfettiBurst
          key={burst.id}
          originX={burst.originX}
          originY={burst.originY}
          variant={burst.variant}
          onComplete={() => removeBurst(burst.id)}
        />
      ))}

      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-8 sm:gap-10 sm:px-6 sm:py-10 md:py-12 lg:flex-row lg:items-center lg:gap-16 xl:gap-20">
        <div className="flex w-full justify-center lg:w-auto lg:flex-shrink-0">
          <PhoneDisplay buttonStyle={buttonStyle} fontStyle={fontStyle} selectedTheme={selectedTheme} profile={profile} links={links} />
        </div>

        <div className="w-full max-w-md space-y-6 sm:space-y-7">
          <div className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left">
            <div
              ref={stampRef}
              aria-label="Profile published"
              className={`flex h-14 w-14 items-center justify-center border-2 border-[#331400] bg-[#FED45C] transition-all duration-500 ease-out motion-reduce:transition-none sm:h-16 sm:w-16 dark:border-[#F5EEE4] ${
                stamped ? '-rotate-3 scale-100 opacity-100' : 'rotate-12 scale-150 opacity-0'
              }`}
            >
              <Check className="h-7 w-7 text-[#331400] sm:h-8 sm:w-8" strokeWidth={3} aria-hidden="true" />
            </div>

            <div
              className={`transition-all duration-500 ease-out motion-reduce:transition-none ${
                stamped ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
              }`}
              style={{ transitionDelay: stamped ? '150ms' : '0ms' }}
            >
              <h1 className="text-2xl font-bold text-[#331400] sm:text-3xl lg:text-4xl dark:text-[#F5EEE4]">Your profile is live!</h1>
              <p className="mt-2 text-sm text-[#666464] dark:text-[#F5EEE4]/60">Share your page and start growing your audience.</p>
            </div>
          </div>

          {profileLink && (
            <div className="flex items-center gap-2 border border-[#331400]/15 bg-white px-4 py-3 dark:border-[#F5EEE4]/15 dark:bg-white/5">
              <span className="min-w-0 flex-1 truncate text-sm text-[#666464] dark:text-[#F5EEE4]/60">{profileLink}</span>
              <button
                ref={copyButtonRef}
                type="button"
                onClick={handleCopyLink}
                className="shrink-0 bg-[#331400] px-3 py-1.5 text-xs font-semibold text-[#FED45C] transition-transform duration-150 hover:bg-[#4a2c1a] active:scale-95 motion-reduce:transition-none"
              >
                Copy
              </button>
            </div>
          )}

          <div className="border border-[#331400]/15 bg-white p-6 dark:border-[#F5EEE4]/15 dark:bg-white/5">
            <h2 className="text-base font-semibold text-[#331400] dark:text-[#F5EEE4]">Share your profile</h2>
            <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
              {SHARE_TARGETS.map(({ platform, icon: Icon, label }) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => handleShare(platform)}
                  disabled={!profileLink}
                  aria-label={`Share on ${label}`}
                  className="flex h-12 items-center justify-center border border-[#331400]/15 text-[#331400] transition-transform duration-150 hover:scale-105 hover:bg-[#331400]/5 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 motion-reduce:transition-none sm:h-14 dark:border-[#F5EEE4]/15 dark:text-[#F5EEE4] dark:hover:bg-white/10"
                >
                  <Icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {profile.username ? (
              <Link to="/$username" params={{ username: profile.username }} target="_blank" className="flex-1">
                <Button variant="outline" className="h-12 w-full border-[#331400] text-sm font-semibold text-[#331400] dark:border-[#F5EEE4] dark:text-[#F5EEE4]">
                  Visit Profile
                </Button>
              </Link>
            ) : null}
            <Button
              onClick={() => navigate({ to: '/dashboard' })}
              className="h-12 flex-1 bg-[#FED45C] text-sm font-semibold text-[#331400] hover:bg-[#FED45C]/90"
            >
              Open Dashboard
            </Button>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  )
}