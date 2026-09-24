import { useState } from 'react'
import { BadgeCheck, Check, Loader2, Pencil, X } from 'lucide-react'

import { getApiErrorMessage } from '@/shared/lib/api-error'
import { toast } from '@/shared/lib/toast'
import type { User } from '@/features/auth/types'
import { useUpdateProfile, useUsernameAvailability } from '@/features/profile'

import { useBadgeStatus } from '../hooks/use-badges'
import { AccountTypeSection } from './AccountTypeSection'
import { ChangeEmailDialog } from './ChangeEmailDialog'
import { SectionHeader } from './SectionHeader'
import { card, editButton, muted, row } from './styles'
import { VerificationDialog } from './VerificationDialog'

const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/

function UsernameRow({ user }: { user: User }) {
  const updateProfileMutation = useUpdateProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(user.profile?.username ?? '')

  const trimmed = draft.trim()
  const shapeError =
    trimmed.length > 0 && trimmed.length < 3
      ? 'At least 3 characters'
      : trimmed.length > 30
        ? '30 characters or less'
        : trimmed.length > 0 && !USERNAME_REGEX.test(trimmed)
          ? 'Letters, numbers, - and _ only'
          : null

  const { isChecking, isAvailable } = useUsernameAvailability(trimmed, user.profile?.username)
  const isOwn = trimmed === user.profile?.username
  const canSave = trimmed.length >= 3 && !shapeError && (isOwn || isAvailable === true)

  const startEditing = () => {
    setDraft(user.profile?.username ?? '')
    setIsEditing(true)
  }

  const cancel = () => setIsEditing(false)

  const save = () => {
    if (!canSave || isOwn) {
      setIsEditing(false)
      return
    }
    updateProfileMutation.mutate(
      { username: trimmed },
      {
        onSuccess: () => {
          toast.success('Username updated')
          setIsEditing(false)
        },
        onError: (error) => toast.error('Could not update username', { description: getApiErrorMessage(error) }),
      },
    )
  }

  if (!isEditing) {
    return (
      <div className={row}>
        <div>
          <p className="font-medium">Username</p>
          <p className={muted}>{user.profile?.username ? `@${user.profile.username}` : 'Not set'}</p>
        </div>
        <button type="button" onClick={startEditing} className={editButton}>
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
      </div>
    )
  }

  return (
    <div className={row}>
      <div className="min-w-0 flex-1">
        <p className="mb-1.5 font-medium">Username</p>
        <div className="flex items-center gap-2">
          <div className="relative flex h-10 min-w-0 flex-1 items-center border border-[#331400]/20 dark:border-[#F5EEE4]/20">
            <span className="pl-2.5 text-sm text-[#331400]/50 select-none dark:text-[#F5EEE4]/50">@</span>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value.toLowerCase())}
              autoFocus
              className="h-full min-w-0 flex-1 bg-transparent px-1.5 text-sm outline-none"
            />
            {trimmed.length >= 3 && !shapeError && (
              <span className="pr-2.5">
                {isOwn ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : isChecking ? (
                  <Loader2 className="h-4 w-4 animate-spin text-[#331400]/50 dark:text-[#F5EEE4]/50" />
                ) : isAvailable === true ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : isAvailable === false ? (
                  <X className="h-4 w-4 text-red-500" />
                ) : null}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={save}
            disabled={!canSave || updateProfileMutation.isPending}
            className="h-10 shrink-0 bg-[#331400] px-3 text-xs font-semibold text-[#FED45C] disabled:opacity-40 dark:bg-[#FED45C] dark:text-[#331400]"
          >
            Save
          </button>
          <button type="button" onClick={cancel} className="h-10 shrink-0 border border-[#331400]/15 px-3 text-xs font-semibold dark:border-[#F5EEE4]/15">
            Cancel
          </button>
        </div>
        {shapeError && <p className="mt-1.5 text-xs text-red-500">{shapeError}</p>}
      </div>
    </div>
  )
}

function EmailRow({ user }: { user: User }) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <div className={row}>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">Email address</p>
            <span
              className={`px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                user.isEmailVerified ? 'bg-green-500/15 text-green-700 dark:text-green-400' : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
              }`}
            >
              {user.isEmailVerified ? 'Verified' : 'Unverified'}
            </span>
          </div>
          <p className={muted}>{user.email}</p>
        </div>
        <button type="button" onClick={() => setDialogOpen(true)} className={editButton}>
          <Pencil className="h-3.5 w-3.5" />
          Change
        </button>
      </div>
      <ChangeEmailDialog currentEmail={user.email} open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}

function BioRow({ user }: { user: User }) {
  const updateProfileMutation = useUpdateProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(user.profile?.bio ?? '')

  const startEditing = () => {
    setDraft(user.profile?.bio ?? '')
    setIsEditing(true)
  }

  const save = () => {
    const trimmed = draft.trim()
    if (trimmed === (user.profile?.bio ?? '')) {
      setIsEditing(false)
      return
    }
    updateProfileMutation.mutate(
      { bio: trimmed },
      {
        onSuccess: () => {
          toast.success('Bio updated')
          setIsEditing(false)
        },
        onError: (error) => toast.error('Could not update bio', { description: getApiErrorMessage(error) }),
      },
    )
  }

  if (!isEditing) {
    return (
      <div className={row}>
        <div className="min-w-0">
          <p className="font-medium">Bio</p>
          <p className={`${muted} line-clamp-2`}>{user.profile?.bio || 'No bio yet'}</p>
        </div>
        <button type="button" onClick={startEditing} className={editButton}>
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </button>
      </div>
    )
  }

  return (
    <div className={row}>
      <div className="min-w-0 flex-1">
        <p className="mb-1.5 font-medium">Bio</p>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={500}
          rows={3}
          autoFocus
          className="w-full border border-[#331400]/20 bg-transparent p-2.5 text-sm outline-none focus-visible:border-[#331400] dark:border-[#F5EEE4]/20 dark:focus-visible:border-[#F5EEE4]"
        />
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={save}
            disabled={updateProfileMutation.isPending}
            className="h-9 bg-[#331400] px-3 text-xs font-semibold text-[#FED45C] disabled:opacity-40 dark:bg-[#FED45C] dark:text-[#331400]"
          >
            Save
          </button>
          <button type="button" onClick={() => setIsEditing(false)} className="h-9 border border-[#331400]/15 px-3 text-xs font-semibold dark:border-[#F5EEE4]/15">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function VerificationCard() {
  const { data: status, isPending, isError } = useBadgeStatus()
  const [dialogOpen, setDialogOpen] = useState(false)

  const isVerified = status?.hasActiveBadge ?? false
  const latest = status?.latestRequest ?? null
  const isPendingReview = latest?.status === 'pending' && !isVerified
  const canApply = !isVerified && !isPendingReview

  return (
    <section className={card}>
      <SectionHeader title="Verification badge" description="Prove you're authentic and build trust with your audience" />
      <div className={row}>
        <div>
          <p className="font-medium">Status</p>
          <p className={muted}>
            {isPending
              ? 'Loading…'
              : isVerified
                ? 'Your account is verified'
                : isPendingReview
                  ? "We're reviewing your application"
                  : latest?.status === 'rejected'
                    ? 'Your last application was not approved — you can re-apply'
                    : 'Apply for a badge to show followers you’re authentic'}
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 px-2 py-1 text-xs font-semibold ${
            isVerified
              ? 'bg-green-500/15 text-green-700 dark:text-green-400'
              : isPendingReview
                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                : 'bg-[#331400]/5 text-[#331400]/60 dark:bg-white/5 dark:text-[#F5EEE4]/60'
          }`}
        >
          {isVerified && <BadgeCheck className="h-3.5 w-3.5" />}
          {isPending ? '—' : isVerified ? 'Verified' : isPendingReview ? 'Pending review' : latest?.status === 'rejected' ? 'Rejected' : 'Unverified'}
        </span>
      </div>

      {isError && <p className="px-5 pb-4 text-sm text-red-500 sm:px-6">Could not load verification status.</p>}

      {canApply && (
        <div className="px-5 pb-5 sm:px-6">
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="bg-[#FED45C] px-4 py-2 text-sm font-semibold text-[#331400] shadow-[4px_4px_0px_0px_#000000] hover:bg-[#FED45C]/90"
          >
            Apply now
          </button>
        </div>
      )}

      <VerificationDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </section>
  )
}

export function AccountSection({ user }: { user: User }) {
  return (
    <div className="space-y-6">
      <section className={card}>
        <SectionHeader title="Personal information" description="Manage your account details" />
        <UsernameRow user={user} />
        <EmailRow user={user} />
        <BioRow user={user} />
      </section>

      <VerificationCard />
      <AccountTypeSection user={user} />
    </div>
  )
}
