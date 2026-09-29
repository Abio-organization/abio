import { createFileRoute } from "@tanstack/react-router";

import { SettingsPage } from "@/features/settings";

type SettingsSection = "account" | "privacy" | "notifications";

export const Route = createFileRoute("/dashboard/settings")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { section: SettingsSection } => ({
    section:
      search.section === "privacy" || search.section === "notifications"
        ? search.section
        : "account",
  }),
  component: SettingsRoute,
});

function SettingsRoute() {
  const { section } = Route.useSearch();
  return <SettingsPage initialSection={section} />;
}
