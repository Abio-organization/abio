import { createFileRoute } from '@tanstack/react-router'

import { Footer, NavBar } from '@/features/landing'

/**
 * Placeholder — the full store/onboarding flow (product config, links,
 * payment, checkout) is a separate, larger feature not built yet. This
 * exists so nav links and CTAs pointing here resolve to something real
 * instead of a broken route.
 */
function StorePage() {
  return (
    <main className="min-h-screen bg-[#FEF4EA]">
      <NavBar />
      <div className="flex min-h-screen flex-col items-center justify-center px-4 pt-24 text-center">
        <h1 className="font-display text-[40px] font-[400] text-[#5D2D2B] md:text-[56px]">Coming soon</h1>
        <p className="mt-4 max-w-md text-sm text-[#5D2D2B]/70">
          The Acard store is on its way. Check back soon to order your custom NFC card.
        </p>
      </div>
      <Footer />
    </main>
  )
}

export const Route = createFileRoute('/store')({
  component: StorePage,
})
