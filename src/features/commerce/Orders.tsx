import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Clock, AlertTriangle } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { commerce, canPay, paymentUrl, money } from "./api";
import { RequireCustomer } from "./RequireCustomer";
import { CommerceLayout, OrderSummary, Steps, Loading, ErrorBox } from "./ui";
export function Orders() {
  return (
    <RequireCustomer>
      <OrderList />
    </RequireCustomer>
  );
}
function OrderList() {
  const userId = useAuthStore((s) => s.user?.id);
  const [page, setPage] = useState(1);
  const query = useQuery({
    queryKey: ["commerce", "orders", userId, page],
    queryFn: ({ signal }) => commerce.orders(page, signal),
    retry: 1,
  });
  return (
    <CommerceLayout back="/dashboard/store" backLabel="Back to store">
      <h1 className="text-2xl font-extrabold text-[#1a0800] dark:text-[#F5EEE4]">
        Your orders
      </h1>
      <p className="mt-1 text-sm text-[#331400]/60 dark:text-[#F5EEE4]/60">
        Payment status and delivery progress, in one place.
      </p>
      {query.isPending && <Loading />}
      {query.isError && (
        <ErrorBox
          message={getApiErrorMessage(query.error)}
          retry={() => void query.refetch()}
        />
      )}
      <div className="mt-5 grid gap-3">
        {query.data?.orders.map((order) => (
          <Link
            key={order.id}
            to="/orders/$id"
            params={{ id: order.id }}
            className="flex items-center justify-between gap-4 border border-[#331400]/10 bg-white p-4 transition-colors hover:border-[#331400]/30 hover:bg-[#FEF4EA]/50 dark:border-[#F5EEE4]/10 dark:bg-[#2B2119] dark:hover:border-[#FED45C]/50 dark:hover:bg-white/5 sm:p-5"
          >
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-[#1a0800] dark:text-[#F5EEE4]">
                Order #{order.id.slice(0, 8)}
              </h3>
              <p className="mt-1 text-xs text-[#331400]/55 dark:text-[#F5EEE4]/55">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-1 text-xs text-[#331400]/65 dark:text-[#F5EEE4]/65">
                Payment: {order.payment?.status ?? "unavailable"} · Delivery:{" "}
                {order.status}
              </p>
            </div>
            <strong className="shrink-0 text-sm font-extrabold text-[#1a0800] dark:text-[#F5EEE4]">
              {money(order.totalAmountKobo)}
            </strong>
          </Link>
        ))}
      </div>
      {query.data && !query.data.orders.length && (
        <p className="border border-dashed border-[#331400]/20 py-10 text-center text-sm text-[#331400]/55 dark:border-[#F5EEE4]/20 dark:text-[#F5EEE4]/55">
          No orders yet. Your purchases will appear here.
        </p>
      )}
      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          className="border border-[#331400]/20 px-4 py-2.5 text-xs font-semibold text-[#331400] transition-colors hover:bg-[#331400]/5 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#F5EEE4]/20 dark:text-[#F5EEE4] dark:hover:bg-white/5"
          disabled={page <= 1 || query.isFetching}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </button>
        <span className="text-xs font-semibold text-[#331400]/60 dark:text-[#F5EEE4]/60">
          Page {page}
        </span>
        <button
          className="border border-[#331400]/20 px-4 py-2.5 text-xs font-semibold text-[#331400] transition-colors hover:bg-[#331400]/5 disabled:cursor-not-allowed disabled:opacity-40 dark:border-[#F5EEE4]/20 dark:text-[#F5EEE4] dark:hover:bg-white/5"
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
  );
}
export function OrderDetail({ id }: { id: string }) {
  return (
    <RequireCustomer>
      <Detail id={id} key={id} />
    </RequireCustomer>
  );
}
function Detail({ id }: { id: string }) {
  const userId = useAuthStore((s) => s.user?.id);
  const cache = useQueryClient();
  const [started, setStarted] = useState(Date.now);
  const [polling, setPolling] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setPolling(false), 60000);
    return () => clearTimeout(timer);
  }, [started]);
  const [reviewNote] = useState(() =>
    sessionStorage.getItem(`payment-review:${id}`),
  );
  const [openError, setOpenError] = useState("");
  const query = useQuery({
    queryKey: ["commerce", "order", userId, id],
    queryFn: ({ signal }) => commerce.order(id, signal),
    retry: 1,
    refetchInterval: (q) =>
      q.state.data?.payment?.status === "pending" &&
      q.state.data.status !== "cancelled" &&
      polling
        ? 2500
        : false,
    refetchIntervalInBackground: false,
  });
  const order = query.data;
  useEffect(() => {
    if (!order) return;
    const key = `checkout-attempt:${userId}`;
    try {
      const attempt = JSON.parse(localStorage.getItem(key) || "{}");
      if (
        attempt.orderId === order.id ||
        (attempt.startedAt &&
          Date.parse(order.createdAt) >= Date.parse(attempt.startedAt) - 5000)
      )
        localStorage.removeItem(key);
    } catch {
      /* ignore malformed local journal */
    }
  }, [order, userId]);
  const pay = useMutation({
    mutationFn: () => commerce.pay(id),
    retry: false,
    onSuccess: (result) => {
      cache.setQueryData(["commerce", "order", userId, id], result);
      const url = paymentUrl(result.checkoutUrl);
      if (!url) {
        setOpenError(
          "Your order is saved, but no valid payment link was returned. Please try again later.",
        );
        return;
      }
      try {
        sessionStorage.removeItem(`payment-review:${id}`);
        window.location.assign(url);
      } catch {
        setOpenError("Could not open payment. Please try again.");
      }
    },
    onError: () => {
      void query.refetch();
    },
  });
  if (query.isPending)
    return (
      <CommerceLayout>
        <Loading text="Checking your order…" />
      </CommerceLayout>
    );
  if (!order)
    return (
      <CommerceLayout>
        <ErrorBox
          message={getApiErrorMessage(
            query.error,
            "Could not load this order.",
          )}
          retry={() => void query.refetch()}
        />
        <Link to="/orders">View your orders</Link>
      </CommerceLayout>
    );
  const paid = order.payment?.status === "success";
  const pending = canPay(order);
  const waiting = pending && polling;
  const cancelledReturn =
    new URLSearchParams(window.location.search).get("cancelled") === "1";
  return (
    <CommerceLayout back="/orders" backLabel="All orders">
      <Steps step={paid ? 3 : 2} />
      <div className="mx-auto w-full max-w-3xl">
        {reviewNote && pending && (
          <p
            role="status"
            className="mb-4 border border-[#FED45C]/60 bg-[#FED45C]/15 p-3 text-sm text-[#331400] dark:text-[#F5EEE4]"
          >
            {reviewNote}
          </p>
        )}
        <div className="mb-5 border border-[#331400]/10 bg-white p-6 text-center dark:border-[#3A2C20] dark:bg-[#2B2119] sm:p-9">
          {paid ? (
            <Check
              size={55}
              className="mx-auto mb-4 text-[#331400] dark:text-[#FED45C]"
            />
          ) : pending ? (
            <Clock
              size={48}
              className="mx-auto mb-4 text-[#331400] dark:text-[#FED45C]"
            />
          ) : (
            <AlertTriangle
              size={48}
              className="mx-auto mb-4 text-[#331400] dark:text-[#FED45C]"
            />
          )}
          <h1
            className={`text-xl font-extrabold text-[#1a0800] dark:text-[#F5EEE4] sm:text-2xl ${paid ? "" : ""}`}
          >
            {paid
              ? "Order confirmed successfully"
              : pending
                ? reviewNote
                  ? "Your order is saved"
                  : waiting
                    ? "Confirming payment…"
                    : "Payment confirmation is taking longer"
                : order.payment?.status === "reversed"
                  ? "Payment reversed"
                  : order.status === "cancelled"
                    ? "Order cancelled"
                    : "Payment was not completed"}
          </h1>
          <p className="mt-3 text-xs text-[#331400]/55 dark:text-[#F5EEE4]/55">
            Order ID: <strong>{order.id}</strong>
          </p>
          {paid ? (
            <p className="mt-3 text-sm leading-6 text-[#331400]/70 dark:text-[#F5EEE4]/70">
              Thank you. We’ll update your order as it moves toward delivery.
            </p>
          ) : pending ? (
            <p className="mt-3 text-sm leading-6 text-[#331400]/70 dark:text-[#F5EEE4]/70">
              {cancelledReturn
                ? "You returned without completing checkout. We are checking the latest payment status."
                : "Your order is saved. Only a confirmed payment will mark it paid."}
            </p>
          ) : (
            <p className="mt-3 text-sm leading-6 text-[#331400]/70 dark:text-[#F5EEE4]/70">
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
            message={getApiErrorMessage(pay.error, "Could not open payment.")}
          />
        )}{" "}
        {openError && <ErrorBox message={openError} />}
        <div className="mb-5 flex flex-wrap justify-center gap-3">
          <button
            className="border border-[#331400]/20 px-4 py-3 text-sm font-semibold text-[#331400] transition-colors hover:bg-[#331400]/5 disabled:opacity-50 dark:border-[#F5EEE4]/20 dark:text-[#F5EEE4] dark:hover:bg-white/5"
            disabled={query.isFetching}
            onClick={() => {
              setPolling(true);
              setStarted(Date.now());
              void query.refetch();
            }}
          >
            {query.isFetching ? "Checking…" : "Check again"}
          </button>
          {pending && (
            <button
              className="bg-[#FED45C] px-5 py-3 text-sm font-extrabold text-[#331400] transition-colors hover:bg-[#f7c93d] disabled:cursor-not-allowed disabled:opacity-45"
              disabled={pay.isPending || query.isFetching}
              onClick={() => {
                setOpenError("");
                pay.mutate();
              }}
            >
              {pay.isPending ? "Opening payment…" : "Continue payment"}
            </button>
          )}
        </div>
        <OrderSummary order={order} />
        <section className="mb-5 border border-[#331400]/10 bg-white p-4 dark:border-[#3A2C20] dark:bg-[#2B2119] sm:p-6">
          <h2 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#331400]/50 dark:text-[#F5EEE4]/50">
            Delivery details
          </h2>
          <p className="whitespace-pre-wrap text-sm leading-6">
            {order.shippingAddress}
          </p>
          <p className="mt-2 text-xs text-[#331400]/60 dark:text-[#F5EEE4]/60">
            Status: {order.status}
          </p>
          <p className="mt-1 text-xs text-[#331400]/60 dark:text-[#F5EEE4]/60">
            Tracking ID: {order.trackingNumber ?? "Not assigned yet"}
          </p>
        </section>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            className="border border-[#331400]/20 px-4 py-3 text-sm font-semibold text-[#331400] transition-colors hover:bg-[#331400]/5 dark:border-[#F5EEE4]/20 dark:text-[#F5EEE4] dark:hover:bg-white/5"
            to="/store"
          >
            Shop again
          </Link>
          {paid && (
            <button
              className="border border-[#331400]/20 px-4 py-3 text-sm font-semibold text-[#331400] transition-colors hover:bg-[#331400]/5 dark:border-[#F5EEE4]/20 dark:text-[#F5EEE4] dark:hover:bg-white/5"
              onClick={() => window.print()}
            >
              Print / save receipt
            </button>
          )}
        </div>
      </div>
    </CommerceLayout>
  );
}
