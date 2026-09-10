import { apiClient } from '@/shared/lib/api-client'
import type { ApiResponse } from '@/shared/types'

/** UTC window ending today. Mirrors the backend enum (src/modules/analytics/analytics.schemas.ts). */
export type AnalyticsRange = '7d' | '30d'

export interface AnalyticsSummary {
  range: AnalyticsRange
  /** UTC calendar date, `YYYY-MM-DD`. */
  from: string
  to: string
  views: number
  clicks: number
  /** `clicks / views`, 0 when there are no views. Multiply by 100 for a percentage. */
  clickRate: number
}

export interface AnalyticsDailyPoint {
  /** `YYYY-MM-DD` (UTC). */
  date: string
  views: number
  clicks: number
}

export interface AnalyticsDaily {
  range: AnalyticsRange
  from: string
  to: string
  /** Full series — missing days are filled with 0. Length 7 or 30. */
  days: AnalyticsDailyPoint[]
}

export interface AnalyticsTopLink {
  linkId: string
  title: string
  url: string | null
  clicks: number
}

export interface AnalyticsLinks {
  range: AnalyticsRange
  from: string
  to: string
  /** Sorted by clicks desc, top ~20. */
  links: AnalyticsTopLink[]
}

export async function getAnalyticsSummary(range: AnalyticsRange) {
  const { data } = await apiClient.get<ApiResponse<AnalyticsSummary>>('/analytics/summary', {
    params: { range },
  })
  return data.data
}

export async function getAnalyticsDaily(range: AnalyticsRange) {
  const { data } = await apiClient.get<ApiResponse<AnalyticsDaily>>('/analytics/daily', {
    params: { range },
  })
  return data.data
}

export async function getAnalyticsLinks(range: AnalyticsRange) {
  const { data } = await apiClient.get<ApiResponse<AnalyticsLinks>>('/analytics/links', {
    params: { range },
  })
  return data.data
}

/**
 * Fire-and-forget public profile view ping — unauthenticated, must never block
 * the profile page or surface errors to the viewer. Call once on profile mount;
 * the backend does not dedupe views in v1.
 */
export async function trackProfileView(username: string) {
  await apiClient.post(`/public/profiles/${encodeURIComponent(username)}/view`)
}
