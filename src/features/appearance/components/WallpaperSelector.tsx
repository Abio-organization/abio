import { Upload } from 'lucide-react'
import { useRef, useState } from 'react'

import { toast } from '@/shared/lib/toast'
import { cn } from '@/shared/lib/utils'

import { ColorPicker } from './ColorPicker'

type WallpaperMode = 'fill' | 'gradient' | 'image'

interface WallpaperSelectorProps {
  wallpaper: string
  onWallpaperChange: (next: string) => void
  onFileChange: (file: File | null) => void
}

function modeFromWallpaper(wallpaper: string): WallpaperMode {
  if (wallpaper.startsWith('fill:')) return 'fill'
  if (wallpaper.startsWith('gradient:')) return 'gradient'
  return 'image'
}

function parseGradient(wallpaper: string): [string, string] {
  if (!wallpaper.startsWith('gradient:')) return ['#331400', '#FED45C']
  const [, a, b] = wallpaper.split(':')
  return [a || '#331400', b || '#FED45C']
}

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024

export function WallpaperSelector({ wallpaper, onWallpaperChange, onFileChange }: WallpaperSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [mode, setMode] = useState<WallpaperMode>(modeFromWallpaper(wallpaper))
  const [gradientStart, gradientEnd] = parseGradient(wallpaper)

  const handleModeChange = (next: WallpaperMode) => {
    setMode(next)
    if (next === 'fill') onWallpaperChange(`fill:${wallpaper.startsWith('fill:') ? wallpaper.slice(5) : '#331400'}`)
    if (next === 'gradient') onWallpaperChange(`gradient:${gradientStart}:${gradientEnd}`)
    // 'image' mode waits for the user to actually pick a file — no-op until then.
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error('Image is too large', { description: 'Please choose a file under 10MB.' })
      return
    }
    onFileChange(file)
    onWallpaperChange(URL.createObjectURL(file))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {(['fill', 'gradient', 'image'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleModeChange(option)}
            className={cn(
              'flex-1 border py-2 text-xs font-medium capitalize',
              mode === option
                ? 'border-[#331400] bg-[#331400]/5 dark:border-[#F5EEE4] dark:bg-white/5'
                : 'border-[#331400]/15 text-[#666464] dark:border-[#F5EEE4]/15',
            )}
          >
            {option}
          </button>
        ))}
      </div>

      {mode === 'fill' && (
        <div>
          <p className="mb-2 text-xs font-semibold tracking-wide text-[#666464] uppercase dark:text-[#F5EEE4]/50">Background color</p>
          <ColorPicker
            value={wallpaper.startsWith('fill:') ? wallpaper.slice(5) : '#331400'}
            onChange={(color) => onWallpaperChange(`fill:${color ?? '#331400'}`)}
          />
        </div>
      )}

      {mode === 'gradient' && (
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-[#666464] uppercase dark:text-[#F5EEE4]/50">Start color</p>
            <ColorPicker value={gradientStart} onChange={(color) => onWallpaperChange(`gradient:${color ?? gradientStart}:${gradientEnd}`)} />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide text-[#666464] uppercase dark:text-[#F5EEE4]/50">End color</p>
            <ColorPicker value={gradientEnd} onChange={(color) => onWallpaperChange(`gradient:${gradientStart}:${color ?? gradientEnd}`)} />
          </div>
          <div className="h-12 w-full" style={{ background: `linear-gradient(180deg, ${gradientStart}, ${gradientEnd})` }} />
        </div>
      )}

      {mode === 'image' && (
        <div className="flex flex-col gap-3">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
          {wallpaper && !wallpaper.startsWith('fill:') && !wallpaper.startsWith('gradient:') ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-9/12 w-full max-w-40 overflow-hidden border border-[#331400]/15 dark:border-[#F5EEE4]/15"
            >
              <img src={wallpaper} alt="" className="h-full w-full object-cover" />
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-medium text-white opacity-0 hover:opacity-100">
                Change
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 border border-dashed border-[#331400]/30 py-8 text-[#666464] hover:border-[#331400] dark:border-[#F5EEE4]/30 dark:text-[#F5EEE4]/60"
            >
              <Upload className="h-5 w-5" />
              <span className="text-xs font-medium">Upload an image</span>
              <span className="text-[10px] text-[#666464]/60 dark:text-[#F5EEE4]/40">JPG, PNG or WebP, up to 10MB</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
