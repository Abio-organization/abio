import { NotFoundContent } from '@/shared/components/NotFoundContent'

/** 404 for an unmatched /dashboard/* path — renders inside DashboardLayout's <Outlet />, so the sidebar/mobile nav stays visible. */
export function DashboardNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <NotFoundContent homeHref="/dashboard" homeLabel="Go back to dashboard" />
    </div>
  )
}
