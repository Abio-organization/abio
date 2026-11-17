import { Link } from "@tanstack/react-router";

export function ProfileNotFoundPlaceholder() {
  return (
    <main className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-[#FEF4EA] px-6 text-center">
      <img
        src="/images/not-found.svg"
        alt=""
        width={460}
        height={360}
        className="h-auto w-48 sm:w-60"
      />

      <div className="space-y-1">
        <h1 className="text-xl font-bold text-[#331400] sm:text-2xl">
          This page doesn&apos;t exist
        </h1>
        <p className="text-sm text-neutral-500 sm:text-base">
          The username you&apos;re looking for isn&apos;t on Abio.
        </p>
      </div>

      <Link
        to="/"
        className="mt-2 bg-[#FED45C] shadow-[2px_2px_0px_0px_#000000] px-5 py-3 text-xs font-semibold text-[#331400] transition hover:bg-[#4a2207] hover:text-white sm:text-sm"
      >
        Go to Abio
      </Link>
    </main>
  );
}