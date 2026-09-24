import type { ReactNode } from 'react'
import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { LogOut, Settings as SettingsIcon } from "lucide-react";
import { useLogout } from "@/features/auth/hooks/use-auth";
import { Moon, Sun } from 'lucide-react'

import { useTheme } from '@/shared/hooks/use-theme'

interface NavItem {
  title: string;
  url: string;
  /** Either an svg asset pair, or a lucide icon (no matching asset exists for every entry). */
  icon?: string;
  activeIcon?: string;
  Icon?: typeof SettingsIcon;
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
  {
    title: "Settings",
    url: "/dashboard/settings",
    Icon: SettingsIcon,
  },
];

function NavLink({
  item,
  orientation,
}: {
  item: NavItem;
  orientation: "vertical" | "horizontal";
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
            <item.Icon className="h-6 w-6 shrink-0" strokeWidth={isActive ? 2.25 : 1.75} />
          ) : (
            <img
              src={isActive ? item.activeIcon : item.icon}
              alt={item.title}
              className="h-8 w-8 object-contain dark:invert"
            />
          )}
          <span className="text-[10px] font-medium">{item.title}</span>
        </>
      )}
    </Link>
  );
}

export function DashboardLayout({ children }: { children?: ReactNode }) {
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const { theme, toggleTheme } = useTheme()

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate({ to: "/auth/sign-in" }),
    });
  };

  return (
    <div className="flex min-h-screen bg-[#FFFFFF] dark:bg-[#1C1611]">
      <aside className="hidden w-30 shrink-0 flex-col items-center border-r border-[#331400]/10 bg-white py-6 md:flex dark:border-[#F5EEE4]/10 dark:bg-[#20160f]">
        <Link to="/" className="mb-15 flex items-center justify-center">
          <img src="/icons/A.bio.svg" alt="A.Bio" width={38} height={38} />
        </Link>

        <nav className="flex flex-1 flex-col gap-6">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.url} item={item} orientation="vertical" />
          ))}
        </nav>
        <button
          onClick={toggleTheme}
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          className="flex h-9 w-9 shrink-0 items-center dark:text-[#F5EEE4] justify-center text-[#331400]/50 transition-colors hover:bg-black/10 dark:hover:bg-white/10 mb-4"
        >
          {theme === "dark" ? (
            <Sun className="h-4.5 w-4.5" />
          ) : (
            <Moon className="h-4.5 w-4.5" />
          )}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="flex flex-col items-center gap-1  px-3 py-2.5 text-[#331400]/50 hover:bg-[#331400]/5 hover:text-[#331400] disabled:opacity-50 dark:text-[#F5EEE4]/40 dark:hover:bg-white/10 dark:hover:text-[#F5EEE4]"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-[10px] font-medium">Logout</span>
        </button>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <main className="flex-1 overflow-x-hidden p-4 pb-20 md:p-8 md:pb-8">
          {children ?? <Outlet />}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t-1 border-[#331400] bg-white dark:bg-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl backdrop-saturate-150  md:hidden">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.url} item={item} orientation="horizontal" />
        ))}
      </nav>
    </div>
  );
}
