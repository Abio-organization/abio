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
        <select
          value={currentFontName}
          onChange={(e) => onChange({ ...value, fontFamily: `'${e.target.value}', sans-serif` })}
          className="w-full border border-[#331400]/15 px-3 py-2 text-sm text-[#331400] outline-none focus:border-[#331400] dark:border-[#F5EEE4]/15 bg-[#DCDCDC] dark:bg-transparent dark:text-[#F5EEE4] dark:focus:border-[#F5EEE4]"
          style={{ fontFamily: `'${currentFontName}', sans-serif` }}
        >
          {FONT_OPTIONS.map((font) => (
            <option
              key={font}
              value={font}
              style={{ fontFamily: `'${font}', sans-serif` }}
            >
              {font}
            </option>
          ))}
        </select>
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
        <div className="max-w-[350px] sm:max-w-none">
          <ColorPicker value={value.fillColor} onChange={(color) => onChange({ ...value, fillColor: color ?? '#ffffff' })} />
        </div>
      </div>
    </div>
  )
}