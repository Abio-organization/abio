import { createFileRoute } from '@tanstack/react-router'
import { ProductPage } from '@/features/commerce/Product'
export const Route = createFileRoute('/store/$slug')({
  validateSearch: (search: Record<string, unknown>): { from?: '/dashboard/store' | '/store' | '/' } => ({
    from: search.from === '/dashboard/store' || search.from === '/store' || search.from === '/' ? search.from : undefined,
  }),
  component: function RouteComponent() {
    const { slug } = Route.useParams()
    const { from } = Route.useSearch()
    return <ProductPage slug={slug} back={from ?? '/store'} />
  },
})
