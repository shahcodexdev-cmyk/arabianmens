import { formatPrice, storeConfig } from '../../config/store';
import type { CartItem } from '../../types';
import { ShieldCheck, MessageCircle, Sparkles } from 'lucide-react';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
}

export default function OrderSummary({ items, subtotal }: OrderSummaryProps) {
  const isFreeShipping =
    storeConfig.freeShippingThreshold > 0 &&
    subtotal >= storeConfig.freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : storeConfig.shippingCharge;
  const grandTotal = subtotal + shippingFee;

  return (
    <div className="bg-white p-6 rounded-lg border border-light-gray shadow-xs space-y-6">
      <h3 className="font-heading text-lg text-midnight font-bold tracking-wide border-b border-light-gray pb-3">
        Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
      </h3>

      {/* Item List */}
      <div className="space-y-4 max-h-80 overflow-y-auto pr-1 divide-y divide-light-gray">
        {items.map((item) => (
          <div key={item.variantId} className="pt-3 first:pt-0 flex gap-3">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-20 object-cover rounded bg-ivory flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-charcoal line-clamp-1">
                {item.name}
              </h4>
              <p className="text-[11px] text-warm-gray mt-0.5">
                Size: <span className="text-charcoal font-medium">{item.size}</span> | Color: <span className="text-charcoal font-medium">{item.color}</span>
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-warm-gray">Qty: {item.quantity}</span>
                <span className="text-xs font-bold text-midnight">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Breakdown */}
      <div className="border-t border-light-gray pt-4 space-y-2 text-xs">
        <div className="flex justify-between text-charcoal">
          <span>Subtotal</span>
          <span className="font-semibold">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-charcoal">
          <span>Shipping Fee</span>
          <span className={`font-semibold ${isFreeShipping ? 'text-emerald-700' : 'text-gold'}`}>
            {isFreeShipping ? 'FREE' : formatPrice(shippingFee)}
          </span>
        </div>
        <div className="border-t border-light-gray pt-3 flex justify-between text-base font-bold text-midnight">
          <span>Estimated Total</span>
          <span className="font-heading text-xl text-midnight font-bold">
            {formatPrice(grandTotal)}
          </span>
        </div>
      </div>

      {/* WhatsApp Notice Box */}
      <div className="bg-ivory/80 border border-[#e3dac9] p-4 rounded-md space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-midnight">
          <MessageCircle className="w-4 h-4 text-[#25D366]" />
          <span>WhatsApp Order Process</span>
        </div>
        <p className="text-[11px] text-warm-gray leading-relaxed">
          Your order request will be sent directly to our store WhatsApp. We will confirm item availability, delivery timeline, and direct payment arrangements with you before dispatching.
        </p>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-warm-gray justify-center pt-2">
        <ShieldCheck className="w-4 h-4 text-gold" />
        <span>No upfront card payment required online</span>
      </div>
    </div>
  );
}
