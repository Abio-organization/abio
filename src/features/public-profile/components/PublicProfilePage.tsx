import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { QRCodeCanvas } from "qrcode.react";
import { Copy, Share2, X } from "lucide-react";
import { useState, type CSSProperties } from "react";

import { Loader } from "@/shared/components/loader";

import { PhoneDisplay } from "@/shared/components/PhoneDisplay";
import {
  cornerConfigToButtonStyle,
  fontConfigToFontStyle,
  wallpaperToSelectedTheme,
} from "@/features/appearance/lib";
import { trackProfileView } from "@/features/analytics";
import { queryKeys } from "@/shared/lib/query-keys";
import { getPublicProfile } from "@/features/profile/api/profile.api";
import type { PhoneDisplayProfile } from "@/shared/hooks/usePhoneDisplayProps";
import { useEffect, useRef } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { toast } from "@/shared/lib/toast";

interface PublicProfilePageProps {
  username: string;
}

function displayNameForUsername(username: string, fallback: string) {
  if (username === "ootn") return "one of those nights";
  return fallback;
}

function themeForUsername(username: string, displayTheme: string) {
  if (username === "ootn") return "/themes/ootn.jpeg";
  if (username === "dnabygaza") return "/themes/theme7.jpg";
  return displayTheme;
}

function backgroundStyleForTheme(theme: string): CSSProperties {
  if (theme.startsWith("fill:")) {
    return { backgroundColor: theme.slice("fill:".length) };
  }

  if (theme.startsWith("gradient:")) {
    const [, start, end] = theme.split(":");
    return { backgroundImage: `linear-gradient(180deg, ${start}, ${end})` };
  }

  return {
    backgroundImage: `url(${theme})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
}

export function PublicProfilePage({ username }: PublicProfilePageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const profileLink = username ? `${window.location.origin}/${username}` : null;

  // Explicit view tracking — fire-and-forget, once per profile mount. The cached
  // GET profile response deliberately does not count views (see FRONTEND_INTEGRATION_PLAN).
  const trackedUsername = useRef<string | null>(null);
  useEffect(() => {
    if (!username || trackedUsername.current === username) return;
    trackedUsername.current = username;
    void trackProfileView(username).catch(() => {});
  }, [username]);

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.userProfile(username),
    queryFn: async () => {
      const res = await getPublicProfile(username);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FEF4EA]">
        <Loader />
      </div>
    );
  }

  if (isError || !data) {
    return <p className="p-6 text-sm text-red-600">Profile not found.</p>;
  }

  const { links, display, user } = data;
  const displayTheme =
    wallpaperToSelectedTheme(display.wallpaper_config) ||
    display.selected_theme ||
    "/themes/theme1.png";

  const phoneProfile: PhoneDisplayProfile = {
    // The backend's Profile model has no displayName field — the public
    // endpoint returns it as `user.name`, matching the authenticated contract.
    displayName: displayNameForUsername(
      username,
      user.name ?? data.username ?? username,
    ),
    bio: data.bio ?? "",
    location: data.location ?? "",
    avatarUrl: data.avatarUrl,
    username: data.username ?? username,
  };

  const selectedTheme = themeForUsername(username, displayTheme);
  const visibleLinks = links.filter((link) => link.isVisible);

  const handleShare = async (url: string, title: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not share this link");
    }
  };

  const handleCopyProfileLink = async () => {
    if (!profileLink) return;
    try {
      await navigator.clipboard.writeText(profileLink);
      toast.success("Profile link copied");
      setIsShareOpen(false);
    } catch {
      toast.error("Could not copy profile link");
    }
  };

  return (
    <main className="relative h-dvh overflow-hidden bg-[#FEF4EA]">
      <div
        className="absolute inset-0 hidden lg:block"
        style={backgroundStyleForTheme(selectedTheme)}
        aria-hidden="true"
      />

      <div className="absolute left-4 top-4 z-20 hidden md:left-6 md:top-6 lg:block">
        <img
          src="/Abio-logo.png"
          alt="Abio logo"
          className="h-9 w-9 object-contain md:h-11 md:w-11"
        />
      </div>

      <div className="relative z-20 flex h-full w-full items-center justify-center lg:px-6">
        <PhoneDisplay
          buttonStyle={cornerConfigToButtonStyle(display.corner_config)}
          fontStyle={fontConfigToFontStyle(display.font_config)}
          selectedTheme={selectedTheme}
          profile={phoneProfile}
          links={visibleLinks}
          fullBleed
          className="h-dvh w-full md:h-dvh md:w-full lg:h-[600px] lg:w-[300px]"
          profileHeaderClassName="h-[150px]"
          contentClassName="pb-24 lg:pb-3"
          onAvatarClick={
            phoneProfile.avatarUrl ? () => setIsAvatarOpen(true) : undefined
          }
          onShareProfile={() => setIsShareOpen(true)}
          onShareLink={(link) => void handleShare(link.url, link.title)}
        />
      </div>

      <Link
        to="/auth/sign-up"
        className="fixed bottom-4 left-1/2 z-[110] -translate-x-1/2 bg-white px-5 py-3 text-xs font-semibold text-black shadow-lg transition hover:bg-[#4a2207] hover:text-white md:text-sm"
        aria-label={`Join ${username} on Abio`}
      >
        Join {username} on Abio
      </Link>

      {profileLink && (
        <a
          href={profileLink}
          target="_blank"
          rel="noopener noreferrer"
          title="Open this profile"
          aria-label="Open this profile from its QR code"
          className="fixed bottom-4 right-4 z-[100] hidden flex-col items-center gap-1 border border-gray-200 bg-white p-2 shadow-lg md:flex"
        >
          <QRCodeCanvas
            ref={canvasRef}
            value={profileLink}
            size={88}
            level="H"
            bgColor="#ffffff"
            fgColor="#000000"
          />
          <span className="max-w-24 truncate text-[9px] font-medium text-gray-600">
            Scan to open
          </span>
        </a>
      )}

      {isAvatarOpen && phoneProfile.avatarUrl && (
        <div
          className="fixed inset-0 z-[200] flex cursor-pointer items-center justify-center bg-black/90 p-5"
          onClick={() => setIsAvatarOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsAvatarOpen(false)}
            aria-label="Close profile photo"
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center bg-black/50 text-white"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={phoneProfile.avatarUrl}
            alt={phoneProfile.displayName}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}

      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share this profile</DialogTitle>
            <DialogDescription>
              Send {phoneProfile.displayName}&apos;s Abio profile to someone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex min-w-0 items-center gap-2">
            <input
              readOnly
              value={profileLink ?? ""}
              aria-label="Profile link"
              className="h-10 min-w-0 flex-1 border border-[#331400]/20 bg-transparent px-3 text-sm dark:border-[#F5EEE4]/20"
            />
            <Button onClick={handleCopyProfileLink} className="h-10 shrink-0">
              <Copy className="mr-2 h-4 w-4" /> Copy
            </Button>
          </div>
          {profileLink && (
            <Button
              variant="outline"
              onClick={() => void handleShare(profileLink, "Abio profile")}
            >
              <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
