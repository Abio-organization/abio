import { useState } from "react";
import { Plus, Search } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Field, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Switch } from "@/shared/components/ui/switch";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { toast } from "@/shared/lib/toast";

import { useCreateLink, useUpdateLink } from "@/features/links";
import { LINK_PLATFORM_OPTIONS } from "@/features/links/platforms";
import { buildPlatformUrl, PLATFORMS } from "@/features/onboarding/data";

const PLATFORM_DOMAINS: Record<string, string[]> = {
  TWITTER: ["twitter.com", "x.com"],
  INSTAGRAM: ["instagram.com"],
  LINKEDIN: ["linkedin.com"],
  GITHUB: ["github.com"],
  FACEBOOK: ["facebook.com", "fb.com"],
  YOUTUBE: ["youtube.com", "youtu.be"],
  TIKTOK: ["tiktok.com"],
  DISCORD: ["discord.com", "discord.gg"],
  TWITCH: ["twitch.tv"],
  SPOTIFY: ["spotify.com"],
  REDDIT: ["reddit.com"],
  PINTEREST: ["pinterest.com", "pin.it"],
  MEDIUM: ["medium.com"],
  whatsapp: ["wa.me", "whatsapp.com"],
  snapchat: ["snapchat.com"],
  telegram: ["t.me", "telegram.me"],
};

const SUGGESTED_PLATFORM_VALUES: Record<string, string> = {
  whatsapp: "whatsapp",
  youtube: "YOUTUBE",
  X: "TWITTER",
  tiktok: "TIKTOK",
  snapchat: "snapchat",
  telegram: "telegram",
  linkedin: "LINKEDIN",
  instagram: "INSTAGRAM",
  Website: "Website",
};

const ONBOARDING_PLATFORM_IDS: Record<string, string> = {
  TWITTER: "X",
  INSTAGRAM: "instagram",
  LINKEDIN: "linkedin",
  YOUTUBE: "youtube",
  TIKTOK: "tiktok",
  whatsapp: "whatsapp",
  snapchat: "snapchat",
  telegram: "telegram",
  Website: "Website",
};

const PLATFORM_URL_BASES: Record<string, string> = {
  GITHUB: "https://github.com/",
  FACEBOOK: "https://facebook.com/",
  DISCORD: "https://discord.gg/",
  TWITCH: "https://twitch.tv/",
  SPOTIFY: "https://open.spotify.com/user/",
  REDDIT: "https://reddit.com/user/",
  PINTEREST: "https://pinterest.com/",
  MEDIUM: "https://medium.com/@",
};

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function resolveLinkUrl(raw: string, platform: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const parsed = parseLink(trimmed);
  const hasProtocol = /^https?:\/\//i.test(trimmed);
  const looksLikeDomain = /^[\w-]+(?:\.[\w-]+)+(?:[/:?#].*)?$/i.test(trimmed);
  const supportsUsername =
    Boolean(ONBOARDING_PLATFORM_IDS[platform] || PLATFORM_URL_BASES[platform]);
  const hasPath = /[/?#]/.test(trimmed);
  const isBareDomain =
    looksLikeDomain && (!supportsUsername || platform === "Website" || hasPath);
  if (parsed && (hasProtocol || parsed.platform || isBareDomain)) {
    return parsed.url;
  }

  const username = trimmed.replace(/^@/, "");
  const onboardingPlatform = ONBOARDING_PLATFORM_IDS[platform];
  const generatedUrl = onboardingPlatform
    ? buildPlatformUrl(onboardingPlatform, username)
    : PLATFORM_URL_BASES[platform]
      ? `${PLATFORM_URL_BASES[platform]}${username}`
      : "";

  return generatedUrl ? (parseLink(generatedUrl)?.url ?? null) : null;
}

function parseLink(raw: string): { url: string; platform: string | null } | null {
  try {
    const url = new URL(normalizeUrl(raw));
    if (!["http:", "https:"].includes(url.protocol) || !url.hostname.includes(".")) {
      return null;
    }

    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    const platform =
      Object.entries(PLATFORM_DOMAINS).find(([, domains]) =>
        domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`)),
      )?.[0] ?? null;

    return { url: url.toString(), platform };
  } catch {
    return null;
  }
}

export function AddLinkDialog() {
  const createMutation = useCreateLink();
  const updateMutation = useUpdateLink();

  const [open, setOpen] = useState(false);
  const [quickLink, setQuickLink] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState<string>(
    LINK_PLATFORM_OPTIONS[0].value,
  );
  const [isVisible, setIsVisible] = useState(true);

  const reset = () => {
    setQuickLink("");
    setTitle("");
    setUrl("");
    setPlatform(LINK_PLATFORM_OPTIONS[0].value);
    setIsVisible(true);
  };

  const applyQuickLink = () => {
    const search = quickLink.trim();
    const matchingPlatform = LINK_PLATFORM_OPTIONS.find(
      (option) =>
        option.label
          .toLowerCase()
          .split(/[\s/]+/)
          .includes(search.toLowerCase()) ||
        option.value.toLowerCase() === search.toLowerCase(),
    );

    if (matchingPlatform) {
      setPlatform(matchingPlatform.value);
      return;
    }

    const parsed = parseLink(search);
    if (!parsed) return;

    setUrl(parsed.url);
    setPlatform(parsed.platform ?? "CUSTOM");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      toast.warning("Please fill in both title and URL or username");
      return;
    }

    const normalizedUrl = resolveLinkUrl(url, platform);
    if (!normalizedUrl) {
      toast.warning("Enter a valid URL or a username for the selected platform");
      return;
    }

    createMutation.mutate(
      { title: title.trim(), url: normalizedUrl, platform },
      {
        onSuccess: (res) => {
          const finish = () => {
            toast.success("Link added");
            setOpen(false);
          };

          if (!isVisible) {
            updateMutation.mutate(
              { id: res.data.id, payload: { isVisible: false } },
              {
                onSuccess: finish,
                onError: (error) => {
                  toast.error("Link added, but visibility could not be updated", {
                    description: getApiErrorMessage(error),
                  });
                  setOpen(false);
                },
              },
            );
          } else {
            finish();
          }
        },
        onError: (error) =>
          toast.error("Could not add link", {
            description: getApiErrorMessage(error),
          }),
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger
        render={
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 bg-[#331400] py-3 text-sm font-semibold text-[#FED45C] shadow-[4px_4px_0px_0px_#000000] hover:bg-[#4a2c1a] dark:bg-[#FED45C] dark:text-[#331400]"
          />
        }
      >
        <Plus className="h-4 w-4" />
        Add link
      </DialogTrigger>

      <DialogContent className="max-h-[92vh] w-[calc(100%-2rem)] max-w-[1080px] gap-0 overflow-y-auto border-0 bg-white p-6 text-foreground shadow-none sm:max-w-[1080px] sm:p-8 md:p-12">
        <DialogHeader className="mb-6 items-center md:mb-6">
          <DialogTitle className="m-0 text-center text-[26px] font-medium leading-tight text-foreground md:text-[30px]">
            Add Link
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-4">
          <div className="relative">
            <Search
              aria-hidden="true"
              className="absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-white dark:text-[#F5EEE4]"
            />
            <Input
              aria-label="Paste or search a link"
              value={quickLink}
              onChange={(e) => setQuickLink(e.target.value)}
              onBlur={applyQuickLink}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyQuickLink();
                }
              }}
              placeholder="Paste or search a link"
              className="h-[42px] border-[#331400] bg-[#331400] pl-[58px] text-sm text-white placeholder:text-white focus-visible:border-[#331400] focus-visible:ring-0 dark:border-[#3A2C20] dark:bg-[#2B2119] dark:text-[#F5EEE4] dark:placeholder:text-[#F5EEE4]/60 dark:focus-visible:border-[#FED45C] md:h-[42px]"
            />
          </div>

          <Field className="gap-1">
            <FieldLabel
              htmlFor="link-title"
              className="text-[17px] font-normal text-[#331400] dark:text-[#F5EEE4]"
            >
              Title
            </FieldLabel>
            <Input
              id="link-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Instagram"
              className="h-[42px] border-2 border-[#331400]/60 bg-transparent px-5 text-base text-[#331400] placeholder:text-[#666464]/70 focus-visible:border-[#331400] focus-visible:ring-[#FED45C] dark:border-[#3A2C20] dark:text-[#F5EEE4] dark:placeholder:text-[#F5EEE4]/40 dark:focus-visible:border-[#FED45C]"
            />
          </Field>

          <Field className="gap-1">
            <FieldLabel
              htmlFor="link-url"
              className="text-[17px] font-normal text-[#331400] dark:text-[#F5EEE4]"
            >
              URL / username
            </FieldLabel>
            <Input
              id="link-url"
              type="text"
              inputMode="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter a URL or username"
              className="h-[42px] border-2 border-[#331400]/60 bg-transparent px-5 text-base text-[#331400] placeholder:text-[#666464]/70 focus-visible:border-[#331400] focus-visible:ring-[#FED45C] dark:border-[#3A2C20] dark:text-[#F5EEE4] dark:placeholder:text-[#F5EEE4]/40 dark:focus-visible:border-[#FED45C]"
            />
          </Field>

          <Field className="gap-1">
            <FieldLabel
              htmlFor="link-platform"
              className="text-[17px] font-normal text-[#331400] dark:text-[#F5EEE4]"
            >
              Platform
            </FieldLabel>
            <Select  value={platform} onValueChange={(value) => value && setPlatform(value)}>
              <SelectTrigger
                id="link-platform"
                className="h-[42px] w-full border-[#331400] bg-[#331400] px-5 text-base text-white focus-visible:border-[#331400] focus-visible:ring-0 [&_svg]:text-white dark:border-[#3A2C20] dark:bg-[#2B2119] dark:text-[#F5EEE4] dark:focus-visible:border-[#FED45C] dark:[&_svg]:text-[#F5EEE4]"
              >
                <SelectValue placeholder="Select a platform" />
              </SelectTrigger>
              <SelectContent
                align="start"
                alignItemWithTrigger={false}
                className="max-h-[50dvh] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                <SelectGroup>
                  {LINK_PLATFORM_OPTIONS.filter(
                    (option) => option.value !== "SPOTIFY",
                  ).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Listen</SelectLabel>
                  {LINK_PLATFORM_OPTIONS.filter(
                    (option) => option.value === "SPOTIFY", "YOUTUBE",
                  ).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <div role="group" aria-labelledby="suggested-icons-label">
            <p
              id="suggested-icons-label"
              className="mt-4 mb-6 text-[17px] font-medium text-[#331400] dark:text-[#F5EEE4]"
            >
              Suggested icons
            </p>
            <div
              aria-label="Suggested platform icons"
              tabIndex={0}
              className="flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible sm:snap-none"
            >
              {PLATFORMS.map((suggestion) => {
                const platformValue = SUGGESTED_PLATFORM_VALUES[suggestion.id];
                const isSelected = platform === platformValue;
                return (
                  <button
                    key={suggestion.id}
                    type="button"
                    aria-label={`Select ${suggestion.name} icon`}
                    aria-pressed={isSelected}
                    title={suggestion.name}
                    onClick={() => {
                      setPlatform(platformValue);
                      setTitle(suggestion.name);
                    }}
                    className={`inline-flex h-fit w-fit shrink-0 snap-start items-center justify-center overflow-hidden border-2 p-0 transition-colors ${
                      isSelected
                        ? "border-[#331400] bg-[#FED45C] text-[#331400] dark:border-[#FED45C]"
                        : "border-[#331400]/20 text-[#331400] hover:bg-[#331400]/5 dark:border-[#F5EEE4]/20 dark:text-[#F5EEE4] dark:hover:bg-[#F5EEE4]/10"
                    }`}
                  >
                    <img
                      src={suggestion.linksIcon ?? suggestion.icon}
                      alt=""
                      className="block h-10 md:h-18 w-10 md:w-18 object-contain"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <Field orientation="horizontal" className="mt-1 justify-between">
            <FieldLabel
              htmlFor="link-visible"
              className="text-[17px] font-normal text-[#331400] dark:text-[#F5EEE4]"
            >
              Visible
            </FieldLabel>
            <Switch
              id="link-visible"
              checked={isVisible}
              onCheckedChange={setIsVisible}
              aria-label="Visible on profile"
              className="h-8 w-[60px] bg-[#331400] data-[checked]:bg-[#331400] [&_[data-slot=switch-thumb]]:size-7 [&_[data-slot=switch-thumb]]:translate-x-0 [&_[data-slot=switch-thumb]]:bg-white [&[data-checked]_[data-slot=switch-thumb]]:translate-x-[28px] dark:bg-[#3A2C20] dark:data-[checked]:bg-[#FED45C] dark:[&_[data-slot=switch-thumb]]:bg-[#F5EEE4]"
            />
          </Field>

          <DialogFooter className="mt-6 flex-col p-0 md:mt-2">
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="h-12 w-full rounded-none bg-[#FED45C] text-base font-semibold text-[#331400] shadow-[4px_4px_0px_0px_#000000] hover:bg-[#FED45C]/90 disabled:opacity-70"
            >
              {createMutation.isPending || updateMutation.isPending
                ? "Adding…"
                : "Add Link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
