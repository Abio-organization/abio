import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout'
import { useQuery } from '@tanstack/react-query'
import { commerce } from '@/features/commerce/api'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { Link, useNavigate } from '@tanstack/react-router'
import { Search, ShoppingBag, ShoppingCart, ReceiptText } from 'lucide-react'
import { useState } from 'react'

import { Footer, NavBar } from '@/features/landing'

import { useCatalog } from '../catalog'
import { useCartCount } from '../store/cart-store'
import { ProductCard } from './ProductCard'

export function StorePage({ embedded = false }: { embedded?: boolean }) {
  const authenticated = useAuthStore((s) => s.isAuthenticated)
  return authenticated && !embedded
    ? <DashboardLayout><StoreContent embedded publicEntry /></DashboardLayout>
    : <StoreContent embedded={embedded} publicEntry={!embedded} />
}
function StoreContent({ embedded, publicEntry }: { embedded: boolean; publicEntry: boolean }) {
  const catalog = useCatalog()
  const products = catalog.data ?? []
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const guestCount = useCartCount()
  const userId = useAuthStore(s=>s.user?.id)
  const accountCart=useQuery({queryKey:['commerce','cart-count',userId],queryFn:()=>commerce.cart(),enabled:!!userId})
  const cartCount=guestCount+(accountCart.data?.itemCount??0)

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      <div
        className="relative min-h-screen overflow-x-hidden bg-[#FEF4EA] dark:bg-[#1C1611]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #33140010 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      >
        {!embedded && <NavBar />}

        <div className={embedded ? 'pt-8 pb-0' : 'pt-36 pb-0'}>
          <div className="mx-auto flex max-w-7xl flex-col gap-3 border-b border-[#331400]/10 px-4 pb-4 sm:flex-row sm:items-end sm:justify-between dark:border-[#F5EEE4]/10">
            <div>
              <span className="text-3xl font-medium tracking-wide text-black dark:text-[#F5EEE4]">
                Store
              </span>
            </div>

            <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center md:gap-4">
              <div className="flex w-full items-center justify-between md:justify-start">
                <p className="text-xs font-medium text-[#331400] dark:text-[#F5EEE4]/70">
                  {filteredProducts.length} products
                </p>
                <Link
                  to="/store/cart"
                  className="relative p-2 transition-colors hover:bg-[#331400]/5 dark:hover:bg-[#F5EEE4]/10"
                >
                  <ShoppingCart className="h-5 w-5 text-[#331400] dark:text-[#F5EEE4]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FED45C] text-xs font-bold text-[#331400]">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

              {userId && <Link to="/orders" className="inline-flex items-center justify-center gap-2 border border-[#331400]/20 px-4 py-2 text-sm font-medium text-[#331400] hover:bg-[#FED45C]/20 dark:border-[#F5EEE4]/20 dark:text-[#F5EEE4]">
                <ReceiptText className="h-4 w-4" /> Your orders
              </Link>}
              <div className="relative w-full md:w-64">
                <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full border border-[#331400]/20 bg-white py-2 pr-4 pl-9 text-sm outline-none focus:border-[#331400] focus:ring-1 focus:ring-[#331400] dark:border-[#3A2C20] dark:bg-[#2B2119] dark:text-[#F5EEE4] dark:focus:border-[#F5EEE4]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8">
          {catalog.isPending ? (
            <p role="status">Loading products…</p>
          ) : catalog.isError ? (
            <div role="alert">
              Could not load products.{' '}
              <button onClick={() => void catalog.refetch()}>Try again</button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[#331400]/5 dark:bg-[#F5EEE4]/5">
                <ShoppingBag className="h-10 w-10 text-[#331400]/30 dark:text-[#F5EEE4]/30" />
              </div>
              <p className="text-[#331400]/50 dark:text-[#F5EEE4]/50">
                No products found
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => void navigate({to:'/store/$slug',params:{slug:product.slug},search:{from: publicEntry ? '/' : '/dashboard/store'}})}
                />
              ))}
            </div>
          )}
        </div>

        {!embedded && <Footer />}
      </div>


    </>
  )
}
