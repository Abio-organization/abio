import { createRouter } from '@tanstack/react-router'

import { RouteErrorFallback } from '@/app/RouteErrorFallback'
import { routeTree } from '@/routeTree.gen'

export const router = createRouter({
  routeTree,
  defaultErrorComponent: RouteErrorFallback,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
