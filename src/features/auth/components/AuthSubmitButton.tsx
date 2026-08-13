import { Loader2 } from 'lucide-react'
import type { ComponentProps } from 'react'

import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'

interface AuthSubmitButtonProps extends ComponentProps<typeof Button> {
  pending: boolean
  pendingLabel?: string
}

export function AuthSubmitButton({ pending, pendingLabel, children, className, disabled, ...props }: AuthSubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={disabled || pending}
      className={cn('h-12 w-full bg-[#FED45C] text-sm font-semibold text-[#331400] hover:bg-[#FED45C]/90', className)}
      {...props}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {pendingLabel ?? 'Please wait…'}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
