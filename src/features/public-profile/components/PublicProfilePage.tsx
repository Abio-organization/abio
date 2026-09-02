import { useQuery } from "@tanstack/react-query";
import { QRCodeCanvas } from "qrcode.react";

import { PhoneDisplay } from "@/shared/components/PhoneDisplay";
import {
  cornerConfigToButtonStyle,
  fontConfigToFontStyle,
  wallpaperToSelectedTheme,
} from "@/features/appearance/lib";
import { queryKeys } from "@/shared/lib/query-keys";
import { getPublicProfile } from "@/features/profile/api/profile.api";
import type { PhoneDisplayProfile } from "@/shared/hooks/usePhoneDisplayProps";
import { useRef } from "react";

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
    return <p className="p-6 text-sm text-neutral-500">Loading profile…</p>;
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FEF4EA]  p-6">
      <PhoneDisplay
        buttonStyle={cornerConfigToButtonStyle(display.corner_config)}
        fontStyle={fontConfigToFontStyle(display.font_config)}
        selectedTheme={themeForUsername(username, displayTheme)}
        profile={phoneProfile}
        links={links}
      />
      <div>
        {profileLink && (
          <QRCodeCanvas
            ref={canvasRef}
            value={profileLink}
            size={88}
            level="H"
            bgColor="#ffffff"
            fgColor="#000000"
            className="fixed bottom-4 right-4 z-[100] flex-col items-center gap-1 hidden md:flex border border-gray-200 bg-white p-2 shadow-lg transition-opacity hover:opacity-95"
          />
        
        )}
      </div>
    </div>
  );
}
