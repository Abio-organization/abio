import { Link } from "@tanstack/react-router";
import { SearchX } from "lucide-react";

export function ProfileNotFoundPlaceholder() {
  return (
    <main className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-[#FEF4EA] px-6 text-center">
      <SearchX className="h-10 w-10 text-neutral-400" strokeWidth={1.5} />
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
        className="mt-2 bg-[#331400] px-5 py-3 text-xs font-semibold text-white shadow-lg transition hover:bg-[#4a2207] sm:text-sm"
      >
        Go to Abio
      </Link>
    </main>
  );
}
