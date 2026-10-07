import { useState } from "react";
import { motion } from "framer-motion";

import { getProductPrice, formatNaira } from "../lib/pricing";
import type { Product } from "../types";

export function ProductCard({
  product,
  onClick,
}: {
  product: Product;
  onClick: () => void;
}) {
  const [liked, setLiked] = useState(false);

  const price =
    product.type === "standard" && product.colors?.length
      ? Math.min(...product.colors.map((c) => c.price))
      : getProductPrice(product);

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View ${product.name}`}
      className="group flex h-full w-full cursor-pointer flex-col gap-3 bg-white p-3 text-left shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#331400] md:gap-4 dark:bg-[#2B2119] dark:focus-visible:outline-[#FED45C]"
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image panel */}
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-[#F5F5F5] dark:bg-[#1C1611]">
        <img
          src={product.defaultImage || "/icons/A.bio.svg"}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105 md:p-4"
        />
        {product.badge && (
          <span className="absolute top-2 left-2 z-10 bg-[#FED45C] px-1.5 py-1 text-[8px] font-black text-[#331400] md:top-3 md:left-3 md:px-2">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          aria-label={liked ? "Remove from favourites" : "Add to favourites"}
          aria-pressed={liked}
          onClick={(e) => {
            e.stopPropagation();
            setLiked((v) => !v);
          }}
          className="absolute top-2 right-2 z-100 flex h-8 w-8 cursor-pointer items-center justify-center bg-black/[0.07] transition-colors hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-[#331400] md:top-3 md:right-3 md:h-10 md:w-10 dark:bg-white/10 dark:hover:bg-white/20 dark:focus-visible:outline-[#FED45C]"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 text-red-600 transition-transform active:scale-90 md:h-5 md:w-5"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 21s-7.5-4.6-9.6-9.2C.8 8.2 2.7 4.5 6.3 4.5c2 0 3.4 1 4.2 2.3l1.5 2.1 1.5-2.1c.8-1.3 2.2-2.3 4.2-2.3 3.6 0 5.5 3.7 3.9 7.3C19.5 16.4 12 21 12 21z" />
          </svg>
        </button>
      </div>

      {/* Details: stacked on mobile, side by side from md up */}
      <div className="flex h-[130px] shrink-0 flex-col gap-2 px-1 md:flex-row md:items-start md:justify-between md:gap-4">
        <div className="min-w-0 md:flex-1">
          <h3 className="h-6 truncate text-base leading-8 font-bold text-[#1a0800] md:h-10 md:text-2xl md:leading-10 dark:text-[#F5EEE4]">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-2 h-8 text-[11px] leading-4 text-[#1a0800] md:mt-2 md:h-10 md:text-xs md:leading-5 dark:text-[#F5EEE4]/80">
            {product.tagline ?? product.description ?? ""}
          </p>
          <p className="mt-2 h-7 truncate text-base leading-7 font-extrabold text-[#1a0800] md:mt-4 md:h-8 md:text-xl md:leading-8 dark:text-[#F5EEE4]">
            {product.colors &&
            new Set(product.colors.map((c) => c.price)).size > 1
              ? "From "
              : ""}
            {formatNaira(price)}
          </p>
        </div>

        {/* Colors: swatches under the price on mobile, labelled column on md+ */}
        <div className="h-5 shrink-0 md:h-auto md:w-28 md:pt-2 md:text-right">
          {product.colors && product.colors.length > 0 && (
            <>
              <p className="hidden text-sm whitespace-nowrap text-[#1a0800] md:block dark:text-[#F5EEE4]">
                Available Colors
              </p>
              <div className="flex gap-2 md:mt-2 md:justify-end">
                {product.colors.slice(0, 4).map((c) => (
                  <span
                    key={c.name}
                    title={c.name}
                    className="h-5 w-5 border border-[#1a0800]/40 dark:border-[#F5EEE4]/40"
                    // style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <span className="mt-auto block w-full shrink-0 border-r-[3px] border-b-[3px] border-[#1a0800] bg-[#FFCF5C] py-2.5 text-center text-sm font-semibold text-[#1a0800] transition-[filter] group-hover:brightness-95 md:py-3">
        Buy Now
      </span>
    </motion.div>
  );
}