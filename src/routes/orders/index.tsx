import { createFileRoute } from '@tanstack/react-router'
import { Orders } from '@/features/commerce/Orders'
export const Route = createFileRoute('/orders/')({ component: Orders })
