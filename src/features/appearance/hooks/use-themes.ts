import { useQuery } from '@tanstack/react-query'

import { getThemes } from '@/features/appearance/api/appearance.api'
import { queryKeys } from '@/shared/lib/query-keys'

/** Public preset theme gallery (no auth required) — used by the marketing template page. */
export function useGetThemes() {
  return useQuery({
    queryKey: queryKeys.themes,
    queryFn: async () => {
      const res = await getThemes()
      return res.data
    },
  })
}
