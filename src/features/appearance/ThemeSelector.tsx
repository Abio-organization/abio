const PRESET_THEMES = Array.from({ length: 6 }, (_, i) => `/themes/theme${i + 1}.png`)

interface ThemeSelectorProps {
  selectedTheme: string
  onSelect: (theme: string) => void
}

export function ThemeSelector({ selectedTheme, onSelect }: ThemeSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {PRESET_THEMES.map((theme) => (
        <button
          key={theme}
          type="button"
          className={`aspect-square overflow-hidden rounded-lg border-2 ${selectedTheme === theme ? 'border-neutral-900' : 'border-transparent'}`}
          onClick={() => onSelect(theme)}
        >
          <img src={theme} alt="" className="h-full w-full object-cover" />
        </button>
      ))}
    </div>
  )
}
