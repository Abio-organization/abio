import { useRef, useState } from 'react'
import { FileText, Upload } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Field, FieldLabel } from '@/shared/components/ui/field'
import { Textarea } from '@/shared/components/ui/textarea'
import { getApiErrorMessage } from '@/shared/lib/api-error'
import { toast } from '@/shared/lib/toast'

import { useCreateBadgeRequest } from '../hooks/use-badges'

const REASON_MIN = 10
const REASON_MAX = 1000
const MAX_FILE_BYTES = 5 * 1024 * 1024
const ACCEPTED_TYPES = ['image/', 'application/pdf']

interface VerificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VerificationDialog({ open, onOpenChange }: VerificationDialogProps) {
  const createMutation = useCreateBadgeRequest()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [reason, setReason] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const reset = () => {
    setReason('')
    setFile(null)
  }

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next)
    if (!next) reset()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0]
    if (!picked) return
    if (!ACCEPTED_TYPES.some((type) => picked.type.startsWith(type))) {
      toast.error('Please upload an image or PDF')
      return
    }
    if (picked.size > MAX_FILE_BYTES) {
      toast.error('File must be 5MB or smaller')
      return
    }
    setFile(picked)
  }

  const trimmedReason = reason.trim()
  const canSubmit = trimmedReason.length >= REASON_MIN && trimmedReason.length <= REASON_MAX && Boolean(file)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      toast.warning('Please attach a government ID or business certificate')
      return
    }
    if (trimmedReason.length < REASON_MIN) {
      toast.warning(`Tell us a bit more — at least ${REASON_MIN} characters`)
      return
    }

    createMutation.mutate(
      { reason: trimmedReason, idDocument: file },
      {
        onSuccess: () => {
          toast.success('Application submitted', { description: "We'll review it within 24–48 hours." })
          handleOpenChange(false)
        },
        onError: (error) => toast.error('Could not submit application', { description: getApiErrorMessage(error) }),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Apply for verification</DialogTitle>
          <DialogDescription>
            Prove you're authentic. Verification is free and helps build trust with your audience.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field>
            <FieldLabel htmlFor="verification-reason">Why should you be verified?</FieldLabel>
            <Textarea
              id="verification-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Tell us why you deserve a verification badge (10–1000 characters)"
              rows={4}
              maxLength={REASON_MAX}
            />
            <p className="text-right text-xs text-[#331400]/45 dark:text-[#F5EEE4]/45">
              {reason.trim().length}/{REASON_MAX}
            </p>
          </Field>

          <Field>
            <FieldLabel>Government ID or business certificate</FieldLabel>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-3 border border-dashed border-[#331400]/30 bg-[#331400]/5 px-3 py-3 text-left hover:bg-[#331400]/10 dark:border-[#F5EEE4]/30 dark:bg-white/5 dark:hover:bg-white/10"
            >
              {file ? (
                <FileText className="h-5 w-5 shrink-0 text-[#331400] dark:text-[#F5EEE4]" />
              ) : (
                <Upload className="h-5 w-5 shrink-0 text-[#331400]/50 dark:text-[#F5EEE4]/50" />
              )}
              <span className="min-w-0 flex-1 truncate text-sm">
                {file ? file.name : 'Choose file — PDF or image, max 5MB'}
              </span>
            </button>
          </Field>

          <DialogFooter>
            <Button
              type="submit"
              disabled={!canSubmit || createMutation.isPending}
              className="h-10 w-full bg-[#FED45C] text-[#331400] shadow-[4px_4px_0px_0px_#000000] hover:bg-[#FED45C]/90"
            >
              {createMutation.isPending ? 'Submitting…' : 'Submit application'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
