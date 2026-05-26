import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Abio</h1>
      <p className="text-neutral-600">Link-in-bio — Vite rebuild scaffold.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          to="/dashboard"
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
        >
          Dashboard
        </Link>
        <Link
          to="/auth/sign-in"
          className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium"
        >
          Sign in
        </Link>
      </div>
    </main>
  )
}
