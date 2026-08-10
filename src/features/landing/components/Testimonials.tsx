import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const influencers = [
  { src: '/images/fabulous.jpeg', alt: 'Fabuloushype', username: 'fabulous', link: 'https://www.abio.site/fabulous' },
  { src: '/images/zuo.PNG', alt: 'Zuo', username: 'zuo', link: 'https://www.abio.site/zuo' },
  { src: '/images/zion.jpeg', alt: 'Zion', username: 'zion', link: 'https://www.abio.site/ziongotlevels' },
  { src: '/images/samuel zeus.jpeg', alt: 'Samuel Zeus', username: 'SamuelXeus', link: 'https://www.abio.site/SamuelXeus' },
]

const MARQUEE_ITEMS = [...influencers, ...influencers, ...influencers]

const rotatingWords = ['Influencers', 'Creators', 'Artists', 'Leaders', 'Innovators', 'Web3']

export function Testimonials() {
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = rotatingWords[wordIndex]
    const typingSpeed = isDeleting ? 50 : 120
    const timer = setTimeout(() => {
      setText((prev) => {
        if (!isDeleting) {
          const next = currentWord.substring(0, prev.length + 1)
          if (next === currentWord) setTimeout(() => setIsDeleting(true), 1000)
          return next
        } else {
          const next = currentWord.substring(0, prev.length - 1)
          if (next === '') {
            setIsDeleting(false)
            setWordIndex((i) => (i + 1) % rotatingWords.length)
          }
          return next
        }
      })
    }, typingSpeed)
    return () => clearTimeout(timer)
  }, [text, isDeleting, wordIndex])

  return (
    <section className="w-full overflow-hidden bg-[#FEF4EA] py-10 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="mb-10 px-4 text-center"
      >
        <h2 className="font-display text-[32px] leading-[0.9] font-[400] text-[#5D2D2B] xl:text-[50px]">Abio for all. Trusted by</h2>
        <div className="mt-1 flex h-12 items-center justify-center">
          <span className="font-display border-r-4 border-yellow-500 pr-1 text-[32px] font-[400] text-yellow-500 sm:text-3xl md:text-5xl">{text}</span>
        </div>
      </motion.div>

      <div className="relative overflow-hidden">
        <div className="animate-marquee flex gap-4 whitespace-nowrap md:gap-6">
          {MARQUEE_ITEMS.map((item, i) => (
            <div key={`${item.username}-${i}`} className="w-[220px] flex-shrink-0 sm:w-[240px] md:w-[250px] lg:w-[280px]">
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden"
                style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)' }}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 text-sm font-semibold whitespace-nowrap text-black" style={{ borderRadius: 0 }}>
                    <Link to="/" className="group flex flex-shrink-0 items-center gap-[1.5px]">
                      <img src="/icons/Abio b&w.svg" alt="A.Bio Logo" width={20} height={20} className="h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-105" />
                    </Link>
                    <span className="max-w-[120px] truncate">/{item.username}</span>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
