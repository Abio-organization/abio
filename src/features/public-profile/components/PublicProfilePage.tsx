import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { QRCodeCanvas } from "qrcode.react";

import { Loader } from "@/shared/components/loader";

import { PhoneDisplay } from "@/shared/components/PhoneDisplay";
import {
  cornerConfigToButtonStyle,
  fontConfigToFontStyle,
  wallpaperToSelectedTheme,
} from "@/features/appearance/lib";
import { queryKeys } from "@/shared/lib/query-keys";
import { getPublicProfile } from "@/features/profile/api/profile.api";
import type { PhoneDisplayProfile } from "@/shared/hooks/usePhoneDisplayProps";
import { useRef, type CSSProperties } from "react";

interface PublicProfilePageProps {
  username: string;
}

function displayNameForUsername(username: string, fallback: string) {
  if (username === "ootn") return "one of those nights";
  return fallback;
}

function themeForUsername(username: string, displayTheme: string) {
  if (username === "ootn") return "/themes/ootn.jpeg";
  return displayTheme;
}

function backgroundStyleForSelectedTheme(selectedTheme: string): CSSProperties {
  if (selectedTheme.startsWith("fill:")) {
    return { backgroundColor: selectedTheme.replace("fill:", "") };
  }

  if (selectedTheme.startsWith("gradient:")) {
    const [, a, b] = selectedTheme.split(":");
    return { background: `linear-gradient(180deg, ${a}, ${b})` };
  }

  return {
    backgroundImage: `url(${selectedTheme})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
}

export function PublicProfilePage({ username }: PublicProfilePageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const profileLink = username ? `${window.location.origin}/${username}` : null;
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

  if (username === "dnabygaza") {
    return (
      <div className="p-6">
        <p className="mb-4 text-sm text-neutral-600">
          Special case: Menu tab + DnaFormV1 — implement when porting legacy
          behavior.
        </p>
        <PhoneDisplay
          buttonStyle={cornerConfigToButtonStyle(display.corner_config)}
          fontStyle={fontConfigToFontStyle(display.font_config)}
          selectedTheme={themeForUsername(username, displayTheme)}
          profile={phoneProfile}
          links={links}
        />
      </div>
    );
  }

  const selectedTheme = themeForUsername(username, displayTheme);
  const pageBackground = backgroundStyleForSelectedTheme(selectedTheme);

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden p-6"
      style={pageBackground}
    >
      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute left-6 top-6 z-10">
        <img
          src="/Abio-logo.png"
          alt="Abio logo"
          className="h-11 w-11 object-contain"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        <PhoneDisplay
          buttonStyle={cornerConfigToButtonStyle(display.corner_config)}
          fontStyle={fontConfigToFontStyle(display.font_config)}
          selectedTheme={selectedTheme}
          profile={phoneProfile}
          links={links}
        />

        <Link
          to="/auth/sign-up"
          className="mt-4 block bg-white px-5 py-2.5 text-sm font-medium shadow-lg capitalize text-black transition-opacity hover:opacity-95"
        >
          join {username} on abio
        </Link>
      </div>

      {profileLink && (
        <QRCodeCanvas
          ref={canvasRef}
          value={profileLink}
          size={88}
          level="H"
          bgColor="#ffffff"
          fgColor="#000000"
          className="fixed bottom-4 right-4 z-[100] hidden flex-col items-center gap-1 border border-gray-200 bg-white p-2 shadow-lg transition-opacity hover:opacity-95 md:flex"
        />
      )}
    </div>
  );
}
