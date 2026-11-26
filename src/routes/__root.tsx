import { Outlet, createRootRoute } from '@tanstack/react-router'

import { NotFoundPage } from '@/features/landing/components/NotFoundPage'

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
})

function RootLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  )
}
