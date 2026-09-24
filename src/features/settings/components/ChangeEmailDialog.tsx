import { useState } from 'react'

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
import { Input } from '@/shared/components/ui/input'
import { getApiErrorMessage } from '@/shared/lib/api-error'
import { toast } from '@/shared/lib/toast'

import { useUpdateAccountEmail } from '../hooks/use-account-settings'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface ChangeEmailDialogProps {
  currentEmail: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChangeEmailDialog({ currentEmail, open, onOpenChange }: ChangeEmailDialogProps) {
  const updateEmailMutation = useUpdateAccountEmail()
  const [email, setEmail] = useState(currentEmail)

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next)
    if (next) setEmail(currentEmail)
  }

  const trimmed = email.trim()
  const isValid = EMAIL_REGEX.test(trimmed)
  const isUnchanged = trimmed === currentEmail

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) {
      toast.warning('Please enter a valid email address')
      return
    }
    if (isUnchanged) {
      handleOpenChange(false)
      return
    }

    updateEmailMutation.mutate(trimmed, {
      onSuccess: () => {
        toast.success('Check your inbox', { description: `We sent a verification link to ${trimmed}.` })
        handleOpenChange(false)
      },
      onError: (error) => toast.error('Could not update email', { description: getApiErrorMessage(error) }),
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Change email</DialogTitle>
          <DialogDescription>We'll send a link to verify your new address before it's confirmed.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field>
            <FieldLabel htmlFor="account-email">Email address</FieldLabel>
            <Input
              id="account-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoFocus
            />
          </Field>

          <DialogFooter>
            <Button
              type="submit"
              disabled={!isValid || updateEmailMutation.isPending}
              className="h-10 w-full bg-[#FED45C] text-[#331400] shadow-[4px_4px_0px_0px_#000000] hover:bg-[#FED45C]/90"
            >
              {updateEmailMutation.isPending ? 'Saving…' : 'Send verification link'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
