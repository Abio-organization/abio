import { useState, useRef } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { getApiErrorMessage } from '@/shared/lib/api-error'
import { commerce, money, paymentUrl, type Order } from './api'
import { useServerCart } from './hooks'
import { RequireCustomer } from './RequireCustomer'
import { CommerceLayout, Steps, Loading, ErrorBox, OrderSummary } from './ui'
export function Checkout() {
  return (
    <RequireCustomer>
      <CheckoutForm />
    </RequireCustomer>
  )
}
function CheckoutForm() {
  const user = useAuthStore((s) => s.user)!
  const query = useServerCart()
  const cache = useQueryClient()
  const navigate = useNavigate()
  const key = `checkout-attempt:${user.id}`
  const draftKey = `shipping:${user.id}`
  const stored = (() => {
    try {
      return JSON.parse(sessionStorage.getItem(draftKey) || '{}')
    } catch {
      return {}
    }
  })()
  const [address, setAddress] = useState<string>(stored.address ?? '')
  const [zone, setZone] = useState<'lagos' | 'outside_lagos'>(
    stored.zone === 'outside_lagos' ? 'outside_lagos' : 'lagos',
  )
  const [step, setStep] = useState(1)
  const [agreed, setAgreed] = useState(false)
  const [uncertain, setUncertain] = useState(Boolean(localStorage.getItem(key)))
  const [saved, setSaved] = useState<Order | null>(null)
  const lock = useRef(false)
  const [redirectError, setRedirectError] = useState('')
  const mutation = useMutation({
    mutationFn: async () => {
      if (lock.current || localStorage.getItem(key)) throw new Error('Checkout is already in progress. Check your recent orders.')
      lock.current = true
      localStorage.setItem(
        key,
        JSON.stringify({ startedAt: new Date().toISOString() }),
      )
      try {
        return await commerce.checkout({
          deliveryZone: zone,
          shippingAddress: address.trim(),
        })
      } finally {
        lock.current = false
      }
    },
    retry: false,
    onSuccess: async (order) => {
      setSaved(order)
      localStorage.setItem(key, JSON.stringify({ orderId: order.id }))
      cache.setQueryData(['commerce', 'order', user.id, order.id], order)
      void cache.invalidateQueries({ queryKey: ['commerce', 'cart', user.id] })
      sessionStorage.removeItem(draftKey)
      const expectedTotal = (query.data?.subtotalKobo ?? 0) + (zone === 'lagos' ? 0 : 500000)
      const changedTotal = order.totalAmountKobo !== expectedTotal
      const url = paymentUrl(order.checkoutUrl)
      if (!url || changedTotal) sessionStorage.setItem(`payment-review:${order.id}`, changedTotal ? 'The total changed after checking current prices. Review the new total before continuing payment.' : 'Your order is saved, but payment could not be opened. Continue payment below when you are ready.')
      await navigate({ to: '/orders/$id', params: { id: order.id } })
      if (url && !changedTotal) {
        try {
          window.location.assign(url)
        } catch {
          setRedirectError('Could not open payment. Continue from your order.')
        }
      }
    },
    onError: (error) => {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        [400, 401, 403, 404, 409, 422].includes(error.response.status)
      ) {
        localStorage.removeItem(key)
        void query.refetch()
      } else setUncertain(true)
    },
  })
  if (saved)
    return (
      <CommerceLayout>
        <Loading text="Opening your order…" />
        {redirectError && <ErrorBox message={redirectError} />}
        <Link to="/orders/$id" params={{ id: saved.id }}>
          Continue to your order
        </Link>
      </CommerceLayout>
    )
  if (uncertain) {
    let orderId: string | undefined
    try {
      orderId = JSON.parse(localStorage.getItem(key) || '{}').orderId
    } catch {
      /* malformed local data */
    }
    return (
      <CommerceLayout>
        <h1>Check your order before trying again</h1>
        <p>
          Your previous checkout may already have created an order. Open it to
          continue payment.
        </p>
        {orderId ? (
          <Link
            className="commerce-primary"
            to="/orders/$id"
            params={{ id: orderId }}
          >
            View saved order
          </Link>
        ) : (
          <Link className="commerce-primary" to="/orders">
            Check recent orders
          </Link>
        )}
        <p className="commerce-note">
          We have paused new checkout attempts to avoid duplicate orders. If no
          order appears, contact support before starting again.
        </p>
      </CommerceLayout>
    )
  }
  if (query.isPending)
    return (
      <CommerceLayout>
        <Loading text="Preparing your checkout…" />
      </CommerceLayout>
    )
  if (query.isError)
    return (
      <CommerceLayout>
        <ErrorBox
          message={getApiErrorMessage(query.error)}
          retry={() => void query.refetch()}
        />
      </CommerceLayout>
    )
  const cart = query.data!
  if (!cart.items.length)
    return (
      <CommerceLayout>
        <h1>Your cart is empty</h1>
        <Link to="/orders">View your orders</Link>
      </CommerceLayout>
    )
  const fee = zone === 'lagos' ? 0 : 500000
  const estimate = {
    subtotalKobo: cart.subtotalKobo,
    shippingFeeKobo: fee,
    totalAmountKobo: cart.subtotalKobo + fee,
    items: cart.items.map((i) => ({
      ...i,
      productName: i.product.name,
      productType: i.product.type,
      variantColorName: i.variant?.colorName ?? null,
      imageUrls: i.variant?.imageUrls ?? [],
    })),
  }
  const blocked = cart.items.some(
    (i) =>
      !i.product.active ||
      (i.product.type === 'standard' &&
        (!i.variant?.active || i.variant.stockQty < i.quantity)),
  )
  return (
    <CommerceLayout back="/store/cart" backLabel="Back to cart">
      <Steps step={step} />
      <div className="commerce-grid">
        <section className="commerce-panel">
          <h1>{step === 1 ? 'Personal details' : 'Payment'}</h1>
          {step === 1 ? (
            <form
              className="commerce-form"
              onSubmit={(e) => {
                e.preventDefault()
                sessionStorage.setItem(
                  draftKey,
                  JSON.stringify({ address, zone }),
                )
                setStep(2)
              }}
            >
              <label>
                Name
                <input value={user.name} readOnly />
              </label>
              <label>
                Email
                <input value={user.email} readOnly />
              </label>
              <label>
                Delivery zone
                <select
                  value={zone}
                  onChange={(e) => setZone(e.target.value as typeof zone)}
                >
                  <option value="lagos">Lagos — Free delivery</option>
                  <option value="outside_lagos">Outside Lagos — ₦5,000</option>
                </select>
              </label>
              <label>
                Shipping address
                <textarea
                  required
                  minLength={5}
                  maxLength={500}
                  rows={4}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, city, state, and delivery directions"
                />
              </label>
              <button
                className="commerce-primary"
                disabled={address.trim().length < 5}
              >
                Continue to payment
              </button>
            </form>
          ) : (
            <div className="commerce-form">
              <p>
                Complete payment securely on Bachs. Available card and
                bank-transfer options will be shown there.
              </p>
              <div
                className="commerce-panel"
                style={{ border: '1px solid #ddd', background: '#fafafa' }}
              >
                <h2>Bachs checkout</h2>
                <p>
                  We’ll open the hosted payment page after saving your order.
                </p>
              </div>
              <p>
                <strong>Delivery to:</strong> {address}
              </p>
              <button
                className="commerce-secondary"
                disabled={mutation.isPending}
                onClick={() => setStep(1)}
              >
                Edit personal details
              </button>
              <label className="commerce-check">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                I have reviewed my delivery details and order total.
              </label>
              {blocked && (
                <ErrorBox message="Some items are unavailable. Return to your cart to update them." />
              )}
              {mutation.isError && (
                <ErrorBox
                  message={getApiErrorMessage(
                    mutation.error,
                    'Could not create your order.',
                  )}
                />
              )}
              <button
                className="commerce-primary"
                disabled={
                  !agreed || blocked || mutation.isPending || query.isFetching
                }
                onClick={() => mutation.mutate()}
              >
                {mutation.isPending
                  ? 'Creating your order…'
                  : `Pay | ${money(estimate.totalAmountKobo)}`}
              </button>
              <p className="commerce-note">
                Current prices and availability are checked before payment.
              </p>
            </div>
          )}
        </section>
        <OrderSummary order={estimate} />
      </div>
    </CommerceLayout>
  )
}
