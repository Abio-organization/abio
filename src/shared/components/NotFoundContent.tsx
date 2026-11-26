import { Link } from '@tanstack/react-router'

interface NotFoundContentProps {
  homeHref?: string
  homeLabel?: string
}

/** The "404 / Oops... / Go back to home" block, shared between the landing-chrome and dashboard-chrome 404 pages — only the surrounding header/footer differs. */
export function NotFoundContent({ homeHref = '/', homeLabel = 'Go back to home' }: NotFoundContentProps) {
  return (
    <div className="flex flex-col items-center px-5 text-center">
      <h1 className="text-7xl font-extrabold tracking-tight text-[#331400] sm:text-8xl md:text-9xl dark:text-[#F5EEE4]">
        404
      </h1>
      <h2 className="mt-6 text-2xl font-bold text-[#331400] sm:text-3xl dark:text-[#F5EEE4]">
        Oops... Something went wrong
      </h2>
      <p className="mt-2 text-base text-gray-400 dark:text-[#F5EEE4]/50">
        we can&apos;t find the page you looking for.
      </p>
      <Link
        to={homeHref}
        className="mt-8 bg-[#FED45C] px-8 py-3 text-sm font-bold text-[#331400] shadow-[4px_4px_0px_0px_#000000] transition-shadow duration-200 hover:shadow-[6px_6px_0px_0px_#000000]"
      >
        {homeLabel}
      </Link>
    </div>
  )
}
