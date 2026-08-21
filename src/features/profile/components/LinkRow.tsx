import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { BarChart2, GripVertical, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Input } from '@/shared/components/ui/input'
import { Switch } from '@/shared/components/ui/switch'
import { cn } from '@/shared/lib/utils'
import { getPlatformIcon } from '@/shared/components/PlatformIcon'

import type { Link } from '@/features/links/types'

interface LinkRowProps {
  link: Link
  isEditing: boolean
  onStartEdit: () => void
  onSaveEdit: (title: string, url: string) => void
  onCancelEdit: () => void
  onToggleVisible: (isVisible: boolean) => void
  onRequestDelete: () => void
}

export function LinkRow({ link, isEditing, onStartEdit, onSaveEdit, onCancelEdit, onToggleVisible, onRequestDelete }: LinkRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id })
  const [title, setTitle] = useState(link.title)
  const [url, setUrl] = useState(link.url)
  const titleInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      setTitle(link.title)
      setUrl(link.url)
      titleInputRef.current?.focus()
    }
  }, [isEditing, link.title, link.url])

  const handleSave = () => {
    if (!title.trim() || !url.trim()) return
    onSaveEdit(title.trim(), url.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    }
    if (e.key === 'Escape') onCancelEdit()
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-link-id={link.id}
      className={cn(
        'flex items-center gap-2 border border-[#331400]/10 bg-white p-3 dark:border-[#F5EEE4]/10 dark:bg-white/5',
        isDragging && 'opacity-50',
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="shrink-0 cursor-grab touch-none text-[#331400]/30 active:cursor-grabbing dark:text-[#F5EEE4]/30"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full text-[#331400] dark:text-[#F5EEE4]">
        {link.icon_link ? (
          <img src={link.icon_link} alt="" className="h-full w-full object-cover" />
        ) : (
          getPlatformIcon(link.platform, 'h-5 w-5')
        )}
      </div>

      {isEditing ? (
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-center">
          <Input
            ref={titleInputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Title"
            className="h-9 sm:w-1/3"
          />
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://…"
            className="h-9 flex-1"
          />
        </div>
      ) : (
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[#331400] dark:text-[#F5EEE4]">{link.title}</p>
          <p className="truncate text-xs text-[#666464] dark:text-[#F5EEE4]/50">{link.url}</p>
        </div>
      )}

      {isEditing ? (
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={handleSave} className="text-xs font-semibold text-green-600 hover:text-green-700">
            Save
          </button>
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs font-semibold text-[#666464] hover:text-[#331400] dark:hover:text-[#F5EEE4]"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden items-center gap-1 text-xs text-[#666464] sm:flex dark:text-[#F5EEE4]/50">
            <BarChart2 className="h-3.5 w-3.5" />
            {link.clickCount}
          </span>
          <Switch checked={link.isVisible} onCheckedChange={onToggleVisible} />
          <button
            type="button"
            onClick={onStartEdit}
            className="text-[#331400]/40 hover:text-[#331400] dark:text-[#F5EEE4]/40 dark:hover:text-[#F5EEE4]"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button type="button" onClick={onRequestDelete} className="text-[#331400]/40 hover:text-red-600 dark:text-[#F5EEE4]/40">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
