import { useState } from 'react'

import type { ButtonStyle, FontStyle } from '@/features/appearance/types'
import { cn } from '@/shared/lib/utils'

import { CornerStyleEditor } from './CornerStyleEditor'
import { FontStyleEditor } from './FontStyleEditor'

type StyleTab = 'corner' | 'font'

interface ButtonAndFontTabsProps {
  buttonStyle: ButtonStyle
  fontStyle: FontStyle
  onButtonStyleChange: (value: ButtonStyle) => void
  onFontStyleChange: (value: FontStyle) => void
}

export function ButtonAndFontTabs({ buttonStyle, fontStyle, onButtonStyleChange, onFontStyleChange }: ButtonAndFontTabsProps) {
  const [tab, setTab] = useState<StyleTab>('corner')

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {(['corner', 'font'] as const).map((key) => (
          <button
            key={key}
            type="button"
            className={cn(
              'px-3 py-1.5 text-sm font-medium capitalize',
              tab === key ? 'bg-[#331400] text-white dark:bg-[#F5EEE4] dark:text-[#331400]' : 'bg-[#331400]/5 text-[#666464] dark:bg-white/5 dark:text-[#F5EEE4]/60',
            )}
            onClick={() => setTab(key)}
          >
            {key === 'corner' ? 'Buttons' : 'Font'}
          </button>
        ))}
      </div>
      {tab === 'corner' ? (
        <CornerStyleEditor value={buttonStyle} onChange={onButtonStyleChange} />
      ) : (
        <FontStyleEditor value={fontStyle} onChange={onFontStyleChange} />
      )}
    </div>
  )
}
