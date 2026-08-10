import { Link, useLocation } from '@tanstack/react-router'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useTheme } from '@/shared/hooks/use-theme'

import { Button } from '@/shared/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/shared/components/ui/sheet'

import { navLinks } from '../data'

const sheetVariants: Variants = {
  closed: {
    x: '100%',
    transition: { type: 'tween', duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },
  open: {
    x: 0,
    transition: { type: 'tween', duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
}

const itemVariants: Variants = {
  closed: { opacity: 0, x: 15, transition: { duration: 0.15 } },
  open: { opacity: 1, x: 0, transition: { duration: 0.2, ease: 'easeOut' } },
}

export function NavBar() {
  const { pathname } = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <header className="fixed top-[30px] left-1/2 z-50 w-[95%] -translate-x-1/2 bg-[#FED45C] md:top-[40px] md:w-[90%]">
      <div className="shadow-xl transition-all duration-300">
        <div className="container mx-auto flex items-center justify-between px-5 py-[16px] md:px-10 lg:px-6">
          <div className="flex items-center gap-14">
            <Link to="/" className="group flex items-center gap-[1.5px]">
              <img
                src="/icons/A.bio.svg"
                alt="A.Bio Logo"
                width={24}
                height={24}
                className="transition-transform group-hover:scale-105"
              />
              <span className="text-end text-3xl font-medium tracking-wide text-black">bio</span>
            </Link>

            <nav className="hidden items-center space-x-12 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`${
                    pathname === link.href ? 'text-[#FF0000]' : ''
                  } text-sm font-semibold transition-colors duration-200 hover:text-[#FF0000]/80 md:text-[16px]`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-black transition-colors hover:bg-black/10"
            >
              {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            <div className="hidden items-center space-x-2 lg:flex">
              <Link to="/auth/sign-in">
                <Button
                  variant="ghost"
                  className="h-10 bg-[#ff0000]/10 px-6 text-base font-semibold hover:bg-[#ff0000]/20"
                >
                  Log In
                </Button>
              </Link>
              <Link to="/auth/sign-up">
                <Button className="h-10 px-6 text-base font-semibold">Sign Up</Button>
              </Link>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <Link to="/auth/sign-in">
                <Button variant="ghost" className="h-10 bg-[#ff0000]/10 px-4 text-[14px] font-bold">
                  Log in
                </Button>
              </Link>
              <Link to="/auth/sign-up">
                <Button className="h-10 bg-[#ff0000] px-4 text-xs font-semibold text-[#FED45C] shadow-[2px_2px_0px_0px_#000000] hover:bg-[#ff0000]/80">
                  Sign up
                </Button>
              </Link>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-2 transition-colors hover:bg-black/5 lg:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex h-9 w-9 items-center justify-center bg-[#ff0000] text-[#FED45C]"
                  >
                    <X className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.div
                    key="hamburger"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="cursor-pointer p-1 text-black"
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent
            side="right"
            showCloseButton={false}
            className="top-[118px] h-[calc(100dvh-118px)] w-full max-w-full border-none bg-[#FEF4EA] p-0 lg:hidden dark:bg-[#1C1611]"
          >
            <SheetTitle className="sr-only">Mobile Menu</SheetTitle>

            <AnimatePresence mode="wait">
              {isOpen && (
                <motion.div
                  key="menu-content"
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={sheetVariants}
                  className="flex h-full flex-col px-6 pt-6"
                >
                  <nav className="flex flex-col">
                    {navLinks.map((link, index) => (
                      <motion.div
                        key={link.href}
                        custom={index}
                        variants={itemVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        transition={{ delay: index * 0.03 }}
                        className="border-b border-black/10 py-8 dark:border-white/10"
                      >
                        <Link
                          to={link.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between text-lg font-semibold text-black transition-colors hover:text-[#FF0000] dark:text-[#F5EEE4]"
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
