import { useQuery } from '@tanstack/react-query'

import { getAllLinks } from '@/features/links/api/links.api'
import { queryKeys } from '@/shared/lib/query-keys'

export function useGetAllLinks() {
  return useQuery({
    queryKey: queryKeys.links,
    queryFn: async () => {
      const res = await getAllLinks()
      return res.data
    },
  })
}
