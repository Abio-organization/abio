import { Plus, X } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

const PRESET_COLORS = [
  '#FFFFFF',
  '#000000',
  '#331400',
  '#6B7280',
  '#EF4444',
  '#F97316',
  '#FBBF24',
  '#22C55E',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
]

interface ColorPickerProps {
  /** null means "none" — only meaningful when allowNone is set. */
  value: string | null | undefined
  onChange: (color: string | null) => void
  allowNone?: boolean
}

const swatchBase = 'relative flex h-8 shadow-md w-8 shrink-0 items-center justify-center overflow-hidden border-2 transition-transform hover:scale-105'

export function ColorPicker({ value, onChange, allowNone }: ColorPickerProps) {
  return (
    <div className="flex lg:flex-wrap max-w-full snap-x snap-mandatory items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {allowNone && (
        <button
          type="button"
          onClick={() => onChange(null)}
          title="None"
          className={cn(swatchBase, 'bg-white', !value ? 'border-[#331400] dark:border-[#F5EEE4]' : 'border-transparent')}
        >
          <X className="h-4 w-4 text-red-500" strokeWidth={2.5} />
        </button>
      )}
       <label
        className={cn(swatchBase, 'cursor-pointer border-transparent')}
        style={{ background: 'conic-gradient(from 180deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)' }}
      >
        <Plus className="h-4 w-4 text-white drop-shadow" />
        <input
          type="color"
          value={value && value.startsWith('#') ? value : '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </label>
      {PRESET_COLORS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          title={color}
          style={{ backgroundColor: color }}
          className={cn(
            swatchBase,
            color.toUpperCase() === value?.toUpperCase() ? 'border-[#331400] dark:border-[#F5EEE4]' : 'border-transparent',
            color === '#FFFFFF' && 'ring-1 ring-inset ring-black/10',
          )}
        />
      ))}

     
    </div>
  )
}
