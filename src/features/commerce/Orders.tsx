import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, Clock, AlertTriangle } from 'lucide-react'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { getApiErrorMessage } from '@/shared/lib/api-error'
import { commerce, canPay, paymentUrl, money } from './api'
import { RequireCustomer } from './RequireCustomer'
import { CommerceLayout, OrderSummary, Steps, Loading, ErrorBox } from './ui'
export function Orders() {
  return (
    <RequireCustomer>
      <OrderList />
    </RequireCustomer>
  )
}
function OrderList() {
  const userId = useAuthStore((s) => s.user?.id)
  const [page, setPage] = useState(1)
  const query = useQuery({
    queryKey: ['commerce', 'orders', userId, page],
    queryFn: ({ signal }) => commerce.orders(page, signal),
    retry: 1,
  })
  return (
    <CommerceLayout back="/dashboard/store" backLabel="Back to store">
      <h1>Your orders</h1>
      <p>Payment status and delivery progress, in one place.</p>
      {query.isPending && <Loading />}
      {query.isError && (
        <ErrorBox
          message={getApiErrorMessage(query.error)}
          retry={() => void query.refetch()}
        />
      )}
      <div className="commerce-order-list">
        {query.data?.orders.map((order) => (
          <Link key={order.id} to="/orders/$id" params={{ id: order.id }}>
            <div>
              <h3>Order #{order.id.slice(0, 8)}</h3>
              <p>{new Date(order.createdAt).toLocaleDateString()}</p>
              <p>
                Payment: {order.payment?.status ?? 'unavailable'} · Delivery:{' '}
                {order.status}
              </p>
            </div>
            <strong>{money(order.totalAmountKobo)}</strong>
          </Link>
        ))}
      </div>
      {query.data && !query.data.orders.length && (
        <p>No orders yet. Your purchases will appear here.</p>
      )}
      <div className="commerce-actions">
        <button
          className="commerce-secondary"
          disabled={page <= 1 || query.isFetching}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          className="commerce-secondary"
          disabled={
            !query.data ||
            page >= query.data.pagination.totalPages ||
            query.isFetching
          }
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </CommerceLayout>
  )
}
export function OrderDetail({ id }: { id: string }) {
  return (
    <RequireCustomer>
      <Detail id={id} key={id} />
    </RequireCustomer>
  )
}
function Detail({ id }: { id: string }) {
  const userId = useAuthStore((s) => s.user?.id)
  const cache = useQueryClient()
  const [started, setStarted] = useState(Date.now)
  const [polling, setPolling] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setPolling(false), 60000)
    return () => clearTimeout(timer)
  }, [started])
  const [reviewNote] = useState(() => sessionStorage.getItem(`payment-review:${id}`))
  const [openError, setOpenError] = useState('')
  const query = useQuery({
    queryKey: ['commerce', 'order', userId, id],
    queryFn: ({ signal }) => commerce.order(id, signal),
    retry: 1,
    refetchInterval: (q) =>
      q.state.data?.payment?.status === 'pending' &&
      q.state.data.status !== 'cancelled' &&
      polling
        ? 2500
        : false,
    refetchIntervalInBackground: false,
  })
  const order = query.data
  useEffect(() => {
    if (!order) return
    const key = `checkout-attempt:${userId}`
    try {
      const attempt = JSON.parse(localStorage.getItem(key) || '{}')
      if (
        attempt.orderId === order.id ||
        (attempt.startedAt &&
          Date.parse(order.createdAt) >= Date.parse(attempt.startedAt) - 5000)
      )
        localStorage.removeItem(key)
    } catch {
      /* ignore malformed local journal */
    }
  }, [order, userId])
  const pay = useMutation({
    mutationFn: () => commerce.pay(id),
    retry: false,
    onSuccess: (result) => {
      cache.setQueryData(['commerce', 'order', userId, id], result)
      const url = paymentUrl(result.checkoutUrl)
      if (!url) {
        setOpenError(
          'Your order is saved, but no valid payment link was returned. Please try again later.',
        )
        return
      }
      try {
        sessionStorage.removeItem(`payment-review:${id}`)
        window.location.assign(url)
      } catch {
        setOpenError('Could not open payment. Please try again.')
      }
    },
    onError: () => {
      void query.refetch()
    },
  })
  if (query.isPending)
    return (
      <CommerceLayout>
        <Loading text="Checking your order…" />
      </CommerceLayout>
    )
  if (!order)
    return (
      <CommerceLayout>
        <ErrorBox
          message={getApiErrorMessage(
            query.error,
            'Could not load this order.',
          )}
          retry={() => void query.refetch()}
        />
        <Link to="/orders">View your orders</Link>
      </CommerceLayout>
    )
  const paid = order.payment?.status === 'success'
  const pending = canPay(order)
  const waiting = pending && polling
  const cancelledReturn =
    new URLSearchParams(window.location.search).get('cancelled') === '1'
  return (
    <CommerceLayout back="/orders" backLabel="All orders">
      <Steps step={paid ? 3 : 2} />
      <div className="commerce-confirm">
        {reviewNote && pending && <p role="status" className="commerce-error">{reviewNote}</p>}
        <div className="commerce-center">
          {paid ? (
            <Check size={55} color="#7644ff" style={{ margin: '0 auto' }} />
          ) : pending ? (
            <Clock size={48} color="#7644ff" style={{ margin: '0 auto' }} />
          ) : (
            <AlertTriangle
              size={48}
              color="#7644ff"
              style={{ margin: '0 auto' }}
            />
          )}
          <h1 className={paid ? 'commerce-success' : ''}>
            {paid
              ? 'Order confirmed successfully'
              : pending
                ? reviewNote
                  ? 'Your order is saved'
                  : waiting
                  ? 'Confirming payment…'
                  : 'Payment confirmation is taking longer'
                : order.payment?.status === 'reversed'
                  ? 'Payment reversed'
                  : order.status === 'cancelled'
                    ? 'Order cancelled'
                    : 'Payment was not completed'}
          </h1>
          <p>
            Order ID: <strong>{order.id}</strong>
          </p>
          {paid ? (
            <p>
              Thank you. We’ll update your order as it moves toward delivery.
            </p>
          ) : pending ? (
            <p>
              {cancelledReturn
                ? 'You returned without completing checkout. We are checking the latest payment status.'
                : 'Your order is saved. Only a confirmed payment will mark it paid.'}
            </p>
          ) : (
            <p>
              This payment cannot be resumed. Check the status before placing a
              new order.
            </p>
          )}
        </div>
        {query.isError && (
          <ErrorBox message="We could not refresh the payment status. This does not mean your payment failed." />
        )}
        {pay.isError && (
          <ErrorBox
            message={getApiErrorMessage(pay.error, 'Could not open payment.')}
          />
        )}{' '}
        {openError && <ErrorBox message={openError} />}
        <div className="commerce-actions">
          <button
            className="commerce-secondary"
            disabled={query.isFetching}
            onClick={() => {
              setPolling(true)
              setStarted(Date.now())
              void query.refetch()
            }}
          >
            {query.isFetching ? 'Checking…' : 'Check again'}
          </button>
          {pending && (
            <button
              className="commerce-primary"
              disabled={pay.isPending || query.isFetching}
              onClick={() => {
                setOpenError('')
                pay.mutate()
              }}
            >
              {pay.isPending ? 'Opening payment…' : 'Continue payment'}
            </button>
          )}
        </div>
        <OrderSummary order={order} />
        <section className="commerce-panel">
          <h2>Delivery details</h2>
          <p style={{ whiteSpace: 'pre-wrap' }}>{order.shippingAddress}</p>
          <p>Status: {order.status}</p>
          <p>Tracking ID: {order.trackingNumber ?? 'Not assigned yet'}</p>
        </section>
        <div className="commerce-actions">
          <Link className="commerce-secondary" to="/store">
            Shop again
          </Link>
          {paid && (
            <button
              className="commerce-secondary"
              onClick={() => window.print()}
            >
              Print / save receipt
            </button>
          )}
        </div>
      </div>
    </CommerceLayout>
  )
}
