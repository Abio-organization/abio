# Checkout checks

Run the frontend on port 3000, then run `node tests/manual/commerce-flow.cjs` and `node tests/manual/commerce-safety.cjs`. These use Playwright and intercepted API fixtures; they do not charge a card or verify the live provider.

The flow uses the backend Bachs hosted checkout URL. Payment is confirmed only from the authenticated order API, updated by the webhook. Return query parameters never mark an order paid. Personal details, payment, confirmation, cart, product detail and order history share the reference design with square UI borders.

Before release, deploy the new `/orders/:id` return route to the configured Bachs return origin. Run a real sandbox payment and confirm the webhook updates payment status, including a delayed webhook, cancellation, and pending expiry. The current backend return origin points to `https://abio-smoky.vercel.app`; localhost fixture checks cannot prove that deployed callback journey. Do not expose provider secrets to the frontend.

Checkout creation has no backend idempotency request key. The frontend persists an attempt marker and pauses after an ambiguous failure instead of automatically creating another order. Cross-device exactly-once checkout would require backend support. Cart synchronization uses absolute PATCH targets and refuses blind replay of an uncertain additive POST.
