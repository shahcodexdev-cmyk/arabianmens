import { useState, useEffect, useRef } from 'react';
import {
  X,
  MessageCircle,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Truck,
  CreditCard,
  Banknote,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { storeConfig, formatPrice } from '../../config/store';
import {
  buildFormattedWhatsAppMessage,
  isWhatsAppConfigured,
} from '../../lib/whatsapp';
import { indianStates } from './IndianStates';
import type { PaymentMode } from '../../types';

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    closeCheckout,
    items,
    checkoutSingleItem,
    clearCart,
  } = useCart();

  // Active items for this checkout session
  const activeItems = checkoutSingleItem ? [checkoutSingleItem] : items;

  // Pricing
  const subtotal = activeItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const isFreeShipping =
    storeConfig.freeShippingThreshold > 0 &&
    subtotal >= storeConfig.freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : storeConfig.shippingCharge;
  const grandTotal = subtotal + shippingFee;

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    whatsapp: '',
    email: '',
    house: '',
    street: '',
    landmark: '',
    city: '',
    state: 'Maharashtra',
    pinCode: '',
    paymentMode: 'Cash on Delivery' as PaymentMode,
    notes: '',
  });

  const [sameAsMobile, setSameAsMobile] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<{
    orderId: string;
    url: string;
    grandTotal: number;
    paymentMode: string;
    itemsCount: number;
  } | null>(null);

  // Field Refs for smooth scrolling & focus
  const nameRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const whatsappRef = useRef<HTMLInputElement>(null);
  const houseRef = useRef<HTMLInputElement>(null);
  const streetRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLSelectElement>(null);
  const pinRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync WhatsApp number when sameAsMobile is enabled
  useEffect(() => {
    if (sameAsMobile) {
      setFormData((prev) => ({
        ...prev,
        whatsapp: prev.mobile,
      }));
    }
  }, [formData.mobile, sameAsMobile]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isCheckoutOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSubmittedOrder(null);
      setErrors({});
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCheckoutOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCheckout();
      }
    };
    if (isCheckoutOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCheckoutOpen, closeCheckout]);

  if (!isCheckoutOpen) return null;

  const validate = (): boolean => {
    const err: Record<string, string> = {};
    let firstErrorRef: React.RefObject<HTMLElement | null> | null = null;

    // Full Name
    if (!formData.fullName.trim()) {
      err.fullName = 'Full Name is required';
      if (!firstErrorRef) firstErrorRef = nameRef;
    }

    // Mobile (10-digit Indian Mobile)
    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (!cleanMobile) {
      err.mobile = 'Mobile number is required';
      if (!firstErrorRef) firstErrorRef = mobileRef;
    } else if (cleanMobile.length !== 10 || !/^[6-9]\d{9}$/.test(cleanMobile)) {
      err.mobile = 'Please enter a valid 10-digit Indian mobile number';
      if (!firstErrorRef) firstErrorRef = mobileRef;
    }

    // WhatsApp Number
    const cleanWa = (sameAsMobile ? formData.mobile : formData.whatsapp).replace(
      /\D/g,
      ''
    );
    if (!cleanWa) {
      err.whatsapp = 'WhatsApp number is required';
      if (!firstErrorRef) firstErrorRef = whatsappRef;
    } else if (cleanWa.length !== 10) {
      err.whatsapp = 'Please enter a valid 10-digit WhatsApp number';
      if (!firstErrorRef) firstErrorRef = whatsappRef;
    }

    // House / Flat
    if (!formData.house.trim()) {
      err.house = 'Flat / House / Building details are required';
      if (!firstErrorRef) firstErrorRef = houseRef;
    }

    // Street / Locality
    if (!formData.street.trim()) {
      err.street = 'Street / Area / Locality is required';
      if (!firstErrorRef) firstErrorRef = streetRef;
    }

    // City
    if (!formData.city.trim()) {
      err.city = 'City is required';
      if (!firstErrorRef) firstErrorRef = cityRef;
    }

    // State
    if (!formData.state.trim()) {
      err.state = 'State is required';
      if (!firstErrorRef) firstErrorRef = stateRef;
    }

    // PIN Code (6 digits)
    const cleanPin = formData.pinCode.replace(/\D/g, '');
    if (!cleanPin) {
      err.pinCode = 'Postal / PIN code is required';
      if (!firstErrorRef) firstErrorRef = pinRef;
    } else if (cleanPin.length !== 6) {
      err.pinCode = 'PIN code must be exactly 6 digits';
      if (!firstErrorRef) firstErrorRef = pinRef;
    }

    setErrors(err);

    // Smooth scroll and focus the first erroneous input
    if (firstErrorRef && firstErrorRef.current) {
      firstErrorRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      firstErrorRef.current.focus();
    }

    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (activeItems.length === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = buildFormattedWhatsAppMessage({
        items: activeItems.map((item) => ({
          name: item.name,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          unitPrice: item.price,
          lineTotal: item.price * item.quantity,
          productUrl: `${storeConfig.websiteUrl}/products/${item.slug}`,
        })),
        subtotal,
        shippingFee,
        grandTotal,
        paymentMode: formData.paymentMode,
        customer: {
          fullName: formData.fullName.trim(),
          mobile: formData.mobile.replace(/\D/g, ''),
          whatsapp: (sameAsMobile ? formData.mobile : formData.whatsapp).replace(
            /\D/g,
            ''
          ),
          email: formData.email.trim() || undefined,
        },
        address: {
          house: formData.house.trim(),
          street: formData.street.trim(),
          landmark: formData.landmark.trim() || undefined,
          city: formData.city.trim(),
          state: formData.state.trim(),
          pinCode: formData.pinCode.replace(/\D/g, ''),
          instructions: formData.notes.trim() || undefined,
        },
        notes: formData.notes.trim() || undefined,
      });

      // 1. Open WhatsApp window
      window.open(orderData.url, '_blank');

      // 2. Clear cart if checking out main cart
      if (!checkoutSingleItem) {
        clearCart();
      }

      // 3. Switch to Success State
      setSubmittedOrder({
        orderId: orderData.orderId,
        url: orderData.url,
        grandTotal,
        paymentMode: formData.paymentMode,
        itemsCount: activeItems.length,
      });
    } catch {
      // Error fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={closeCheckout}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-light-gray flex flex-col max-h-[92vh] z-10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-midnight text-white border-b border-[#2b2723]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold">
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
            </div>
            <div>
              <h2
                id="checkout-modal-title"
                className="font-heading text-lg font-bold text-white tracking-wide leading-tight"
              >
                WhatsApp Order Checkout
              </h2>
              <p className="text-[11px] text-gray-300">
                Direct fulfillment & sizing verification with our boutique
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCheckout}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Close checkout modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-5 sm:p-7 bg-[#FAF8F5]"
        >
          {submittedOrder ? (
            /* ================= SUCCESS SCREEN ================= */
            <div className="py-8 px-4 max-w-lg mx-auto text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 uppercase tracking-wider mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Order Transferred to WhatsApp
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-midnight">
                  Thank You, {formData.fullName}!
                </h3>
                <p className="text-sm text-warm-gray mt-2">
                  Your structured order request has been generated under Reference:
                </p>
                <div className="mt-3 p-3 bg-white rounded-xl border border-gold/40 shadow-xs inline-block">
                  <span className="text-xs uppercase tracking-widest text-warm-gray block">
                    Order Reference ID
                  </span>
                  <span className="font-mono text-xl font-bold text-midnight tracking-wider">
                    {submittedOrder.orderId}
                  </span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-light-gray text-left space-y-3 text-xs shadow-xs">
                <div className="flex justify-between pb-2 border-b border-light-gray">
                  <span className="text-warm-gray">Items Ordered:</span>
                  <span className="font-semibold text-midnight">
                    {submittedOrder.itemsCount} item(s)
                  </span>
                </div>
                <div className="flex justify-between pb-2 border-b border-light-gray">
                  <span className="text-warm-gray">Grand Total:</span>
                  <span className="font-bold text-midnight text-sm">
                    {formatPrice(submittedOrder.grandTotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-gray">Selected Payment Mode:</span>
                  <span className="font-semibold text-gold">
                    {submittedOrder.paymentMode}
                  </span>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 text-left space-y-2">
                <p className="font-bold flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  Final Step: Send Message in WhatsApp
                </p>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  WhatsApp was opened with your order summary pre-filled. Please tap
                  <strong> Send</strong> in the chat to confirm your order with our boutique staff.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.open(submittedOrder.url, '_blank')}
                  className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-[0.16em] rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Re-open WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={closeCheckout}
                  className="w-full py-3 px-6 bg-white border border-gray-300 text-midnight hover:bg-gray-50 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Done / Continue Shopping
                </button>
              </div>
            </div>
          ) : activeItems.length === 0 ? (
            /* ================= EMPTY STATE ================= */
            <div className="py-16 text-center space-y-4">
              <ShoppingBag className="w-12 h-12 text-warm-gray mx-auto" />
              <h3 className="font-heading text-xl font-bold text-midnight">
                No Items to Checkout
              </h3>
              <p className="text-xs text-warm-gray">
                Please add items to your cart before proceeding to checkout.
              </p>
              <button
                type="button"
                onClick={closeCheckout}
                className="px-6 py-3 bg-midnight text-gold text-xs font-bold uppercase tracking-wider rounded-xl"
              >
                Explore Products
              </button>
            </div>
          ) : (
            /* ================= CHECKOUT FORM ================= */
            <form onSubmit={handleSubmit} noValidate>
              {/* Dev Placeholder Warning */}
              {!isWhatsAppConfigured() && (
                <div className="mb-5 p-3.5 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Store Setup Notice:</strong>
                    <span>
                      WhatsApp number is currently the demonstration default in{' '}
                      <code>store.ts</code>. Update <code>whatsappNumber</code> to your live Business number for customer chats.
                    </span>
                  </div>
                </div>
              )}

              {/* Validation Summary if any error */}
              {Object.keys(errors).length > 0 && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>
                    Please complete the highlighted required fields before submitting your order.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Input Form (7 cols) */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Step 1: Customer Details */}
                  <div className="bg-white p-5 rounded-xl border border-light-gray shadow-xs space-y-4">
                    <h3 className="font-heading text-sm font-bold text-midnight uppercase tracking-wider flex items-center gap-2 border-b border-light-gray pb-2.5">
                      <span className="w-5 h-5 rounded-full bg-midnight text-gold text-[10px] flex items-center justify-center font-bold">
                        1
                      </span>
                      <span>Customer Contact</span>
                    </h3>

                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold text-charcoal mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          ref={nameRef}
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => {
                            setFormData({ ...formData, fullName: e.target.value });
                            if (errors.fullName) {
                              setErrors((prev) => ({ ...prev, fullName: '' }));
                            }
                          }}
                          placeholder="e.g. Tariq Khan"
                          className={`w-full px-3.5 py-2.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 ${
                            errors.fullName
                              ? 'border-red-500 bg-red-50/40'
                              : 'border-gray-300 bg-white'
                          }`}
                        />
                        {errors.fullName && (
                          <p className="text-[11px] text-red-500 mt-1 font-medium">
                            {errors.fullName}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-bold text-charcoal mb-1">
                            Mobile Number <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-xs text-gray-500 font-semibold select-none">
                              +91
                            </span>
                            <input
                              ref={mobileRef}
                              type="tel"
                              maxLength={10}
                              value={formData.mobile}
                              onChange={(e) => {
                                setFormData({ ...formData, mobile: e.target.value });
                                if (errors.mobile) {
                                  setErrors((prev) => ({ ...prev, mobile: '' }));
                                }
                              }}
                              placeholder="10-digit number"
                              className={`w-full pl-11 pr-3.5 py-2.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 ${
                                errors.mobile
                                  ? 'border-red-500 bg-red-50/40'
                                  : 'border-gray-300 bg-white'
                              }`}
                            />
                          </div>
                          {errors.mobile && (
                            <p className="text-[11px] text-red-500 mt-1 font-medium">
                              {errors.mobile}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-charcoal mb-1">
                            WhatsApp Number <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-xs text-gray-500 font-semibold select-none">
                              +91
                            </span>
                            <input
                              ref={whatsappRef}
                              type="tel"
                              maxLength={10}
                              disabled={sameAsMobile}
                              value={formData.whatsapp}
                              onChange={(e) => {
                                setFormData({ ...formData, whatsapp: e.target.value });
                                if (errors.whatsapp) {
                                  setErrors((prev) => ({ ...prev, whatsapp: '' }));
                                }
                              }}
                              placeholder="10-digit number"
                              className={`w-full pl-11 pr-3.5 py-2.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:bg-gray-100 disabled:text-gray-500 ${
                                errors.whatsapp
                                  ? 'border-red-500 bg-red-50/40'
                                  : 'border-gray-300 bg-white'
                              }`}
                            />
                          </div>
                          {errors.whatsapp && (
                            <p className="text-[11px] text-red-500 mt-1 font-medium">
                              {errors.whatsapp}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="modalSameAsMobile"
                          checked={sameAsMobile}
                          onChange={(e) => setSameAsMobile(e.target.checked)}
                          className="rounded border-gray-300 text-gold focus:ring-gold cursor-pointer"
                        />
                        <label
                          htmlFor="modalSameAsMobile"
                          className="text-xs text-warm-gray cursor-pointer select-none"
                        >
                          WhatsApp number is the same as mobile number
                        </label>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-charcoal mb-1">
                          Email Address <span className="text-warm-gray text-[10px] font-normal">(Optional, for invoice copy)</span>
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="e.g. name@example.com"
                          className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Delivery Address */}
                  <div className="bg-white p-5 rounded-xl border border-light-gray shadow-xs space-y-4">
                    <h3 className="font-heading text-sm font-bold text-midnight uppercase tracking-wider flex items-center gap-2 border-b border-light-gray pb-2.5">
                      <span className="w-5 h-5 rounded-full bg-midnight text-gold text-[10px] flex items-center justify-center font-bold">
                        2
                      </span>
                      <span>Delivery Address (India)</span>
                    </h3>

                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold text-charcoal mb-1">
                          House / Flat / Building / Floor <span className="text-red-500">*</span>
                        </label>
                        <input
                          ref={houseRef}
                          type="text"
                          value={formData.house}
                          onChange={(e) => {
                            setFormData({ ...formData, house: e.target.value });
                            if (errors.house) {
                              setErrors((prev) => ({ ...prev, house: '' }));
                            }
                          }}
                          placeholder="e.g. Flat 302, Palm Heights"
                          className={`w-full px-3.5 py-2.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 ${
                            errors.house
                              ? 'border-red-500 bg-red-50/40'
                              : 'border-gray-300 bg-white'
                          }`}
                        />
                        {errors.house && (
                          <p className="text-[11px] text-red-500 mt-1 font-medium">
                            {errors.house}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-charcoal mb-1">
                          Street / Area / Locality <span className="text-red-500">*</span>
                        </label>
                        <input
                          ref={streetRef}
                          type="text"
                          value={formData.street}
                          onChange={(e) => {
                            setFormData({ ...formData, street: e.target.value });
                            if (errors.street) {
                              setErrors((prev) => ({ ...prev, street: '' }));
                            }
                          }}
                          placeholder="e.g. Linking Road, Bandra West"
                          className={`w-full px-3.5 py-2.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 ${
                            errors.street
                              ? 'border-red-500 bg-red-50/40'
                              : 'border-gray-300 bg-white'
                          }`}
                        />
                        {errors.street && (
                          <p className="text-[11px] text-red-500 mt-1 font-medium">
                            {errors.street}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-bold text-charcoal mb-1">
                            Landmark <span className="text-warm-gray text-[10px] font-normal">(Optional)</span>
                          </label>
                          <input
                            type="text"
                            value={formData.landmark}
                            onChange={(e) =>
                              setFormData({ ...formData, landmark: e.target.value })
                            }
                            placeholder="e.g. Near Metro Station"
                            className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-charcoal mb-1">
                            City <span className="text-red-500">*</span>
                          </label>
                          <input
                            ref={cityRef}
                            type="text"
                            value={formData.city}
                            onChange={(e) => {
                              setFormData({ ...formData, city: e.target.value });
                              if (errors.city) {
                                setErrors((prev) => ({ ...prev, city: '' }));
                              }
                            }}
                            placeholder="e.g. Mumbai"
                            className={`w-full px-3.5 py-2.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 ${
                              errors.city
                                ? 'border-red-500 bg-red-50/40'
                                : 'border-gray-300 bg-white'
                            }`}
                          />
                          {errors.city && (
                            <p className="text-[11px] text-red-500 mt-1 font-medium">
                              {errors.city}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-bold text-charcoal mb-1">
                            State <span className="text-red-500">*</span>
                          </label>
                          <select
                            ref={stateRef}
                            value={formData.state}
                            onChange={(e) => {
                              setFormData({ ...formData, state: e.target.value });
                              if (errors.state) {
                                setErrors((prev) => ({ ...prev, state: '' }));
                              }
                            }}
                            className={`w-full px-3.5 py-2.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white ${
                              errors.state
                                ? 'border-red-500 bg-red-50/40'
                                : 'border-gray-300'
                            }`}
                          >
                            {indianStates.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-charcoal mb-1">
                            Postal / PIN Code <span className="text-red-500">*</span>
                          </label>
                          <input
                            ref={pinRef}
                            type="text"
                            maxLength={6}
                            value={formData.pinCode}
                            onChange={(e) => {
                              setFormData({ ...formData, pinCode: e.target.value });
                              if (errors.pinCode) {
                                setErrors((prev) => ({ ...prev, pinCode: '' }));
                              }
                            }}
                            placeholder="6-digit PIN"
                            className={`w-full px-3.5 py-2.5 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 ${
                              errors.pinCode
                                ? 'border-red-500 bg-red-50/40'
                                : 'border-gray-300 bg-white'
                            }`}
                          />
                          {errors.pinCode && (
                            <p className="text-[11px] text-red-500 mt-1 font-medium">
                              {errors.pinCode}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Payment Mode Selection (Radio) */}
                  <div className="bg-white p-5 rounded-xl border border-light-gray shadow-xs space-y-4">
                    <h3 className="font-heading text-sm font-bold text-midnight uppercase tracking-wider flex items-center gap-2 border-b border-light-gray pb-2.5">
                      <span className="w-5 h-5 rounded-full bg-midnight text-gold text-[10px] flex items-center justify-center font-bold">
                        3
                      </span>
                      <span>Payment Preference</span>
                    </h3>

                    <p className="text-[11px] text-warm-gray">
                      No card needed on this site. Select your preferred method to settle with our team on WhatsApp:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                          formData.paymentMode === 'Cash on Delivery'
                            ? 'border-midnight bg-cream/70 shadow-xs'
                            : 'border-light-gray hover:border-gray-400 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMode"
                          value="Cash on Delivery"
                          checked={formData.paymentMode === 'Cash on Delivery'}
                          onChange={() =>
                            setFormData({
                              ...formData,
                              paymentMode: 'Cash on Delivery',
                            })
                          }
                          className="mt-0.5 text-midnight focus:ring-midnight"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-midnight">
                            <Banknote className="w-4 h-4 text-gold" />
                            <span>Cash on Delivery (COD)</span>
                          </div>
                          <p className="text-[10px] text-warm-gray mt-1 leading-snug">
                            Pay with cash or UPI scan when your parcel arrives at your address.
                          </p>
                        </div>
                      </label>

                      <label
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                          formData.paymentMode === 'UPI / Online Transfer'
                            ? 'border-midnight bg-cream/70 shadow-xs'
                            : 'border-light-gray hover:border-gray-400 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMode"
                          value="UPI / Online Transfer"
                          checked={formData.paymentMode === 'UPI / Online Transfer'}
                          onChange={() =>
                            setFormData({
                              ...formData,
                              paymentMode: 'UPI / Online Transfer',
                            })
                          }
                          className="mt-0.5 text-midnight focus:ring-midnight"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-midnight">
                            <CreditCard className="w-4 h-4 text-gold" />
                            <span>UPI / Direct Bank Transfer</span>
                          </div>
                          <p className="text-[10px] text-warm-gray mt-1 leading-snug">
                            Instant GPay, PhonePe, Paytm, or NetBanking verified in WhatsApp.
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Special Instructions */}
                    <div className="pt-2">
                      <label className="block text-xs font-bold text-charcoal mb-1">
                        Special Instructions / Notes <span className="text-warm-gray text-[10px] font-normal">(Optional)</span>
                      </label>
                      <textarea
                        rows={2}
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        placeholder="e.g. Please call before delivery, verify chest sizing 42"
                        className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Order Summary Card (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-white p-5 rounded-xl border border-light-gray shadow-xs space-y-4">
                    <h3 className="font-heading text-sm font-bold text-midnight uppercase tracking-wider border-b border-light-gray pb-2.5 flex items-center justify-between">
                      <span>Order Summary</span>
                      <span className="text-xs font-normal text-warm-gray">
                        {activeItems.length} item{activeItems.length === 1 ? '' : 's'}
                      </span>
                    </h3>

                    {/* Items List */}
                    <div className="space-y-3 max-h-56 overflow-y-auto pr-1 divide-y divide-light-gray/60">
                      {activeItems.map((item) => (
                        <div
                          key={item.variantId}
                          className="pt-2.5 first:pt-0 flex gap-3 items-center"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-16 object-cover rounded-lg bg-ivory flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-midnight line-clamp-1">
                              {item.name}
                            </h4>
                            <p className="text-[11px] text-warm-gray mt-0.5">
                              Size: <strong className="text-charcoal">{item.size}</strong> • Color: <strong className="text-charcoal">{item.color}</strong>
                            </p>
                            <div className="flex items-center justify-between mt-1 text-xs">
                              <span className="text-warm-gray">Qty: {item.quantity}</span>
                              <span className="font-bold text-midnight">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cost Breakdown */}
                    <div className="border-t border-light-gray pt-3 space-y-2 text-xs">
                      <div className="flex justify-between text-charcoal">
                        <span>Items Subtotal</span>
                        <span className="font-semibold text-midnight">
                          {formatPrice(subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-charcoal">
                        <span>Shipping Delivery</span>
                        <span
                          className={`font-semibold ${
                            isFreeShipping ? 'text-emerald-700' : 'text-gold'
                          }`}
                        >
                          {isFreeShipping ? 'FREE' : formatPrice(shippingFee)}
                        </span>
                      </div>
                      <div className="border-t border-light-gray/80 pt-2.5 flex justify-between text-base font-bold text-midnight">
                        <span>Total Due</span>
                        <span className="font-heading text-xl text-midnight font-bold">
                          {formatPrice(grandTotal)}
                        </span>
                      </div>
                    </div>

                    {/* Submit CTA */}
                    <div className="pt-2 space-y-2.5">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-[0.16em] rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Place Order on WhatsApp</span>
                      </button>

                      <p className="text-[11px] text-warm-gray text-center leading-relaxed">
                        Submitting opens WhatsApp with your pre-formatted order summary ready to send to our team.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-light-gray flex items-center justify-center gap-1.5 text-[11px] text-warm-gray">
                      <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                      <span>Direct Boutique Confirmation & Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
