import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { LinkIcon } from 'lucide-react'
import { useState } from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { getApiErrorMessage } from '@/shared/lib/api-error'
import { toast } from '@/shared/lib/toast'

import { useDeleteLink, useReorderLinks, useUpdateLink } from '@/features/links'
import type { Link } from '@/features/links/types'

import { LinkRow } from '@/features/profile/components/LinkRow'

interface LinkListProps {
  links: Link[]
}

export function LinkList({ links }: LinkListProps) {
  const reorderMutation = useReorderLinks()
  const updateMutation = useUpdateLink()
  const deleteMutation = useDeleteLink()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Link | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 3 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const sorted = [...links].sort((a, b) => a.displayOrder - b.displayOrder)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = sorted.findIndex((l) => l.id === active.id)
    const newIndex = sorted.findIndex((l) => l.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(sorted, oldIndex, newIndex)
    reorderMutation.mutate(
      reordered.map((link, index) => ({ id: link.id, displayOrder: index })),
      { onError: () => toast.error('Failed to save new order') },
    )
  }

  const handleSaveEdit = (link: Link, title: string, url: string) => {
    // The backend requires `platform` whenever `url` is present in the body — even
    // unchanged — for any URL it can't auto-detect as a known social platform.
    updateMutation.mutate(
      { id: link.id, payload: { title, url, platform: link.platform } },
      {
        onSuccess: () => {
          setEditingId(null)
          toast.success('Link updated')
        },
        onError: (error) => toast.error('Could not update link', { description: getApiErrorMessage(error) }),
      },
    )
  }

  const handleToggleVisible = (link: Link, isVisible: boolean) => {
    updateMutation.mutate(
      { id: link.id, payload: { isVisible } },
      { onError: (error) => toast.error('Could not update link', { description: getApiErrorMessage(error) }) },
    )
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success('Link deleted')
        setDeleteTarget(null)
      },
      onError: (error) => {
        toast.error('Could not delete link', { description: getApiErrorMessage(error) })
        setDeleteTarget(null)
      },
    })
  }

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 border border-dashed border-[#331400]/20 py-10 text-center dark:border-[#F5EEE4]/20">
        <LinkIcon className="h-6 w-6 text-[#331400]/30 dark:text-[#F5EEE4]/30" />
        <p className="text-sm text-[#666464] dark:text-[#F5EEE4]/50">No links yet — add your first one below.</p>
      </div>
    )
  }

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sorted.map((l) => l.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {sorted.map((link) => (
              <LinkRow
                key={link.id}
                link={link}
                isEditing={editingId === link.id}
                onStartEdit={() => setEditingId(link.id)}
                onSaveEdit={(title, url) => handleSaveEdit(link, title, url)}
                onCancelEdit={() => setEditingId(null)}
                onToggleVisible={(isVisible) => handleToggleVisible(link, isVisible)}
                onRequestDelete={() => setDeleteTarget(link)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete link?</DialogTitle>
            <DialogDescription>
              "{deleteTarget?.title}" will be removed from your profile. This can't be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting…' : 'Yes, delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
