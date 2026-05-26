import { PhoneDisplay } from '@/components/PhoneDisplay'
import { usePhoneDisplayProps } from '@/hooks/usePhoneDisplayProps'

export function DashboardPage() {
  const phone = usePhoneDisplayProps()

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section>
        <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Read-only phone preview of saved appearance and links.
        </p>
      </section>
      <section className="flex justify-center">
        {phone.isLoading ? (
          <p className="text-sm text-neutral-500">Loading preview…</p>
        ) : (
          <PhoneDisplay
            buttonStyle={phone.buttonStyle}
            fontStyle={phone.fontStyle}
            selectedTheme={phone.selectedTheme}
            profile={phone.profile}
            links={phone.links}
          />
        )}
      </section>
    </div>
  )
}
