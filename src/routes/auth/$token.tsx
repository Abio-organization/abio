import { createFileRoute } from '@tanstack/react-router'

import { VerifyEmailPage } from '@/features/auth/components/VerifyEmailPage'

export const Route = createFileRoute('/auth/$token')({
  component: VerifyEmailRoute,
})

function VerifyEmailRoute() {
  const { token } = Route.useParams()
  return <VerifyEmailPage token={token} />
}
