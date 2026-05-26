import { useRef } from 'react'

interface WallpaperSelectorProps {
  selectedTheme: string
  onFillSelect: (color: string) => void
  onImageSelect: (file: File) => void
}

export function WallpaperSelector({
  selectedTheme,
  onFillSelect,
  onImageSelect,
}: WallpaperSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-lg border px-3 py-2 text-sm"
          onClick={() => onFillSelect('#f5f5f5')}
        >
          Fill
        </button>
        <button
          type="button"
          className="rounded-lg border px-3 py-2 text-sm"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload image
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onImageSelect(file)
        }}
      />
      <p className="text-xs text-neutral-500">Current preview: {selectedTheme}</p>
    </div>
  )
}
