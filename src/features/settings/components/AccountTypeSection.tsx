import { useState } from 'react'
import { Check, CheckCircle2 } from 'lucide-react'

import type { User } from '@/features/auth/types'

import { useMyBusinessInquiry } from '../hooks/use-business-inquiry'
import { BusinessInquiryDialog } from './BusinessInquiryDialog'
import { SectionHeader } from './SectionHeader'
import { card, muted, row } from './styles'

const BUSINESS_FEATURES = [
  'Invite unlimited team members',
  'Role-based access control (Admin, Manager, Staff)',
  'Attendance tracking by class/department',
  'Custom NFC cards for staff',
  'Advanced analytics dashboard',
  'Bulk ordering discounts',
]

function formatSentDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function AccountTypeSection({ user }: { user: User }) {
  const { data: inquiry, isPending } = useMyBusinessInquiry()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <section className={card}>
      <SectionHeader title="Account type" description="Grow with Abio" />

      <div className={row}>
        <div>
          <p className="font-medium">Current account</p>
          <p className={muted}>Personal account — perfect for creators and freelancers</p>
        </div>
        <span className="inline-flex shrink-0 items-center bg-[#331400]/5 px-2 py-1 text-xs font-semibold text-[#331400] dark:bg-white/5 dark:text-[#F5EEE4]">
          Personal
        </span>
      </div>

      <div className={row}>
        <div>
          <p className="font-medium">Switch to business account</p>
          <p className={muted}>Invite staff, manage teams, track attendance, custom NFC cards</p>
        </div>

        {isPending ? (
          <span className={`shrink-0 text-xs ${muted}`}>Loading…</span>
        ) : inquiry ? (
          <span className="inline-flex shrink-0 items-center gap-1.5 bg-green-500/15 px-2 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Sent {formatSentDate(inquiry.createdAt)}
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="shrink-0 bg-[#331400] px-4 py-2 text-sm font-semibold text-[#FED45C] hover:bg-[#4a2c1a] dark:bg-[#FED45C] dark:text-[#331400]"
          >
            Get started
          </button>
        )}
      </div>

      {inquiry && (
        <p className={`px-5 pb-4 sm:px-6 ${muted}`}>
          Your details have been sent — our sales team will reach out within 24 hours with a tailored proposal.
        </p>
      )}

      <div className="border-t border-[#331400]/10 px-5 py-4 sm:px-6 dark:border-[#F5EEE4]/10">
        <p className="mb-3 text-sm font-semibold">Business account features</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {BUSINESS_FEATURES.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <span className={muted}>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <BusinessInquiryDialog user={user} open={dialogOpen} onOpenChange={setDialogOpen} />
    </section>
  )
}
