import type { ButtonStyle, ShadowType } from "@/features/appearance/types";
import { shadowFromType } from "@/features/appearance/lib";
import { cn } from "@/shared/lib/utils";

import { ColorPicker } from "./ColorPicker";

// Import SVG icons
import SharpEdgeIcon from "/icons/sharpedge.svg";
import CurvedEdgeIcon from "/icons/curvededge.svg";
import RoundEdgeIcon from "/icons/roundedge.svg";
import ShadowNoneIcon from "/icons/tabler_shadowoff.svg";
import Shadow from "/icons/tabler_shadow.svg";
import ShadowHard from "/icons/tablerhard.svg";

interface CornerStyleEditorProps {
  value: ButtonStyle;
  onChange: (next: ButtonStyle) => void;
}

const SHAPES: Array<{
  label: string;
  borderRadius: string;
  preview: string;
  icon: string;
}> = [
  {
    label: "Sharp",
    borderRadius: "0px",
    preview: "rounded-none",
    icon: SharpEdgeIcon,
  },
  {
    label: "Curved",
    borderRadius: "8px",
    preview: "rounded-md",
    icon: CurvedEdgeIcon,
  },
  {
    label: "Round",
    borderRadius: "9999px",
    preview: "rounded-full",
    icon: RoundEdgeIcon,
  },
];

const SHADOWS: Array<{ label: string; value: ShadowType; icon: string }> = [
  { label: "None", value: "none", icon: ShadowNoneIcon },
  { label: "Soft", value: "soft", icon: Shadow },
  { label: "Hard", value: "hard", icon: ShadowHard },
];

function shadowTypeOf(boxShadow: string): ShadowType {
  if (boxShadow === "none") return "none";
  if (boxShadow.includes("4px 4px 0px")) return "hard";
  return "soft";
}

export function CornerStyleEditor({ value, onChange }: CornerStyleEditorProps) {
  const activeShadow = shadowTypeOf(value.boxShadow);
  const opacityPct = Math.round((value.opacity ?? 1) * 50);

  return (
    <div className="flex flex-col gap-6">
      <div>
        {/* <p className="mb-2 text-xs font-semibold tracking-wide text-[#666464] uppercase dark:text-[#F5EEE4]/50">
          corners
        </p> */}
        <div className="flex gap-6 md:gap-10">
          {SHAPES.map((shape) => (
            <button
              key={shape.label}
              type="button"
              onClick={() =>
                onChange({ ...value, borderRadius: shape.borderRadius })
              }
              className={cn(
                "flex flex-col items-center justify-center gap-1 border px-4 py-2 text-[10px] font-medium shadow-md cursor-pointer min-w-[100px] lg:min-w-[120px]",
                // Apply the preview class directly to the button
                shape.preview,
                value.borderRadius === shape.borderRadius
                  ? "border-[#331400] bg-[#331400]/5 dark:border-[#F5EEE4] dark:bg-white/5"
                  : "border-[#331400]/15 text-[#666464] dark:border-[#F5EEE4]/15",
              )}
            >
              <img
                src={shape.icon}
                alt={shape.label}
                className= "object-contain brightness-0 dark:invert"
                 width={16}
                height={16}
              />
              {shape.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold tracking-wide text-[#666464] uppercase dark:text-[#F5EEE4]/50">
          Fill color
        </p>
        <div className="max-w-[350px] sm:max-w-none">

        <ColorPicker
          
          value={value.backgroundColor}
          onChange={(color) =>
            onChange({ ...value, backgroundColor: color ?? "#331400" })
          }
          
          allowNone
        />
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold tracking-wide text-[#666464] uppercase dark:text-[#F5EEE4]/50">
          Border color
        </p>
        <div className="max-w-[350px] sm:max-w-none">

        <ColorPicker
          value={value.borderColor === "transparent" ? null : value.borderColor}
          onChange={(color) =>
            onChange({ ...value, borderColor: color ?? "transparent" })
          }
          allowNone
        />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center  justify-between">
          <p className="text-xs font-semibold tracking-wide text-[#666464] uppercase dark:text-[#F5EEE4]/50">
            Opacity
          </p>
          <span className="text-xs font-medium text-[#331400] dark:text-[#F5EEE4]">
            {opacityPct}%
          </span>
        </div>
        <div className="flex items-center md:bg-[#ECECED] py-3 px-[4px] gap-2 rounded-full md:border-2 md:border-[#000]">

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={value.opacity ?? 1}
            onChange={(e) =>
              onChange({ ...value, opacity: Number(e.target.value) })
            }
            className="w-full h-[2px] accent-[#331400] dark:accent-[#FED45C]"
          />
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold tracking-wide text-[#666464] uppercase dark:text-[#F5EEE4]/50">
          Shadow
        </p>
        <div className="flex  gap-2">
          {SHADOWS.map((shadow) => (
            <button
              key={shadow.value}
              type="button"
              onClick={() =>
                onChange({ ...value, boxShadow: shadowFromType(shadow.value) })
              }
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 border py-2 text-center text-xs font-medium",
                activeShadow === shadow.value
                  ? "border-[#331400] bg-[#331400]/5 dark:border-[#F5EEE4] dark:bg-white/5"
                  : "border-[#331400]/15 text-[#666464] dark:border-[#F5EEE4]/15",
              )}
            >
              <img
                src={shadow.icon}
                alt={shadow.label}
                className="h-5 w-5 brightness-0 dark:invert object-contain"
              />
              {shadow.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
