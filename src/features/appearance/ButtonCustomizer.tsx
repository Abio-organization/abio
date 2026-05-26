import type { ButtonStyle } from '@/types/appearance.types'

interface ButtonCustomizerProps {
  value: ButtonStyle
  onChange: (value: ButtonStyle) => void
}

export function ButtonCustomizer({ value, onChange }: ButtonCustomizerProps) {
  return (
    <div className="flex flex-col gap-3 text-sm text-neutral-600">
      <p>Corner styles (sharp / round / curved) — preview only until Save.</p>
      <button
        type="button"
        className="rounded-lg border px-3 py-2 text-left"
        onClick={() =>
          onChange({ ...value, borderRadius: '9999px', boxShadow: value.boxShadow })
        }
      >
        Round corners
      </button>
    </div>
  )
}
