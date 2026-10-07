import { DashboardLayout } from "@/features/dashboard/components/DashboardLayout";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { money, type Order } from "./api";
export function CommerceLayout({
  children,
  back = "/store",
  backLabel = "Continue shopping",
  productDetail = false,
}: {
  children: ReactNode;
  back?: string;
  backLabel?: string;
  productDetail?: boolean;
}) {
  const authenticated = useAuthStore((s) => s.isAuthenticated);
  const content = (
    <div
      className={` text-[#331400] dark:bg-[#1C1611] dark:text-[#F5EEE4] ${
        productDetail
          ? "flex h-full min-h-0 flex-col overflow-hidden bg-transparent"
          : "min-h-screen"
      }`}
    >
      {!authenticated && (
        <header className="mx-auto flex w-full max-w-8xl shrink-0 items-center px-4 py-4 sm:px-6">
          <Link to="/">
            <img src="/icons/A.bio.svg" alt="Abio" width={38} height={38} />
          </Link>
        </header>
      )}
      <main
        className={`mx-auto w-full max-w-8xl px-4 sm:px-6 ${
          productDetail
            ? "flex min-h-0 max-w-none flex-1 flex-col overflow-hidden px-0 pt-2 pb-0"
            : "pb-12"
        }`}
      >
        {children}
      </main>
    </div>
  );
  return authenticated ? <DashboardLayout>{content}</DashboardLayout> : content;
}
export function Loading({ text = "Loading…" }: { text?: string }) {
  return (
    <p
      className="flex min-h-48 items-center justify-center gap-3 py-10 text-sm font-semibold text-[#331400]/65 dark:text-[#F5EEE4]/65"
      role="status"
    >
      <Loader2 className="h-5 w-5 animate-spin text-[#331400] dark:text-[#FED45C]" />
      {text}
    </p>
  );
}
export function ErrorBox({
  message,
  retry,
}: {
  message: string;
  retry?: () => void;
}) {
  return (
    <div
      className="my-4 flex flex-col gap-3 border border-red-900/15 bg-white p-4 text-sm text-[#331400] dark:border-red-200/15 dark:bg-[#2B2119] dark:text-[#F5EEE4]"
      role="alert"
    >
      <p>{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="w-fit border border-[#331400]/20 px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#331400]/5 dark:border-[#F5EEE4]/20 dark:hover:bg-white/5"
        >
          Try again
        </button>
      )}
    </div>
  );
}
export function Steps({ step }: { step: number }) {
  return (
    <ol className="mb-8 grid grid-cols-3 gap-2" aria-label="Checkout progress">
      {["Personal details", "Payment", "Complete"].map((name, i) => {
        const currentStep = i + 1;
        const complete = step > currentStep;
        const active = step === currentStep;
        return (
          <li
            key={name}
            aria-current={active ? "step" : undefined}
            className="flex min-w-0 flex-col items-center gap-2 text-center"
          >
            <span
              className={`flex h-8 w-8 items-center justify-center border text-xs font-bold ${complete || active ? "border-[#FED45C] bg-[#FED45C] text-[#331400]" : "border-[#331400]/15 text-[#331400]/40 dark:border-[#F5EEE4]/20 dark:text-[#F5EEE4]/40"}`}
            >
              {complete ? "✓" : currentStep}
            </span>
            <span
              className={`text-[10px] font-semibold sm:text-xs ${complete || active ? "text-[#331400] dark:text-[#F5EEE4]" : "text-[#331400]/40 dark:text-[#F5EEE4]/40"}`}
            >
              {name}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
export function OrderSummary({
  order,
}: {
  order: Pick<
    Order,
    "items" | "subtotalKobo" | "shippingFeeKobo" | "totalAmountKobo"
  >;
}) {
  return (
    <aside className="border border-[#331400]/10 bg-white p-5 dark:border-[#3A2C20] dark:bg-[#2B2119] sm:p-6">
      <h2 className="mb-4 text-base font-bold text-[#1a0800] dark:text-[#F5EEE4]">
        Your order{" "}
        <span>({order.items.reduce((n, i) => n + i.quantity, 0)})</span>
      </h2>
      {order.items.map((item) => (
        <article
          className="mb-3 flex gap-3 border border-[#331400]/10 p-3 last:mb-0 dark:border-[#F5EEE4]/10"
          key={item.id}
        >
          <img
            src={
              item.imageUrls?.[0] ||
              item.variant?.imageUrls?.[0] ||
              "/icons/A.bio.svg"
            }
            alt=""
            className="h-16 w-16 shrink-0 bg-[#FAFAFC] object-contain p-1 dark:bg-[#1C1611]"
          />
          <div className="min-w-0 flex-1 text-sm">
            <h3 className="truncate font-semibold text-[#1a0800] dark:text-[#F5EEE4]">
              {item.productName ?? item.product?.name ?? "Product"}
            </h3>
            <p className="mt-0.5 text-xs text-[#331400]/55 dark:text-[#F5EEE4]/55">
              {item.variantColorName ??
                item.variant?.colorName ??
                item.preferredColor}
            </p>
            {item.customUsername && (
              <p className="text-xs">{item.customUsername}</p>
            )}
            <p className="text-xs">Quantity: {item.quantity}</p>
            <strong className="mt-2 block text-sm">
              {money(item.unitPriceKobo * item.quantity)}
            </strong>
          </div>
        </article>
      ))}
      <div className="mt-5 space-y-3 border-t border-[#331400]/15 pt-4 text-sm dark:border-[#F5EEE4]/15">
        <h3 className="text-[10px] font-bold uppercase text-[#331400]/50 dark:text-[#F5EEE4]/50">
          Order summary
        </h3>
        <p className="flex justify-between gap-4">
          <span>Subtotal</span>
          <strong>{money(order.subtotalKobo)}</strong>
        </p>
        <p className="flex justify-between gap-4">
          <span>Delivery</span>
          <strong>
            {order.shippingFeeKobo === 0
              ? "Free"
              : money(order.shippingFeeKobo)}
          </strong>
        </p>
        <p className="flex justify-between gap-4 border-t border-[#331400]/15 pt-3 text-base font-bold dark:border-[#F5EEE4]/15">
          <span>Total</span>
          <strong>{money(order.totalAmountKobo)}</strong>
        </p>
      </div>
    </aside>
  );
}
