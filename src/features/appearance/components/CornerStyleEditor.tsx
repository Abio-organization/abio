import type { ButtonStyle, ShadowType } from '@/features/appearance/types'
import { shadowFromType } from '@/features/appearance/lib'
import { cn } from '@/shared/lib/utils'

import { ColorPicker } from './ColorPicker'

interface CornerStyleEditorProps {
  value: ButtonStyle
  onChange: (next: ButtonStyle) => void
}

const SHAPES: Array<{ label: string; borderRadius: string; preview: string }> = [
  { label: 'Sharp', borderRadius: '0px', preview: 'rounded-none' },
  { label: 'Curved', borderRadius: '12px', preview: 'rounded-xl' },
  { label: 'Round', borderRadius: '9999px', preview: 'rounded-full' },
]

const SHADOWS: Array<{ label: string; value: ShadowType }> = [
  { label: 'None', value: 'none' },
  { label: 'Soft', value: 'soft' },
  { label: 'Hard', value: 'hard' },
]

function shadowTypeOf(boxShadow: string): ShadowType {
  if (boxShadow === 'none') return 'none'
  if (boxShadow.includes('4px 4px 0px')) return 'hard'
  return 'soft'
}

export function CornerStyleEditor({ value, onChange }: CornerStyleEditorProps) {
  const activeShadow = shadowTypeOf(value.boxShadow)
  const opacityPct = Math.round((value.opacity ?? 1) * 100)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs font-semibold tracking-wide text-[#666464] uppercase dark:text-[#F5EEE4]/50">Shape</p>
        <div className="flex gap-2">
          {SHAPES.map((shape) => (
            <button
              key={shape.label}
              type="button"
              onClick={() => onChange({ ...value, borderRadius: shape.borderRadius })}
              className={cn(
                'flex flex-1 flex-col items-center gap-2 border py-3 text-xs font-medium',
                value.borderRadius === shape.borderRadius
                  ? 'border-[#331400] bg-[#331400]/5 dark:border-[#F5EEE4] dark:bg-white/5'
                  : 'border-[#331400]/15 text-[#666464] dark:border-[#F5EEE4]/15',
              )}
            >
              <span className={cn('h-5 w-8 bg-[#331400] dark:bg-[#F5EEE4]', shape.preview)} />
              {shape.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold tracking-wide text-[#666464] uppercase dark:text-[#F5EEE4]/50">Fill color</p>
        <ColorPicker value={value.backgroundColor} onChange={(color) => onChange({ ...value, backgroundColor: color ?? '#331400' })} />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold tracking-wide text-[#666464] uppercase dark:text-[#F5EEE4]/50">Border color</p>
        <ColorPicker
          value={value.borderColor === 'transparent' ? null : value.borderColor}
          onChange={(color) => onChange({ ...value, borderColor: color ?? 'transparent' })}
          allowNone
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold tracking-wide text-[#666464] uppercase dark:text-[#F5EEE4]/50">Opacity</p>
          <span className="text-xs font-medium text-[#331400] dark:text-[#F5EEE4]">{opacityPct}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={value.opacity ?? 1}
          onChange={(e) => onChange({ ...value, opacity: Number(e.target.value) })}
          className="w-full accent-[#331400] dark:accent-[#FED45C]"
        />
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold tracking-wide text-[#666464] uppercase dark:text-[#F5EEE4]/50">Shadow</p>
        <div className="flex gap-2">
          {SHADOWS.map((shadow) => (
            <button
              key={shadow.value}
              type="button"
              onClick={() => onChange({ ...value, boxShadow: shadowFromType(shadow.value) })}
              className={cn(
                'flex-1 border py-2 text-xs font-medium',
                activeShadow === shadow.value
                  ? 'border-[#331400] bg-[#331400]/5 dark:border-[#F5EEE4] dark:bg-white/5'
                  : 'border-[#331400]/15 text-[#666464] dark:border-[#F5EEE4]/15',
              )}
            >
              {shadow.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
