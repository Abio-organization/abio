import { BarChart2, GripVertical, Pencil, Trash2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const platforms = [
  { name: 'TikTok', link: 'https://www.tiktok.com/@yourname', icon: '/assets/platform-icons/colored/Social=TikTok,Style=Original.svg', active: false },
  { name: 'Snapchat', link: 'https://www.snapchat.com/add/yourname', icon: '/assets/platform-icons/colored/Social=Snapchat,Style=Original.svg', active: true },
  { name: 'Instagram', link: 'https://www.instagram.com/yourname', icon: '/assets/platform-icons/colored/Social=Instagram,Style=Original.svg', active: true },
  { name: 'WhatsApp', link: 'https://wa.me/+1234567890', icon: '/assets/platform-icons/colored/Social=WhatsApp,Style=Original.svg', active: false },
  { name: 'Pinterest', link: 'https://pin.it/yourname', icon: '/assets/platform-icons/colored/Social=Pinterest,Style=Original.svg', active: true },
  { name: 'YouTube', link: 'https://youtube.com/@yourname', icon: '/assets/platform-icons/colored/Social=YouTube,Style=Original.svg', active: true },
  { name: 'Twitter', link: 'https://twitter.com/yourname', icon: '/assets/platform-icons/colored/Social=X ex Twitter,Style=Original.svg', active: false },
]

const Toggle = ({ active }: { active: boolean }) => (
  <div className={`relative h-4 w-7 flex-shrink-0 rounded-full transition-colors duration-200 xl:h-5 xl:w-9 ${active ? 'bg-[#5D2D2B]' : 'bg-gray-200'}`}>
    <div className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform duration-200 xl:h-4 xl:w-4 ${active ? 'translate-x-3 xl:translate-x-4' : 'translate-x-0.5'}`} />
  </div>
)

function SocialLinkCard({ name, link, icon, active }: { name: string; link: string; icon: string; active: boolean }) {
  return (
    <div className="flex w-full flex-col gap-1 border border-[#e5e5e5] bg-white px-2 py-1.5 shadow-[1px_1px_0px_0px_#000] xl:gap-2 xl:px-4 xl:py-3 xl:shadow-[3px_3px_0px_0px_#000]">
      <div className="flex items-center gap-1.5 xl:gap-3">
        <GripVertical className="h-2.5 w-2.5 flex-shrink-0 xl:h-4 xl:w-4" style={{ color: '#FF0000' }} />
        <img src={icon} alt={name} width={28} height={28} className="h-4 w-4 flex-shrink-0 object-contain xl:h-7 xl:w-7" />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-0.5">
            <span className="text-[9px] leading-none font-bold text-black xl:text-[13px]">{name}</span>
            <Pencil className="h-2 w-2 text-gray-400 xl:h-3 xl:w-3" />
          </div>
          <div className="flex min-w-0 items-center gap-0.5">
            <span className="max-w-[90px] truncate text-[7px] text-gray-400 xl:max-w-none xl:text-[11px]">{link}</span>
            <Pencil className="h-1.5 w-1.5 flex-shrink-0 text-gray-400 xl:h-3 xl:w-3" />
          </div>
        </div>
        <Toggle active={active} />
        <Trash2 className="h-2.5 w-2.5 flex-shrink-0 xl:h-4 xl:w-4" style={{ color: '#FF0000' }} />
      </div>
      <div className="flex items-center gap-1 border-t border-gray-100 pt-1 xl:pt-1.5">
        <BarChart2 className="h-2 w-2 text-gray-300 xl:h-3.5 xl:w-3.5" />
        <span className="text-[7px] font-medium text-gray-400 xl:text-[10px]">850 clicks</span>
      </div>
    </div>
  )
}

const VISIBLE = 4
const mobileOffsets = [8, -8, 8, -8]
const desktopOffsets = [24, -24, 24, -24]

export function ManageYourLinks() {
  const [startIndex, setStartIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1280)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % platforms.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const offsets = isMobile ? mobileOffsets : desktopOffsets
  const visible = Array.from({ length: VISIBLE }, (_, i) => ({ ...platforms[(startIndex + i) % platforms.length], slotIndex: i }))

  return (
    <section className="relative w-full overflow-hidden bg-[#FFDCE3] px-4 py-16 sm:px-8 md:px-12 md:py-24 lg:px-20">
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-8 xl:grid xl:grid-cols-[1fr_1fr] xl:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-md space-y-5 text-center md:text-left"
          >
            <h2 className="font-display text-[34px] leading-[0.9] font-[400] text-[#5D2D2B] md:leading-tight xl:text-[50px]">
              Every Link connected, <br /> One place to manage it all
            </h2>
            <p className="mx-auto max-w-xs text-left text-xs leading-6 font-light text-[#5D2D2B]/80 sm:text-sm md:mx-0">
              Organize, prioritize, and update links anytime to keep your audience up to speed.
            </p>
          </motion.div>

          <div className="flex w-full flex-col gap-1.5 px-6 sm:px-10 md:px-16 xl:gap-3 xl:px-0 xl:pl-8">
            <AnimatePresence mode="popLayout">
              {visible.map((platform) => {
                const xOffset = offsets[platform.slotIndex]
                return (
                  <motion.div
                    key={`${platform.name}-${platform.slotIndex}`}
                    initial={{ opacity: 0, y: -20, x: xOffset, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, x: xOffset, scale: 1 }}
                    exit={{ opacity: 0, y: 20, x: xOffset, scale: 0.96 }}
                    transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
                    layout
                  >
                    <SocialLinkCard name={platform.name} link={platform.link} icon={platform.icon} active={platform.active} />
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
