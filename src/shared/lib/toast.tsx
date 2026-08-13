import { toast as sonnerToast } from 'sonner'
import type { ReactNode } from 'react'

import { ToastCard } from '@/shared/components/ui/toast'

interface ToastOptions {
  description?: ReactNode
}

/** App-wide toast API — renders the custom ToastCard design instead of sonner's default look. */
export const toast = {
  warning: (title: ReactNode, options?: ToastOptions) =>
    sonnerToast.custom(() => <ToastCard variant="warning" title={title} description={options?.description} />),

  error: (title: ReactNode, options?: ToastOptions) =>
    sonnerToast.custom(() => <ToastCard variant="error" title={title} description={options?.description} />),

  success: (title: ReactNode, options?: ToastOptions) =>
    sonnerToast.custom(() => <ToastCard variant="success" title={title} description={options?.description} />),
}
