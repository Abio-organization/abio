import { Footer } from '@/features/landing/components/Footer'
import { NavBar } from '@/features/landing/components/NavBar'
import { NotFoundContent } from '@/shared/components/NotFoundContent'

/** Global 404 — rendered for any route not matched anywhere in the tree (see src/routes/__root.tsx). */
export function NotFoundPage() {
  return (
    <section className="flex min-h-screen flex-col overflow-x-hidden bg-[#FEF4EA] dark:bg-[#1C1611]">
      <NavBar />
      <main className="flex flex-1 flex-col items-center justify-center pt-32 pb-16 md:pt-36">
        <NotFoundContent />
      </main>
      <Footer />
    </section>
  )
}
