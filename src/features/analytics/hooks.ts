import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/shared/lib/query-keys'

import {
  getAnalyticsDaily,
  getAnalyticsLinks,
  getAnalyticsSummary,
  type AnalyticsRange,
} from './api'

export function useAnalyticsSummary(range: AnalyticsRange, enabled = true) {
  return useQuery({
    queryKey: queryKeys.analytics.summary(range),
    queryFn: () => getAnalyticsSummary(range),
    enabled,
  })
}

export function useAnalyticsDaily(range: AnalyticsRange, enabled = true) {
  return useQuery({
    queryKey: queryKeys.analytics.daily(range),
    queryFn: () => getAnalyticsDaily(range),
    enabled,
  })
}

export function useAnalyticsLinks(range: AnalyticsRange, enabled = true) {
  return useQuery({
    queryKey: queryKeys.analytics.links(range),
    queryFn: () => getAnalyticsLinks(range),
    enabled,
  })
}
