import { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check, Heart, Eye } from 'lucide-react';
import type { Product } from '../../types';
import { formatPrice, getDiscountPercentage } from '../../config/store';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [addedSize, setAddedSize] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeColor, setActiveColor] = useState(product.colors[0]?.name || '');

  const discount = product.compareAtPrice
    ? getDiscountPercentage(product.price, product.compareAtPrice)
    : 0;

  const hasSecondImage = product.images.length > 1;

  const handleQuickAddSize = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();

    // Find the variant matching this size and active color (or first available)
    const variant =
      product.variants.find(
        (v) => v.size === size && (v.color === activeColor || !activeColor) && v.available
      ) || product.variants.find((v) => v.size === size && v.available);

    if (!variant) return;

    addItem({
      productId: product.id,
      variantId: variant.id,
      quantity: 1,
      name: product.name,
      slug: product.slug,
      image: product.images[0]?.url || '',
      price: variant.price,
      size: variant.size,
      color: variant.color,
    });

    setAddedSize(size);
    setTimeout(() => setAddedSize(null), 2000);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <article className="group relative flex flex-col bg-white rounded-2xl p-2.5 sm:p-3 border border-light-gray/70 hover:border-gold/50 shadow-xs hover:shadow-xl transition-all duration-300">
      {/* Image Container with Soft Luxury Canvas */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#F3EFE6] select-none">
        <Link
          to={`/products/${product.slug}`}
          className="block w-full h-full"
          aria-label={`View ${product.name}`}
        >
          {/* Primary Image */}
          <img
            src={product.images[0]?.url}
            alt={product.images[0]?.alt || product.name}
            className={`h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
              hasSecondImage ? 'group-hover:opacity-0' : ''
            }`}
            loading="lazy"
          />

          {/* Secondary Alternate Image on Desktop Hover */}
          {hasSecondImage && (
            <img
              src={product.images[1].url}
              alt={product.images[1].alt || `${product.name} - alternate`}
              className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105"
              loading="lazy"
            />
          )}
        </Link>

        {/* Top Badges (Left) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 pointer-events-none z-10">
          {product.newArrival && (
            <span className="px-2.5 py-0.5 rounded-full bg-midnight/90 backdrop-blur-md text-[10px] font-bold tracking-wider uppercase text-white shadow-xs">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-gold text-[10px] font-bold tracking-wider uppercase text-midnight shadow-xs">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button (Top Right) */}
        <button
          type="button"
          onClick={toggleWishlist}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all duration-200 z-10 ${
            isWishlisted
              ? 'bg-red-50 text-red-500 shadow-md scale-110'
              : 'bg-white/90 backdrop-blur-sm text-charcoal/70 hover:text-midnight hover:bg-white shadow-xs hover:scale-110'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-red-500 text-red-500' : ''
            }`}
          />
        </button>

        {/* Quick Size Select Bar (Zanerobe / Modern Luxury Style - slides up on hover) */}
        <div className="absolute inset-x-2 bottom-2 z-10 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden sm:block">
          <div className="bg-white/95 backdrop-blur-md p-2 rounded-xl shadow-lg border border-light-gray/60">
            <p className="text-[10px] uppercase tracking-widest text-warm-gray text-center font-bold mb-1.5">
              {addedSize ? (
                <span className="text-emerald-700 flex items-center justify-center gap-1">
                  <Check className="w-3 h-3 text-emerald-700" /> Added Size {addedSize}
                </span>
              ) : (
                'Quick Add Size'
              )}
            </p>
            <div className="flex items-center justify-center gap-1.5">
              {product.sizes.map((size) => {
                const isAvailable = product.variants.some(
                  (v) => v.size === size && v.available
                );
                return (
                  <button
                    key={size}
                    type="button"
                    disabled={!isAvailable}
                    onClick={(e) => handleQuickAddSize(e, size)}
                    className={`h-7 min-w-[28px] px-1.5 text-[11px] font-bold rounded transition-all ${
                      isAvailable
                        ? 'bg-cream hover:bg-midnight hover:text-gold text-charcoal border border-light-gray'
                        : 'bg-gray-100 text-gray-300 cursor-not-allowed line-through'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="pt-3 px-1 flex flex-1 flex-col justify-between space-y-2">
        <div>
          {/* Category Tag */}
          <span className="block text-[10px] uppercase tracking-[0.2em] text-gold font-bold">
            {product.category.replace(/-/g, ' ')}
          </span>

          {/* Product Title */}
          <Link to={`/products/${product.slug}`} className="block mt-0.5">
            <h3 className="font-heading text-base sm:text-lg font-bold text-midnight group-hover:text-gold transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Colors available row */}
          {product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 mt-1.5">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveColor(color.name);
                  }}
                  className={`w-3.5 h-3.5 rounded-full border border-gray-300 transition-transform ${
                    activeColor === color.name ? 'ring-2 ring-gold ring-offset-1 scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  aria-label={color.name}
                />
              ))}
              <span className="text-[10px] text-warm-gray ml-1 font-medium">
                {product.colors.length} {product.colors.length === 1 ? 'color' : 'colors'}
              </span>
            </div>
          )}

          {/* Stock Dispatch Badge */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 animate-pulse" />
            <span className="text-[10px] text-emerald-800 font-semibold tracking-wide">
              In Stock • Dispatches in 24 Hours
            </span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-1 border-t border-light-gray/50 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-base sm:text-lg font-bold text-midnight">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-warm-gray line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Mobile Quick Action Link */}
          <Link
            to={`/products/${product.slug}`}
            className="sm:hidden p-2 rounded-lg bg-midnight text-gold hover:bg-black transition-colors"
            aria-label={`View ${product.name}`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
