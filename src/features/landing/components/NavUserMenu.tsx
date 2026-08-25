import { Link, useNavigate } from '@tanstack/react-router'
import { ChevronDown, LayoutDashboard, LogOut } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { useAuthUser, useLogout } from '@/features/auth'

import { Button } from '@/shared/components/ui/button'

function UserAvatar({ name, avatarUrl, size = 'md' }: { name: string; avatarUrl: string | null; size?: 'md' | 'sm' }) {
  const sizeClass = size === 'sm' ? 'h-9 w-9 text-sm' : 'h-10 w-10 text-base'

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        className={`${sizeClass} shrink-0 rounded-full border-2 border-black object-cover`}
      />
    )
  }

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full border-2 border-black bg-[#ff0000]/10 font-bold uppercase text-black`}
    >
      {(name.trim()[0] ?? 'U').toUpperCase()}
    </div>
  )
}

interface NavUserMenuProps {
  variant: 'desktop' | 'mobile'
  onNavigate?: () => void
}

export function NavUserMenu({ variant, onNavigate }: NavUserMenuProps) {
  const user = useAuthUser()
  const navigate = useNavigate()
  const logoutMutation = useLogout()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const displayName = user?.name?.trim() || user?.email?.split('@')[0] || 'User'

  const handleLogout = () => {
    onNavigate?.()
    setOpen(false)
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate({ to: '/auth/sign-in' }),
    })
  }

  useEffect(() => {
    if (variant !== 'desktop' || !open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, variant])

  if (!user) return null

  if (variant === 'mobile') {
    return (
      <div className="mt-8 flex w-full flex-col gap-4 lg:hidden">
        <div className="flex items-center gap-3 border-b border-black/10 pb-4 dark:border-white/10">
          <UserAvatar name={displayName} avatarUrl={user.profile?.avatarUrl ?? null} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-black dark:text-[#F5EEE4]">{displayName}</p>
            <p className="truncate text-xs text-black/60 dark:text-[#F5EEE4]/60">{user.email}</p>
          </div>
        </div>

        <Link to="/dashboard" onClick={onNavigate}>
          <Button
            variant="ghost"
            className="h-10 w-full bg-[#ff0000]/10 px-4 text-[14px] font-bold hover:bg-[#ff0000]/20"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>

        <Button
          type="button"
          variant="ghost"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="h-10 w-full bg-[#ff0000] px-4 text-xs font-semibold text-[#FED45C] shadow-[2px_2px_0px_0px_#000000] hover:bg-[#ff0000]/80 disabled:opacity-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {logoutMutation.isPending ? 'Logging out…' : 'Log out'}
        </Button>
      </div>
    )
  }

  return (
    <div ref={menuRef} className="relative hidden lg:block">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border-2 border-black/10 bg-white/40 py-1 pl-1 pr-3 transition-colors hover:bg-white/70"
      >
        <UserAvatar name={displayName} avatarUrl={user.profile?.avatarUrl ?? null} />
        <span className="max-w-[120px] truncate text-sm font-semibold text-black">{displayName}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-black transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden border-2 border-black bg-[#FEF4EA] shadow-[2px_2px_0px_0px_#000000] dark:bg-[#1C1611]"
        >
          <div className="border-b border-black/10 px-4 py-3 dark:border-white/10">
            <p className="truncate text-sm font-bold text-black dark:text-[#F5EEE4]">{displayName}</p>
            <p className="truncate text-xs text-black/60 dark:text-[#F5EEE4]/60">{user.email}</p>
          </div>

          <Link
            to="/dashboard"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#ff0000]/10 dark:text-[#F5EEE4] dark:hover:bg-white/5"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="flex w-full items-center gap-2 border-t border-black/10 px-4 py-3 text-sm font-semibold text-[#ff0000] transition-colors hover:bg-[#ff0000]/10 disabled:opacity-50 dark:border-white/10"
          >
            <LogOut className="h-4 w-4" />
            {logoutMutation.isPending ? 'Logging out…' : 'Log out'}
          </button>
        </div>
      )}
    </div>
  )
}
