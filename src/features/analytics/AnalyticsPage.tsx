import { useMemo, useState } from 'react'
import { RefreshCw, Share2 } from 'lucide-react'

import { useAuthStore } from '@/features/auth/store/auth-store'
import { useGetAllLinks } from '@/features/links'
import { getPlatformIcon } from '@/shared/components/PlatformIcon'
import { toast } from '@/shared/lib/toast'
import { getApiErrorMessage } from '@/shared/lib/api-error'

import { useAnalyticsDaily, useAnalyticsLinks, useAnalyticsSummary } from './hooks'
import type { AnalyticsRange } from './api'

const card = ' border border-[#331400]/10 bg-white p-5 sm:p-6 dark:border-[#F5EEE4]/10 dark:bg-[#20160f]'
const muted = 'text-[#331400]/55 dark:text-[#F5EEE4]/55'
const number = new Intl.NumberFormat()

type ViewRange = AnalyticsRange | 'all'

const RANGES: Array<{ value: ViewRange; label: string }> = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: 'all', label: 'All time' },
]

/** clicks / views as a bounded, readable percentage. */
function clickRatePercent(views: number, clicks: number) {
  if (views <= 0) return '0%'
  return `${Math.round((clicks / views) * 100)}%`
}

function weekdayLabel(isoDate: string) {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })
}

function dayMonthLabel(isoDate: string) {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-US', { day: 'numeric', month: 'short', timeZone: 'UTC' })
}

/** Best-effort platform guess from a link's URL/title, for the row icon. */
function guessPlatform(text: string) {
  const haystack = text.toLowerCase()
  const known = [
    'tiktok', 'instagram', 'linkedin', 'youtube', 'facebook', 'twitch', 'discord',
    'spotify', 'reddit', 'pinterest', 'medium', 'snapchat', 'telegram', 'whatsapp', 'github',
  ]
  for (const key of known) {
    if (haystack.includes(key)) return key
  }
  if (haystack.includes('twitter') || haystack.includes('x.com')) return 'twitter'
  return 'custom'
}

interface AudienceRow {
  id: string
  label: string
  clicks: number
  platform: string
}

export function AnalyticsPage() {
  const user = useAuthStore((s) => s.user)
  const [range, setRange] = useState<ViewRange>('7d')
  const [metric, setMetric] = useState<'clicks' | 'share'>('clicks')

  const isAllTime = range === 'all'
  const apiRange: AnalyticsRange = isAllTime ? '30d' : range

  const summary = useAnalyticsSummary(apiRange, !isAllTime)
  const daily = useAnalyticsDaily(apiRange, !isAllTime)
  const links = useAnalyticsLinks(apiRange, !isAllTime)
  const allLinks = useGetAllLinks()

  const username = user?.profile?.username ?? null
  const profileUrl = username ? `${window.location.origin}/${username}` : ''

  const isFetching =
    (isAllTime ? allLinks.isFetching : summary.isFetching || daily.isFetching || links.isFetching)
  const refetchAll = () => {
    if (isAllTime) {
      void allLinks.refetch()
      return
    }
    void summary.refetch()
    void daily.refetch()
    void links.refetch()
  }

  const days = useMemo(() => daily.data?.days ?? [], [daily.data])
  const chartMax = useMemo(
    () => Math.max(1, ...days.flatMap((d) => [d.views, d.clicks])),
    [days],
  )

  // Lifetime totals come from the counters the backend keeps on the profile /
  // each link — there's no lifetime day-by-day series to chart.
  const lifetimeViews = user?.profile?.viewCount ?? 0
  const lifetimeClicks = useMemo(
    () => (allLinks.data ?? []).reduce((sum, link) => sum + Math.max(0, link.clickCount || 0), 0),
    [allLinks.data],
  )

  const totals = isAllTime
    ? { views: lifetimeViews, clicks: lifetimeClicks }
    : { views: summary.data?.views ?? 0, clicks: summary.data?.clicks ?? 0 }

  const audienceRows: AudienceRow[] = useMemo(() => {
    if (isAllTime) {
      return (allLinks.data ?? [])
        .map((link) => ({
          id: link.id,
          label: link.title,
          clicks: Math.max(0, link.clickCount || 0),
          platform: guessPlatform(`${link.url} ${link.title} ${link.platform}`),
        }))
        .filter((row) => row.clicks > 0)
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 20)
    }
    return (links.data?.links ?? []).map((link) => ({
      id: link.linkId,
      label: link.title,
      clicks: link.clicks,
      platform: guessPlatform(`${link.url ?? ''} ${link.title}`),
    }))
  }, [isAllTime, allLinks.data, links.data])

  const totalRowClicks = audienceRows.reduce((sum, row) => sum + row.clicks, 0)

  const audiencePending = isAllTime ? allLinks.isPending : links.isPending
  const audienceError = isAllTime ? allLinks.error : links.error
  const audienceIsError = isAllTime ? allLinks.isError : links.isError
  const summaryPending = isAllTime ? allLinks.isPending : summary.isPending
  const summaryError = isAllTime ? allLinks.error : summary.error
  const summaryIsError = isAllTime ? allLinks.isError : summary.isError

  const rangeLabel = range === '7d' ? 'the last 7 days' : range === '30d' ? 'the last 30 days' : 'all time'

  const handleShare = async () => {
    if (!profileUrl) return
    try {
      if (navigator.share) {
        await navigator.share({ title: user?.name ?? 'My Abio', url: profileUrl })
        return
      }
      await navigator.clipboard.writeText(profileUrl)
      toast.success('Profile link copied')
    } catch {
      /* user dismissed the share sheet — nothing to do */
    }
  }

  return (
    <main className="mx-auto w-full space-y-6 pb-24 text-[#331400] dark:text-[#F5EEE4]">
      {/* Profile summary */}
      <section className=" bg-[#F7F5F2] p-5 sm:p-6 dark:bg-white/5" aria-label="Your profile">
        <div className="mb-4 flex items-center gap-3">
          {user?.profile?.avatarUrl ? (
            <img src={user.profile.avatarUrl} alt="" className="h-14 w-14  object-cover" />
          ) : (
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#FED45C] text-lg font-semibold text-[#331400]">
              {user?.name?.slice(0, 1) || 'A'}
            </span>
          )}
          <div className="min-w-0">
            <h2 className="truncate font-semibold">{user?.name || 'Your profile'}</h2>
            <p className={`truncate text-sm ${muted}`}>{user?.profile?.bio || 'Your links. Your audience.'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1 truncate  border border-[#331400]/10 bg-white px-4 py-3 text-sm dark:border-[#F5EEE4]/10 dark:bg-[#20160f]">
            {profileUrl ? (
              <a href={profileUrl} target="_blank" rel="noreferrer" className="hover:underline">
                {profileUrl.replace(/^https?:\/\//, '')}
              </a>
            ) : (
              <span className={muted}>Set a username to share your profile</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => void handleShare()}
            disabled={!profileUrl}
            aria-label="Share profile link"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#331400] text-[#FED45C] disabled:opacity-40 dark:bg-[#FED45C] dark:text-[#331400]"
          >
            <Share2 className="h-4.5 w-4.5" />
          </button>
        </div>
      </section>

      {/* Heading + controls */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold sm:text-3xl">Analytics</h1>
        <div className="flex items-center gap-2">
          <div className="flex border border-[#331400]/15 p-0.5 text-sm dark:border-[#F5EEE4]/15">
            {RANGES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setRange(option.value)}
                aria-pressed={range === option.value}
                className={` px-3 py-1.5 transition-colors ${
                  range === option.value
                    ? 'bg-[#331400] text-[#F5EEE4] dark:bg-[#FED45C] dark:text-[#331400]'
                    : muted
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={refetchAll}
            disabled={isFetching}
            className="flex items-center gap-2 border border-[#331400]/15 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-[#F5EEE4]/15"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </header>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        {/* Overview: summary + daily chart */}
        <section className={card} aria-labelledby="overview-title">
          <h2 id="overview-title" className="text-xl font-medium">Overview</h2>
          <p className={`mt-1 text-sm ${muted}`}>Views, clicks and click rate over {rangeLabel}</p>

          {summaryPending ? (
            <div className="my-6 h-24 animate-pulse rounded-xl bg-[#331400]/5 dark:bg-white/5" role="status" />
          ) : summaryIsError ? (
            <p className="my-6 text-sm text-[#EA2228]" role="alert">{getApiErrorMessage(summaryError)}</p>
          ) : (
            <div className="my-6 grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { title: 'Views', value: number.format(totals.views) },
                { title: 'Clicks', value: number.format(totals.clicks) },
                { title: 'Click Rate', value: clickRatePercent(totals.views, totals.clicks) },
              ].map(({ title, value }) => (
                <div key={title} className="min-w-0 rounded-xl border border-[#331400]/10 bg-[#FED45C]/10 px-1 py-4 text-center dark:border-[#F5EEE4]/10">
                  <p className="break-all text-xl font-semibold sm:text-2xl">{value}</p>
                  <p className={`mt-1 text-xs ${muted}`}>{title}</p>
                </div>
              ))}
            </div>
          )}

          {isAllTime ? (
            <p className={`rounded-xl border border-dashed border-[#331400]/15 px-4 py-8 text-center text-sm dark:border-[#F5EEE4]/15 ${muted}`}>
              Day-by-day trends are available for the 7 and 30 day ranges.
            </p>
          ) : (
            <>
              <div className="mb-3 flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5  bg-[#331400] dark:bg-[#F5EEE4]" />Views</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5  bg-[#FED45C]" />Clicks</span>
              </div>

              {daily.isPending ? (
                <div className="h-44 animate-pulse  bg-[#331400]/5 dark:bg-white/5" role="status" />
              ) : daily.isError ? (
                <p className="text-sm text-[#EA2228]" role="alert">{getApiErrorMessage(daily.error)}</p>
              ) : (
                <div
                  className="flex h-44 gap-1 sm:gap-1.5"
                  role="img"
                  aria-label={days.map((d) => `${d.date}: ${d.views} views, ${d.clicks} clicks`).join('; ')}
                >
                  {days.map((d, index) => {
                    const showLabel = range === '7d' || index % 5 === 0
                    return (
                      <div key={d.date} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                        <div className="flex w-full flex-1 items-end justify-center gap-0.75">
                          <div
                            className="w-1/3 min-w-0.75  bg-[#331400] dark:bg-[#F5EEE4]"
                            style={{ height: `${d.views ? Math.max(3, (d.views / chartMax) * 100) : 0}%` }}
                          />
                          <div
                            className="w-1/3 min-w-0.75  bg-[#FED45C]"
                            style={{ height: `${d.clicks ? Math.max(3, (d.clicks / chartMax) * 100) : 0}%` }}
                          />
                        </div>
                        <span className={`h-3 truncate text-[10px] ${muted}`}>
                          {showLabel ? (range === '7d' ? weekdayLabel(d.date) : dayMonthLabel(d.date)) : ''}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </section>

        {/* Audience / link performance */}
        <section className={card} aria-labelledby="audience-title">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="audience-title" className="text-xl font-medium">Audience</h2>
              <p className={`mt-1 text-sm ${muted}`}>Link performance</p>
            </div>
            <select
              aria-label="Link metric"
              value={metric}
              onChange={(e) => setMetric(e.target.value as 'clicks' | 'share')}
              className=" border border-[#331400]/15 bg-transparent px-3 py-1.5 text-sm dark:border-[#F5EEE4]/15"
            >
              <option value="clicks">Clicks</option>
              <option value="share">Click share</option>
            </select>
          </div>

          {audiencePending ? (
            <div className="space-y-3" role="status">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse  bg-[#331400]/5 dark:bg-white/5" />
              ))}
            </div>
          ) : audienceIsError ? (
            <p className="text-sm text-[#EA2228]" role="alert">{getApiErrorMessage(audienceError)}</p>
          ) : audienceRows.length === 0 ? (
            <p className={`py-10 text-center text-sm ${muted}`}>
              No link clicks {isAllTime ? 'yet' : 'in this range yet'}. Share your profile to start seeing activity here.
            </p>
          ) : (
            <ul className="space-y-3">
              {audienceRows.map((row) => (
                <li key={row.id} className="flex items-center gap-3  border border-[#331400]/10 p-3 dark:border-[#F5EEE4]/10">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FED45C]/20">
                    {getPlatformIcon(row.platform, 'h-4 w-4')}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm">{row.label}</span>
                  <span className={`shrink-0 text-xs ${muted}`}>
                    {metric === 'share'
                      ? `${totalRowClicks ? Math.round((row.clicks / totalRowClicks) * 100) : 0}%`
                      : `${number.format(row.clicks)} ${row.clicks === 1 ? 'click' : 'clicks'}`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
