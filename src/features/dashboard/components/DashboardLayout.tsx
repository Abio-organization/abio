import { Link, Outlet, useNavigate } from '@tanstack/react-router'
import { BarChart3, LogOut, ShoppingCart, SlidersHorizontal, UserRound } from 'lucide-react'
import type { ComponentType } from 'react'

import { useLogout } from '@/features/auth/hooks/use-auth'

interface NavItem {
  to: string
  label: string
  icon: ComponentType<{ className?: string }>
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'My Abio', icon: UserRound },
  { to: '/dashboard/appearance', label: 'Appearance', icon: SlidersHorizontal },
  { to: '/dashboard/statistics', label: 'Analytics', icon: BarChart3 },
  { to: '/dashboard/store', label: 'Store', icon: ShoppingCart },
]

function NavLink({ item, orientation }: { item: NavItem; orientation: 'vertical' | 'horizontal' }) {
  const Icon = item.icon
  return (
    <Link
      to={item.to}
      activeOptions={{ exact: item.to === '/dashboard' }}
      className={
        orientation === 'vertical'
          ? 'group flex flex-col items-center gap-1 rounded-xl px-3 py-2.5 text-[#331400]/50 hover:bg-[#331400]/5 hover:text-[#331400] [&.active]:bg-[#FED45C]/20 [&.active]:text-[#331400] dark:text-[#F5EEE4]/40 dark:hover:bg-white/5 dark:hover:text-[#F5EEE4] dark:[&.active]:bg-[#FED45C]/10 dark:[&.active]:text-[#F5EEE4]'
          : 'flex flex-1 flex-col items-center gap-0.5 py-2 text-[#331400]/50 [&.active]:text-[#331400] dark:text-[#F5EEE4]/40 dark:[&.active]:text-[#F5EEE4]'
      }
    >
      <Icon className="h-5 w-5" />
      <span className="text-[10px] font-medium">{item.label}</span>
    </Link>
  )
}

export function DashboardLayout() {
  const navigate = useNavigate()
  const logoutMutation = useLogout()

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate({ to: '/auth/sign-in' }),
    })
  }

  return (
    <div className="flex min-h-screen bg-[#FEF4EA] dark:bg-[#1C1611]">
      <aside className="hidden w-20 shrink-0 flex-col items-center border-r border-[#331400]/10 bg-white py-6 md:flex dark:border-[#F5EEE4]/10 dark:bg-[#20160f]">
        <Link to="/" className="mb-6 flex items-center justify-center">
          <img src="/icons/A.bio.svg" alt="A.Bio" width={28} height={28} />
        </Link>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} item={item} orientation="vertical" />
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="flex flex-col items-center gap-1 rounded-xl px-3 py-2.5 text-[#331400]/50 hover:bg-[#331400]/5 hover:text-[#331400] disabled:opacity-50 dark:text-[#F5EEE4]/40 dark:hover:bg-white/5 dark:hover:text-[#F5EEE4]"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-[10px] font-medium">Logout</span>
        </button>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <main className="flex-1 overflow-x-hidden p-4 pb-20 md:p-8 md:pb-8">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-[#331400]/10 bg-white md:hidden dark:border-[#F5EEE4]/10 dark:bg-[#20160f]">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} item={item} orientation="horizontal" />
        ))}
      </nav>
    </div>
  )
}
