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
import { cn } from '@/shared/lib/utils'
import type { User } from '@/features/auth/types'

import { useCreateBusinessInquiry } from '../hooks/use-business-inquiry'

const COMPANY_SIZE_OPTIONS = ['1–10', '11–50', '51–200', '201–500', '500+']
const INDUSTRY_OPTIONS = [
  'Technology',
  'Retail & E-commerce',
  'Education',
  'Healthcare',
  'Finance',
  'Real Estate',
  'Hospitality & Events',
  'Non-profit',
  'Other',
]
const FEATURE_OPTIONS = [
  'Access control (unlock doors)',
  'Attendance tracking',
  'Custom NFC cards for staff',
  'Advanced analytics',
]

const selectClass = 'h-10 w-full border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30'

interface BusinessInquiryDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BusinessInquiryDialog({ user, open, onOpenChange }: BusinessInquiryDialogProps) {
  const createMutation = useCreateBusinessInquiry()

  const [companyName, setCompanyName] = useState('')
  const [fullName, setFullName] = useState(user.name ?? '')
  const [email, setEmail] = useState(user.email ?? '')
  const [phone, setPhone] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [industry, setIndustry] = useState('')
  const [features, setFeatures] = useState<string[]>([])

  const reset = () => {
    setCompanyName('')
    setFullName(user.name ?? '')
    setEmail(user.email ?? '')
    setPhone('')
    setCompanySize('')
    setIndustry('')
    setFeatures([])
  }

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next)
    if (!next) reset()
  }

  const toggleFeature = (feature: string) => {
    setFeatures((prev) => (prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]))
  }

  const canSubmit =
    companyName.trim().length > 0 &&
    fullName.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    phone.trim().length > 0 &&
    companySize.length > 0 &&
    industry.length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) {
      toast.warning('Please fill in all the required fields')
      return
    }

    createMutation.mutate(
      {
        companyName: companyName.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        companySize,
        industry,
        features,
      },
      {
        onSuccess: () => {
          toast.success('Sent!', { description: 'Our sales team will reach out within 24 hours.' })
          handleOpenChange(false)
        },
        onError: (error) => toast.error('Could not send your details', { description: getApiErrorMessage(error) }),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Grow with Abio</DialogTitle>
          <DialogDescription>Tell us about your company. Our team will set up the perfect plan and reach out within 24 hours.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field>
            <FieldLabel htmlFor="biz-company">Company name</FieldLabel>
            <Input id="biz-company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g., Acme Corp, Sarah's Studio" autoFocus />
          </Field>

          <Field>
            <FieldLabel htmlFor="biz-name">Your full name</FieldLabel>
            <Input id="biz-name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" />
          </Field>

          <Field>
            <FieldLabel htmlFor="biz-email">Email</FieldLabel>
            <Input id="biz-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" />
          </Field>

          <Field>
            <FieldLabel htmlFor="biz-phone">Phone (WhatsApp)</FieldLabel>
            <Input id="biz-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 XXX XXXX XXXX" />
          </Field>

          <Field>
            <FieldLabel htmlFor="biz-size">Company size</FieldLabel>
            <select id="biz-size" value={companySize} onChange={(e) => setCompanySize(e.target.value)} className={cn(selectClass)}>
              <option value="">Select team size…</option>
              {COMPANY_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size} people
                </option>
              ))}
            </select>
          </Field>

          <Field>
            <FieldLabel htmlFor="biz-industry">Industry</FieldLabel>
            <select id="biz-industry" value={industry} onChange={(e) => setIndustry(e.target.value)} className={cn(selectClass)}>
              <option value="">Select industry…</option>
              {INDUSTRY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>

          <Field>
            <FieldLabel>What features interest you?</FieldLabel>
            <div className="space-y-2">
              {FEATURE_OPTIONS.map((feature) => (
                <label key={feature} className="flex cursor-pointer items-center gap-2.5 text-sm">
                  <input
                    type="checkbox"
                    checked={features.includes(feature)}
                    onChange={() => toggleFeature(feature)}
                    className="h-4 w-4 shrink-0 accent-[#331400] dark:accent-[#FED45C]"
                  />
                  {feature}
                </label>
              ))}
            </div>
          </Field>

          <DialogFooter>
            <Button
              type="submit"
              disabled={!canSubmit || createMutation.isPending}
              className="h-10 w-full bg-[#FED45C] text-[#331400] shadow-[4px_4px_0px_0px_#000000] hover:bg-[#FED45C]/90"
            >
              {createMutation.isPending ? 'Sending…' : 'Contact us'}
            </Button>
          </DialogFooter>
          <p className="-mt-2 text-center text-xs text-[#331400]/45 dark:text-[#F5EEE4]/45">
            Our sales team will reach out within 24 hours with a tailored proposal.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
