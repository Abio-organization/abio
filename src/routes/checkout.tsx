import { createFileRoute } from '@tanstack/react-router'
import { Checkout } from '@/features/commerce/Checkout'
export const Route = createFileRoute('/checkout')({ component: Checkout })
