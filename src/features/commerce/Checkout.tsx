import { useState, useRef } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { commerce, money, paymentUrl, type Order } from "./api";
import { useServerCart } from "./hooks";
import { RequireCustomer } from "./RequireCustomer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { CommerceLayout, Steps, Loading, ErrorBox, OrderSummary } from "./ui";
export function Checkout() {
  return (
    <RequireCustomer>
      <CheckoutForm />
    </RequireCustomer>
  );
}
function CheckoutForm() {
  const user = useAuthStore((s) => s.user)!;
  const query = useServerCart();
  const cache = useQueryClient();
  const navigate = useNavigate();
  const key = `checkout-attempt:${user.id}`;
  const draftKey = `shipping:${user.id}`;
  const stored = (() => {
    try {
      return JSON.parse(sessionStorage.getItem(draftKey) || "{}");
    } catch {
      return {};
    }
  })();
  const [address, setAddress] = useState<string>(stored.address ?? "");
  const [zone, setZone] = useState<"lagos" | "outside_lagos">(
    stored.zone === "outside_lagos" ? "outside_lagos" : "lagos",
  );
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [uncertain, setUncertain] = useState(
    Boolean(localStorage.getItem(key)),
  );
  const [saved, setSaved] = useState<Order | null>(null);
  const lock = useRef(false);
  const [redirectError, setRedirectError] = useState("");
  const mutation = useMutation({
    mutationFn: async () => {
      if (lock.current || localStorage.getItem(key))
        throw new Error(
          "Checkout is already in progress. Check your recent orders.",
        );
      lock.current = true;
      localStorage.setItem(
        key,
        JSON.stringify({ startedAt: new Date().toISOString() }),
      );
      try {
        return await commerce.checkout({
          deliveryZone: zone,
          shippingAddress: address.trim(),
        });
      } finally {
        lock.current = false;
      }
    },
    retry: false,
    onSuccess: async (order) => {
      setSaved(order);
      localStorage.setItem(key, JSON.stringify({ orderId: order.id }));
      cache.setQueryData(["commerce", "order", user.id, order.id], order);
      void cache.invalidateQueries({ queryKey: ["commerce", "cart", user.id] });
      sessionStorage.removeItem(draftKey);
      const expectedTotal =
        (query.data?.subtotalKobo ?? 0) + (zone === "lagos" ? 0 : 500000);
      const changedTotal = order.totalAmountKobo !== expectedTotal;
      const url = paymentUrl(order.checkoutUrl);
      if (!url || changedTotal)
        sessionStorage.setItem(
          `payment-review:${order.id}`,
          changedTotal
            ? "The total changed after checking current prices. Review the new total before continuing payment."
            : "Your order is saved, but payment could not be opened. Continue payment below when you are ready.",
        );
      await navigate({ to: "/orders/$id", params: { id: order.id } });
      if (url && !changedTotal) {
        try {
          window.location.assign(url);
        } catch {
          setRedirectError("Could not open payment. Continue from your order.");
        }
      }
    },
    onError: (error) => {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        [400, 401, 403, 404, 409, 422].includes(error.response.status)
      ) {
        localStorage.removeItem(key);
        void query.refetch();
      } else setUncertain(true);
    },
  });
  if (saved)
    return (
      <CommerceLayout>
        <Loading text="Opening your order…" />
        {redirectError && <ErrorBox message={redirectError} />}
        <Link
          className="mt-4 inline-block text-sm font-semibold text-[#331400] underline underline-offset-4 dark:text-[#F5EEE4]"
          to="/orders/$id"
          params={{ id: saved.id }}
        >
          Continue to your order
        </Link>
      </CommerceLayout>
    );
  if (uncertain) {
    let orderId: string | undefined;
    try {
      orderId = JSON.parse(localStorage.getItem(key) || "{}").orderId;
    } catch {
      /* malformed local data */
    }
    return (
      <CommerceLayout>
        <h1 className="text-2xl font-extrabold text-[#1a0800] dark:text-[#F5EEE4]">
          Check your order before trying again
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#331400]/65 dark:text-[#F5EEE4]/65">
          Your previous checkout may already have created an order. Open it to
          continue payment.
        </p>
        {orderId ? (
          <Link
            className="mt-5 inline-block bg-[#331400] px-5 py-4 text-center text-sm font-bold text-white hover:bg-[#1a0800]"
            to="/orders/$id"
            params={{ id: orderId }}
          >
            View saved order
          </Link>
        ) : (
          <Link
            className="mt-5 inline-block bg-[#331400] px-5 py-4 text-center text-sm font-bold text-white hover:bg-[#1a0800]"
            to="/orders"
          >
            Check recent orders
          </Link>
        )}
        <p className="mt-4 max-w-xl border border-[#331400]/10 bg-white p-4 text-xs leading-5 text-[#331400]/65 dark:border-[#F5EEE4]/10 dark:bg-[#2B2119] dark:text-[#F5EEE4]/65">
          We have paused new checkout attempts to avoid duplicate orders. If no
          order appears, contact support before starting again.
        </p>
      </CommerceLayout>
    );
  }
  if (query.isPending)
    return (
      <CommerceLayout>
        <Loading text="Preparing your checkout…" />
      </CommerceLayout>
    );
  if (query.isError)
    return (
      <CommerceLayout>
        <ErrorBox
          message={getApiErrorMessage(query.error)}
          retry={() => void query.refetch()}
        />
      </CommerceLayout>
    );
  const cart = query.data!;
  if (!cart.items.length)
    return (
      <CommerceLayout>
        <h1 className="text-2xl font-extrabold text-[#1a0800] dark:text-[#F5EEE4]">
          Your cart is empty
        </h1>
        <Link
          className="mt-4 inline-block text-sm font-semibold underline underline-offset-4"
          to="/orders"
        >
          View your orders
        </Link>
      </CommerceLayout>
    );
  const fee = zone === "lagos" ? 0 : 500000;
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
  };
  const blocked = cart.items.some(
    (i) =>
      !i.product.active ||
      (i.product.type === "standard" &&
        (!i.variant?.active || i.variant.stockQty < i.quantity)),
  );
  return (
    <CommerceLayout back="/store/cart" backLabel="Back to cart">
      <Steps step={step} />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:gap-8">
        <section className="min-w-0 border border-[#331400]/10 bg-white p-4 dark:border-[#3A2C20] dark:bg-[#2B2119] sm:p-6">
          <h1 className="text-2xl font-bold text-[#1a0800] dark:text-[#F5EEE4]">
            {step === 1 ? "Personal details" : "Payment"}
          </h1>
          {step === 1 ? (
            <form
              className="mt-5 grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                sessionStorage.setItem(
                  draftKey,
                  JSON.stringify({ address, zone }),
                );
                setStep(2);
              }}
            >
              <label className="grid gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#331400]/65 dark:text-[#F5EEE4]/65">
                Name
                <input
                  className="h-10 border border-[#331400]/20 bg-[#FEF4EA]/50 px-3 text-sm font-medium normal-case tracking-normal text-[#331400] outline-none dark:border-[#F5EEE4]/20 dark:bg-[#1C1611] dark:text-[#F5EEE4]"
                  value={user.name}
                  readOnly
                />
              </label>
              <label className="grid gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#331400]/65 dark:text-[#F5EEE4]/65">
                Email
                <input
                  className="h-10 border border-[#331400]/20 bg-[#FEF4EA]/50 px-3 text-sm font-medium normal-case tracking-normal text-[#331400] outline-none dark:border-[#F5EEE4]/20 dark:bg-[#1C1611] dark:text-[#F5EEE4]"
                  value={user.email}
                  readOnly
                />
              </label>
              <label className="grid gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#331400]/65 dark:text-[#F5EEE4]/65">
                Delivery zone
                <Select
                  value={zone}
                  onValueChange={(value) => setZone(value as typeof zone)}
                >
                  <SelectTrigger className="h-10 w-full border border-[#331400]/20 bg-white px-3 text-sm font-medium normal-case tracking-normal text-[#331400] outline-none focus:border-[#331400] focus:ring-1 focus:ring-[#FED45C] dark:border-[#F5EEE4]/20 dark:bg-[#1C1611] dark:text-[#F5EEE4]">
                    <SelectValue placeholder="Select a zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lagos">Lagos — Free delivery</SelectItem>
                    <SelectItem value="outside_lagos">
                      Outside Lagos — ₦5,000
                    </SelectItem>
                  </SelectContent>
                </Select>
              </label>
              <label className="grid gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#331400]/65 dark:text-[#F5EEE4]/65">
                Shipping address
                <textarea
                  className="min-h-28 border border-[#331400]/20 bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-[#331400] outline-none focus:border-[#331400] focus:ring-1 focus:ring-[#FED45C] dark:border-[#F5EEE4]/20 dark:bg-[#1C1611] dark:text-[#F5EEE4]"
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
                className="mt-2 w-full bg-[#FFCF5C] shadow-[4px_4px_0_#1a0800] px-5 py-4 text-sm font-extrabold text-black transition-colors hover:bg-[#1a0800] disabled:cursor-not-allowed disabled:opacity-45"
                disabled={address.trim().length < 5}
              >
                Continue to payment
              </button>
            </form>
          ) : (
            <div className="mt-5 grid gap-4">
              <p className="text-sm leading-6 text-[#331400]/70 dark:text-[#F5EEE4]/70">
                Complete payment securely on Bachs. Available card and
                bank-transfer options will be shown there.
              </p>
              <div className="border border-[#331400]/10 bg-[#FEF4EA]/70 p-4 dark:border-[#F5EEE4]/10 dark:bg-[#1C1611]">
                <h2 className="text-base font-bold text-[#1a0800] dark:text-[#F5EEE4]">
                  Bachs checkout
                </h2>
                <p className="mt-1 text-xs leading-5 text-[#331400]/65 dark:text-[#F5EEE4]/65">
                  We’ll open the hosted payment page after saving your order.
                </p>
              </div>
              <p className="border-l-2 border-[#FED45C] pl-3 text-sm leading-6">
                <strong>Delivery to:</strong> {address}
              </p>
              <button
                className="w-fit border border-[#331400]/20 px-4 py-2.5 text-sm font-semibold text-[#331400] transition-colors hover:bg-[#331400]/5 disabled:opacity-50 dark:border-[#F5EEE4]/20 dark:text-[#F5EEE4] dark:hover:bg-white/5"
                disabled={mutation.isPending}
                onClick={() => setStep(1)}
              >
                Edit personal details
              </button>
              <label className="flex items-start gap-2 text-xs leading-5 text-[#331400]/70 dark:text-[#F5EEE4]/70">
                <input
                  className="mt-0.5 h-4 w-4 accent-[#331400]"
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
                    "Could not create your order.",
                  )}
                />
              )}
              <button
                className="w-full bg-[#FED45C] px-5 py-4 text-sm font-extrabold text-[#331400] transition-colors hover:bg-[#f7c93d] disabled:cursor-not-allowed disabled:opacity-45"
                disabled={
                  !agreed || blocked || mutation.isPending || query.isFetching
                }
                onClick={() => mutation.mutate()}
              >
                {mutation.isPending
                  ? "Creating your order…"
                  : `Pay | ${money(estimate.totalAmountKobo)}`}
              </button>
              <p className="text-center text-[10px] leading-5 text-[#331400]/55 dark:text-[#F5EEE4]/55">
                Current prices and availability are checked before payment.
              </p>
            </div>
          )}
        </section>
        <OrderSummary order={estimate} />
      </div>
    </CommerceLayout>
  );
}
