import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { commerce } from './api'
import { syncGuestCart } from './cart-sync'
export function useServerCart() {
  const userId = useAuthStore((s) => s.user?.id)
  return useQuery({
    queryKey: ['commerce', 'cart', userId],
    enabled: !!userId,
    queryFn: async () => {
      await syncGuestCart(userId!)
      return commerce.cart()
    },
    retry: false,
    staleTime: 0,
  })
}
