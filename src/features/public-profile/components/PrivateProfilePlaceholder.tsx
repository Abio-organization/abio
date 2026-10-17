import { Lock, MapPin, User as UserIcon } from "lucide-react";

import { getPlatformIcon } from "@/shared/components/PlatformIcon";

const PLACEHOLDER_LINKS = [
  { platform: "whatsapp", label: "WhatsApp" },
  { platform: "instagram", label: "Instagram" },
  { platform: "snapchat", label: "Snapchat" },
  { platform: "pinterest", label: "Pinterest" },
  { platform: "tiktok", label: "Tiktok" },
];

/** Shown for both "profile not found" and "profile is private" — the API deliberately returns the same 404 for either, so we can't (and shouldn't) tell them apart. */
export function PrivateProfilePlaceholder() {
  return (
    <main className="fixed inset-0 overflow-y-auto bg-gradient-to-b from-[#FBD9E4] to-[#FDEFF3]">
      <div className="mx-auto flex min-h-full w-full max-w-sm flex-col px-5 pt-12 pb-10 sm:max-w-md sm:pt-16">
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-neutral-100 shadow-md sm:h-20 sm:w-20">
            <UserIcon className="h-7 w-7 text-neutral-400 sm:h-9 sm:w-9" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold text-neutral-900 sm:text-2xl">
              Your Name
            </h1>
            <p className="truncate text-sm font-medium text-neutral-400 sm:text-base">
              @yourname
            </p>
          </div>
        </div>

        <p className="mt-5 text-base font-bold text-neutral-900 sm:text-lg">
          Write a Short Bio for yourself
        </p>

        <div className="mt-3 flex w-fit items-center gap-1.5 border border-neutral-300 bg-white/70 px-3 py-1.5">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-500" />
          <span className="text-xs font-medium text-neutral-500 sm:text-sm">
            Your Location
          </span>
        </div>

        <div className="mt-7 flex flex-col">
          <span className="text-sm font-medium text-black">Links</span>
          <div className="mt-1 h-[3px] w-8 bg-red-500" />
        </div>

        <div className="relative mt-4 flex-1">
          <div className="space-y-3 blur-[1.5px]" aria-hidden="true">
            {PLACEHOLDER_LINKS.map(({ platform, label }) => (
              <div
                key={platform}
                className="flex items-center gap-3 rounded-full bg-white/60 px-4 py-3 opacity-50"
              >
                {getPlatformIcon(platform, "h-5 w-5 shrink-0 text-neutral-700")}
                <span className="text-sm font-medium text-neutral-600">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4">
            <Lock className="h-9 w-9 text-neutral-800" strokeWidth={1.5} />
            <span className="rounded-full bg-white px-4 py-2 text-center text-sm font-semibold text-neutral-800 shadow-md">
              This Account Is Private
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
