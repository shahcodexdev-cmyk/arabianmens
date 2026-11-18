import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, Info, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice, storeConfig } from '../../config/store';
import QuantitySelector from '../products/QuantitySelector';

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    itemCount,
    subtotal,
    openCheckout,
  } = useCart();

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    if (isDrawerOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  const threshold = storeConfig.freeShippingThreshold;
  const isFreeShippingUnlocked = threshold > 0 && subtotal >= threshold;
  const amountNeeded = threshold > 0 ? Math.max(0, threshold - subtotal) : 0;
  const progressPercent =
    threshold > 0 ? Math.min(100, Math.round((subtotal / threshold) * 100)) : 100;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white text-charcoal flex flex-col h-full z-10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-light-gray bg-midnight text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gold" />
            <h2 className="text-lg font-heading tracking-wide">
              Your Cart ({itemCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="p-1.5 text-gray-400 hover:text-white transition-colors"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Free Shipping Progress Bar */}
        {threshold > 0 && items.length > 0 && (
          <div className="bg-[#FAF7F2] p-4 border-b border-light-gray/70">
            <div className="flex items-center justify-between text-xs mb-2">
              {isFreeShippingUnlocked ? (
                <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>You've unlocked <strong>FREE Delivery!</strong></span>
                </span>
              ) : (
                <span className="text-charcoal text-xs">
                  Add <strong className="text-midnight">{formatPrice(amountNeeded)}</strong> more to get <strong>FREE Delivery!</strong>
                </span>
              )}
              <span className="text-[11px] text-warm-gray font-medium">
                {formatPrice(subtotal)} / {formatPrice(threshold)}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isFreeShippingUnlocked ? 'bg-emerald-600' : 'bg-gold'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-ivory flex items-center justify-center text-warm-gray mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-heading text-midnight mb-2">
              Your cart is empty
            </h3>
            <p className="text-sm text-warm-gray mb-6 max-w-xs">
              Explore our contemporary and traditional menswear collections to find your signature style.
            </p>
            <button
              type="button"
              onClick={closeDrawer}
              className="px-6 py-3 bg-midnight text-gold text-xs uppercase tracking-widest font-semibold hover:bg-black transition-colors rounded shadow"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-light-gray">
              {items.map((item) => (
                <div key={item.variantId} className="pt-4 first:pt-0 flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded bg-ivory flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/products/${item.slug}`}
                          onClick={closeDrawer}
                          className="font-medium text-sm text-midnight hover:text-gold transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.variantId)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-1"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs text-warm-gray mt-1 space-x-2">
                        <span>Size: <strong className="text-charcoal">{item.size}</strong></span>
                        <span>•</span>
                        <span>Color: <strong className="text-charcoal">{item.color}</strong></span>
                      </div>

                      <p className="text-sm font-semibold text-midnight mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <QuantitySelector
                        quantity={item.quantity}
                        onChange={(qty) => updateQuantity(item.variantId, qty)}
                      />
                      <span className="text-sm font-bold text-midnight">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Summary */}
            <div className="p-5 border-t border-light-gray bg-ivory/50 space-y-3.5">
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-charcoal">
                  <span>Subtotal</span>
                  <span className="font-semibold text-midnight text-sm">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-charcoal">
                  <span>Shipping</span>
                  <span className={`font-semibold ${isFreeShippingUnlocked ? 'text-emerald-700' : 'text-gold'}`}>
                    {isFreeShippingUnlocked ? 'FREE' : formatPrice(storeConfig.shippingCharge)}
                  </span>
                </div>
                <div className="border-t border-light-gray/70 pt-2 flex items-center justify-between text-base">
                  <span className="text-charcoal font-bold">Estimated Total</span>
                  <span className="font-heading text-xl font-bold text-midnight">
                    {formatPrice(subtotal + (isFreeShippingUnlocked ? 0 : storeConfig.shippingCharge))}
                  </span>
                </div>
              </div>

              {/* Pre-Checkout Heads-Up Notice (Mandatory) */}
              <div className="bg-amber-50/90 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>How It Works:</strong> Enter your delivery address on the next step. Your complete order summary will then open in WhatsApp to confirm with our team.
                </p>
              </div>

              {/* CTA Button */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => openCheckout()}
                  className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-[0.16em] rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Proceed to WhatsApp Checkout →</span>
                </button>

                <div className="flex items-center justify-between pt-1 text-[11px] text-warm-gray px-1">
                  <Link
                    to="/cart"
                    onClick={closeDrawer}
                    className="hover:text-midnight underline"
                  >
                    View Full Cart Page
                  </Link>
                  <span>Instant WhatsApp Confirmation</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
