import { useEffect, useRef, useState, type ReactNode } from "react"
import { Link, Outlet, useNavigate } from "@tanstack/react-router"
import {
  Bell,
  CreditCard,
  LogOut,
  MoreHorizontal,
  Settings as SettingsIcon,
  UserRound,
} from "lucide-react"

import { Moon, Sun } from "lucide-react"

import { useLogout } from "@/features/auth/hooks/use-auth"
import { useAuthUser } from "@/features/auth"
import { useTheme } from "@/shared/hooks/use-theme"

interface NavItem {
  title: string
  url: string
  icon?: string
  activeIcon?: string
  Icon?: typeof SettingsIcon
}

const NAV_ITEMS: NavItem[] = [
  {
    title: "My Abio",
    url: "/dashboard",
    icon: "/icons/dashboard.svg",
    activeIcon: "/icons/dashboard-fill.svg",
  },
  {
    title: "Appearance",
    url: "/dashboard/appearance",
    icon: "/icons/appearance.svg",
    activeIcon: "/icons/appearance-fill.svg",
  },
  {
    title: "Analytics",
    url: "/dashboard/statistics",
    icon: "/icons/statistics.svg",
    activeIcon: "/icons/statistics-fill.svg",
  },
  {
    title: "Store",
    url: "/dashboard/store",
    icon: "/icons/store.svg",
    activeIcon: "/icons/store-fill.svg",
  },
]

function NavLink({
  item,
  orientation,
}: {
  item: NavItem
  orientation: "vertical" | "horizontal"
}) {
  return (
    <Link
      to={item.url}
      activeOptions={{ exact: item.url === "/dashboard" }}
      className={
        orientation === "vertical"
          ? "group flex flex-col items-center gap-1 px-3 py-2.5 text-[#331400]/50 hover:bg-[#331400]/5 hover:text-[#331400] [&.active]:bg-[#FED45C]/20 [&.active]:text-[#331400] dark:text-[#F5EEE4]/40 dark:hover:bg-white/5 dark:hover:text-[#F5EEE4] dark:[&.active]:bg-[#FED45C]/10 dark:[&.active]:text-[#F5EEE4]"
          : "flex flex-1 flex-col items-center gap-0.5 py-2 text-[#331400]/50 [&.active]:text-[#331400] dark:text-[#F5EEE4]/40 dark:[&.active]:text-[#F5EEE4]"
      }
    >
      {({ isActive }) => (
        <>
          {item.Icon ? (
            <item.Icon
              className="h-6 w-6 shrink-0"
              strokeWidth={isActive ? 2.25 : 1.75}
            />
          ) : (
            <img
              src={isActive ? item.activeIcon : item.icon}
              alt={item.title}
              className="h-8 w-8 object-contain dark:invert"
            />
          )}

          <span className="text-[10px] font-medium">
            {item.title}
          </span>
        </>
      )}
    </Link>
  )
}

function AccountMenu({
  displayName,
  email,
  isLoggingOut,
  onLogout,
}: {
  displayName: string
  email?: string
  isLoggingOut: boolean
  onLogout: () => void
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <div ref={containerRef} className="group relative w-full px-2">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="mx-auto flex h-10 w-10 cursor-pointer list-none items-center justify-center text-[#331400]/60 hover:bg-[#331400]/5 hover:text-[#331400] dark:text-[#F5EEE4]/60 dark:hover:bg-white/5 dark:hover:text-[#F5EEE4]"
      >
        <MoreHorizontal className="h-6 w-6" aria-hidden="true" />
        <span className="sr-only">Open account menu</span>
      </button>

      {open && (
        <div className="absolute bottom-0  left-[calc(100%+0.75rem)] z-50 w-64 overflow-hidden border border-[#331400]/15 bg-white text-[#331400] shadow-xl dark:border-[#F5EEE4]/15 dark:bg-[#20160f] dark:text-[#F5EEE4]">
          <div className="border-b border-[#331400]/10 px-4 py-3 dark:border-[#F5EEE4]/10">
            <p className="truncate text-sm font-semibold">
              {displayName}
            </p>

            <p className="truncate text-xs text-[#331400]/55 dark:text-[#F5EEE4]/55">
              {email}
            </p>
          </div>

          <nav aria-label="Account menu" className="py-1">
            <Link
              to="/dashboard"
              onClick={close}
              className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#331400]/5 dark:hover:bg-white/5"
            >
              <UserRound className="h-4 w-4" />
              Profile
            </Link>

            <Link
              to="/dashboard/settings"
              search={{ section: "notifications" }}
              onClick={close}
              className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#331400]/5 dark:hover:bg-white/5"
            >
              <Bell className="h-4 w-4" />
              Notifications
            </Link>

            <Link
              to="/orders"
              onClick={close}
              className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#331400]/5 dark:hover:bg-white/5"
            >
              <CreditCard className="h-4 w-4" />
              Purchase
            </Link>

            <Link
              to="/dashboard/settings"
              search={{ section: "account" }}
              onClick={close}
              className="flex items-center gap-3 border-t border-[#331400]/10 px-4 py-2.5 text-sm hover:bg-[#331400]/5 dark:border-[#F5EEE4]/10 dark:hover:bg-white/5"
            >
              <SettingsIcon className="h-4 w-4" />
              Account Settings
            </Link>

            <button
              type="button"
              onClick={() => {
                close()
                onLogout()
              }}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 border-t border-[#331400]/10 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-500/5 disabled:opacity-50 dark:border-[#F5EEE4]/10 dark:text-red-400"
            >
              <LogOut className="h-4 w-4" />

              {isLoggingOut ? "Signing out…" : "Sign Out"}
            </button>
          </nav>
        </div>
      )}
    </div>
  )
}

export function DashboardLayout({
  children,
}: {
  children?: ReactNode
}) {
  const navigate = useNavigate()
  const logoutMutation = useLogout()
  const user = useAuthUser()
  const { theme, toggleTheme } = useTheme()

  const displayName =
    user?.name?.trim() ||
    user?.email?.split("@")[0] ||
    "Your account"

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate({ to: "/auth/sign-in" }),
    })
  }

  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-[#FFFFFF] dark:bg-[#1C1611]">
      {/* Desktop sidebar */}
      <aside className="hidden h-full w-30 shrink-0 flex-col items-center border-r border-[#331400]/10 bg-white py-6 md:flex dark:border-[#F5EEE4]/10 dark:bg-[#20160f]">
        <Link
          to="/"
          className="mb-15 flex items-center justify-center"
        >
          <img
            src="/icons/A.bio.svg"
            alt="A.Bio"
            width={38}
            height={38}
          />
        </Link>

        <nav className="flex min-h-0 flex-1 flex-col gap-6">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.url}
              item={item}
              orientation="vertical"
            />
          ))}
        </nav>

        <button
          onClick={toggleTheme}
          aria-label={
            theme === "dark"
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          className="mb-4 flex h-9 w-9 shrink-0 items-center justify-center text-[#331400]/50 transition-colors hover:bg-black/10 dark:text-[#F5EEE4] dark:hover:bg-white/10"
        >
          {theme === "dark" ? (
            <Sun className="h-4.5 w-4.5" />
          ) : (
            <Moon className="h-4.5 w-4.5" />
          )}
        </button>

        <AccountMenu
          displayName={displayName}
          email={user?.email}
          isLoggingOut={logoutMutation.isPending}
          onLogout={handleLogout}
        />
      </aside>

      {/* Dashboard content */}
      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-4 pb-20 md:p-8 md:pb-8">
          {children ?? <Outlet />}
        </main>
      </div>

      {/* Mobile navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-[#331400] bg-white shadow-[0_-8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl backdrop-saturate-150 dark:bg-white/10 md:hidden">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.url}
            item={item}
            orientation="horizontal"
          />
        ))}
      </nav>
    </div>
  )
}