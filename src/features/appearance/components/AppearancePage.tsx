import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { PhoneDisplay } from '@/shared/components/PhoneDisplay'
import { Button } from '@/shared/components/ui/button'
import { ButtonAndFontTabs } from '@/features/appearance/components/ButtonAndFontTabs'
import { ThemeSelector } from '@/features/appearance/components/ThemeSelector'
import { WallpaperSelector } from '@/features/appearance/components/WallpaperSelector'
import { ProfileContent } from '@/features/profile/components/ProfileContent'
import { usePhoneDisplayProps } from '@/shared/hooks/usePhoneDisplayProps'
type AppearanceTab = 'profile' | 'style' | 'themes' | 'wallpaper'

export function AppearancePage() {
  const saved = usePhoneDisplayProps()
  const [tab, setTab] = useState<AppearanceTab>('profile')
  const [buttonStyle, setButtonStyle] = useState(saved.buttonStyle)
  const [fontStyle, setFontStyle] = useState(saved.fontStyle)
  const [selectedTheme, setSelectedTheme] = useState(saved.selectedTheme)
  const [settingsSynced, setSettingsSynced] = useState(false)

  useEffect(() => {
    if (settingsSynced || saved.isLoading) return
    setButtonStyle(saved.buttonStyle)
    setFontStyle(saved.fontStyle)
    setSelectedTheme(saved.selectedTheme)
    setSettingsSynced(true)
  }, [
    settingsSynced,
    saved.isLoading,
    saved.buttonStyle,
    saved.fontStyle,
    saved.selectedTheme,
  ])

  const tabs: { id: AppearanceTab; label: string }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'style', label: 'Style' },
    { id: 'themes', label: 'Themes' },
    { id: 'wallpaper', label: 'Wallpaper' },
  ]

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-neutral-900">Appearance</h1>
          <Button
            type="button"
            onClick={() => toast.message('useUpdateAppearanceAll — implement next')}
          >
            Save Changes
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`rounded-lg px-3 py-1.5 text-sm ${tab === t.id ? 'bg-neutral-900 text-white' : 'bg-neutral-100'}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab === 'profile' ? <ProfileContent /> : null}
        {tab === 'style' ? (
          <ButtonAndFontTabs
            buttonStyle={buttonStyle}
            fontStyle={fontStyle}
            onButtonStyleChange={setButtonStyle}
            onFontStyleChange={setFontStyle}
          />
        ) : null}
        {tab === 'themes' ? (
          <ThemeSelector selectedTheme={selectedTheme} onSelect={setSelectedTheme} />
        ) : null}
        {tab === 'wallpaper' ? (
          <WallpaperSelector
            selectedTheme={selectedTheme}
            onFillSelect={(color) => setSelectedTheme(`fill:${color}`)}
            onImageSelect={(file) => setSelectedTheme(URL.createObjectURL(file))}
          />
        ) : null}
      </div>
      <div className="flex justify-center">
        <PhoneDisplay
          buttonStyle={buttonStyle}
          fontStyle={fontStyle}
          selectedTheme={selectedTheme}
          profile={saved.profile}
          links={saved.links}
        />
      </div>
    </div>
  )
}
