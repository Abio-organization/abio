import { createFileRoute } from "@tanstack/react-router";

import { ThemesStep } from "@/features/onboarding";

export const Route = createFileRoute("/onboarding/themes")({
  component: ThemesStep,
});
