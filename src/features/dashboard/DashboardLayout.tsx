import { Link, Outlet } from '@tanstack/react-router'

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3 text-sm">
          <Link to="/dashboard" className="font-semibold text-neutral-900">
            Dashboard
          </Link>
          <Link
            to="/dashboard/appearance"
            className="text-neutral-600 hover:text-neutral-900 [&.active]:font-medium [&.active]:text-neutral-900"
          >
            Appearance
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl p-4">
        <Outlet />
      </main>
    </div>
  )
}
