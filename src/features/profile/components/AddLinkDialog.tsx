import { useRef, useState } from 'react'
import { Link as LinkIcon, Plus } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Field, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'
import { Switch } from '@/shared/components/ui/switch'
import { getApiErrorMessage } from '@/shared/lib/api-error'
import { cn } from '@/shared/lib/utils'
import { toast } from '@/shared/lib/toast'

import { useCreateLink, useUpdateLink, useUpdateLinkIcon } from '@/features/links'
import { LINK_PLATFORM_OPTIONS, getLinkTitlePlaceholder, getLinkUrlPlaceholder } from '@/features/links/platforms'

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim()
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

export function AddLinkDialog() {
  const createMutation = useCreateLink()
  const updateMutation = useUpdateLink()
  const updateIconMutation = useUpdateLinkIcon()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [platform, setPlatform] = useState<string>(LINK_PLATFORM_OPTIONS[0].value)
  const [isVisible, setIsVisible] = useState(true)
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [iconPreviewUrl, setIconPreviewUrl] = useState<string | null>(null)

  const isCustom = platform === 'CUSTOM'

  const reset = () => {
    setTitle('')
    setUrl('')
    setPlatform(LINK_PLATFORM_OPTIONS[0].value)
    setIsVisible(true)
    setIconFile(null)
    setIconPreviewUrl(null)
  }

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    setIconFile(file)
    setIconPreviewUrl(URL.createObjectURL(file))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !url.trim()) {
      toast.warning('Please fill in both title and URL')
      return
    }

    createMutation.mutate(
      { title: title.trim(), url: normalizeUrl(url), platform },
      {
        onSuccess: (res) => {
          const finish = () => {
            toast.success('Link added')
            setOpen(false)
            reset()
          }
          const applyVisibility = () => {
            if (!isVisible) {
              updateMutation.mutate({ id: res.data.id, payload: { isVisible: false } }, { onSuccess: finish, onError: finish })
            } else {
              finish()
            }
          }
          if (iconFile) {
            updateIconMutation.mutate({ id: res.data.id, file: iconFile }, { onSuccess: applyVisibility, onError: applyVisibility })
          } else {
            applyVisibility()
          }
        },
        onError: (error) => toast.error('Could not add link', { description: getApiErrorMessage(error) }),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (setOpen(next), !next && reset())}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 bg-[#331400] py-3 text-sm font-semibold text-[#FED45C] hover:bg-[#4a2c1a]"
          />
        }
      >
        <Plus className="h-4 w-4" />
        Add new link
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a link</DialogTitle>
          <DialogDescription>It'll show up on your profile right away.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="link-platform">Platform</FieldLabel>
            <select
              id="link-platform"
              value={platform}
              onChange={(e) => {
                setPlatform(e.target.value)
                if (e.target.value !== 'CUSTOM') {
                  setIconFile(null)
                  setIconPreviewUrl(null)
                }
              }}
              className={cn(
                'h-8 w-full border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30',
              )}
            >
              {LINK_PLATFORM_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>

          {isCustom && (
            <Field>
              <FieldLabel>Icon</FieldLabel>
              <div className="flex items-center gap-3">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleIconChange} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-dashed border-[#331400]/30 bg-[#331400]/5 hover:bg-[#331400]/10 dark:border-[#F5EEE4]/30 dark:bg-white/5"
                >
                  {iconPreviewUrl ? (
                    <img src={iconPreviewUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <LinkIcon className="h-4 w-4 text-[#331400]/50 dark:text-[#F5EEE4]/50" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-[#331400] hover:underline dark:text-[#F5EEE4]"
                >
                  {iconPreviewUrl ? 'Change icon' : 'Upload an icon'}
                </button>
              </div>
            </Field>
          )}

          <Field>
            <FieldLabel htmlFor="link-title">Title</FieldLabel>
            <Input
              id="link-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={getLinkTitlePlaceholder(platform)}
              autoFocus
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="link-url">URL</FieldLabel>
            <Input
              id="link-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={getLinkUrlPlaceholder(platform)}
            />
          </Field>

          <Field orientation="horizontal">
            <Switch checked={isVisible} onCheckedChange={setIsVisible} />
            <FieldLabel>Visible on profile</FieldLabel>
          </Field>

          <DialogFooter>
            <Button type="submit" disabled={createMutation.isPending} className="bg-[#FED45C] text-[#331400] hover:bg-[#FED45C]/90">
              {createMutation.isPending ? 'Adding…' : 'Add link'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
