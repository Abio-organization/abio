import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createLink, getAllLinks, updateLinkIcon } from '@/features/links/api/links.api'
import type { Link } from '@/features/links/types'
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

export function useCreateLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Pick<Link, 'title' | 'url' | 'platform'>) => createLink(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.links })
    },
  })
}

export function useUpdateLinkIcon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => updateLinkIcon(id, file),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.links })
    },
  })
}
