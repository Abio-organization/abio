import { RotateCcw, RotateCw } from 'lucide-react'

import { useAppearanceEditorStore } from '@/features/appearance/store/appearance-editor-store'
import { cn } from '@/shared/lib/utils'

const buttonClass =
  'flex h-9 w-9 items-center justify-center bg-[#FED45C] text-[#331400] transition-all hover:bg-[#fdd935] disabled:cursor-not-allowed disabled:opacity-40'

export function UndoRedoControls({ className }: { className?: string }) {
  const canUndo = useAppearanceEditorStore((s) => s.canUndo)
  const canRedo = useAppearanceEditorStore((s) => s.canRedo)
  const undo = useAppearanceEditorStore((s) => s.undo)
  const redo = useAppearanceEditorStore((s) => s.redo)

  if (!canUndo && !canRedo) return null

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <button type="button" title="Undo (Ctrl+Z)" onClick={undo} disabled={!canUndo} className={buttonClass}>
        <RotateCcw className="h-4 w-4" />
      </button>
      <button type="button" title="Redo (Ctrl+Shift+Z)" onClick={redo} disabled={!canRedo} className={buttonClass}>
        <RotateCw className="h-4 w-4" />
      </button>
    </div>
  )
}
