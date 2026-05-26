import type { FontStyle } from '@/types/appearance.types'

interface FontCustomizerProps {
  value: FontStyle
  onChange: (value: FontStyle) => void
}

export function FontCustomizer({ value, onChange }: FontCustomizerProps) {
  return (
    <div className="flex flex-col gap-3 text-sm text-neutral-600">
      <p>Font customization — maps to FontConfig on save.</p>
      <label className="flex flex-col gap-1">
        <span className="font-medium text-neutral-700">Text color</span>
        <input
          type="color"
          value={value.fillColor.startsWith('#') ? value.fillColor : '#ffffff'}
          onChange={(e) => onChange({ ...value, fillColor: e.target.value })}
        />
      </label>
    </div>
  )
}
