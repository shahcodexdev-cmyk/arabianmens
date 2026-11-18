import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Info, Sparkles } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/products/Breadcrumbs';
import QuantitySelector from '../components/products/QuantitySelector';
import { useCart } from '../context/CartContext';
import { formatPrice, storeConfig } from '../config/store';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    itemCount,
    openCheckout,
  } = useCart();

  const threshold = storeConfig.freeShippingThreshold;
  const isFreeShippingUnlocked = threshold > 0 && subtotal >= threshold;
  const amountNeeded = threshold > 0 ? Math.max(0, threshold - subtotal) : 0;
  const progressPercent =
    threshold > 0 ? Math.min(100, Math.round((subtotal / threshold) * 100)) : 100;

  const shippingFee = isFreeShippingUnlocked ? 0 : storeConfig.shippingCharge;
  const grandTotal = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="py-20 bg-cream min-h-[70vh] flex flex-col items-center justify-center px-4">
        <SEOHead title="Your Shopping Cart" canonical="/cart" />

        <div className="w-20 h-20 rounded-full bg-ivory flex items-center justify-center text-warm-gray mb-6 shadow-xs">
          <ShoppingBag className="w-10 h-10" />
        </div>

        <h1 className="font-heading text-3xl font-bold text-midnight mb-3">
          Your Cart is Empty
        </h1>
        <p className="text-warm-gray text-sm max-w-md text-center mb-8">
          You haven't added any menswear items to your shopping cart yet. Browse our signature collections to elevate your wardrobe.
        </p>

        <Link
          to="/shop"
          className="px-8 py-4 bg-midnight text-gold text-xs uppercase tracking-[0.2em] font-bold rounded shadow hover:bg-black transition-colors"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 bg-cream min-h-screen">
      <SEOHead title="Your Shopping Cart" canonical="/cart" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shopping Cart' },
          ]}
        />

        <div className="flex items-baseline justify-between mt-4 mb-6 border-b border-light-gray pb-4">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-midnight">
            Shopping Cart ({itemCount})
          </h1>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-red-600 hover:underline font-medium"
          >
            Clear Cart
          </button>
        </div>

        {/* Dynamic Free Shipping Progress Bar */}
        {threshold > 0 && (
          <div className="mb-6 bg-white p-4 sm:p-5 rounded-xl border border-light-gray shadow-xs">
            <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
              {isFreeShippingUnlocked ? (
                <span className="font-bold text-emerald-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>You've unlocked <strong>FREE Delivery!</strong></span>
                </span>
              ) : (
                <span className="text-charcoal">
                  Add <strong className="text-midnight">{formatPrice(amountNeeded)}</strong> more to get <strong>FREE Delivery!</strong>
                </span>
              )}
              <span className="text-xs text-warm-gray font-medium">
                {formatPrice(subtotal)} / {formatPrice(threshold)}
              </span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isFreeShippingUnlocked ? 'bg-emerald-600' : 'bg-gold'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 bg-white rounded-lg border border-light-gray shadow-xs overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-ivory text-xs font-semibold text-charcoal border-b border-light-gray uppercase tracking-wider">
              <span className="col-span-6">Product</span>
              <span className="col-span-2 text-center">Price</span>
              <span className="col-span-2 text-center">Quantity</span>
              <span className="col-span-2 text-right">Total</span>
            </div>

            <div className="divide-y divide-light-gray">
              {items.map((item) => (
                <div key={item.variantId} className="p-4 sm:p-6 flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                  {/* Product Details */}
                  <div className="w-full md:col-span-6 flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-24 object-cover rounded bg-ivory flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/products/${item.slug}`}
                        className="font-heading text-base font-bold text-midnight hover:text-gold transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <div className="text-xs text-warm-gray mt-1 space-x-2">
                        <span>Size: <strong className="text-charcoal">{item.size}</strong></span>
                        <span>•</span>
                        <span>Color: <strong className="text-charcoal">{item.color}</strong></span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.variantId)}
                        className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 mt-3"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="w-full md:col-span-2 flex justify-between md:justify-center items-center text-sm font-semibold text-charcoal">
                    <span className="md:hidden text-xs text-warm-gray">Unit Price:</span>
                    <span>{formatPrice(item.price)}</span>
                  </div>

                  {/* Quantity */}
                  <div className="w-full md:col-span-2 flex justify-between md:justify-center items-center">
                    <span className="md:hidden text-xs text-warm-gray">Quantity:</span>
                    <QuantitySelector
                      quantity={item.quantity}
                      onChange={(qty) => updateQuantity(item.variantId, qty)}
                    />
                  </div>

                  {/* Line Total */}
                  <div className="w-full md:col-span-2 flex justify-between md:justify-end items-center font-bold text-sm text-midnight">
                    <span className="md:hidden text-xs text-warm-gray">Line Total:</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary Card */}
          <div className="lg:col-span-4 bg-white p-6 rounded-lg border border-light-gray shadow-xs space-y-5">
            <h2 className="font-heading text-xl font-bold text-midnight border-b border-light-gray pb-3">
              Cart Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-charcoal">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-charcoal">
                <span>Shipping</span>
                <span className={`font-semibold ${isFreeShippingUnlocked ? 'text-emerald-700' : 'text-gold'}`}>
                  {isFreeShippingUnlocked ? 'FREE' : formatPrice(storeConfig.shippingCharge)}
                </span>
              </div>
              <div className="border-t border-light-gray pt-3 flex justify-between text-base font-bold text-midnight">
                <span>Estimated Total</span>
                <span className="font-heading text-2xl text-midnight font-bold">
                  {formatPrice(grandTotal)}
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

            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={() => openCheckout()}
                className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-[0.16em] rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to WhatsApp Checkout →</span>
              </button>

              <Link
                to="/shop"
                className="block text-center text-xs text-charcoal hover:text-gold uppercase tracking-wider font-semibold py-2"
              >
                ← Continue Shopping
              </Link>
            </div>

            <div className="pt-2 border-t border-light-gray flex items-center justify-center gap-2 text-xs text-warm-gray">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>Direct WhatsApp confirmation • No online card needed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
