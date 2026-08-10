import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

function useCountUp(target: number, duration: number, active: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    let s = 0
    const step = target / (duration / 16)
    const t = setInterval(() => {
      s += step
      if (s >= target) {
        setValue(target)
        clearInterval(t)
      } else setValue(Math.floor(s))
    }, 16)
    return () => clearInterval(t)
  }, [active, target, duration])
  return value
}

const DAY_DATA = [38, 52, 44, 100, 61, 85, 10]
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export function DetailedAnalytics() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })

  const views = useCountUp(1200, 1600, inView)
  const clicks = useCountUp(1340, 1800, inView)
  const rate = useCountUp(108, 1400, inView)

  const max = Math.max(...DAY_DATA)

  const stats = [
    { num: views, fmt: (n: number) => n.toLocaleString(), suffix: '', label: 'Views', sub: 'this month', change: '↑ 34%' },
    { num: clicks, fmt: (n: number) => n.toLocaleString(), suffix: '', label: 'Clicks', sub: 'total', change: '↑ 22%' },
    { num: rate, fmt: (n: number) => n, suffix: '%', label: 'Click rate', sub: 'across all links', change: '↑ 8%' },
  ]

  return (
    <section className="w-full bg-[#FED45C] px-4 py-16 sm:px-8 md:px-12 md:py-20 lg:px-20">
      <div ref={ref} className="grid gap-12 md:grid-cols-2 md:items-center md:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="md:order-2"
        >
          <h2 className="font-display mb-5 text-center text-[32px] leading-[0.92] font-[400] tracking-tight text-[#5D2D2B] sm:text-[48px] md:text-left md:text-[52px]">
            Your Audience, <br /> finally simplified.
            <br />
          </h2>

          <p className="mb-8 max-w-sm text-left text-sm leading-[1.85] font-light text-[#5D2D2B]/55">
            See exactly who's clicking, where they're from, and what's making them stay. No guesswork. Just data that actually makes sense.
          </p>

          <div>
            <p className="mb-3 text-[10px] font-bold tracking-[0.12em] text-[#5D2D2B]/90 uppercase">This week</p>
            <div className="mb-1.5 flex h-[64px] items-end gap-2">
              {DAY_DATA.map((v, i) => (
                <div key={i} className="flex h-full flex-1 flex-col items-center justify-end">
                  <motion.div
                    className="w-full rounded-t-[0px]"
                    initial={{ height: 0 }}
                    animate={inView ? { height: `${(v / max) * 100}%` } : {}}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{ background: i === 3 ? '#ffffff' : 'rgba(140, 140, 140, 0.2)' }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              {DAYS.map((d, i) => (
                <div key={i} className="flex-1 text-center text-[10px] font-bold" style={{ color: i === 3 ? '#5D2D2B' : 'rgba(93,45,43,0.28)' }}>
                  {d}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative flex flex-col divide-y divide-[#5D2D2B]/10 border-y border-[#5D2D2B]/10 md:order-1"
        >
          <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-[#5D2D2B]/15" />
          <div className="absolute top-0 right-0 bottom-0 w-[2px] bg-[#5D2D2B]/15" />

          {stats.map(({ num, fmt, suffix, label, sub, change }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
              className="flex items-center justify-between gap-4 px-6 py-6 md:py-7"
            >
              <div>
                <div className="mb-1.5 flex items-baseline gap-1 leading-none">
                  <span className="text-[44px] font-black tracking-tight text-[#5D2D2B] tabular-nums md:text-[52px]">{fmt(num)}</span>
                  <span className="text-[24px] font-black text-[#5D2D2B]/25">{suffix}</span>
                </div>
                <p className="text-[12px] font-bold text-[#ff0000]">
                  {label} <span className="font-normal opacity-70">| {sub}</span>
                </p>
              </div>
              <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
                <span className="text-[14px] font-bold text-[#3EB489]">{change}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
