import { useNavigate, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/lib/api-client'
import { mapProduct } from '@/features/store/catalog'
import { ProductModal } from '@/features/store/components/ProductModal'
import { CommerceLayout, Loading, ErrorBox } from './ui'
export function ProductPage({ slug, back = '/store' }: { slug: string; back?: '/dashboard/store' | '/store' | '/' }) {
  const navigate = useNavigate()
  const query = useQuery({
    queryKey: ['store', 'product', slug],
    queryFn: async ({ signal }) => {
      const { data } = await apiClient.get(
        '/astore/products/' + encodeURIComponent(slug),
        { signal },
      )
      return mapProduct(data.data)
    },
    retry: 1,
  })
  return (
    <CommerceLayout back={back}>
      <h1>All products</h1>
      <p style={{ margin: '20px 0' }}>
        <Link to={back}>All products</Link> &gt;{' '}
        <span style={{ color: '#7644ff' }}>{query.data?.name ?? slug}</span>
      </p>
      {query.isPending ? (
        <Loading />
      ) : query.isError ? (
        <ErrorBox
          message="This product is unavailable or could not be loaded."
          retry={() => void query.refetch()}
        />
      ) : (
        <ProductModal
          key={query.data.id}
          inline
          product={query.data}
          onClose={() => void navigate({ to: back })}
        />
      )}
    </CommerceLayout>
  )
}
