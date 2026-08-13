import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-linear-to-br from-[#FEF4EA] via-[#FEF4EA] to-[#FEF0E0] dark:from-[#1C1611] dark:via-[#1C1611] dark:to-[#20160f]">
      <div className="shrink-0 px-4 pt-4 pb-2 md:px-12 md:pt-8 md:pb-3 lg:px-20">
        <Link to="/" className="group flex items-center gap-[1.5px]">
          <img src="/icons/A.bio.svg" alt="A.Bio Logo" width={24} height={24} className="transition-transform group-hover:scale-105" />
          <span className="text-end text-3xl font-medium tracking-wide text-black dark:text-[#F5EEE4]">bio</span>
        </Link>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
