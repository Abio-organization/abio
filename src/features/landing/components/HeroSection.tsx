import { useNavigate } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { Input } from '@/shared/components/ui/input'
import { getPlatformIconUrl } from '@/shared/lib/platform-icons'

// ─── TYPES
type ButtonStyle = {
  variant: 'outline' | 'solid' | 'glass' | 'brutal' | 'pill' | 'square' | 'tag'
  bg?: string
  color: string
  borderColor?: string
  shadow?: string
  radius?: string
}

type ProfileLink = {
  label: string
  platform: string
  style: ButtonStyle
}

type Profile = {
  name: string
  handle: string
  bio: string
  avatar: string
  avatarBg: string
  avatarImg?: string
  waveRGB: [number, number, number]
  botBg: string
  patternColor: string
  dotColor: string
  links: ProfileLink[]
  verified?: boolean
}

// ─── PROFILES
const PROFILES: Profile[] = [
  {
    name: 'Anslem',
    handle: 'stereooo',
    bio: 'Currency Enthusiast',
    avatar: 'STEREOOO',
    avatarBg: '#0a0a0a',
    waveRGB: [74, 222, 128],
    verified: true,
    botBg: 'linear-gradient(170deg,#c8dfc0 0%,#8db87e 40%,#5a8a4e 100%)',
    patternColor: 'rgba(255,255,255,0.22)',
    dotColor: '#1f4015',
    links: [
      { label: 'Twitter', platform: 'twitter', style: { variant: 'pill', bg: 'transparent', color: '#1f4015', borderColor: '#1f4015', shadow: '0 4px 14px rgba(31,64,21,0.3)', radius: '0px' } },
      { label: 'WhatsApp', platform: 'whatsapp', style: { variant: 'pill', bg: 'transparent', color: '#1f4015', borderColor: '#1f4015', shadow: '0 4px 14px rgba(31,64,21,0.3)', radius: '0px' } },
      { label: 'Telegram', platform: 'telegram', style: { variant: 'pill', bg: 'transparent', color: '#1f4015', borderColor: '#1f4015', shadow: '0 4px 14px rgba(31,64,21,0.3)', radius: '0px' } },
      { label: 'Snapchat', platform: 'snapchat', style: { variant: 'pill', bg: 'transparent', color: '#1f4015', borderColor: '#1f4015', shadow: '0 4px 14px rgba(31,64,21,0.3)', radius: '0px' } },
    ],
  },
  {
    name: 'David Osh',
    handle: 'Oshnova',
    bio: 'Product Designer',
    avatar: '',
    avatarImg: '/images/Rectangle 1188.png',
    avatarBg: 'linear-gradient(135deg,#5D2D2B,#331400)',
    waveRGB: [254, 212, 92],
    verified: true,
    botBg: 'linear-gradient(170deg,#FED45C 0%,#FF9A3C 60%,#FF6B1A 100%)',
    patternColor: 'rgba(93,45,43,0.18)',
    dotColor: '#5D2D2B',
    links: [
      { label: 'Portfolio', platform: 'behance', style: { variant: 'brutal', bg: '#5D2D2B', color: '#fff', shadow: '4px 4px 0 #000', radius: '0px' } },
      { label: 'Telegram', platform: 'telegram', style: { variant: 'brutal', bg: '#5D2D2B', color: '#fff', shadow: '4px 4px 0 #000', radius: '0px' } },
      { label: 'Snapchat', platform: 'snapchat', style: { variant: 'brutal', bg: '#5D2D2B', color: '#fff', shadow: '4px 4px 0 #000', radius: '0px' } },
      { label: 'Whatsapp', platform: 'whatsapp', style: { variant: 'brutal', bg: '#5D2D2B', color: '#fff', shadow: '4px 4px 0 #000', radius: '0px' } },
    ],
  },
  {
    name: 'Eunice',
    handle: 'euniceaks',
    bio: 'Data Analyst',
    avatar: 'CLAY',
    avatarImg: '/images/Rectangle 1189.png',
    avatarBg: 'linear-gradient(135deg,#db2777,#9d174d)',
    waveRGB: [219, 39, 119],
    verified: false,
    botBg: 'linear-gradient(170deg,#fce7f3 0%,#fbcfe8 40%,#f9a8d4 100%)',
    patternColor: 'rgba(157,23,77,0.2)',
    dotColor: '#db2777',
    links: [
      { label: 'Follow on IG', platform: 'instagram', style: { variant: 'solid', bg: '#db2777', color: '#fff', shadow: '0 8px 24px rgba(219,39,119,0.45)', radius: '18px' } },
      { label: 'Email me', platform: 'gmail', style: { variant: 'solid', bg: '#db2777', color: '#fff', shadow: '0 8px 24px rgba(219,39,119,0.45)', radius: '18px' } },
    ],
  },
]

// ─── BADGE DATA
const BADGES = [
  { label: 'NFC tap ↗', bg: '#FED45C', color: '#000', left: -260, top: 100, delay: 0, dur: 3.5 },
  { label: '10k views', bg: '#fff', color: '#333', left: -275, top: 280, delay: 0.6, dur: 4.2 },
  { label: 'Live', bg: '#3EB489', color: '#fff', left: 200, top: 80, delay: 0.2, dur: 3.2 },
  { label: '2.2k clicks', bg: '#fff', color: '#333', left: 188, top: 270, delay: 0.9, dur: 4.8 },
] as const

// ─── RESPONSIVE SIZING
function useCardSize() {
  const [size, setSize] = useState({
    w: 280, h: 580, rotY: -22, rotX: 8, rotZ: 2.5, ringSm: 480, ringLg: 580, showBadges: true,
  })

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w < 380) setSize({ w: 230, h: 490, rotY: -6, rotX: 2, rotZ: 0.5, ringSm: 290, ringLg: 350, showBadges: false })
      else if (w < 640) setSize({ w: 250, h: 520, rotY: -8, rotX: 3, rotZ: 1, ringSm: 320, ringLg: 390, showBadges: false })
      else if (w < 1024) setSize({ w: 265, h: 550, rotY: -16, rotX: 6, rotZ: 2, ringSm: 430, ringLg: 520, showBadges: true })
      else setSize({ w: 280, h: 580, rotY: -22, rotX: 8, rotZ: 2.5, ringSm: 480, ringLg: 580, showBadges: true })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return size
}

// ─── LINK BUTTON
const LinkButton = ({ link }: { link: ProfileLink }) => {
  const { style, platform } = link
  const baseClass = style.variant === 'tag' ? 'px-2.5 py-1' : 'px-3.5 py-2'
  const iconSize = style.variant === 'tag' ? 12 : 16
  const isWhiteText = style.color.toLowerCase() === '#ffffff' || style.color.toLowerCase() === '#fff'

  return (
    <div
      className={`relative z-[2] flex w-full cursor-pointer items-center justify-start gap-2 transition-transform hover:-translate-y-0.5 ${baseClass}`}
      style={{
        background: style.bg ?? 'transparent',
        color: style.color,
        border: style.borderColor ? `2px solid ${style.borderColor}` : 'none',
        borderRadius: style.radius ?? '50px',
        boxShadow: style.shadow ?? 'none',
      }}
    >
      <img
        src={getPlatformIconUrl(platform, 'black') || ''}
        alt={platform}
        width={iconSize}
        height={iconSize}
        className="flex-shrink-0"
        style={{ filter: isWhiteText ? 'brightness(0) invert(1)' : 'brightness(0) invert(0)' }}
      />
      <span className={`font-bold ${style.variant === 'tag' ? 'text-[10px]' : 'text-[11px]'}`} style={{ color: style.color }}>
        {link.label}
      </span>
    </div>
  )
}

// ─── AVATAR
const Avatar = ({ profile }: { profile: Profile }) => (
  <div
    className="flex h-[48px] w-[48px] flex-shrink-0 items-center justify-center overflow-hidden rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
    style={{ background: profile.avatarBg }}
  >
    {profile.avatarImg ? (
      <img src={profile.avatarImg} alt={profile.name} width={48} height={48} className="h-full w-full object-cover" />
    ) : (
      <span className="text-[10px] leading-tight font-black tracking-[-0.3px] text-white md:text-center">{profile.avatar}</span>
    )}
  </div>
)

// ─── PROFILE CARD
const ProfileCard = ({ profile }: { profile: Profile }) => (
  <div className="absolute inset-0 flex flex-col" style={{ background: '#fff' }}>
    <div className="flex-shrink-0 bg-white px-4 pt-6 pb-3 text-left">
      <div className="mb-2.5 flex items-start gap-2">
        <Avatar profile={profile} />
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-start gap-1.5">
            <span className="text-[12px] leading-tight font-extrabold text-[#0a0a0a]">{profile.name}</span>
            {profile.verified && (
              <div className="flex h-[16px] w-[16px] flex-shrink-0 items-center justify-center rounded-full bg-[#FF0000] shadow-[0_2px_6px_rgba(255,0,0,0.3)]">
                <svg width="7" height="7" viewBox="0 0 11 9" fill="none">
                  <path d="M1 4.5L4 7.5L10 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
          <div className="text-[9px] font-medium text-[#999]">/{profile.handle}</div>
          <p className="mt-1 mb-3 text-[9px] leading-[1.5] font-medium text-[#444] sm:truncate">{profile.bio}</p>
        </div>
      </div>

      <div className="flex">
        <div className="relative inline-flex flex-col items-center">
          <span className="text-[10px] text-black leading-none font-thin">Links</span>
          <div className="absolute -right-0.5 -bottom-3 -left-0.5 h-[2.5px] bg-[#FF0000]" />
        </div>
      </div>
    </div>

    <div className="relative flex flex-1 flex-col gap-2 overflow-hidden px-4 py-4" style={{ background: profile.botBg }}>
      {profile.links.map((link, i) => (
        <LinkButton key={`${link.label}-${i}`} link={link} />
      ))}
    </div>
  </div>
)

// ─── 3D TILTED CARD
const TiltedCard = () => {
  const [idx, setIdx] = useState(0)
  const [hovering, setHovering] = useState(false)
  const { w, h, rotY, rotX, rotZ, ringSm, ringLg, showBadges } = useCardSize()

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % PROFILES.length), 4500)
    return () => clearInterval(t)
  }, [])

  const profile = PROFILES[idx]

  return (
    <div className="relative flex flex-col items-center" style={{ perspective: 1400, perspectiveOrigin: '50% 45%' }}>
      <motion.div
        className="pointer-events-none absolute rounded-full border border-dashed border-[#5D2D2B]/10 dark:border-[#F5EEE4]/10"
        style={{ width: ringSm, height: ringSm, top: '50%', left: '50%', marginLeft: -ringSm / 2, marginTop: -ringSm / 2, zIndex: 1 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#FED45C]" style={{ boxShadow: '0 0 12px #FED45C' }} />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute rounded-full border border-dashed border-[#5D2D2B]/[0.06] dark:border-[#F5EEE4]/[0.06]"
        style={{ width: ringLg, height: ringLg, top: '50%', left: '50%', marginLeft: -ringLg / 2, marginTop: -ringLg / 2, zIndex: 1 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />

      {showBadges &&
        BADGES.map((b) => (
          <motion.div
            key={b.label}
            className="pointer-events-none absolute z-[5] flex items-center gap-1.5 px-2 py-1.5 whitespace-nowrap"
            style={{
              background: b.bg,
              color: b.color,
              left: `calc(50% + ${b.left}px)`,
              top: b.top,
              fontSize: 9,
              fontWeight: 800,
              boxShadow: '0 8px 28px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1)',
            }}
            animate={{ y: [0, -9, 0] }}
            transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut', delay: b.delay }}
          >
            <span>{b.label}</span>
          </motion.div>
        ))}

      {!showBadges && (
        <div
          className="pointer-events-none absolute right-0 bottom-[-36px] left-0 z-[5] overflow-hidden"
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
            maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)',
          }}
        >
          <motion.div className="flex w-max gap-2" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}>
            {[...BADGES, ...BADGES].map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-1 px-2.5 py-1 whitespace-nowrap"
                style={{ background: b.bg, color: b.color, fontSize: 9, fontWeight: 800, boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}
              >
                <span>{b.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      )}

      <motion.div
        className="relative"
        style={{ transformStyle: 'preserve-3d', zIndex: 3 }}
        animate={{
          rotateY: hovering ? rotY / 2 : rotY,
          rotateX: hovering ? rotX / 2 : rotX,
          rotateZ: hovering ? rotZ / 2 : rotZ,
          scale: hovering ? 1.02 : 1,
        }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        onHoverStart={() => setHovering(true)}
        onHoverEnd={() => setHovering(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={profile.handle}
            initial={{ rotateY: 90, opacity: 0, scale: 0.88 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            exit={{ rotateY: -90, opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.85, ease: [0.645, 0.045, 0.355, 1.0] }}
            className="relative overflow-hidden"
            style={{
              width: w,
              height: h,
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              boxShadow: ['0 30px 60px rgba(0,0,0,0.3)', '0 16px 32px rgba(0,0,0,0.18)', '0 6px 12px rgba(0,0,0,0.1)'].join(','),
            }}
          >
            <ProfileCard profile={profile} />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="relative z-10 mt-5 flex justify-center gap-1.5">
        {PROFILES.map((p, i) => (
          <motion.button
            key={i}
            onClick={() => setIdx(i)}
            animate={{ width: i === idx ? 20 : 5, opacity: i === idx ? 1 : 0.25 }}
            transition={{ duration: 0.3 }}
            className="h-[5px] cursor-pointer rounded-full"
            style={{ background: p.dotColor }}
          />
        ))}
      </div>
    </div>
  )
}

export function HeroSection() {
  const navigate = useNavigate()
  const goToSignUp = () => navigate({ to: '/auth/sign-up' })

  return (
    <section className="w-full min-h-screen overflow-hidden bg-[#FEF4EA] px-4 pt-24 dark:bg-[#1C1611] pb-8 sm:px-8 sm:pt-28 md:px-12 md:pt-28 md:pb-0 lg:px-20">
      <div className="w-full md:container md:mx-auto md:grid md:grid-cols-2 md:items-center md:gap-6 md:py-0 lg:gap-12">
        {/* ── MOBILE (< md) ── */}
        <div className="mt-20 flex flex-col items-center text-center md:hidden">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="w-full">
            <h1 className="font-display text-[40px] leading-[0.88] font-[400] tracking-tight text-[#5D2D2B] dark:text-[#F5EEE4]">
              Endless
              <br />
              Connection
            </h1>

            <div className="relative inline-block">
              <p className="text-[33px] leading-tight text-[#5D2D2B] dark:text-[#F5EEE4]">In just A Biography.</p>
              <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.5 }}>
                <img src="/images/scribble.svg" alt="" width={160} height={160} className="pointer-events-none absolute -bottom-2 right-2 w-[6rem] xs:w-[5rem] sm:w-[6rem]" />
              </motion.div>
            </div>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35, duration: 0.6 }} className="mt-5 text-left text-[14px] leading-[1.8] text-[#5D2D2B]/80 dark:text-[#F5EEE4]/80">
            Share your music, links, shop, and profile with one tap on your NFC Acard. Works on any NFC enabled device, Iphone/Android. No app needed. All seen from a single link and dynamic profile.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="mt-6 flex w-full flex-col items-center gap-2.5">
            <div className="relative w-full max-w-[310px]">
              <span className="absolute top-1/2 left-3.5 z-10 -translate-y-1/2 text-[16px] font-semibold text-black select-none">abio.site/</span>
              <Input
                placeholder=""
                className="h-12 w-full rounded-none border-0 bg-[#FED45C] dark:bg-[#FED45C] pl-[89px] text-[16px] font-medium placeholder:font-semibold placeholder:text-[#8B4646] focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={goToSignUp}
              className="h-11 w-full max-w-[310px] bg-[#5D2D2B] text-[13px] font-black text-[#FED45C] shadow-[3px_3px_0px_0px_#000000] transition-shadow duration-200 hover:shadow-[4px_4px_0px_0px_#000000]"
            >
              Get Abio for free
            </motion.button>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.7 }} className="mt-10 mb-6">
            <TiltedCard />
          </motion.div>
        </div>

        {/* ── TABLET/DESKTOP LEFT — text ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative z-10 hidden space-y-6 pt-8 pb-10 md:block md:py-0 lg:space-y-8"
        >
          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-[48px] leading-[1] font-[400] text-[#5D2D2B] dark:text-[#F5EEE4] md:text-[54px] lg:text-[70px] xl:text-[86px]"
            >
              Endless
              <br />
              Connection
            </motion.h1>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }} className="relative inline-block">
              <p className="text-2xl text-[#5D2D2B] dark:text-[#F5EEE4] md:text-3xl lg:text-5xl">In just A Biography.</p>
              <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.5 }}>
                <img
                  src="/images/scribble.svg"
                  alt="decoration"
                  width={160}
                  height={160}
                  className="pointer-events-none absolute top-9 right-0 w-[6rem] md:top-10 md:w-[8rem] lg:top-11 lg:w-[10rem]"
                />
              </motion.div>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="text-[13px] leading-[1.7] text-[#5D2D2B] dark:text-[#F5EEE4] md:max-w-xl md:text-sm lg:max-w-2xl lg:text-base"
          >
            Share your music, links, shop, and profile with one tap on your NFC Acard. Works on any NFC enabled device, Iphone/Android. No app needed. All seen from a single link and dynamic profile.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }} className="grid w-full grid-cols-2 gap-2 overflow-hidden">
            <div className="relative min-w-0 overflow-hidden">
              <span className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-[16px] font-semibold whitespace-nowrap text-black  select-none">abio.site/</span>
              <Input
                placeholder=""
                className="h-12 w-full min-w-0 rounded-none border-0 bg-[#FED45C] dark:bg-[#FED45C] pl-[70px] text-[16px] font-medium placeholder:font-semibold placeholder:text-[#8B4646] focus-visible:ring-0 focus-visible:ring-offset-0 md:pl-[75px] lg:pl-[85px]"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={goToSignUp}
              className="relative z-10 h-11 w-full bg-[#5D2D2B] px-2 text-[12px] font-black whitespace-nowrap text-[#FED45C] shadow-[3px_3px_0px_0px_#000000] transition-shadow duration-200 hover:shadow-[4px_4px_0px_0px_#000000] md:h-12 md:text-[13px]"
            >
              Get Abio for free
            </motion.button>
          </motion.div>
        </motion.div>

        {/* ── TABLET/DESKTOP RIGHT — card ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative hidden items-center justify-center py-4 md:flex lg:py-8"
        >
          <TiltedCard />
        </motion.div>
      </div>
    </section>
  )
}
