import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { ThemeSelector } from "@/features/appearance/components/ThemeSelector";
import { updatePreferences } from "@/features/appearance/api/appearance.api";
import type { DisplayTheme } from "@/features/appearance/types";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { queryKeys } from "@/shared/lib/query-keys";
import { toast } from "@/shared/lib/toast";
import { Button } from "@/shared/components/ui/button";
import { OnboardingLayout } from "@/features/onboarding/components/OnboardingLayout";

export function ThemesStep() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedTheme, setSelectedTheme] = useState<DisplayTheme | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleContinue = async () => {
    if (!selectedTheme) {
      toast.warning("Select a theme to continue");
      return;
    }

    setIsSaving(true);
    try {
      const response = await updatePreferences({
        font_config: selectedTheme.font_config,
        corner_config: selectedTheme.corner_config,
        wallpaper_config: selectedTheme.wallpaper_config,
        selected_theme: selectedTheme.id,
      });
      queryClient.setQueryData(queryKeys.settings, response.data);
      toast.success("Theme saved");
      navigate({ to: "/onboarding/platforms" });
    } catch (error) {
      toast.error("Could not save theme", {
        description: getApiErrorMessage(error),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <OnboardingLayout step={3}>
      <div className="flex flex-1 justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-xl font-bold text-[#331400] md:text-2xl dark:text-[#F5EEE4]">
              Choose your theme
            </h1>
            <p className="text-sm text-[#666464] dark:text-[#F5EEE4]/60">
              Pick a look for your profile.
            </p>
          </div>

          <ThemeSelector
            selectedThemeId={selectedTheme?.id ?? null}
            onSelect={setSelectedTheme}
          />

          <div className="mt-8 space-y-3">
            <Button
              onClick={handleContinue}
              disabled={isSaving}
              className="h-12 w-full bg-[#FED45C] text-sm font-semibold text-[#331400] hover:bg-[#FED45C]/90"
            >
              {isSaving ? "Saving…" : "Continue"}
            </Button>
            <button
              type="button"
              onClick={() => navigate({ to: "/onboarding/platforms" })}
              className="w-full text-sm font-semibold text-[#666464] hover:underline dark:text-[#F5EEE4]/60"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}
