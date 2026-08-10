import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

const faqs = [
  {
    question: 'What is Abio.site?',
    answer:
      'Abio.site is a link-in-bio tool that lets you create a beautiful profile to showcase your social, contact, business, and other information. We seamlessly combine this with an NFC-enabled card, called an Acard, that allows for one-tap sharing of your profile.',
  },
  {
    question: 'How does the NFC card work?',
    answer:
      'The Acard uses NFC (Near Field Communication) technology. Simply tap it against any NFC-enabled smartphone and your Abio profile opens instantly — no app download required.',
  },
  {
    question: 'What is the benefit of using an Acard over a traditional business card?',
    answer:
      'Unlike paper cards, your Acard always stays up-to-date. Edit your profile anytime and everyone who taps your card gets your latest info, links, and contact details in real time.',
  },
  {
    question: 'What is the benefit of using Abio.site over other link-in-bio tools?',
    answer:
      "Abio combines a powerful digital profile with NFC card technology, giving you both an online presence and a physical sharing tool. It's the bridge between your digital and physical networking.",
  },
]

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  return (
    <section className="relative w-full overflow-hidden bg-[#FEF4EA] px-4 py-16 sm:px-8 md:px-12 md:py-24 lg:px-20">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04]">
        <img src="/images/footerlogo.svg" alt="" className="h-auto w-[40rem] object-contain sm:w-[55rem]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-12 text-center md:mb-16"
        >
          <h2 className="font-display mb-3 text-[40px] leading-tight font-[400] text-[#5D2D2B] xl:text-[50px]">Got Questions?</h2>
          <p className="text-base font-light text-[#5D2D2B]/60">Everything you need to know about Abio</p>
        </motion.div>

        <div className="space-y-4 md:space-y-5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ background: isOpen ? '#5D2D2B' : '#FED45C', boxShadow: isOpen ? '0 8px 32px rgba(93,45,43,0.18)' : '0 2px 12px rgba(0,0,0,0.06)' }}
                >
                  <button
                    onClick={() => toggle(index)}
                    className="flex w-full cursor-pointer items-center justify-between px-7 py-7 text-left md:px-10 md:py-9"
                    aria-expanded={isOpen}
                  >
                    <span
                      className="pr-6 text-[18px] leading-snug font-bold transition-colors duration-300 sm:text-[22px] md:text-[26px]"
                      style={{ color: isOpen ? '#FEF4EA' : '#5D2D2B' }}
                    >
                      {faq.question}
                    </span>

                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.28, ease: 'easeInOut' }}
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-colors duration-300 md:h-11 md:w-11"
                      style={{ background: isOpen ? 'rgba(254,212,92,0.18)' : 'rgba(93,45,43,0.12)' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M4 6.5L9 11.5L14 6.5" stroke={isOpen ? '#FED45C' : '#5D2D2B'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="overflow-hidden"
                      >
                        <div className="mx-7 h-px bg-[#FEF4EA]/15 md:mx-10" />
                        <p className="px-7 py-7 text-[15px] leading-[1.85] font-light text-[#FEF4EA]/80 sm:text-[17px] md:px-10 md:py-8 md:text-[18px]">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
