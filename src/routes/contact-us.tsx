import { createFileRoute } from '@tanstack/react-router'

import { ContactUsPage } from '@/features/landing'

export const Route = createFileRoute('/contact-us')({
  component: ContactUsPage,
})
