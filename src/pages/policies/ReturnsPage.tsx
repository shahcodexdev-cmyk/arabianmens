import SEOHead from '../../components/seo/SEOHead';
import Breadcrumbs from '../../components/products/Breadcrumbs';

export default function ReturnsPage() {
  return (
    <div className="py-8 md:py-16 bg-cream min-h-screen">
      <SEOHead
        title="Return & Refund Policy"
        description="Guidelines on size exchanges, returns, and refund requests for purchases made through Arabian Mens Collection."
        canonical="/policies/returns"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Return & Refund Policy' },
          ]}
        />

        <div className="bg-white p-8 sm:p-12 rounded-xl border border-light-gray shadow-xs space-y-6 text-charcoal text-xs sm:text-sm leading-relaxed">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-midnight border-b border-light-gray pb-4">
            Return & Exchange Policy
          </h1>

          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-midnight">
              1. Size Exchanges
            </h2>
            <p>
              We want you to feel confident and distinguished in your Arabian Mens Collection garments. If an item does not fit as expected, we are pleased to offer size exchanges subject to stock availability.
            </p>

            <h2 className="font-heading text-xl font-bold text-midnight">
              2. Eligibility Criteria
            </h2>
            <p>
              • The exchange request must be initiated within <strong>48 hours of delivery</strong> by messaging our official WhatsApp number.<br />
              • Items must be unwashed, unworn, undamaged, free of perfumes or marks, and returned with all original tags intact in the original packaging.
            </p>

            <h2 className="font-heading text-xl font-bold text-midnight">
              3. Non-Eligible Items
            </h2>
            <p>
              Garments purchased during final clearance events, customized items, or pieces showing signs of wear or perfume are not eligible for exchange or return.
            </p>

            <h2 className="font-heading text-xl font-bold text-midnight">
              4. Damaged or Defective Items
            </h2>
            <p>
              In the rare event of receiving a transit-damaged or defective garment, please send clear unboxing photographs or a video to our WhatsApp within 24 hours of delivery. We will promptly arrange a priority replacement at no extra charge.
            </p>

            <h2 className="font-heading text-xl font-bold text-midnight">
              5. Refund Settlement
            </h2>
            <p>
              Since transactions are handled directly through WhatsApp without automated payment gateways, approved refunds are settled via original UPI or direct bank transfer within 3 to 5 business days after product inspection at our facility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

