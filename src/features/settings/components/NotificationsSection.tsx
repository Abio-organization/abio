import { Switch } from '@/shared/components/ui/switch'
import { getApiErrorMessage } from '@/shared/lib/api-error'
import { toast } from '@/shared/lib/toast'

import { useNotificationSettings, useUpdateNotifications } from '../hooks/use-account-settings'
import { SectionHeader } from './SectionHeader'
import { card, muted } from './styles'

export function NotificationsSection() {
  const { data, isPending, isError } = useNotificationSettings()
  const updateMutation = useUpdateNotifications()

  const checked = data?.emailOnLinkTap ?? false

  const handleChange = (next: boolean) => {
    updateMutation.mutate(next, {
      onError: (error) => toast.error('Could not update notifications', { description: getApiErrorMessage(error) }),
    })
  }

  return (
    <section className={card}>
      <SectionHeader title="Email notifications" description="Choose what emails you receive" />

      <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <p className="font-medium">New tap notification</p>
          <p className={muted}>Email me when someone taps my link</p>
        </div>
        {isError ? (
          <p className="shrink-0 text-sm text-red-500">Could not load</p>
        ) : (
          <Switch
            checked={checked}
            disabled={isPending || updateMutation.isPending}
            onCheckedChange={handleChange}
            aria-label="Email me when someone taps my link"
          />
        )}
      </div>
    </section>
  )
}
