import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Link as LinkIcon, Plus, X } from 'lucide-react'
import { useRef, useState } from 'react'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { getApiErrorStatus } from '@/shared/lib/api-error'
import { queryKeys } from '@/shared/lib/query-keys'
import { toast } from '@/shared/lib/toast'

import { createLink, updateLinkIcon } from '@/features/links/api/links.api'
import { PLATFORMS, getPlatformPlaceholder, buildPlatformUrl } from '@/features/onboarding/data'
import { useOnboardingStore } from '@/features/onboarding/store/onboarding-store'
import { OnboardingLayout } from '@/features/onboarding/components/OnboardingLayout'

const MAX_CUSTOM_LINKS = 5

interface CustomLinkDraft {
  id: string
  url: string
  iconFile: File | null
  iconPreviewUrl: string | null
}

function createCustomLinkDraft(): CustomLinkDraft {
  return { id: crypto.randomUUID(), url: '', iconFile: null, iconPreviewUrl: null }
}

function normalizeCustomUrl(raw: string): string {
  const trimmed = raw.trim()
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

export function LinksStep() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const selectedPlatformIds = useOnboardingStore((s) => s.selectedPlatformIds)
  const resetOnboardingStore = useOnboardingStore((s) => s.reset)

  const selectedPlatforms = PLATFORMS.filter((p) => selectedPlatformIds.includes(p.id))

  const [platformValues, setPlatformValues] = useState<Record<string, string>>({})
  const [customLinks, setCustomLinks] = useState<CustomLinkDraft[]>([createCustomLinkDraft()])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCustomIconChange = (id: string, file: File) => {
    setCustomLinks((links) =>
      links.map((link) => (link.id === id ? { ...link, iconFile: file, iconPreviewUrl: URL.createObjectURL(file) } : link)),
    )
  }

  const handleSubmit = async () => {
    const platformLinks = selectedPlatforms
      .map((platform) => {
        const url = buildPlatformUrl(platform.id, platformValues[platform.id] ?? '')
        return url ? { title: platform.name, url, platform: platform.id, iconFile: null as File | null } : null
      })
      .filter((link) => link !== null)

    const customLinksToSave = customLinks
      .filter((link) => link.url.trim())
      .map((link) => ({ title: 'Custom Link', url: normalizeCustomUrl(link.url), platform: 'custom', iconFile: link.iconFile }))

    const linksToSave = [...platformLinks, ...customLinksToSave]

    if (linksToSave.length === 0) {
      toast.warning('Add at least one link, or skip this step')
      return
    }

    setIsSubmitting(true)
    const results = await Promise.allSettled(
      linksToSave.map(async (link) => {
        try {
          const res = await createLink({ title: link.title, url: link.url, platform: link.platform })
          if (link.iconFile) {
            await updateLinkIcon(res.data.id, link.iconFile)
          }
        } catch (error) {
          if (getApiErrorStatus(error) === 409) return
          throw error
        }
      }),
    )
    setIsSubmitting(false)
    void queryClient.invalidateQueries({ queryKey: queryKeys.links })

    const failedCount = results.filter((r) => r.status === 'rejected').length
    if (failedCount === results.length) {
      toast.error('Failed to save links', { description: 'Please check your links and try again.' })
      return
    }
    if (failedCount > 0) {
      toast.warning(`${failedCount} link(s) failed to save`, { description: `Saved ${results.length - failedCount} of ${results.length}.` })
    } else {
      toast.success('Links saved', { description: `Added ${results.length} link(s).` })
    }

    resetOnboardingStore()
    navigate({ to: '/onboarding/profile' })
  }

  return (
    <OnboardingLayout step={5}>
      <div className="flex flex-1 justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-xl font-bold text-[#331400] md:text-2xl dark:text-[#F5EEE4]">Add your links</h1>
            <p className="text-sm text-[#666464] dark:text-[#F5EEE4]/60">Fill the fields below to add content to your bio.</p>
          </div>

          <div className="space-y-5">
            {selectedPlatforms.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-center text-sm font-semibold text-[#331400] dark:text-[#F5EEE4]">Selected platforms</h2>
                {selectedPlatforms.map((platform) => (
                  <div key={platform.id} className="flex items-center gap-3">
                    <img src={platform.icon} alt="" className="h-8 w-8 shrink-0 object-contain" />
                    <Input
                      placeholder={getPlatformPlaceholder(platform.id, platform.name)}
                      value={platformValues[platform.id] ?? ''}
                      onChange={(e) => setPlatformValues((prev) => ({ ...prev, [platform.id]: e.target.value }))}
                      className="h-11"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <h2 className="text-center text-sm font-semibold text-[#331400] dark:text-[#F5EEE4]">Optional additions</h2>
              {customLinks.map((link) => (
                <CustomLinkRow
                  key={link.id}
                  link={link}
                  onIconChange={(file) => handleCustomIconChange(link.id, file)}
                  onUrlChange={(url) => setCustomLinks((links) => links.map((l) => (l.id === link.id ? { ...l, url } : l)))}
                  onRemove={
                    customLinks.length > 1
                      ? () => setCustomLinks((links) => links.filter((l) => l.id !== link.id))
                      : undefined
                  }
                />
              ))}

              {customLinks.length < MAX_CUSTOM_LINKS && (
                <button
                  type="button"
                  onClick={() => setCustomLinks((links) => [...links, createCustomLinkDraft()])}
                  className="flex w-full items-center justify-center gap-1.5 border border-dashed border-[#331400]/30 py-2 text-xs font-medium text-[#331400]/60 hover:border-[#331400] hover:text-[#331400] dark:border-[#F5EEE4]/30 dark:text-[#F5EEE4]/60 dark:hover:border-[#F5EEE4] dark:hover:text-[#F5EEE4]"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add another link
                </button>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="h-12 w-full bg-[#FED45C] text-sm font-semibold text-[#331400] hover:bg-[#FED45C]/90"
              >
                {isSubmitting ? 'Saving…' : 'Continue'}
              </Button>
              <button
                type="button"
                onClick={() => navigate({ to: '/onboarding/profile' })}
                className="w-full text-sm font-semibold text-[#666464] hover:underline dark:text-[#F5EEE4]/60"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  )
}

interface CustomLinkRowProps {
  link: CustomLinkDraft
  onIconChange: (file: File) => void
  onUrlChange: (url: string) => void
  onRemove?: () => void
}

function CustomLinkRow({ link, onIconChange, onUrlChange, onRemove }: CustomLinkRowProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onIconChange(file)
        }}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#331400]/5 hover:bg-[#331400]/10 dark:bg-white/10 dark:hover:bg-white/20"
      >
        {link.iconPreviewUrl ? (
          <img src={link.iconPreviewUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <LinkIcon className="h-4 w-4 text-[#331400] dark:text-[#F5EEE4]" />
        )}
      </button>
      <Input placeholder="Add link" value={link.url} onChange={(e) => onUrlChange(e.target.value)} className="h-11" />
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="flex h-9 w-9 shrink-0 items-center justify-center text-[#331400]/40 hover:text-[#331400] dark:text-[#F5EEE4]/40 dark:hover:text-[#F5EEE4]"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
