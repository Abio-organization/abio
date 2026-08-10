import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'

import { getPlatformIconUrl } from '@/shared/lib/platform-icons'

const socialLinks = [
  { platform: 'instagram', href: 'https://www.instagram.com/abiosite?utm_source=qr', label: 'Instagram' },
  { platform: 'tiktok', href: 'https://www.tiktok.com/@abiosite', label: 'TikTok' },
  { platform: 'pinterest', href: 'https://pin.it/6Vnwtlyth', label: 'Pinterest' },
  { platform: 'x', href: 'https://x.com/abio_site?s=21', label: 'X (Twitter)' },
  { platform: 'linkedin', href: 'https://www.linkedin.com/company/abio', label: 'LinkedIn' },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#331400] pt-14 pb-8 text-white">
      <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16">
        <div className="mb-14 grid grid-cols-2 gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <Link to="/" className="group mb-5 flex w-fit items-center gap-[1px]">
              <img src="/icons/A.bio.svg" alt="A.bio Logo" width={24} height={24} className="cursor-pointer select-none transition-transform group-hover:scale-105" />
              <span className="text-3xl font-medium tracking-wide text-white">bio</span>
            </Link>
            <p className="max-w-[200px] text-xs leading-6 text-white/60">One link. Endless connections.</p>
          </div>

          <div>
            <h3 className="font-satoshi mb-5 text-base font-bold text-white">Product</h3>
            <div className="flex flex-col space-y-3 text-xs text-white/70">
              <a href="#" className="transition-colors duration-200 hover:text-white">Themes</a>
              <a href="#" className="transition-colors duration-200 hover:text-white">Store</a>
              <a href="#" className="transition-colors duration-200 hover:text-white">Contact Us</a>
            </div>
          </div>

          <div>
            <h3 className="font-satoshi mb-5 text-base font-bold text-white">Company</h3>
            <div className="flex flex-col space-y-3 text-xs text-white/70">
              <a href="#" className="transition-colors duration-200 hover:text-white">About</a>
              <a href="#" className="transition-colors duration-200 hover:text-white">FAQ</a>
            </div>
          </div>

          <div>
            <h3 className="font-satoshi mb-5 text-base font-bold text-white">Legal</h3>
            <div className="flex flex-col space-y-3 text-xs text-white/70">
              <a href="#" className="transition-colors duration-200 hover:text-white">Terms and conditions</a>
              <a href="#" className="transition-colors duration-200 hover:text-white">Privacy Policy</a>
              <a href="#" className="transition-colors duration-200 hover:text-white">Cookie Policy</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-5 border-t border-[#FED45C]/30 pt-7 sm:flex-row">
          <p className="text-xs text-white/60">© {currentYear}</p>

          <div className="flex space-x-3">
            {socialLinks.map(({ platform, href, label }) => {
              const iconUrl = getPlatformIconUrl(platform, 'black')

              return (
                <motion.a
                  key={platform}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="border border-white/30 p-2 transition-colors duration-200 hover:border-white"
                >
                  {iconUrl ? (
                    <img src={iconUrl} alt={label} width={20} height={20} className="h-5 w-5 invert saturate-0 brightness-0" />
                  ) : (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  )}
                </motion.a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
