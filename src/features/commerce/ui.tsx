import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { money, type Order } from './api'
import './commerce.css'
export function CommerceLayout({
  children,
  back = '/store',
  backLabel = 'Continue shopping',
}: {
  children: ReactNode
  back?: string
  backLabel?: string
}) {
  const authenticated = useAuthStore((s) => s.isAuthenticated)
  const content = (
    <div className="commerce">
      <header className="commerce-header">
        {!authenticated && <Link to="/">
          <img src="/icons/A.bio.svg" alt="Abio" width={38} height={38} />
        </Link>}
        <Link to={back} className="commerce-secondary">
          {backLabel}
        </Link>
      </header>
      <main className="commerce-main">{children}</main>
    </div>
  )
  return authenticated ? <DashboardLayout>{content}</DashboardLayout> : content
}
export function Loading({ text = 'Loading…' }: { text?: string }) {
  return (
    <p className="commerce-loading" role="status">
      <Loader2 className="animate-spin" size={20} />
      {text}
    </p>
  )
}
export function ErrorBox({
  message,
  retry,
}: {
  message: string
  retry?: () => void
}) {
  return (
    <div className="commerce-error" role="alert">
      <p>{message}</p>
      {retry && (
        <button onClick={retry} className="commerce-secondary">
          Try again
        </button>
      )}
    </div>
  )
}
export function Steps({ step }: { step: number }) {
  return (
    <ol className="commerce-steps">
      {['Personal details', 'Payment', 'Complete'].map((name, i) => (
        <li
          key={name}
          aria-current={step === i + 1 ? 'step' : undefined}
          className={step >= i + 1 ? 'active' : ''}
        >
          <span>{i + 1}</span>
          {name}
        </li>
      ))}
    </ol>
  )
}
export function OrderSummary({
  order,
}: {
  order: Pick<
    Order,
    'items' | 'subtotalKobo' | 'shippingFeeKobo' | 'totalAmountKobo'
  >
}) {
  return (
    <aside className="commerce-summary">
      <h2>
        Your order{' '}
        <span>({order.items.reduce((n, i) => n + i.quantity, 0)})</span>
      </h2>
      {order.items.map((item) => (
        <article className="commerce-summary-item" key={item.id}>
          <img
            src={
              item.imageUrls?.[0] ||
              item.variant?.imageUrls?.[0] ||
              '/icons/A.bio.svg'
            }
            alt=""
          />
          <div>
            <h3>{item.productName ?? item.product?.name ?? 'Product'}</h3>
            <p>
              {item.variantColorName ??
                item.variant?.colorName ??
                item.preferredColor}
            </p>
            {item.customUsername && <p>{item.customUsername}</p>}
            <p>Quantity: {item.quantity}</p>
            <strong>{money(item.unitPriceKobo * item.quantity)}</strong>
          </div>
        </article>
      ))}
      <div className="commerce-totals">
        <h3>Order summary</h3>
        <p>
          <span>Subtotal</span>
          <strong>{money(order.subtotalKobo)}</strong>
        </p>
        <p>
          <span>Delivery</span>
          <strong>
            {order.shippingFeeKobo === 0
              ? 'Free'
              : money(order.shippingFeeKobo)}
          </strong>
        </p>
        <p className="total">
          <span>Total</span>
          <strong>{money(order.totalAmountKobo)}</strong>
        </p>
      </div>
    </aside>
  )
}
