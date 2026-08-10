import { Link, useNavigate } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, CreditCard, Minus, Plus, RefreshCw, ShieldCheck, ShoppingBag, Trash2, Truck } from 'lucide-react'

import { Footer, NavBar } from '@/features/landing'

import { getProductById } from '../data'
import { formatNaira, getProductPricing } from '../lib/pricing'
import { useCartStore } from '../store/cart-store'

export function CartPage() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const setQuantity = useCartStore((s) => s.setQuantity)

  const lines = items
    .map((item) => {
      const product = getProductById(item.productId)
      if (!product) return null
      const { discounted } = getProductPricing(product)
      return { item, product, unitPrice: discounted, lineTotal: discounted * item.quantity }
    })
    .filter((l): l is NonNullable<typeof l> => l !== null)

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0)
  const deliveryFee = 0
  const total = subtotal + deliveryFee

  const handleCheckout = () => {
    // Dashboard/checkout isn't built yet — send buyers to sign in for now.
    navigate({ to: '/auth/sign-in' })
  }

  if (lines.length === 0) {
    return (
      <div className="min-h-screen bg-[#FEF4EA] dark:bg-[#1C1611]">
        <NavBar />
        <div className="mx-auto max-w-6xl px-4 pt-36 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 text-center shadow-sm md:p-12 dark:bg-[#2B2119]"
          >
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#331400]/5 dark:bg-[#F5EEE4]/5">
              <ShoppingBag className="h-10 w-10 text-[#331400]/40 dark:text-[#F5EEE4]/40" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-[#1a0800] dark:text-[#F5EEE4]">Your cart is empty</h2>
            <p className="mb-6 text-[#331400]/60 dark:text-[#F5EEE4]/60">Looks like you haven't added any items to your cart yet.</p>
            <Link
              to="/store"
              className="inline-flex items-center gap-2 bg-[#331400] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#442000]"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FEF4EA] dark:bg-[#1C1611]">
      <NavBar />

      <div className="mx-auto max-w-7xl px-4 pt-32 pb-4">
        <div className="flex items-center justify-between">
          <Link to="/store" className="flex items-center gap-2 text-[#331400]/70 transition-colors hover:text-[#331400] dark:text-[#F5EEE4]/70 dark:hover:text-[#F5EEE4]">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Continue Shopping</span>
          </Link>
          <h1 className="text-xl font-bold text-[#1a0800] dark:text-[#F5EEE4]">Shopping Cart</h1>
          <div className="w-24" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Cart items */}
          <div className="flex-1">
            <div className="overflow-hidden bg-white shadow-sm dark:bg-[#2B2119]">
              <div className="hidden grid-cols-12 gap-4 border-b border-[#331400]/10 bg-[#FAFAFC] px-6 py-4 text-sm font-medium text-[#331400]/70 md:grid dark:border-[#3A2C20] dark:bg-[#1C1611] dark:text-[#F5EEE4]/70">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              <AnimatePresence mode="popLayout">
                {lines.map(({ item, product, unitPrice, lineTotal }) => {
                  const image = product.colors?.find((c) => c.name === item.colorName)?.mainImage ?? product.defaultImage
                  return (
                    <motion.div
                      key={`${item.productId}::${item.colorName}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.2 }}
                      className="border-b border-[#331400]/10 last:border-0 dark:border-[#3A2C20]"
                    >
                      <div className="p-4 md:p-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div className="flex flex-1 gap-4">
                            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden bg-[#FAFAFC] dark:bg-[#1C1611]">
                              <img src={image} alt={product.name} className="absolute inset-0 h-full w-full object-contain p-2" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-base font-semibold text-[#1a0800] md:text-lg dark:text-[#F5EEE4]">{product.name}</h3>
                              {item.colorName && (
                                <div className="mt-1 flex items-center gap-2">
                                  <span className="text-xs text-[#331400]/50 dark:text-[#F5EEE4]/50">Color:</span>
                                  <span
                                    className="h-4 w-4 rounded-full border border-[#331400]/20 dark:border-[#F5EEE4]/20"
                                    style={{ backgroundColor: product.colors?.find((c) => c.name === item.colorName)?.code }}
                                  />
                                  <span className="text-xs text-[#331400]/70 dark:text-[#F5EEE4]/70">{item.colorName}</span>
                                </div>
                              )}

                              <div className="mt-3 flex items-center gap-3 md:hidden">
                                <span className="text-xs text-[#331400]/50 dark:text-[#F5EEE4]/50">Price:</span>
                                <span className="font-semibold text-[#1a0800] dark:text-[#F5EEE4]">{formatNaira(unitPrice)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="hidden w-32 text-center md:block">
                            <span className="font-medium text-[#1a0800] dark:text-[#F5EEE4]">{formatNaira(unitPrice)}</span>
                          </div>

                          <div className="flex items-center justify-between md:w-32 md:justify-center">
                            <div className="flex items-center gap-2 md:hidden">
                              <span className="text-xs text-[#331400]/50 dark:text-[#F5EEE4]/50">Qty:</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setQuantity(item.productId, item.colorName, item.quantity - 1)}
                                className="flex h-7 w-7 items-center justify-center border border-[#331400]/20 text-[#331400] transition-colors hover:bg-[#331400]/5 dark:border-[#F5EEE4]/20 dark:text-[#F5EEE4] dark:hover:bg-[#F5EEE4]/10"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center text-sm font-semibold tabular-nums text-[#1a0800] dark:text-[#F5EEE4]">{item.quantity}</span>
                              <button
                                onClick={() => setQuantity(item.productId, item.colorName, item.quantity + 1)}
                                className="flex h-7 w-7 items-center justify-center border border-[#331400]/20 text-[#331400] transition-colors hover:bg-[#331400]/5 dark:border-[#F5EEE4]/20 dark:text-[#F5EEE4] dark:hover:bg-[#F5EEE4]/10"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          <div className="hidden w-32 text-right md:block">
                            <span className="font-semibold text-[#1a0800] dark:text-[#F5EEE4]">{formatNaira(lineTotal)}</span>
                          </div>

                          <button
                            onClick={() => removeItem(item.productId, item.colorName)}
                            aria-label={`Remove ${product.name} from cart`}
                            className="self-end text-[#331400]/40 transition-colors hover:text-red-500 md:self-auto dark:text-[#F5EEE4]/40"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            <div className="mt-6 bg-white p-6 shadow-sm dark:bg-[#2B2119]">
              <h3 className="mb-4 font-semibold text-[#1a0800] dark:text-[#F5EEE4]">Why shop with us?</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-xs text-[#331400]/70 dark:text-[#F5EEE4]/70">Secure Payment</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs text-[#331400]/70 dark:text-[#F5EEE4]/70">Free Delivery</span>
                </div>
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  <span className="text-xs text-[#331400]/70 dark:text-[#F5EEE4]/70">7-Day Returns</span>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs text-[#331400]/70 dark:text-[#F5EEE4]/70">Multiple Payments</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:w-96">
            <div className="sticky top-24 bg-white shadow-sm dark:bg-[#2B2119]">
              <div className="border-b border-[#331400]/10 p-6 dark:border-[#3A2C20]">
                <h2 className="text-lg font-bold text-[#1a0800] dark:text-[#F5EEE4]">Order Summary</h2>
              </div>

              <div className="space-y-4 p-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#331400]/70 dark:text-[#F5EEE4]/70">Subtotal ({lines.reduce((n, l) => n + l.item.quantity, 0)} items)</span>
                  <span className="font-medium text-[#1a0800] dark:text-[#F5EEE4]">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#331400]/70 dark:text-[#F5EEE4]/70">Delivery Fee</span>
                  <span className="font-medium text-green-600 dark:text-green-400">Free</span>
                </div>
                <div className="border-t border-[#331400]/10 pt-4 dark:border-[#3A2C20]">
                  <div className="flex justify-between text-base font-bold">
                    <span className="text-[#1a0800] dark:text-[#F5EEE4]">Total</span>
                    <span className="text-[#331400] dark:text-[#FED45C]">{formatNaira(total)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="mt-4 w-full bg-[#331400] py-3 font-semibold text-white transition-colors hover:bg-[#442000]"
                >
                  Proceed to Checkout
                </button>
                <p className="text-center text-xs text-[#331400]/50 dark:text-[#F5EEE4]/50">Sign in to complete your purchase</p>
              </div>
            </div>

            <Link to="/store" className="mt-4 block text-center text-sm text-[#331400]/60 transition-colors hover:text-[#331400] dark:text-[#F5EEE4]/60 dark:hover:text-[#F5EEE4]">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
