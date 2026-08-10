import { useState } from 'react'

import { ButtonCustomizer } from '@/features/appearance/components/ButtonCustomizer'
import { FontCustomizer } from '@/features/appearance/components/FontCustomizer'
import type { ButtonStyle, FontStyle } from '@/features/appearance/types'

type StyleTab = 'corner' | 'font'

interface ButtonAndFontTabsProps {
  buttonStyle: ButtonStyle
  fontStyle: FontStyle
  onButtonStyleChange: (value: ButtonStyle) => void
  onFontStyleChange: (value: FontStyle) => void
}

export function ButtonAndFontTabs({
  buttonStyle,
  fontStyle,
  onButtonStyleChange,
  onFontStyleChange,
}: ButtonAndFontTabsProps) {
  const [tab, setTab] = useState<StyleTab>('corner')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {(['corner', 'font'] as const).map((key) => (
          <button
            key={key}
            type="button"
            className={`rounded-lg px-3 py-1.5 text-sm capitalize ${tab === key ? 'bg-neutral-900 text-white' : 'bg-neutral-100'}`}
            onClick={() => setTab(key)}
          >
            {key}
          </button>
        ))}
      </div>
      {tab === 'corner' ? (
        <ButtonCustomizer value={buttonStyle} onChange={onButtonStyleChange} />
      ) : (
        <FontCustomizer value={fontStyle} onChange={onFontStyleChange} />
      )}
    </div>
  )
}
