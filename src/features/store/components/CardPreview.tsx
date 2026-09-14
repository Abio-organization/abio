import type { Product } from '../types'
export function CardPreview({
  product,
  color,
  side,
  name,
}: {
  product: Product
  color: string
  side: 'front' | 'back'
  name?: string
}) {
  const preview = product.metadata?.preview
  const overlay =
    side === 'front' ? preview?.frontOverlayUrl : preview?.backOverlayUrl
  return (
    <div
      className="relative mx-auto aspect-[1.586] w-full max-w-md overflow-hidden rounded-2xl shadow-lg"
      style={{ backgroundColor: color }}
      aria-label={`${side} card preview in ${color}`}
    >
      {overlay && (
        <img
          src={overlay}
          alt={`${side} artwork`}
          className="absolute inset-0 h-full w-full object-contain"
        />
      )}
      {side === 'front' && name && (
        <span className="absolute bottom-3 left-3 max-w-[85%] truncate rounded bg-black/65 px-2 py-1 text-sm text-white">
          {name}
        </span>
      )}
      {!overlay && (
        <span className="absolute inset-0 flex items-center justify-center text-sm text-white mix-blend-difference">
          {side === 'front' ? product.name : 'Back preview'}
        </span>
      )}
    </div>
  )
}
