import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { useCartStore, itemKey } from "@/features/store/store/cart-store";
import { useCatalog } from "@/features/store/catalog";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import {
  ArrowLeft,
  BadgeCheck,
  Check,
  Lock,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { commerce, money } from "./api";
import { useServerCart } from "./hooks";
import { CommerceLayout, ErrorBox, Loading } from "./ui";

type Line = {
  key: string;
  image: string;
  name: string;
  color: string;
  notes?: string[];
  quantity: number;
  total: string;
  busy?: boolean;
  removing?: boolean;
  warning?: boolean;
  onChange: (quantity: number) => void;
  onRemove: () => void;
};

const checkoutClass =
  "block w-full bg-[#FFCF5C] px-5 py-4 mb-6 text-center text-sm font-extrabold text-[#1a0800] shadow-[4px_4px_0_#1a0800] transition-[filter] hover:brightness-95 md:w-[440px] md:shadow-[4px_4px_0_#1a0800] dark:bg-[#FFCF5C] dark:text-[#1a0800]";

const checkoutDisabledClass =
  "block w-full cursor-not-allowed bg-[#331400]/45 px-5 py-4 text-center text-sm font-extrabold text-white md:w-[440px]";

function Stepper({
  quantity,
  disabled,
  onChange,
  label,
}: {
  quantity: number;
  disabled?: boolean;
  onChange: (q: number) => void;
  label: string;
}) {
  const btn =
    "flex h-8 w-8 items-center justify-center transition-colors hover:bg-[#331400]/5 disabled:cursor-not-allowed disabled:opacity-35 dark:hover:bg-white/10";
  return (
    <div
      className="inline-flex h-8 items-center  border border-[#1a0800]/60 text-[#1a0800] dark:border-[#F5EEE4]/50 dark:text-[#F5EEE4]"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || quantity <= 1}
        onClick={() => onChange(Math.max(1, quantity - 1))}
        className={`${btn} rounded-l-full`}
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="w-6 text-center text-xs font-semibold tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled || quantity >= 99}
        onClick={() => onChange(Math.min(99, quantity + 1))}
        className={`${btn} rounded-r-full`}
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}

function CartLines({ lines }: { lines: Line[] }) {
  return (
    <div className="bg-[#FAFAFC] shadow-md dark:bg-transparent p-4 ">
      {/* Desktop table header */}
      <div className="hidden items-center  justify-between border-b border-[#1a0800] pb-2 text-sm font-semibold tracking-wide text-[#1a0800] uppercase md:flex dark:border-[#F5EEE4]/40 dark:text-[#F5EEE4]">
        <span>Product</span>
        <span className="pr-4">Total</span>
      </div>

      <div className="flex flex-col  gap-3 md:gap-0">
        {lines.map((l) => (
          <article
            key={l.key}
            className="relative grid grid-cols-[64px_minmax(0,1fr)] gap-3 bg-white p-3 md:grid-cols-[112px_minmax(0,1fr)_auto] md:gap-6 md:border-b md:border-[#1a0800] md:bg-transparent md:px-4 md:py-4 dark:bg-[#2B2119] md:dark:border-[#F5EEE4]/40 md:dark:bg-transparent"
          >
            {/* Image tile — image fills the box, box reduced on all screens */}
            <div className="flex aspect-square items-center justify-center overflow-hidden bg-[#F5F5F5] md:border md:border-[#331400]/10 md:bg-white dark:bg-[#1C1611] md:dark:border-[#3A2C20] md:dark:bg-[#2B2119]">
              <img
                src={l.image}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex min-w-0 flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-bold text-[#1a0800] md:text-lg md:font-semibold dark:text-[#F5EEE4]">
                    {l.name}
                  </h2>
                  <p className="mt-0.5 text-[11px] text-[#331400]/60 md:text-sm md:text-[#1a0800] dark:text-[#F5EEE4]/60 md:dark:text-[#F5EEE4]">
                    Color: {l.color}
                  </p>
                  {l.notes?.map((n) => (
                    <p
                      key={n}
                      className="mt-0.5 truncate text-[11px] text-[#331400]/60 md:text-xs dark:text-[#F5EEE4]/60"
                    >
                      {n}
                    </p>
                  ))}
                </div>
                {/* Decorative selected badge (mobile) */}
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 shrink-0 items-center justify-center bg-[#FED45C] text-[#331400] md:hidden"
                >
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
              </div>

              {/* Price + controls: stacked on mobile, row on desktop */}
              <div className="mt-auto flex flex-col gap-2 pt-3 md:mt-4 md:flex-row md:items-end md:justify-start md:pt-0">
                <p className="text-[16px] font-bold text-[#1a0800] md:hidden dark:text-[#F5EEE4]">
                  {l.total}
                </p>
                {/* Stepper + trash: trash pushed to far right on mobile */}
                <div className="flex w-full items-center justify-between gap-2 md:w-auto md:justify-start">
                  <Stepper
                    quantity={l.quantity}
                    disabled={l.busy}
                    onChange={l.onChange}
                    label={`Quantity for ${l.name}`}
                  />
                  <button
                    type="button"
                    aria-label={`Remove ${l.name}`}
                    disabled={l.busy}
                    onClick={l.onRemove}
                    className="flex h-8 w-8 items-center justify-center text-[#331400]/60 transition-colors hover:text-[#331400] disabled:cursor-wait disabled:opacity-50 md:hidden dark:text-[#F5EEE4]/60 dark:hover:text-[#F5EEE4]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {l.warning && (
                <p
                  role="alert"
                  className="mt-3 border border-red-300 bg-red-50 p-2 text-xs text-red-700 dark:border-red-200/20 dark:bg-red-950/30 dark:text-red-200"
                >
                  Unavailable or insufficient stock. Reduce the quantity or
                  remove this item.
                </p>
              )}
            </div>

            {/* Desktop price + remove */}
            <div className="hidden flex-col items-end justify-between md:flex">
              <p className="text-xl font-bold text-[#1a0800] dark:text-[#F5EEE4]">
                {l.total}
              </p>
              <button
                type="button"
                disabled={l.busy}
                onClick={l.onRemove}
                className="inline-flex h-10 items-center gap-1.5 bg-[#FED45C]/30 px-6 text-sm font-semibold text-[#331400] transition-colors hover:bg-[#FED45C]/60 disabled:cursor-wait disabled:opacity-50 dark:bg-white/10 dark:text-[#F5EEE4] dark:hover:bg-white/20"
              >
                {l.removing ? (
                  "Saving…"
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" /> Remove
                  </>
                )}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function CartFooter({
  subtotal,
  note,
  inStock,
  action,
}: {
  subtotal: string;
  note: string;
  inStock?: boolean;
  action: ReactNode;
}) {
  const row =
    "flex items-baseline justify-between gap-4 border-b border-[#331400]/10 py-4 last:border-b-0 md:border-[#1a0800] md:py- dark:border-[#F5EEE4]/10 md:dark:border-[#F5EEE4]/40";
  return (
    <div className="mt-4 bg-[#FAFAFC] p-5 md:mt-8 shadow-2xl md:p-0 dark:bg-[#2B2119] md:dark:bg-transparent">
      <div className="md:grid md:grid-cols-2 md:items-start md:gap-8 md:px-6">
        {/* Trust list (desktop) */}
        <ul className="hidden space-y-3 text-sm text-[#1a0800] md:block dark:text-[#F5EEE4]">
          <li className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4" /> iOS &amp; Android Compatible
          </li>
          <li className="flex items-center gap-2">
            <Lock className="h-4 w-4" /> Secure &amp; Trusted
          </li>
          {inStock && (
            <li className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-500" /> In stock,
              ready to deliver
            </li>
          )}
        </ul>

        {/* Totals */}
        <dl className="flex flex-col text-[#1a0800] dark:text-[#F5EEE4]">
          <div className={`${row} md:hidden`}>
            <dt className="text-sm text-[#331400]/60 dark:text-[#F5EEE4]/60">
              Product price
            </dt>
            <dd className="text-lg font-extrabold">{subtotal}</dd>
          </div>
          <div className={`${row} md:order-2`}>
            <dt className="text-sm text-[#331400]/60 md:font-bold md:text-[#1a0800] dark:text-[#F5EEE4]/60 md:dark:text-[#F5EEE4]">
              Delivery
            </dt>
            <dd className="text-sm font-semibold md:font-bold">At checkout</dd>
          </div>
          <div className={`${row} md:order-1`}>
            <dt className="text-sm md:text-lg md:uppercase">Subtotal</dt>
            <dd className="text-xl font-bold md:text-xl">{subtotal}</dd>
          </div>
        </dl>
      </div>

      <p className="mt-5 text-center text-xs text-[#331400]/60 md:mt-10 md:text-sm md:text-[#1a0800] dark:text-[#F5EEE4]/60 md:dark:text-[#F5EEE4]">
        {note}
      </p>
      <div className="mt-3 flex justify-center">{action}</div>
    </div>
  );
}

function EmptyCart({ text }: { text?: string }) {
  return (
    <div className="bg-white py-10 text-center dark:bg-[#2B2119]">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center bg-[#331400]/5 dark:bg-white/5">
        <ShoppingBag className="h-9 w-9 text-[#331400]/35 dark:text-[#F5EEE4]/35" />
      </div>
      <h2 className="text-xl font-bold text-[#1a0800] dark:text-[#F5EEE4]">
        Your cart is empty
      </h2>
      {text && (
        <p className="mt-2 text-sm text-[#331400]/55 dark:text-[#F5EEE4]/55">
          {text}
        </p>
      )}
      <Link
        to="/store"
        className="mt-5 inline-flex items-center gap-2 bg-[#331400] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1a0800]"
      >
        <ArrowLeft className="h-4 w-4" /> Continue shopping
      </Link>
    </div>
  );
}

export function Cart() {
  const authenticated = useAuthStore((s) => s.isAuthenticated);
  return (
    <CommerceLayout>
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-[#331400]/10 pb-4 dark:border-[#F5EEE4]/10">
        <h1 className="text-2xl font-semibold text-[#1a0800] dark:text-[#F5EEE4]">
          Cart
        </h1>
        <Link
          to="/store"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#331400]/65 transition-colors hover:text-[#331400] dark:text-[#F5EEE4]/65 dark:hover:text-[#F5EEE4]"
        >
          <ArrowLeft className="h-4 w-4" /> Continue shopping
        </Link>
      </div>
      {authenticated ? <AccountCart /> : <GuestCart />}
    </CommerceLayout>
  );
}

function GuestCart() {
  const catalog = useCatalog();
  const { items, removeItem, setQuantity } = useCartStore();
  if (catalog.isPending) return <Loading />;
  if (catalog.isError)
    return (
      <ErrorBox
        message="Could not load current products."
        retry={() => void catalog.refetch()}
      />
    );
  const lines = items.map((i) => {
    const p = catalog.data?.find((p) => p.id === i.productId);
    const v = p?.colors?.find((v) => v.id === i.variantId);
    const unit = Math.round((v?.price ?? p?.basePrice ?? 0) * 100);
    return { i, p, v, unit };
  });
  const subtotal = lines.reduce((sum, l) => sum + l.unit * l.i.quantity, 0);

  if (!items.length)
    return <EmptyCart text="Choose a product to get started." />;

  const viewLines: Line[] = lines.map(({ i, p, v, unit }) => ({
    key: itemKey(i),
    image: v?.mainImage || p?.defaultImage || "/icons/A.bio.svg",
    name: p?.name ?? "Unavailable product",
    color: v?.name ?? i.preferredColor ?? "Custom",
    notes: i.customUsername ? [i.customUsername] : undefined,
    quantity: i.quantity,
    total: money(unit * i.quantity),
    onChange: (q) => setQuantity(itemKey(i), q),
    onRemove: () => removeItem(itemKey(i)),
  }));

  return (
    <section>
      <CartLines lines={viewLines} />
      <CartFooter
        subtotal={money(subtotal)}
        note="Delivery calculated at checkout. Availability and prices are checked after sign-in."
        action={
          <Link to="/checkout" className={checkoutClass}>
            Sign in to checkout
          </Link>
        }
      />
    </section>
  );
}

function AccountCart() {
  const query = useServerCart();
  const cache = useQueryClient();
  const catalog = useCatalog();
  const drafts = useCartStore((s) => s.items);
  const removeDraft = useCartStore((s) => s.removeItem);
  const userId = useAuthStore((s) => s.user?.id);
  const mutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity?: number }) =>
      quantity === undefined
        ? commerce.remove(id)
        : commerce.update(id, quantity),
    onSettled: () => cache.invalidateQueries({ queryKey: ["commerce"] }),
  });
  if (query.isPending) return <Loading text="Syncing your cart…" />;
  if (query.isError)
    return (
      <>
        <ErrorBox
          message={getApiErrorMessage(
            query.error,
            "Could not sync your cart. Your saved selections are safe.",
          )}
          retry={() => void query.refetch()}
        />
        {drafts.map((i) => (
          <p
            key={itemKey(i)}
            className="my-3 border border-[#331400]/10 p-3 text-sm dark:border-[#F5EEE4]/10"
          >
            Saved selection: {i.colorName ?? i.customUsername ?? "Custom card"}{" "}
            × {i.quantity}{" "}
            <button
              className="mt-2 border border-[#331400]/20 px-3 py-2 text-xs font-semibold text-[#331400] hover:bg-[#331400]/5 dark:border-[#F5EEE4]/20 dark:text-[#F5EEE4] dark:hover:bg-white/5"
              onClick={() => {
                removeDraft(itemKey(i));
                localStorage.removeItem(`cart-sync:${userId}:${itemKey(i)}`);
                localStorage.removeItem(
                  `cart-sync:${userId}:${itemKey(i)}:uncertain`,
                );
                void query.refetch();
              }}
            >
              Discard saved selection
            </button>
          </p>
        ))}
      </>
    );
  const cart = query.data!;
  const blocked = cart.items.some(
    (i) =>
      !i.product.active ||
      (i.product.type === "standard" &&
        (!i.variant?.active || i.quantity > i.variant.stockQty)),
  );

  const viewLines: Line[] = cart.items.map((i) => ({
    key: i.id,
    image:
      i.variant?.imageUrls?.[0] ||
      catalog.data?.find((p) => p.id === i.product.id)?.defaultImage ||
      "/icons/A.bio.svg",
    name: i.product.name,
    color: i.variant?.colorName ?? i.preferredColor ?? "Custom",
    notes: [i.customUsername, i.instructions].filter(Boolean) as string[],
    quantity: i.quantity,
    total: money(i.lineTotalKobo),
    busy: mutation.isPending,
    removing: mutation.isPending && mutation.variables?.id === i.id,
    warning:
      !i.product.active ||
      (i.product.type === "standard" &&
        (!i.variant?.active || i.quantity > i.variant.stockQty)),
    onChange: (q) => mutation.mutate({ id: i.id, quantity: q }),
    onRemove: () => mutation.mutate({ id: i.id }),
  }));

  return (
    <section>
      {mutation.isError && (
        <ErrorBox
          message={getApiErrorMessage(
            mutation.error,
            "Could not update this item.",
          )}
        />
      )}
      {!cart.items.length ? (
        <EmptyCart />
      ) : (
        <>
          <CartLines lines={viewLines} />
          <CartFooter
            subtotal={money(cart.subtotalKobo)}
            note="Delivery calculated at checkout"
            inStock={!blocked}
            action={
              !blocked && !mutation.isPending && !query.isFetching ? (
                <Link to="/checkout" className={checkoutClass}>
                  <span className="md:hidden">Proceed to Checkout</span>
                  <span className="hidden md:inline">Checkout</span>
                </Link>
              ) : (
                <button className={checkoutDisabledClass} disabled>
                  Update your cart to continue
                </button>
              )
            }
          />
        </>
      )}
    </section>
  );
}
