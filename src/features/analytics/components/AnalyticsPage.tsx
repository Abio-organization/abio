import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BarChart3,
  Eye,
  Link2,
  Loader2,
  TrendingUp,
  MousePointer,
} from "lucide-react";

import { useGetAllLinks } from "@/features/links";
import { getPlatformIcon } from "@/shared/components/PlatformIcon";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

const formatCompactNumber = (value: number) =>
  new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(value);

export function AnalyticsPage() {
  const { data: links = [], isLoading } = useGetAllLinks();

  const totalClicks = links.reduce(
    (sum, link) => sum + Number(link.clickCount ?? 0),
    0,
  );

  const visibleLinks = links.filter((link) => link.isVisible).length;
  const totalLinks = links.length;

  const averageClicks =
    totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0;

  const maxClicks = links.reduce(
    (max, link) => Math.max(max, Number(link.clickCount ?? 0)),
    0,
  );

  const topLink = [...links].sort(
    (a, b) => Number(b.clickCount ?? 0) - Number(a.clickCount ?? 0),
  )[0];

  const linkBreakdown = [...links].sort(
    (a, b) => Number(b.clickCount ?? 0) - Number(a.clickCount ?? 0),
  );

  return (
    <div className="flex h-[calc(100vh-7rem)] w-full items-center justify-center overflow-hidden">
      <div className="flex h-full w-full max-w-[1500px] flex-col gap-2 overflow-hidden">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between">
          <div>
            <h1 className="text-2xl  tracking-tight text-[#2A1F18] dark:text-[#F0EAE4] lg:text-3xl">
              Link Performance
            </h1>
            <p className="text-xs text-[#8B7B6B] dark:text-[#6B5F55] lg:text-sm">
              Monitor your link engagement and audience growth
            </p>
          </div>

          {/* <div className="flex items-center gap-2  bg-white/70 px-3 py-1.5 text-xs shadow-sm backdrop-blur-sm dark:bg-[#1E1A16]/70 dark:shadow-none lg:gap-3 lg:px-4 lg:py-2 lg:text-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 lg:h-2 lg:w-2" />
            <span className="text-[#4A3A2A] dark:text-[#B0A8A0]">
              {totalLinks > 0 ? `${visibleLinks} active links` : "No links yet"}
            </span>
          </div> */}
        </div>

        {/* Stats Grid */}
        <div className="grid mt-8 shrink-0 grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-3">
          <StatCard
            title="Total Clicks"
            value={formatCompactNumber(totalClicks)}
            detail={
              totalClicks > 999
                ? `${formatNumber(totalClicks)} total`
                : undefined
            }
            icon={<MousePointer className="h-3.5 w-3.5 lg:h-4 lg:w-4" />}
            iconBg="bg-[#F0E8E0] dark:bg-[#2A221C]"
          />

          <StatCard
            title="Active Links"
            value={String(visibleLinks)}
            detail={`${totalLinks} total links`}
            icon={<Link2 className="h-3.5 w-3.5 lg:h-4 lg:w-4" />}
            iconBg="bg-[#E0F0EA] dark:bg-[#1A2F26]"
          />

          <StatCard
            title="Avg. per Link"
            value={formatCompactNumber(averageClicks)}
            detail={totalLinks > 0 ? "Across all links" : "Waiting for clicks"}
            icon={<BarChart3 className="h-3.5 w-3.5 lg:h-4 lg:w-4" />}
            iconBg="bg-[#F0E8E0] dark:bg-[#2A221C]"
          />

          <StatCard
            title="Best Performer"
            value={
              topLink
                ? formatCompactNumber(Number(topLink.clickCount ?? 0))
                : "0"
            }
            detail={topLink ? topLink.title : "No data yet"}
            icon={<TrendingUp className="h-3.5 w-3.5 lg:h-4 lg:w-4" />}
            iconBg="bg-[#E8ECF4] dark:bg-[#1A2230]"
            highlight
          />
        </div>

        {/* Main Content - Side by Side on Desktop, Stacked on Mobile */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 shadow-lg overflow-hidden lg:grid-cols-[1.5fr_1fr] lg:gap-3">
          {/* Engagement Overview - Chart */}
          {isLoading ? (
            <div className="flex items-center justify-center shadow-lg border border-[#E8E0D8]/40 bg-[#FAFAFC] backdrop-blur-sm dark:border-[#2A221C] dark:bg-[#1A1612]/60">
              <Loader2 className="h-6 w-6 animate-spin text-[#8B7B6B] dark:text-[#6B5F55] lg:h-8 lg:w-8" />
            </div>
          ) : (
            <div className="relative overflow-hidde border border-[#E8E0D8]/40 shadow-lg bg-[#FAFAFC] backdrop-blur-sm dark:border-[#2A221C] dark:bg-white/5">
              <div className="relative flex h-full flex-col p-2.5 lg:p-3">
                <div className="mb-1.5 flex shrink-0 items-center justify-between lg:mb-2">
                  <div>
                    <h3 className="text-xs font-medium text-[#4A3A2A] dark:text-[#C0B8B0] lg:text-sm">
                      Engagement Overview
                    </h3>
                    <p className="text-[10px] text-[#8B7B6B] dark:text-[#6B5F55] lg:text-xs">
                      Last 30 days activity
                    </p>
                  </div>
                  <div className="flex items-center gap-1  bg-[#F0E8E0]/40 px-2 py-1 text-[10px] font-medium text-[#4A3A2A] dark:bg-[#2A221C]/40 dark:text-[#C0B8B0] lg:px-3 lg:py-1.5 lg:text-xs">
                    <span className="h-1 w-1 rounded-full bg-[#4A3A2A] dark:bg-[#C0B8B0] lg:h-1.5 lg:w-1.5" />
                    {formatNumber(totalClicks)} total clicks
                  </div>
                </div>

                {linkBreakdown.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center  border border-dashed border-[#D0C8C0]/40 px-4 text-center dark:border-[#3A322C]/40">
                    <div>
                      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#F0E8E0]/50 dark:bg-[#2A221C]/50 lg:h-12 lg:w-12">
                        <Link2 className="h-5 w-5 text-[#8B7B6B] dark:text-[#6B5F55] lg:h-6 lg:w-6" />
                      </div>
                      <p className="text-xs text-[#8B7B6B] dark:text-[#6B5F55] lg:text-sm">
                        Add your first link to start tracking
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full min-h-0 flex-1 items-end gap-0.5 pb-0.5 lg:gap-1 lg:pb-1">
                    {linkBreakdown.map((link) => {
                      const clickCount = Number(link.clickCount ?? 0);
                      const barHeight =
                        maxClicks > 0
                          ? Math.max(
                              (clickCount / maxClicks) * 100,
                              clickCount > 0 ? 3 : 0,
                            )
                          : 0;

                      return (
                        <div
                          key={link.id}
                          className="group flex h-full min-w-0 flex-1 basis-0 flex-col items-center justify-end gap-1 lg:gap-1.5"
                        >
                          <div className="flex w-full flex-1 items-end justify-center">
                            <div
                              className="w-full min-w-0 bg-gradient-to-t from-[#D4C8BC] to-[#B0A094] transition-all duration-500 group-hover:opacity-80 dark:from-[#3A322C] dark:to-[#4A3A2A]"
                              style={{ height: `${barHeight}%` }}
                            />
                          </div>
                          <div className="w-full text-center">
                            <p className="truncate text-[8px] font-medium text-[#4A3A2A] dark:text-[#B0A8A0] lg:text-[10px]">
                              {link.title.length > 6
                                ? link.title.slice(0, 5) + "…"
                                : link.title}
                            </p>
                            <p className="text-[7px] text-[#8B7B6B] dark:text-[#6B5F55] lg:text-[9px]">
                              {formatNumber(clickCount)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Top Performing Links */}
          <div className="flex flex-col border border-[#E8E0D8]/40 bg-[#FAFAFC] backdrop-blur-sm dark:border-[#2A221C] shadow-lg dark:bg-white/5">
            <div className="shrink-0 border-b border-[#E8E0D8]/20 px-3 py-2.5 dark:border-[#2A221C]/40 lg:px-4 lg:py-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-medium text-[#4A3A2A] dark:text-[#C0B8B0] lg:text-sm">
                    Top Links
                  </h3>
                  <p className="text-[10px] text-[#8B7B6B] dark:text-[#6B5F55] lg:text-xs">
                    Ranked by clicks
                  </p>
                </div>
                <span className="text-[10px] font-medium text-[#8B7B6B] dark:text-[#6B5F55] lg:text-xs">
                  Clicks
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-1.5 lg:px-3 lg:py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {linkBreakdown.length === 0 ? (
                <div className="flex h-full items-center justify-center text-xs text-[#8B7B6B] dark:text-[#6B5F55] lg:text-sm">
                  No links to display
                </div>
              ) : (
                <div className="flex h-full flex-col gap-0.5">
                  {linkBreakdown.map((link, index) => {
                    const platformLabel = link.platform || "custom";
                    const appearance = getPlatformAppearance(platformLabel);
                    const count = Number(link.clickCount ?? 0);

                    return (
                      <div
                        key={link.id}
                        className="flex items-center justify-between gap-2 rounded-md px-1.5 py-1.5 transition-colors hover:bg-[#F0E8E0]/20 dark:hover:bg-[#2A221C]/20 lg:gap-3 lg:px-2 lg:py-2"
                      >
                        <div className="flex min-w-0 items-center gap-1.5 lg:gap-2.5">
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[8px] font-medium text-[#8B7B6B] dark:text-[#6B5F55] lg:h-5 lg:w-5 lg:text-[10px]">
                            {index + 1}
                          </span>
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F0E8E0] dark:bg-[#2A221C] lg:h-6 lg:w-6">
                            {getPlatformIcon(
                              platformLabel,
                              "h-2.5 w-2.5 text-[#4A3A2A] dark:text-[#C0B8B0] lg:h-3.5 lg:w-3.5",
                            )}
                          </div>
                          <p className="truncate text-xs text-[#4A3A2A] dark:text-[#C0B8B0] lg:text-sm">
                            {link.title || appearance.label}
                          </p>
                        </div>
                        <span className="shrink-0 text-xs font-medium text-[#4A3A2A] dark:text-[#C0B8B0] lg:text-sm">
                          {formatNumber(count)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function StatCard({
  title,
  value,
  detail,
  icon,
  iconBg,
  highlight,
}: {
  title: string;
  value: string;
  detail?: string;
  icon: React.ReactNode;
  iconBg: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden  border border-[#E8E0D8]/40  px-3 py-2.5 backdrop-blur-sm transition-all duration-200 hover:border-[#D0C8C0]/60 shadow-lg hover:shadow-[#D0C8C0]/5 dark:border-[#2A221C] bg-[#FAFAFC] dark:bg-white/5 dark:hover:border-[#3A322C] dark:hover:shadow-none  lg:px-4 lg:py-3.5 ${
        highlight ? "border-[#B0A094]/60 dark:border-[#4A3A2A]" : ""
      }`}
    >
      {highlight && (
        <div className="absolute -right-4 -top-4 h-8 w-8 rounded-full bg-gradient-to-br from-[#D4C8BC]/20 to-transparent dark:from-[#3A322C]/20 lg:-right-6 lg:-top-6 lg:h-12 lg:w-12" />
      )}

      <div className="relative flex items-center justify-between">
        <div
          className={`flex h-6 w-6 items-center justify-center  ${iconBg} text-[#4A3A2A] dark:text-[#C0B8B0] lg:h-7 lg:w-7`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-1.5 text-lg font-light tracking-tight text-[#2A1F18] dark:text-[#F0EAE4] lg:mt-2 lg:text-2xl">
        {value}
      </p>
      <p className="text-[10px] font-medium text-[#4A3A2A] dark:text-[#B0A8A0] lg:text-xs">
        {title}
      </p>
      {detail && (
        <p className="text-[8px] text-[#8B7B6B] dark:text-[#6B5F55] lg:text-[10px]">
          {detail}
        </p>
      )}
    </div>
  );
}

// --- Helpers ---

function getPlatformAppearance(platform: string) {
  const value = platform.toLowerCase();
  const palette: Record<string, { label: string }> = {
    tiktok: { label: "TikTok" },
    instagram: { label: "Instagram" },
    twitter: { label: "Twitter" },
    x: { label: "X" },
    linkedin: { label: "LinkedIn" },
    youtube: { label: "YouTube" },
    facebook: { label: "Facebook" },
    reddit: { label: "Reddit" },
    discord: { label: "Discord" },
    default: { label: "Link" },
  };
  return palette[value] ?? palette.default;
}

export const Route = createFileRoute("/dashboard/statistics")({
  component: AnalyticsPage,
});
