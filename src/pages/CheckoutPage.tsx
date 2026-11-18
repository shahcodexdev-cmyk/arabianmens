import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MessageCircle,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Banknote,
  CreditCard,
  ShoppingBag,
} from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/products/Breadcrumbs';
import OrderSummary from '../components/checkout/OrderSummary';
import { indianStates } from '../components/checkout/IndianStates';
import { useCart } from '../context/CartContext';
import { storeConfig, formatPrice } from '../config/store';
import {
  buildFormattedWhatsAppMessage,
  isWhatsAppConfigured,
} from '../lib/whatsapp';
import type { PaymentMode } from '../types';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  // If cart is empty and hasn't submitted, redirect to cart page
  useEffect(() => {
    if (items.length === 0 && !submittedOrder) {
      navigate('/cart');
    }
  }, [items, navigate]);

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
    customerName: string;
  } | null>(null);

  // Field refs for smooth scroll and focus
  const nameRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const whatsappRef = useRef<HTMLInputElement>(null);
  const houseRef = useRef<HTMLInputElement>(null);
  const streetRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLSelectElement>(null);
  const pinRef = useRef<HTMLInputElement>(null);

  // Sync whatsapp number if sameAsMobile is checked
  useEffect(() => {
    if (sameAsMobile) {
      setFormData((prev) => ({
        ...prev,
        whatsapp: prev.mobile,
      }));
    }
  }, [formData.mobile, sameAsMobile]);

  const isFreeShipping =
    storeConfig.freeShippingThreshold > 0 &&
    subtotal >= storeConfig.freeShippingThreshold;
  const shippingFee = isFreeShipping ? 0 : storeConfig.shippingCharge;
  const grandTotal = subtotal + shippingFee;

  const validate = (): boolean => {
    const err: Record<string, string> = {};
    let firstErrorRef: React.RefObject<HTMLElement | null> | null = null;

    // Full Name
    if (!formData.fullName.trim()) {
      err.fullName = 'Full Name is required';
      if (!firstErrorRef) firstErrorRef = nameRef;
    }

    // Mobile (10-digit Indian mobile)
    const cleanMobile = formData.mobile.replace(/\D/g, '');
    if (!cleanMobile) {
      err.mobile = 'Mobile number is required';
      if (!firstErrorRef) firstErrorRef = mobileRef;
    } else if (cleanMobile.length !== 10 || !/^[6-9]\d{9}$/.test(cleanMobile)) {
      err.mobile = 'Please enter a valid 10-digit Indian mobile number';
      if (!firstErrorRef) firstErrorRef = mobileRef;
    }

    // WhatsApp
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

    // Smooth-scroll and focus to first erroneous input
    if (firstErrorRef && firstErrorRef.current) {
      firstErrorRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      firstErrorRef.current.focus();
    }

    return Object.keys(err).length === 0;
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const orderData = buildFormattedWhatsAppMessage({
        items: items.map((item) => ({
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

      // 2. Set submitted order success screen state
      setSubmittedOrder({
        orderId: orderData.orderId,
        url: orderData.url,
        grandTotal,
        paymentMode: formData.paymentMode,
        itemsCount: items.length,
        customerName: formData.fullName.trim(),
      });

      // 3. Clear cart
      clearCart();
    } catch {
      // Error handling
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 md:py-12 bg-cream min-h-screen">
      <SEOHead title="WhatsApp Order Checkout" canonical="/checkout" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shopping Cart', href: '/cart' },
            { label: 'Checkout' },
          ]}
        />

        {submittedOrder ? (
          /* ================= SUCCESS SCREEN ================= */
          <div className="max-w-2xl mx-auto my-12 bg-white rounded-2xl p-8 sm:p-12 border border-light-gray shadow-md text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 uppercase tracking-wider mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Order Transferred to WhatsApp
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-midnight">
                Thank You, {submittedOrder.customerName}!
              </h1>
              <p className="text-sm text-warm-gray mt-2">
                Your order summary has been prepared and transferred directly to WhatsApp under Reference:
              </p>
              <div className="mt-4 p-4 bg-[#FAF7F2] rounded-xl border border-gold/40 shadow-xs inline-block">
                <span className="text-xs uppercase tracking-widest text-warm-gray block mb-0.5">
                  Order Reference ID
                </span>
                <span className="font-mono text-2xl font-bold text-midnight tracking-wider">
                  {submittedOrder.orderId}
                </span>
              </div>
            </div>

            <div className="bg-[#FAF7F2] p-5 rounded-xl border border-light-gray text-left space-y-3 text-xs">
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
                <span className="text-warm-gray">Payment Mode:</span>
                <span className="font-semibold text-gold">
                  {submittedOrder.paymentMode}
                </span>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 text-left space-y-2">
              <p className="font-bold flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                Final Step: Confirm in WhatsApp
              </p>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                WhatsApp was opened in a new tab with your pre-formatted order summary. Please tap
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

              <Link
                to="/shop"
                className="inline-block w-full py-3 px-6 bg-white border border-gray-300 text-midnight hover:bg-gray-50 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                Explore More Styles
              </Link>
            </div>
          </div>
        ) : (
          /* ================= MAIN CHECKOUT FLOW ================= */
          <>
            <div className="mt-4 mb-8">
              <Link
                to="/cart"
                className="inline-flex items-center gap-1.5 text-xs text-warm-gray hover:text-midnight font-medium mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Shopping Cart</span>
              </Link>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-midnight">
                Complete Your WhatsApp Order
              </h1>
              <p className="text-xs text-warm-gray mt-1">
                Fill in your delivery address. Clicking order will generate your structured order and open WhatsApp directly.
              </p>
            </div>

            {/* Configuration Notice if placeholder number is used */}
            {!isWhatsAppConfigured() && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 text-xs flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Developer Demonstration Notice:</p>
                  <p>
                    The store WhatsApp number is currently configured as a placeholder in{' '}
                    <code>src/config/store.ts</code>. Please update <code>whatsappNumber</code> with your actual WhatsApp Business digits before production launch.
                  </p>
                </div>
              </div>
            )}

            {/* Validation Error Banner */}
            {Object.keys(errors).length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>
                  Please complete the highlighted required fields before submitting your order.
                </span>
              </div>
            )}

            {/* Main 2-Column Checkout Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Column */}
              <form onSubmit={handleWhatsAppSubmit} noValidate className="lg:col-span-7 space-y-6">
                {/* Step 1: Customer Information */}
                <div className="bg-white p-6 rounded-lg border border-light-gray shadow-xs space-y-4">
                  <h2 className="font-heading text-lg font-bold text-midnight border-b border-light-gray pb-2 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-midnight text-gold text-xs flex items-center justify-center font-bold">
                      1
                    </span>
                    <span>Customer Information</span>
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">
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
                        placeholder="Enter your complete name"
                        className={`w-full px-3.5 py-2.5 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-gold ${
                          errors.fullName ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-charcoal mb-1">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-xs text-gray-500 font-medium">
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
                            className={`w-full pl-12 pr-3.5 py-2.5 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-gold ${
                              errors.mobile ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                            }`}
                          />
                        </div>
                        {errors.mobile && (
                          <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.mobile}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-charcoal mb-1">
                          WhatsApp Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-xs text-gray-500 font-medium">
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
                            className={`w-full pl-12 pr-3.5 py-2.5 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-gold disabled:bg-gray-100 disabled:text-gray-500 ${
                              errors.whatsapp ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                            }`}
                          />
                        </div>
                        {errors.whatsapp && (
                          <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.whatsapp}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="sameAsMobile"
                        checked={sameAsMobile}
                        onChange={(e) => setSameAsMobile(e.target.checked)}
                        className="rounded border-gray-300 text-gold focus:ring-gold cursor-pointer"
                      />
                      <label htmlFor="sameAsMobile" className="text-xs text-warm-gray cursor-pointer">
                        WhatsApp number is the same as mobile number
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">
                        Email Address <span className="text-warm-gray text-[10px] font-normal">(Optional, for invoice copy)</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="For order invoice copy"
                        className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gold"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2: Delivery Address */}
                <div className="bg-white p-6 rounded-lg border border-light-gray shadow-xs space-y-4">
                  <h2 className="font-heading text-lg font-bold text-midnight border-b border-light-gray pb-2 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-midnight text-gold text-xs flex items-center justify-center font-bold">
                      2
                    </span>
                    <span>Delivery Address (India)</span>
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">
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
                        placeholder="e.g. Flat 402, Royal Residency"
                        className={`w-full px-3.5 py-2.5 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-gold ${
                          errors.house ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                        }`}
                      />
                      {errors.house && (
                        <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.house}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">
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
                        placeholder="e.g. Hill Road, Bandra West"
                        className={`w-full px-3.5 py-2.5 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-gold ${
                          errors.street ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                        }`}
                      />
                      {errors.street && (
                        <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.street}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-charcoal mb-1">
                          Landmark <span className="text-warm-gray text-[10px] font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={formData.landmark}
                          onChange={(e) =>
                            setFormData({ ...formData, landmark: e.target.value })
                          }
                          placeholder="e.g. Near City Mall"
                          className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-charcoal mb-1">
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
                          className={`w-full px-3.5 py-2.5 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-gold ${
                            errors.city ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                          }`}
                        />
                        {errors.city && (
                          <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.city}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-charcoal mb-1">
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
                          className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gold bg-white"
                        >
                          {indianStates.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-charcoal mb-1">
                          PIN Code <span className="text-red-500">*</span>
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
                          className={`w-full px-3.5 py-2.5 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-gold ${
                            errors.pinCode ? 'border-red-500 bg-red-50/30' : 'border-gray-300'
                          }`}
                        />
                        {errors.pinCode && (
                          <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.pinCode}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">
                        Special Delivery Notes <span className="text-warm-gray text-[10px] font-normal">(Optional)</span>
                      </label>
                      <textarea
                        rows={2}
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        placeholder="e.g. Please call before delivery, leave with security"
                        className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gold"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 3: Payment Mode Selection (Radio) */}
                <div className="bg-white p-6 rounded-lg border border-light-gray shadow-xs space-y-4">
                  <h2 className="font-heading text-lg font-bold text-midnight border-b border-light-gray pb-2 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-midnight text-gold text-xs flex items-center justify-center font-bold">
                      3
                    </span>
                    <span>Payment Mode Preference</span>
                  </h2>

                  <p className="text-xs text-warm-gray">
                    Select how you would like to pay upon order confirmation in WhatsApp:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
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
                          setFormData({ ...formData, paymentMode: 'Cash on Delivery' })
                        }
                        className="mt-0.5 text-midnight focus:ring-midnight"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-midnight">
                          <Banknote className="w-4 h-4 text-gold" />
                          <span>Cash on Delivery (COD)</span>
                        </div>
                        <p className="text-[11px] text-warm-gray mt-1 leading-snug">
                          Pay securely in cash or UPI scan when your parcel arrives at your address.
                        </p>
                      </div>
                    </label>

                    <label
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
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
                          setFormData({ ...formData, paymentMode: 'UPI / Online Transfer' })
                        }
                        className="mt-0.5 text-midnight focus:ring-midnight"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-midnight">
                          <CreditCard className="w-4 h-4 text-gold" />
                          <span>UPI / Direct Bank Transfer</span>
                        </div>
                        <p className="text-[11px] text-warm-gray mt-1 leading-snug">
                          Instant payment via Google Pay, PhonePe, Paytm, or NetBanking verified in WhatsApp.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 bg-[#25D366] text-white font-bold text-sm uppercase tracking-wider rounded-lg shadow-lg hover:bg-[#20ba59] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Place Order on WhatsApp</span>
                  </button>

                  <p className="text-[11px] text-warm-gray text-center leading-relaxed">
                    * Clicking will open WhatsApp with your complete order breakdown and address ready to send to our boutique team.
                  </p>
                </div>
              </form>

              {/* Order Summary Sticky Column */}
              <div className="lg:col-span-5 lg:sticky lg:top-28">
                <OrderSummary items={items} subtotal={subtotal} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
