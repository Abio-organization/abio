import { apiClient } from '@/shared/lib/api-client'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { CardPreview } from './CardPreview'
import { useNavigate } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from '@/shared/lib/toast'

import { getProductPrice, formatNaira } from '../lib/pricing'
import { useCartStore } from '../store/cart-store'
import type { Product } from '../types'

function getGallery(product: Product, variantIdx: number): string[] {
  if (product.colors?.[variantIdx]) return product.colors[variantIdx].gallery
  return product.defaultGallery ?? [product.defaultImage]
}

export function ProductModal({
  product,
  onClose,
  inline = false,
}: {
  product: Product
  inline?: boolean
  onClose: () => void
}) {
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)

  const [variantIdx, setVariantIdx] = useState(0)
  const [imgIdx, setImgIdx] = useState(0)
  const [qty, setQty] = useState(1)

  const gallery = getGallery(product, variantIdx)
  const activeImage = gallery[imgIdx] ?? product.defaultImage
  const activeColor = product.colors?.[variantIdx]
  const price = getProductPrice(product, activeColor)
  const [customUsername, setCustomUsername] = useState('')
  const [preferredColor, setPreferredColor] = useState(
    product.metadata?.preview?.defaultColor ?? '#000000',
  )
  const [instructions, setInstructions] = useState('')
  const authenticated = useAuthStore((s) => s.isAuthenticated)
  const [artworkUrl, setArtworkUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [side, setSide] = useState<'front' | 'back'>('front')
  const available =
    product.type === 'custom' ||
    Boolean(activeColor && activeColor.stockQty > 0)
  const limit =
    product.type === 'standard' ? Math.min(99, activeColor?.stockQty ?? 0) : 99

  useEffect(() => {
    if (inline) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [onClose, inline])

  const changeVariant = (i: number) => {
    setVariantIdx(i)
    setImgIdx(0)
    setQty(1)
  }

  const handleAddToCart = () => {
    if (!available) return
    addItem({
      productId: product.id,
      variantId: activeColor?.id,
      colorName: activeColor?.name ?? null,
      quantity: Math.min(qty, limit),
      ...(product.type === 'custom'
        ? {
            customUsername: customUsername.trim() || undefined,
            preferredColor,
            instructions: instructions.trim() || undefined,
            artworkUrl: artworkUrl || undefined,
          }
        : {}),
    })
    toast.success(`Added ${qty} × ${product.name} to cart`, {
      description: activeColor ? `Color: ${activeColor.name}` : undefined,
    })
  }

  const handleBuyNow = () => {
    handleAddToCart()
    if (available) navigate({ to: '/store/cart' })
  }

  return (
    <>
      {!inline && <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
      />}

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className={inline ? "w-full" : "fixed inset-4 z-[101] overflow-y-auto md:inset-8 lg:inset-12"}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex min-h-full items-center justify-center">
          <div className="relative w-full max-w-6xl bg-white dark:bg-[#1C1611]">
            {!inline && <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center bg-white text-[#331400] shadow-lg transition-colors hover:bg-[#FED45C] dark:bg-[#2B2119] dark:text-[#F5EEE4]"
            >
              <X className="h-5 w-5" />
            </motion.button>}

            <div className="flex flex-col gap-10 p-6 md:p-8 lg:flex-row lg:items-start lg:gap-14 lg:p-10">
              {/* Gallery */}
              <div className="flex flex-1 gap-3">
                <div className="hidden w-[72px] flex-shrink-0 flex-col gap-2 pt-1 sm:flex">
                  {gallery.map((src, i) => (
                    <button
                      key={`${product.id}-${variantIdx}-thumb-${i}`}
                      onClick={() => setImgIdx(i)}
                      className={`relative h-[50px] w-[72px] flex-shrink-0 overflow-hidden border-2 transition-all ${
                        imgIdx === i
                          ? 'border-[#331400] dark:border-[#F5EEE4]'
                          : 'border-[#331400]/12 hover:border-[#331400]/35 dark:border-[#F5EEE4]/12'
                      }`}
                    >
                      <img
                        src={src}
                        alt={`${product.name} view ${i + 1}`}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                <div className="flex flex-1 flex-col">
                  <div
                    className="relative overflow-hidden border border-[#331400]/10 bg-white dark:border-[#3A2C20] dark:bg-[#2B2119]"
                    style={{ aspectRatio: '4/3' }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={`img-${product.id}-${variantIdx}-${imgIdx}`}
                        src={activeImage || '/icons/A.bio.svg'}
                        alt={product.name}
                        initial={{ opacity: 0, scale: 1.06 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="absolute inset-0 h-full w-full object-contain p-8"
                      />
                    </AnimatePresence>
                    <div className="absolute bottom-3 left-3 z-10">
                      <span className="bg-[#FEF4EA]/80 px-2 py-1 text-[9px] font-bold tracking-widest text-[#331400]/40 uppercase dark:bg-[#1C1611]/80 dark:text-[#F5EEE4]/40">
                        {activeColor?.name ?? 'Default'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between px-0.5">
                    <div className="flex items-center gap-1.5">
                      {gallery.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setImgIdx(i)}
                          className={`h-[2px] transition-all duration-300 ${
                            imgIdx === i
                              ? 'w-6 bg-[#331400] dark:bg-[#F5EEE4]'
                              : 'w-2 bg-[#331400]/20 hover:bg-[#331400]/40 dark:bg-[#F5EEE4]/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Details panel */}
              <div className="w-full flex-shrink-0 lg:w-[400px] xl:w-[440px]">
                <div className="mb-4">
                  {product.badge && (
                    <span className="mb-2 inline-block bg-[#FED45C] px-2 py-1 text-[9px] font-black tracking-[0.2em] text-[#331400]">
                      {product.badge}
                    </span>
                  )}
                  <h2 className="text-2xl font-extrabold text-[#1a0800] dark:text-[#F5EEE4]">
                    {product.name}
                  </h2>
                  <p className="mt-1 text-sm text-[#331400] dark:text-[#F5EEE4]/70">
                    {product.tagline ?? product.description}
                  </p>
                </div>

                <div className="relative mb-5 border border-[#331400]/10 bg-white p-4 dark:border-[#3A2C20] dark:bg-[#2B2119]">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-[#1a0800] dark:text-[#F5EEE4]">
                      {formatNaira(price)}
                    </span>
                  </div>
                </div>

                {product.type === 'custom' && (
                  <div className="mb-5 space-y-3 text-[#331400] dark:text-[#F5EEE4]">
                    <label className="block text-sm">
                      Name / username
                      <input
                        maxLength={80}
                        value={customUsername}
                        onChange={(e) => setCustomUsername(e.target.value)}
                        className="mt-1 block w-full border p-2"
                      />
                    </label>
                    <label className="block text-sm">
                      Preferred color
                      <input
                        type="color"
                        value={preferredColor}
                        onChange={(e) => setPreferredColor(e.target.value)}
                        className="mt-1 block"
                      />
                    </label>
                    <label className="block text-sm">
                      Artwork (optional)
                      <input
                        type="file"
                        accept="image/*"
                        disabled={!authenticated || uploading}
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          setUploading(true)
                          setUploadError('')
                          try {
                            const body = new FormData()
                            body.append('artwork', file)
                            const response = await apiClient.post(
                              '/cart/artwork',
                              body,
                            )
                            setArtworkUrl(response.data.data.url)
                          } catch {
                            setUploadError(
                              'Could not upload artwork. Please try again.',
                            )
                          } finally {
                            setUploading(false)
                          }
                        }}
                      />
                    </label>
                    {!authenticated && (
                      <p className="text-xs">
                        Sign in to upload custom artwork.
                      </p>
                    )}
                    {uploading && <p role="status">Uploading artwork…</p>}
                    {uploadError && <p role="alert">{uploadError}</p>}
                    {artworkUrl && (
                      <div>
                        <img
                          src={artworkUrl}
                          alt="Uploaded artwork"
                          className="h-16 w-16 object-contain"
                        />
                        <button onClick={() => setArtworkUrl('')}>
                          Remove artwork
                        </button>
                      </div>
                    )}
                    <label className="block text-sm">
                      Instructions
                      <textarea
                        maxLength={1000}
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        className="mt-1 block w-full border p-2"
                      />
                    </label>
                  </div>
                )}
                {product.metadata?.preview?.enabled && (
                  <div className="mb-5 space-y-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSide('front')}
                        aria-pressed={side === 'front'}
                      >
                        Front
                      </button>
                      <button
                        onClick={() => setSide('back')}
                        aria-pressed={side === 'back'}
                      >
                        Back
                      </button>
                    </div>
                    <CardPreview
                      product={product}
                      side={side}
                      color={activeColor?.code ?? preferredColor}
                      name={customUsername}
                    />
                    <p className="text-xs">
                      Color preview · final printed colors may vary.
                    </p>
                  </div>
                )}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-5">
                    <p className="mb-3 text-[10px] font-bold tracking-[0.2em] text-[#331400] uppercase dark:text-[#F5EEE4]">
                      Colour — <span>{activeColor?.name}</span>
                    </p>
                    <div className="flex items-center gap-2.5">
                      {product.colors.map((c, i) => (
                        <button
                          key={c.name}
                          onClick={() => changeVariant(i)}
                          title={c.name}
                          className={`relative h-8 w-8 border-2 transition-all ${
                            variantIdx === i
                              ? 'border-[#331400] dark:border-[#F5EEE4]'
                              : 'border-[#331400]/20 hover:border-[#331400]/50 dark:border-[#F5EEE4]/20'
                          }`}
                          style={{ backgroundColor: c.code }}
                        >
                          {c.code === '#FFFFFF' && (
                            <span className="absolute inset-0 border border-[#331400]/10" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-5">
                  <p className="mb-3 text-[10px] font-bold tracking-[0.2em] text-[#331400] uppercase dark:text-[#F5EEE4]">
                    Quantity
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="flex h-8 w-8 items-center justify-center border border-[#331400] text-[#331400] transition-colors hover:bg-[#331400]/5 dark:border-[#F5EEE4] dark:text-[#F5EEE4] dark:hover:bg-[#F5EEE4]/10"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-base font-extrabold text-[#1a0800] tabular-nums dark:text-[#F5EEE4]">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => Math.min(limit, q + 1))}
                      className="flex h-8 w-8 items-center justify-center border border-[#331400] text-[#331400] transition-colors hover:bg-[#331400]/5 dark:border-[#F5EEE4] dark:text-[#F5EEE4] dark:hover:bg-[#F5EEE4]/10"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {product.features && product.features.length > 0 && (
                  <ul className="mb-7 space-y-2">
                    {product.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2.5 text-sm text-[#331400]/65 dark:text-[#F5EEE4]/65"
                      >
                        <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center bg-[#FED45C] text-[9px] font-black text-[#331400]">
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex gap-3">
                  <button
                    disabled={!available || uploading}
                    onClick={handleAddToCart}
                    className="flex-1 cursor-pointer border-2 border-[#331400] bg-white py-4 text-center text-sm font-extrabold text-[#331400] transition-colors select-none hover:bg-[#331400]/5 dark:border-[#F5EEE4] dark:bg-transparent dark:text-[#F5EEE4] dark:hover:bg-[#F5EEE4]/10"
                  >
                    Add to Cart
                  </button>
                  <motion.button
                    disabled={!available || uploading}
                    onClick={handleBuyNow}
                    whileHover={{
                      scale: 1.015,
                      boxShadow: '6px 6px 0px #FED45C',
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="flex-1 cursor-pointer bg-[#331400] py-4 text-center text-sm font-extrabold text-white shadow-[4px_4px_0px_#FED45C] select-none"
                  >
                    View cart
                  </motion.button>
                </div>

                <p className="mt-3 text-center text-[10px] tracking-wide text-[#331400] dark:text-[#F5EEE4]/60">
                  {!available
                    ? 'This color is currently out of stock.'
                    : product.type === 'custom'
                      ? 'Made to order. Delivery is calculated at checkout.'
                      : 'Delivery is calculated at checkout.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
