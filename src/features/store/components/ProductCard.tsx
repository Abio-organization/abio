import { motion } from 'framer-motion'

import { getProductPricing, formatNaira } from '../lib/pricing'
import type { Product } from '../types'

export function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const { original, discounted } = getProductPricing(product)

  return (
    <motion.div
      onClick={onClick}
      className="group cursor-pointer overflow-hidden border border-[#331400]/10 bg-white transition-all duration-300 hover:shadow-xl dark:border-[#3A2C20] dark:bg-[#2B2119]"
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative overflow-hidden bg-[#FAFAFC] dark:bg-[#1C1611]" style={{ aspectRatio: '1/1' }}>
        <img
          src={product.defaultImage}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 bg-[#FED45C] px-2 py-1 text-[8px] font-black text-[#331400]">{product.badge}</span>
        )}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
      </div>

      <div className="p-3">
        <h3 className="truncate text-sm font-bold text-[#1a0800] dark:text-[#F5EEE4]">{product.name}</h3>
        <p className="mt-0.5 line-clamp-2 text-[11px] text-[#331400]/50 dark:text-[#F5EEE4]/50">{product.tagline ?? product.description ?? ''}</p>

        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span className="text-base font-extrabold text-[#1a0800] dark:text-[#F5EEE4]">{formatNaira(discounted)}</span>
          <span className="text-[10px] text-[#331400]/30 line-through dark:text-[#F5EEE4]/30">{formatNaira(original)}</span>
          <span className="bg-[#FED45C]/20 px-1.5 py-0.5 text-[8px] font-black text-[#331400] dark:bg-[#FED45C]/15 dark:text-[#FED45C]">-15%</span>
        </div>
      </div>
    </motion.div>
  )
}
