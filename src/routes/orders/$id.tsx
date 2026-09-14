import { createFileRoute } from '@tanstack/react-router'
import { OrderDetail } from '@/features/commerce/Orders'
export const Route = createFileRoute('/orders/$id')({
  component: function RouteComponent() {
    const { id } = Route.useParams()
    return <OrderDetail id={id} />
  },
})
