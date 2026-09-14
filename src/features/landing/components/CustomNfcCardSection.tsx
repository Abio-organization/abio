import { Link, useNavigate } from '@tanstack/react-router'
import { useCatalog } from '@/features/store/catalog'
import { ProductCard } from '@/features/store/components/ProductCard'
export function CustomNfcCardSection() {
  const catalog = useCatalog()
  const navigate = useNavigate()
  return (
    <section className="bg-white px-4 py-16 text-[#331400] sm:px-8 dark:bg-[#1C1611] dark:text-[#F5EEE4]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold">Find your next connection</h2>
          <Link
            to="/store"
            className="bg-[#FED45C] px-5 py-3 font-semibold text-[#331400]"
          >
            Explore the store
          </Link>
        </div>
        {catalog.isPending ? (
          <p role="status">Loading products…</p>
        ) : catalog.isError ? (
          <p role="alert">
            Products are temporarily unavailable.{' '}
            <button onClick={() => void catalog.refetch()}>Retry</button>
          </p>
        ) : !catalog.data?.length ? (
          <p>New products are coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {catalog.data?.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => void navigate({ to: '/store/$slug', params: { slug: product.slug }, search: { from: '/' } })}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
