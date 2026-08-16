import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { checkUsername } from '@/features/profile/api/profile.api'

const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/

interface UseUsernameAvailabilityResult {
  isChecking: boolean
  isAvailable: boolean | null
}

/**
 * Debounces `username` before hitting the real availability endpoint. `currentUsername`
 * is treated as always-available so editing an already-owned username doesn't self-reject.
 */
export function useUsernameAvailability(username: string, currentUsername?: string | null): UseUsernameAvailabilityResult {
  const [debounced, setDebounced] = useState(username)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(username), 400)
    return () => clearTimeout(timer)
  }, [username])

  const isValidShape = debounced.length >= 3 && debounced.length <= 30 && USERNAME_REGEX.test(debounced)
  const unchanged = Boolean(currentUsername) && debounced === currentUsername

  const query = useQuery({
    queryKey: ['username-availability', debounced],
    queryFn: async ({ signal }) => {
      const res = await checkUsername(debounced, signal)
      return res.data
    },
    enabled: isValidShape && !unchanged,
    staleTime: 30_000,
  })

  return {
    isChecking: isValidShape && !unchanged && query.isFetching,
    isAvailable: unchanged ? true : (query.data?.isAvailable ?? null),
  }
}
