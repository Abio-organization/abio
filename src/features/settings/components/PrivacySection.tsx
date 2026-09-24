import { getApiErrorMessage } from '@/shared/lib/api-error'
import { toast } from '@/shared/lib/toast'

import { usePrivacySettings, useUpdatePrivacy } from '../hooks/use-account-settings'
import type { ProfileVisibility } from '../api/settings.api'
import { SectionHeader } from './SectionHeader'
import { card, muted, row } from './styles'

export function PrivacySection() {
  const { data, isPending, isError } = usePrivacySettings()
  const updateMutation = useUpdatePrivacy()

  const handleChange = (visibility: ProfileVisibility) => {
    updateMutation.mutate(visibility, {
      onSuccess: () => toast.success(visibility === 'public' ? 'Profile is now public' : 'Profile is now private'),
      onError: (error) => toast.error('Could not update visibility', { description: getApiErrorMessage(error) }),
    })
  }

  return (
    <section className={card}>
      <SectionHeader title="Privacy & data" description="Control who can see your profile" />

      <div className={row}>
        <div>
          <p className="font-medium">Profile visibility</p>
          <p className={muted}>Who can see your public profile page</p>
        </div>

        {isError ? (
          <p className="text-sm text-red-500">Could not load</p>
        ) : (
          <select
            aria-label="Profile visibility"
            value={data?.visibility ?? 'public'}
            disabled={isPending || updateMutation.isPending}
            onChange={(e) => handleChange(e.target.value as ProfileVisibility)}
            className="h-10 min-w-52 border border-[#331400]/20 bg-transparent px-2.5 text-sm outline-none focus-visible:border-[#331400] disabled:opacity-50 dark:border-[#F5EEE4]/20 dark:focus-visible:border-[#F5EEE4]"
          >
            <option value="public">Public (anyone with the link)</option>
            <option value="private">Private (only you)</option>
          </select>
        )}
      </div>
    </section>
  )
}
