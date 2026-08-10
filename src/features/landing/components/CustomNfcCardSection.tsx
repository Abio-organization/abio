import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const ImageCard1 = () => (
  <div className="relative h-full w-full overflow-hidden rounded-[0px] bg-transparent select-none">
    <img src="/images/Apcard 5 white 1.png" alt="Card design 1" className="absolute inset-0 h-full w-full object-contain" />
  </div>
)

const ImageCard2 = () => (
  <div className="relative h-full w-full overflow-hidden rounded-[0px] bg-transparent select-none">
    <img src="/images/Blackcard3.png" alt="Card design 2" className="absolute inset-0 h-full w-full object-contain" />
  </div>
)

const ImageCard3 = () => (
  <div className="relative h-full w-full overflow-hidden rounded-[0px] bg-transparent select-none">
    <img src="/images/pink card 3.png" alt="Card design 3" className="absolute inset-0 h-full w-full object-contain" />
  </div>
)

const CARDS = [
  { id: 'image1', component: ImageCard1 },
  { id: 'image2', component: ImageCard2 },
  { id: 'image3', component: ImageCard3 },
]

const CARD_W = 300
const CARD_H = 189
const STACK_W = 200
const STACK_H = 126

const SmartCardStack = () => {
  const [activeIdx, setActiveIdx] = useState(-1)
  const [doneIdxs, setDoneIdxs] = useState<number[]>([])
  const nextCard = useRef(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const run = () => {
      const idx = nextCard.current
      setActiveIdx(idx)

      const t1 = setTimeout(() => {
        setDoneIdxs((prev) => [...prev, idx])
        setActiveIdx(-1)

        const t2 = setTimeout(() => {
          nextCard.current = (nextCard.current + 1) % CARDS.length
          if (nextCard.current === 0) setDoneIdxs([])
          const t3 = setTimeout(run, 500)
          timers.current.push(t3)
        }, 600)
        timers.current.push(t2)
      }, 2000)
      timers.current.push(t1)
    }

    const init = setTimeout(run, 1000)
    timers.current.push(init)
    return () => timers.current.forEach(clearTimeout)
  }, [])

  return (
    <div className="relative flex flex-col items-center justify-center gap-2 md:flex-row md:gap-0" style={{ width: '100%', maxWidth: 560, height: 'auto', minHeight: 280 }}>
      <div className="relative flex-shrink-0" style={{ width: CARD_W, height: CARD_H + 60 }}>
        <AnimatePresence mode="wait">
          {activeIdx >= 0 &&
            (() => {
              const Component = CARDS[activeIdx].component
              return (
                <motion.div
                  key={`preview-${CARDS[activeIdx].id}`}
                  initial={{ x: -120, opacity: 0, scale: 0.82, rotate: -6 }}
                  animate={{ x: 0, opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ x: -80, opacity: 0, scale: 0.88, rotate: -4 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 28 }}
                  style={{ position: 'absolute', width: CARD_W, height: CARD_H, borderRadius: 20, overflow: 'hidden', top: 30, left: 0, boxShadow: 'none', background: 'transparent' }}
                >
                  <Component />
                </motion.div>
              )
            })()}
        </AnimatePresence>

        <motion.div
          animate={{ opacity: activeIdx >= 0 ? 0.15 : 0, scaleX: activeIdx >= 0 ? 1 : 0.5 }}
          transition={{ duration: 0.5 }}
          style={{ position: 'absolute', bottom: 10, left: '10%', right: '10%', height: 18, borderRadius: '50%', background: 'rgba(0,0,0,0.1)', filter: 'blur(10px)', pointerEvents: 'none' }}
        />
      </div>

      <div className="relative flex-shrink-0" style={{ width: STACK_W + 20, height: STACK_H + 40, marginTop: 20 }}>
        {CARDS.map((card, i) => {
          if (i === activeIdx) return null
          const isDone = doneIdxs.includes(i)
          const stackRank = isDone ? CARDS.length : CARDS.length - 1 - i + doneIdxs.filter((d) => d < i).length
          const offset = stackRank * 4
          const Component = card.component

          return (
            <motion.div
              key={card.id}
              animate={{
                x: isDone ? offset + 2 : offset,
                y: isDone ? -offset * 0.3 + 2 : -offset * 0.3,
                rotate: isDone ? offset * 0.5 - 1 : offset * 0.5,
                scale: 1 - stackRank * 0.018,
                zIndex: isDone ? 0 : CARDS.length - stackRank,
              }}
              transition={{ type: 'spring', stiffness: 180, damping: 26 }}
              style={{ position: 'absolute', width: STACK_W, height: STACK_H, borderRadius: 12, overflow: 'hidden', boxShadow: 'none', top: 20, left: 0, background: 'transparent' }}
            >
              <Component />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

const FloatingBadge = ({
  label,
  delay,
  className,
  variant = 'default',
}: {
  label: string
  delay: number
  className: string
  variant?: 'default' | 'accent' | 'dark' | 'light'
}) => {
  const variants = {
    default: { bg: 'bg-white', border: 'border-[#5D2D2B]/12', text: 'text-[#5D2D2B]' },
    accent: { bg: 'bg-[#FED45C]', border: 'border-[#5D2D2B]/20', text: 'text-[#5D2D2B]' },
    dark: { bg: 'bg-[#5D2D2B]', border: 'border-[#FEF4EA]/20', text: 'text-[#FEF4EA]' },
    light: { bg: 'bg-[#FEF4EA]', border: 'border-[#5D2D2B]/10', text: 'text-[#5D2D2B]' },
  }
  const style = variants[variant]

  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay }}
      className={`absolute flex items-center gap-1.5 ${style.bg} border ${style.border} px-3 py-1.5 shadow-[2px_2px_0px_rgba(0,0,0,0.08)] ${className}`}
    >
      <span className={`text-[10px] font-black ${style.text} whitespace-nowrap`}>{label}</span>
    </motion.div>
  )
}

export function CustomNfcCardSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white px-4 py-12 dark:bg-[#1C1611] sm:px-6 sm:py-16 md:px-12 md:py-20 lg:px-20 lg:py-28">
      <img src="/images/scribble.svg" alt="" className="pointer-events-none absolute top-0 -left-16 w-[7rem] rotate-45 opacity-40 sm:w-[9rem] md:w-[12rem] lg:w-[14rem]" />
      <img src="/images/scribble.svg" alt="" className="pointer-events-none absolute top-8 -right-12 w-[7rem] -rotate-45 opacity-40 sm:w-[9rem] md:w-[12rem] lg:w-[14rem]" />

      <div className="container mx-auto">
        <div className="flex flex-col gap-8 md:gap-12 lg:gap-40">
          <div className="flex flex-col-reverse items-center gap-8 md:grid md:grid-cols-2 md:gap-12 lg:gap-40">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative order-1 flex w-full items-center justify-center overflow-visible md:order-1"
            >
              <div className="relative flex w-full justify-center overflow-visible">
                <SmartCardStack />
                <FloatingBadge label="Tap to share" variant="accent" delay={0} className="-top-2 right-2 md:right-0" />
                <FloatingBadge label="No app needed" variant="dark" delay={1} className="right-2 bottom-2 md:right-0" />
                <FloatingBadge label="Fully custom" variant="light" delay={0.5} className="-left-2 bottom-2 md:-left-2" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="order-2 flex w-full flex-col gap-4 text-center sm:gap-5 md:order-2 md:text-left"
            >
              <div>
                <p className="mb-2 text-[10px] font-bold tracking-[0.1em] text-[#5D2D2B] dark:text-[#F5EEE4] uppercase sm:mb-3 sm:text-[11px]">
                  Your digital identity now in your pockets.
                </p>
                <h2 className="font-display text-[35px] leading-[0.9] font-[400] text-[#5D2D2B] dark:text-[#F5EEE4] sm:text-[40px] sm:leading-none lg:text-[50px]">
                  Get the Acard
                </h2>
              </div>

              <p className="-mb-2 mx-auto max-w-sm px-2 text-left text-xs leading-5 font-light text-[#5D2D2B]/80 dark:text-[#F5EEE4]/80 sm:px-0 sm:text-sm sm:leading-6 md:mx-0 md:mb-0">
                Personalize your NFC Acard with your name, logo, and brand style. One tap shares your Abio — no app needed.
              </p>
            </motion.div>
          </div>

          <div className="flex w-full justify-center md:mt-0 md:justify-start">
            <Link to="/store" className="md:w-auto">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '4px 4px 0px 0px #000000' }}
                whileTap={{ scale: 0.97 }}
                className="h-10 w-full cursor-pointer bg-[#FED45C] px-6 text-xs font-bold text-[#5D2D2B] shadow-[3px_3px_0px_0px_#000000] transition-shadow duration-200 sm:h-12 sm:px-8 sm:text-sm md:w-auto"
              >
                Order your Acard
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
