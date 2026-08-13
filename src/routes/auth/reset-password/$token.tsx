import { createFileRoute } from '@tanstack/react-router'

import { ResetPasswordPage } from '@/features/auth/components/ResetPasswordPage'

export const Route = createFileRoute('/auth/reset-password/$token')({
  component: ResetPasswordRoute,
})

function ResetPasswordRoute() {
  const { token } = Route.useParams()
  return <ResetPasswordPage token={token} />
}
