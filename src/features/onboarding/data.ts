import { ShoppingCart, Users, Zap } from "lucide-react";
import type { ComponentType } from "react";

export interface OnboardingCategory {
  id: string;
  name: string;
}

export const CATEGORIES: OnboardingCategory[] = [
  { id: "musician", name: "Musician / Artist" },
  { id: "influencer", name: "Influencer / Creator" },
  { id: "entrepreneur", name: "Entrepreneur / Coach" },
  { id: "freelancer", name: "Freelancer / Agency" },
  { id: "local", name: "Local Business" },
  { id: "blogger", name: "Blogger / Writer" },
  { id: "designer", name: "Designer" },
  { id: "nonprofit", name: "Non-Profit / Activist" },
  { id: "photographer", name: "Photographer / Videographer" },
];

export interface OnboardingGoal {
  id: string;
  title: string;
  description: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}

export const GOALS: OnboardingGoal[] = [
  {
    id: "grow-brand",
    title: "Creator",
    description: "Grow my following and social media presence.",
    icon: Zap,
  },
  {
    id: "share-links",
    title: "Personal",
    description: "Share links with friends and acquaintances.",
    icon: Users,
  },
  {
    id: "sell-products",
    title: "Business",
    description: "Grow my business and build customer retention.",
    icon: ShoppingCart,
  },
];

export interface OnboardingPlatform {
  id: string;
  name: string;
  icon: string;
  linksIcon?: string;
}

export const PLATFORMS: OnboardingPlatform[] = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "/assets/Whatsapp.svg",
    linksIcon: "/assets/platform-icons/links/whatsapp.svg",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "/assets/Youtube.svg",
    linksIcon: "/assets/platform-icons/links/youtube.svg",
  },
  {
    id: "X",
    name: "X",
    icon: "/assets/X.svg",
    linksIcon: "/assets/platform-icons/links/twitter.svg",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "/assets/tiktok.svg",
    linksIcon: "/assets/platform-icons/links/tiktok.svg",
  },
  {
    id: "snapchat",
    name: "Snapchat",
    icon: "/assets/snapchat.svg",
    linksIcon: "/assets/platform-icons/links/snapchat.svg",
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: "/assets/telegram.svg",
    linksIcon: "/assets/platform-icons/links/telegram.svg",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "/assets/Linkedln.svg",
    linksIcon: "/assets/platform-icons/links/linkedin.svg",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "/assets/Instagram.svg",
    linksIcon: "/assets/platform-icons/links/instagram.svg",
  },
  { id: "Website", name: "Website", icon: "/assets/website.svg" },
];

export const MAX_PLATFORMS = 5;

/** Base URL fragments used to build a full link URL from a bare username/handle. */
export const PLATFORM_BASE_URLS: Record<string, string> = {
  instagram: "instagram.com/",
  X: "x.com/",
  snapchat: "snapchat.com/add/",
  tiktok: "tiktok.com/@",
  youtube: "youtube.com/@",
  linkedin: "linkedin.com/in/",
  telegram: "t.me/",
  whatsapp: "wa.me/",
  Website: "https://",
};

/** Platforms whose handle is conventionally shown with an @ prefix. */
export const AT_PLATFORMS = new Set(["X", "snapchat", "tiktok", "instagram"]);

const COMMON_DOMAIN_SUFFIXES = new Set([
  "app",
  "ai",
  "biz",
  "ca",
  "co",
  "com",
  "de",
  "dev",
  "edu",
  "fr",
  "gg",
  "gov",
  "in",
  "info",
  "io",
  "jp",
  "me",
  "net",
  "nz",
  "online",
  "org",
  "shop",
  "site",
  "tv",
  "uk",
  "us",
  "xyz",
]);

function looksLikePastedUrl(value: string, platformId: string): boolean {
  const host = value.split(/[/?#]/, 1)[0].replace(/^www\./i, "");
  const domainParts = host.split(".");
  if (
    domainParts.length < 2 ||
    !domainParts.every((part) => /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(part))
  ) {
    return false;
  }

  const platformBase = PLATFORM_BASE_URLS[platformId]
    ?.replace(/^https?:\/\//i, "")
    .split("/")[0];
  const isPlatformDomain =
    !!platformBase && (host === platformBase || host.endsWith(`.${platformBase}`));
  const includesPath = /[/?#]/.test(value);
  const suffix = domainParts[domainParts.length - 1]?.toLowerCase();

  return (
    isPlatformDomain ||
    includesPath ||
    /^www\./i.test(value) ||
    platformId === "Website" ||
    COMMON_DOMAIN_SUFFIXES.has(suffix ?? "")
  );
}

export function buildPlatformUrl(platformId: string, value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (/^https?:\/\//i.test(trimmed)) {
    return platformId === "whatsapp"
      ? trimmed.replace(/^(https?:\/\/(?:www\.)?wa\.me\/)@+/i, "$1")
      : trimmed;
  }
  if (!trimmed.startsWith("@") && looksLikePastedUrl(trimmed, platformId)) {
    const pastedUrl =
      platformId === "whatsapp"
        ? trimmed.replace(/^((?:www\.)?wa\.me\/)@+/i, "$1")
        : trimmed;
    return `https://${pastedUrl}`;
  }

  if (platformId === "whatsapp") {
    return `https://wa.me/${trimmed.replace(/\D/g, "")}`;
  }

  const username = trimmed.replace(/^@/, "");
  const base = PLATFORM_BASE_URLS[platformId];
  return base ? `https://${base}${username}` : `https://${username}`;
}

export function getPlatformPlaceholder(
  platformId: string,
  _platformName: string,
): string {
  if (platformId === "whatsapp") return "Phone number or paste a link";

  const base = PLATFORM_BASE_URLS[platformId];
  if (!base || platformId === "Website") return "Paste a link";
  if (AT_PLATFORMS.has(platformId) || base.includes("@")) {
    return "Username or paste a link";
  }

  return "Username or paste a link";
}

export const isCategoryGoalEntry = (name: string) =>
  CATEGORIES.some((c) => c.name === name);
export const isGoalTitleEntry = (name: string) =>
  GOALS.some((g) => g.title === name);

export const ONBOARDING_STEPS = [
  { path: "/onboarding/goal", label: "Goal" },
  { path: "/onboarding/username", label: "Username" },
  { path: "/onboarding/themes", label: "Theme" },
  { path: "/onboarding/platforms", label: "Platforms" },
  { path: "/onboarding/links", label: "Links" },
  { path: "/onboarding/profile", label: "Profile" },
] as const;
