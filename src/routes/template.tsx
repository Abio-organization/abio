import { createFileRoute } from '@tanstack/react-router'

import { TemplatePage } from '@/features/landing'

export const Route = createFileRoute('/template')({
  component: TemplatePage,
})
