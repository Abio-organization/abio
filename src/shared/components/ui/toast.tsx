import { Check, X } from 'lucide-react'
import type { ReactNode } from 'react'

export type ToastVariant = 'warning' | 'error' | 'success'

const GLOW_COLOR: Record<ToastVariant, string> = {
  warning: '#FFD426',
  error: '#F04248',
  success: '#00ED51',
}

function ToastGlyph({ variant }: { variant: ToastVariant }) {
  const color = GLOW_COLOR[variant]

  if (variant === 'success') return <Check className="h-4 w-4" style={{ color }} strokeWidth={3} />
  if (variant === 'error') return <X className="h-4 w-4" style={{ color }} strokeWidth={3} />

  // lucide has no bare exclamation glyph (AlertTriangle/CircleAlert both carry
  // their own outline shape, which would double up with the badge circle here).
  return (
    <svg width="4" height="14" viewBox="0 0 4 14" fill="none" aria-hidden>
      <rect x="0" y="0" width="4" height="9" rx="2" fill={color} />
      <circle cx="2" cy="12" r="2" fill={color} />
    </svg>
  )
}

export interface ToastCardProps {
  variant: ToastVariant
  title: ReactNode
  description?: ReactNode
}

export function ToastCard({ variant, title, description }: ToastCardProps) {
  const glow = GLOW_COLOR[variant]

  return (
    <div
      className="flex w-full max-w-sm items-center gap-4  p-4"
      style={{
        background: '#242C32',
        boxShadow: '0 8px 10px rgba(0,0,0,0.2), 0 6px 30px rgba(0,0,0,0.12), 0 16px 24px rgba(0,0,0,0.14)',
      }}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{ background: `radial-gradient(circle, ${glow} 0%, transparent 72%)` }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: '#171D22' }}>
          <ToastGlyph variant={variant} />
        </div>
      </div>

      <div className="min-w-0">
        <p className="text-base font-medium text-white">{title}</p>
        {description && <p className="mt-0.5 text-[10px] text-white/50">{description}</p>}
      </div>
    </div>
  )
}
