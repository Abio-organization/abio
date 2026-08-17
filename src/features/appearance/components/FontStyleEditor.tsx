import { Italic, Type, Underline } from 'lucide-react'
import { useEffect } from 'react'

import { ensureGoogleFontsLoaded, FONT_OPTIONS, fontFamilyToApiName } from '@/features/appearance/lib'
import type { FontStyle, FontWeight } from '@/features/appearance/types'
import { cn } from '@/shared/lib/utils'

import { ColorPicker } from './ColorPicker'

interface FontStyleEditorProps {
  value: FontStyle
  onChange: (next: FontStyle) => void
}

const WEIGHTS: Array<{ label: string; value: FontWeight }> = [
  { label: 'Regular', value: 'regular' },
  { label: 'Medium', value: 'medium' },
  { label: 'Semibold', value: 'semibold' },
  { label: 'Bold', value: 'bold' },
]

export function FontStyleEditor({ value, onChange }: FontStyleEditorProps) {
  useEffect(() => {
    ensureGoogleFontsLoaded()
  }, [])

  const currentFontName = fontFamilyToApiName(value.fontFamily)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-2 text-xs font-semibold tracking-wide text-[#666464] uppercase dark:text-[#F5EEE4]/50">Font family</p>
        <div className="grid grid-cols-2 gap-2">
          {FONT_OPTIONS.map((font) => (
            <button
              key={font}
              type="button"
              onClick={() => onChange({ ...value, fontFamily: `'${font}', sans-serif` })}
              style={{ fontFamily: `'${font}', sans-serif` }}
              className={cn(
                'border px-3 py-2 text-left text-sm',
                currentFontName === font
                  ? 'border-[#331400] bg-[#331400]/5 dark:border-[#F5EEE4] dark:bg-white/5'
                  : 'border-[#331400]/15 text-[#666464] dark:border-[#F5EEE4]/15',
              )}
            >
              {font}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold tracking-wide text-[#666464] uppercase dark:text-[#F5EEE4]/50">Style</p>
        <div className="flex gap-2">
          <button
            type="button"
            title="Normal"
            onClick={() => onChange({ ...value, italic: false })}
            className={cn(
              'flex h-9 w-9 items-center justify-center border',
              !value.italic ? 'border-[#331400] bg-[#331400]/5 dark:border-[#F5EEE4] dark:bg-white/5' : 'border-[#331400]/15 dark:border-[#F5EEE4]/15',
            )}
          >
            <Type className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Italic"
            onClick={() => onChange({ ...value, italic: !value.italic })}
            className={cn(
              'flex h-9 w-9 items-center justify-center border',
              value.italic ? 'border-[#331400] bg-[#331400]/5 dark:border-[#F5EEE4] dark:bg-white/5' : 'border-[#331400]/15 dark:border-[#F5EEE4]/15',
            )}
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Underline"
            onClick={() => onChange({ ...value, underline: !value.underline })}
            className={cn(
              'flex h-9 w-9 items-center justify-center border',
              value.underline ? 'border-[#331400] bg-[#331400]/5 dark:border-[#F5EEE4] dark:bg-white/5' : 'border-[#331400]/15 dark:border-[#F5EEE4]/15',
            )}
          >
            <Underline className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold tracking-wide text-[#666464] uppercase dark:text-[#F5EEE4]/50">Weight</p>
        <div className="flex flex-wrap gap-2">
          {WEIGHTS.map((weight) => (
            <button
              key={weight.value}
              type="button"
              onClick={() => onChange({ ...value, weight: weight.value })}
              className={cn(
                'border px-3 py-1.5 text-xs font-medium',
                value.weight === weight.value
                  ? 'border-[#331400] bg-[#331400]/5 dark:border-[#F5EEE4] dark:bg-white/5'
                  : 'border-[#331400]/15 text-[#666464] dark:border-[#F5EEE4]/15',
              )}
            >
              {weight.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold tracking-wide text-[#666464] uppercase dark:text-[#F5EEE4]/50">Text color</p>
        <ColorPicker value={value.fillColor} onChange={(color) => onChange({ ...value, fillColor: color ?? '#ffffff' })} />
      </div>
    </div>
  )
}
