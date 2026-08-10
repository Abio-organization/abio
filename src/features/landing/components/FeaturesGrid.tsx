import { motion, type Variants } from 'framer-motion'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const cardVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80, damping: 16 } },
}

const PhoneMockup = () => (
  <div className="mx-auto mt-3 h-[130px] w-[68px] overflow-hidden rounded-[0px] border-[1.5px] border-[#FEF4EA]/20 bg-[#FEF4EA]/[0.07]">
    <div className="mx-2 my-2 flex items-center gap-1">
      <div className="h-[22px] w-[22px] rounded-full bg-[#FED45C]/65" />
      <div>
        <div className="mb-1 h-1 bg-[#FEF4EA]/13" />
        <div className="h-[3px] w-5 bg-[#FEF4EA]/18" />
      </div>
    </div>
    {[1, 2, 3].map((i) => (
      <div key={i} className="mx-1.5 mb-1 h-[15px] border border-[#FEF4EA]/8 bg-[#FEF4EA]/10" />
    ))}
  </div>
)

const themes = [
  { name: 'Warm', bg: '#FEF4EA', card: '#5D2D2B', text: '#5D2D2B' },
  { name: 'Noir', bg: '#120600', card: '#FED45C', text: '#FEF4EA' },
  { name: 'Mint', bg: '#E8F8F2', card: '#3EB489', text: '#0F6E56' },
  { name: 'Blaze', bg: '#FFF1EB', card: '#FF854A', text: '#FF854A' },
  { name: 'Slate', bg: '#1A1A2E', card: '#4A4A8A', text: '#FFF' },
  { name: 'Butter', bg: '#FFFBEA', card: '#FED45C', text: '#5D2D2B' },
]
const allThemes = [...themes, ...themes]

const ThemeCarousel = () => (
  <div className="mt-4 -mx-1 overflow-hidden">
    <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }} className="flex w-max gap-2">
      {allThemes.map((t, i) => (
        <div key={i} className="w-[68px] flex-shrink-0 overflow-hidden rounded-[0px] border border-white/10" style={{ background: t.bg }}>
          <div className="flex flex-col gap-1 p-1.5">
            <div className="mt-0.5 flex items-center gap-1">
              <div className="h-4 w-4 flex-shrink-0 rounded-full" style={{ background: t.card }} />
              <div className="h-1 w-full" style={{ background: t.card }} />
              <div>
                <div className="h-1.5 flex-1 rounded-full opacity-30" style={{ background: t.card }} />
                <div className="h-1.5 flex-1 rounded-full opacity-30" style={{ background: t.card }} />
              </div>
            </div>
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-4 w-full rounded-[0px]" style={{ background: j === 1 ? t.card : `${t.card}30` }} />
            ))}
          </div>
          <div className="py-1 text-center text-[8px] font-bold tracking-wide" style={{ color: t.text, background: `${t.card}18` }}>
            {t.name}
          </div>
        </div>
      ))}
    </motion.div>
  </div>
)

export function FeaturesGrid() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FFDCE3] px-4 py-6 sm:px-8 md:px-12 md:py-16 lg:px-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.08 }}
        className="grid grid-cols-3 gap-3 md:gap-4"
      >
        {/* 1. Bio Profile */}
        <motion.div variants={cardVariants} className="relative col-span-1 flex min-h-[210px] flex-col items-start overflow-hidden bg-[#5D2D2B] p-4 text-left md:min-h-[230px] md:p-6 lg:min-h-[250px]">
          <div className="absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-[#4A2422]" />
          <div className="relative z-10">
            <span className="mb-2 inline-block bg-[#FED45C] px-2 py-0.5 text-[8px] font-black tracking-[0.15em] text-[#5D2D2B] uppercase md:text-[9px]">ABIO</span>
            <h3 className="font-display text-[16px] leading-tight font-[400] text-[#FEF4EA] md:text-[26px]">
              Your link.
              <br />
              Your world.
            </h3>
          </div>
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="relative z-10 mt-auto">
            <PhoneMockup />
          </motion.div>
        </motion.div>

        {/* 2. Themes */}
        <motion.div variants={cardVariants} className="relative col-span-2 flex min-h-[210px] flex-col justify-between overflow-hidden bg-[#120600] p-4 md:min-h-[230px] md:p-6 lg:min-h-[250px]">
          <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-[#FED45C]/05" />
          <div>
            <span className="mb-2 inline-block bg-[#FED45C]/15 px-2 py-0.5 text-[8px] font-black tracking-[0.15em] text-[#FED45C] uppercase md:text-[9px]">Themes</span>
            <h3 className="font-display text-[18px] leading-tight font-[400] text-[#FEF4EA] md:text-[26px]">
              Make it
              <br />
              yours.
            </h3>
            <p className="mt-1.5 text-[10px] text-[#FEF4EA]/35 md:text-[11px]">Your brand. Your style.</p>
          </div>
          <ThemeCarousel />
        </motion.div>

        {/* 3. Realtime */}
        <motion.div variants={cardVariants} className="relative col-span-2 flex min-h-[210px] flex-col justify-between overflow-hidden bg-[#FF854A] p-4 md:min-h-[230px] md:p-6 lg:min-h-[250px]">
          <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-[#E6703B]/40" />
          <div className="relative z-10 flex items-center gap-2">
            <motion.div animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }} transition={{ duration: 1.4, repeat: Infinity }} className="h-2 w-2 rounded-full bg-white" />
            <span className="text-[8px] font-black tracking-[0.15em] text-white/80 uppercase md:text-[9px]">LIVE STATS</span>
          </div>
          <div className="relative z-10">
            <h3 className="font-display text-[18px] leading-tight font-[400] text-white md:text-[26px]">
              Stay up to date always
              <br />
              Updates
            </h3>
            <p className="mt-1.5 text-[10px] leading-relaxed text-white/60 md:text-[11px]">Changes go live instantly. No refresh needed.</p>
          </div>
        </motion.div>

        {/* 4. Who It's For */}
        <motion.div variants={cardVariants} className="relative col-span-1 flex min-h-[210px] flex-col overflow-hidden bg-[#FED45C] p-4 md:min-h-[230px] md:p-6 lg:min-h-[250px]">
          <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-[#F5C840]/40" />
          <div className="relative z-10 mb-2">
            <span className="mb-2 inline-block bg-[#5D2D2B] px-2 py-0.5 text-[8px] font-black tracking-[0.15em] text-[#FED45C] uppercase md:text-[9px]">Built for</span>
            <h3 className="font-display text-[14px] leading-tight font-[400] text-[#5D2D2B] md:text-[26px]">
              Everyone
              <br />
              online.
            </h3>
          </div>

          <div className="relative mt-auto h-[90px] overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-4 bg-gradient-to-b from-[#FED45C] to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-4 bg-gradient-to-t from-[#FED45C] to-transparent" />
            <motion.div animate={{ y: ['0%', '-50%'] }} transition={{ duration: 9, repeat: Infinity, ease: 'linear' }} className="flex flex-col gap-1.5">
              {[
                'Musicians', 'Designers', 'Creators', 'Freelancers', 'Athletes', 'Podcasters', 'Sellers', 'Developers', 'Influencers',
                'Musicians', 'Designers', 'Creators', 'Freelancers', 'Athletes', 'Podcasters', 'Sellers', 'Developers', 'Influencers',
              ].map((label, i) => (
                <div key={i} className="bg-[#5D2D2B]/10 px-2 py-1 text-[9px] font-black tracking-wide whitespace-nowrap text-[#5D2D2B] md:text-[10px]">
                  {label}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
