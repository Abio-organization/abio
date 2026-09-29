import { useEffect, useState } from "react"
import { Bell, Loader2, Lock, User as UserIcon } from "lucide-react"

import { useCurrentUser } from "@/features/auth/hooks/use-auth"

import { AccountSection } from "./AccountSection"
import { NotificationsSection } from "./NotificationsSection"
import { PrivacySection } from "./PrivacySection"

type Tab = "account" | "privacy" | "notifications"

const TABS: Array<{
  value: Tab
  label: string
  Icon: typeof UserIcon
}> = [
  { value: "account", label: "Account", Icon: UserIcon },
  { value: "privacy", label: "Privacy", Icon: Lock },
  { value: "notifications", label: "Notifications", Icon: Bell },
]

export function SettingsPage({
  initialSection = "account",
}: {
  initialSection?: Tab
}) {
  const { data: user, isLoading } = useCurrentUser()
  const [tab, setTab] = useState<Tab>(initialSection)

  useEffect(() => {
    setTab(initialSection)
  }, [initialSection])

  return (
    <main className="flex h-full min-h-0 w-full max-w-7xl flex-col overflow-hidden text-[#331400] dark:text-[#F5EEE4]">
      {/* Fixed header */}
      <header className="shrink-0 pb-6">
        <p className="mb-1 text-xs font-semibold tracking-[0.2em] text-[#331400]/45 uppercase dark:text-[#F5EEE4]/45">
          Settings
        </p>

        <h1 className="text-2xl font-semibold sm:text-3xl">
          Account settings
        </h1>

        <p className="mt-1 text-sm text-[#331400]/55 dark:text-[#F5EEE4]/55">
          Manage your account preferences
        </p>
      </header>

      {/* Everything below the header can scroll */}
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-hidden md:flex-row md:items-start">
        {/* Tabs */}
        <nav
          aria-label="Settings sections"
          className="flex shrink-0 gap-1 overflow-x-auto border-b border-[#331400]/10 pb-2 md:w-44 md:flex-col md:gap-0.5 md:overflow-visible md:border-b-0 md:border-r md:pr-4 md:pb-0 dark:border-[#F5EEE4]/10"
        >
          {TABS.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              aria-current={tab === value ? "page" : undefined}
              className={`flex shrink-0 items-center gap-2 border-l-2 px-3 py-2 text-left text-sm font-medium whitespace-nowrap transition-colors ${
                tab === value
                  ? "border-[#331400] bg-[#331400]/5 text-[#331400] dark:border-[#FED45C] dark:bg-white/5 dark:text-[#F5EEE4]"
                  : "border-transparent text-[#331400]/55 hover:bg-[#331400]/5 dark:text-[#F5EEE4]/55 dark:hover:bg-white/5"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* SCROLLABLE TAB CONTENT */}
        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain pr-1 pb-24">
          {isLoading || !user ? (
            <div
              className="flex justify-center py-16"
              role="status"
            >
              <Loader2 className="h-6 w-6 animate-spin text-[#331400]/50 dark:text-[#F5EEE4]/50" />
            </div>
          ) : (
            <>
              {tab === "account" && (
                <AccountSection user={user} />
              )}

              {tab === "privacy" && <PrivacySection />}

              {tab === "notifications" && (
                <NotificationsSection />
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}
