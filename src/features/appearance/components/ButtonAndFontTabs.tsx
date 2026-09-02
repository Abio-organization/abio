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
    <div className="flex flex-col dark:lg:bg-transparent  lg:max-w-3xl lg:bg-white lg:shadow-sm lg:p-6 mt-4  gap-4">
      <div className="flex gap-2 ">
        {(['corner', 'font'] as const).map((key) => (
          <button
            key={key}
            type="button"
            className={cn(
              'relative px-3 py-1.5 text-sm font-medium capitalize',
              tab === key ? 'text-[#331400] dark:text-[#F5EEE4]' : 'text-[#666464] dark:text-[#F5EEE4]/50',
            )}
            onClick={() => setTab(key)}
          >
            {key === 'corner' ? 'Corner' : 'Font'}
            {tab === key && <span className="absolute right-0 bottom-0 left-0 h-0.5 bg-red-500" />}
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
