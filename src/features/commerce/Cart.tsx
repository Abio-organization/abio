import { Link } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { useCartStore, itemKey } from '@/features/store/store/cart-store'
import { useCatalog } from '@/features/store/catalog'
import { getApiErrorMessage } from '@/shared/lib/api-error'
import { commerce, money } from './api'
import { useServerCart } from './hooks'
import { CommerceLayout, ErrorBox, Loading } from './ui'
export function Cart() {
  const authenticated = useAuthStore((s) => s.isAuthenticated)
  return (
    <CommerceLayout>
      <div className="commerce-center">
        <h1>Cart</h1>
        <Link to="/store">Continue ordering</Link>
      </div>
      {authenticated ? <AccountCart /> : <GuestCart />}
    </CommerceLayout>
  )
}
function GuestCart() {
  const catalog = useCatalog()
  const { items, removeItem, setQuantity } = useCartStore()
  if (catalog.isPending) return <Loading />
  if (catalog.isError)
    return (
      <ErrorBox
        message="Could not load current products."
        retry={() => void catalog.refetch()}
      />
    )
  const lines = items.map((i) => {
    const p = catalog.data?.find((p) => p.id === i.productId)
    const v = p?.colors?.find((v) => v.id === i.variantId)
    const unit = Math.round((v?.price ?? p?.basePrice ?? 0) * 100)
    return { i, p, v, unit }
  })
  const subtotal = lines.reduce((sum, l) => sum + l.unit * l.i.quantity, 0)
  return (
    <section className="commerce-panel commerce-cart">
      {!items.length ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {lines.map(({ i, p, v, unit }) => (
            <article className="commerce-cart-row" key={itemKey(i)}>
              <img
                src={v?.mainImage || p?.defaultImage || '/icons/A.bio.svg'}
                alt=""
              />
              <div>
                <h2>{p?.name ?? 'Unavailable product'}</h2>
                <p>Color: {v?.name ?? i.preferredColor ?? 'Custom'}</p>
                <p>{i.customUsername}</p>
                <div className="commerce-actions">
                  <label>
                    Quantity
                    <input
                      aria-label={`Quantity for ${p?.name}`}
                      type="number"
                      min={1}
                      max={99}
                      value={i.quantity}
                      onChange={(e) =>
                        setQuantity(itemKey(i), Number(e.target.value) || 1)
                      }
                    />
                  </label>
                  <button
                    className="commerce-secondary"
                    onClick={() => removeItem(itemKey(i))}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <strong className="price">{money(unit * i.quantity)}</strong>
            </article>
          ))}
          <div className="commerce-totals">
            <p>
              <span>Subtotal</span>
              <strong>{money(subtotal)}</strong>
            </p>
            <p className="commerce-note">
              Delivery calculated at checkout. Availability and prices are
              checked after sign-in.
            </p>
            <Link to="/checkout" className="commerce-primary">
              Sign in to checkout
            </Link>
          </div>
        </>
      )}
    </section>
  )
}
function AccountCart() {
  const query = useServerCart()
  const cache = useQueryClient()
  const catalog = useCatalog()
  const drafts = useCartStore((s) => s.items)
  const removeDraft = useCartStore((s) => s.removeItem)
  const userId = useAuthStore((s) => s.user?.id)
  const mutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity?: number }) =>
      quantity === undefined
        ? commerce.remove(id)
        : commerce.update(id, quantity),
    onSettled: () =>
      cache.invalidateQueries({ queryKey: ['commerce'] }),
  })
  if (query.isPending) return <Loading text="Syncing your cart…" />
  if (query.isError)
    return (
      <>
        <ErrorBox
          message={getApiErrorMessage(
            query.error,
            'Could not sync your cart. Your saved selections are safe.',
          )}
          retry={() => void query.refetch()}
        />
        {drafts.map((i) => (
          <p key={itemKey(i)}>
            Saved selection: {i.colorName ?? i.customUsername ?? 'Custom card'}{' '}
            × {i.quantity}{' '}
            <button
              className="commerce-secondary"
              onClick={() => {
                removeDraft(itemKey(i))
                localStorage.removeItem(`cart-sync:${userId}:${itemKey(i)}`)
                localStorage.removeItem(`cart-sync:${userId}:${itemKey(i)}:uncertain`)
                void query.refetch()
              }}
            >
              Discard saved selection
            </button>
          </p>
        ))}
      </>
    )
  const cart = query.data!
  const blocked = cart.items.some(
    (i) =>
      !i.product.active ||
      (i.product.type === 'standard' &&
        (!i.variant?.active || i.quantity > i.variant.stockQty)),
  )
  return (
    <section className="commerce-panel commerce-cart">
      {mutation.isError && (
        <ErrorBox
          message={getApiErrorMessage(
            mutation.error,
            'Could not update this item.',
          )}
        />
      )}{' '}
      {!cart.items.length ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.items.map((i) => (
            <article className="commerce-cart-row" key={i.id}>
              <img
                src={
                  i.variant?.imageUrls?.[0] ||
                  catalog.data?.find((p) => p.id === i.product.id)
                    ?.defaultImage ||
                  '/icons/A.bio.svg'
                }
                alt=""
              />
              <div>
                <h2>{i.product.name}</h2>
                <p>
                  Color: {i.variant?.colorName ?? i.preferredColor ?? 'Custom'}
                </p>
                <p>{i.customUsername}</p>
                {i.instructions && <p>{i.instructions}</p>}
                <div className="commerce-actions">
                  <label>
                    Quantity
                    <input
                      key={`${i.id}-${i.quantity}`}
                      aria-label={`Quantity for ${i.product.name}`}
                      type="number"
                      min={1}
                      max={99}
                      defaultValue={i.quantity}
                      disabled={mutation.isPending}
                      onBlur={(e) => {
                        const q = Math.min(
                          99,
                          Math.max(1, Number(e.target.value) || 1),
                        )
                        if (q !== i.quantity)
                          mutation.mutate({ id: i.id, quantity: q })
                      }}
                    />
                  </label>
                  <button
                    className="commerce-secondary"
                    disabled={mutation.isPending}
                    onClick={() => mutation.mutate({ id: i.id })}
                  >
                    {mutation.isPending && mutation.variables?.id === i.id
                      ? 'Saving…'
                      : 'Remove'}
                  </button>
                </div>
                {!i.product.active ||
                (i.product.type === 'standard' &&
                  (!i.variant?.active || i.quantity > i.variant.stockQty)) ? (
                  <p role="alert">
                    Unavailable or insufficient stock. Reduce the quantity or
                    remove this item.
                  </p>
                ) : null}
              </div>
              <strong className="price">{money(i.lineTotalKobo)}</strong>
            </article>
          ))}
          <div className="commerce-totals">
            <p>
              <span>Subtotal</span>
              <strong>{money(cart.subtotalKobo)}</strong>
            </p>
            <p className="commerce-note">Delivery calculated at checkout</p>
            {!blocked && !mutation.isPending && !query.isFetching ? (
              <Link to="/checkout" className="commerce-primary">
                Checkout
              </Link>
            ) : (
              <button className="commerce-primary" disabled>
                Update your cart to continue
              </button>
            )}
          </div>
        </>
      )}
    </section>
  )
}
