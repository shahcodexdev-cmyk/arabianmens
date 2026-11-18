import SEOHead from '../../components/seo/SEOHead';
import Breadcrumbs from '../../components/products/Breadcrumbs';

export default function ShippingPage() {
  return (
    <div className="py-8 md:py-16 bg-cream min-h-screen">
      <SEOHead
        title="Shipping Policy"
        description="Learn about dispatch schedules, delivery timelines, and Pan-India courier arrangements at Arabian Mens Collection."
        canonical="/policies/shipping"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shipping Policy' },
          ]}
        />

        <div className="bg-white p-8 sm:p-12 rounded-xl border border-light-gray shadow-xs space-y-6 text-charcoal text-xs sm:text-sm leading-relaxed">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-midnight border-b border-light-gray pb-4">
            Shipping & Delivery Policy
          </h1>

          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-midnight">
              1. Direct WhatsApp Order Confirmation
            </h2>
            <p>
              Arabian Mens Collection operates a dedicated boutique storefront with WhatsApp order settlement. Once you submit an order request through our checkout form, our fulfillment staff reviews the product availability, your designated delivery address, and confirms dispatch logistics with you directly.
            </p>

            <h2 className="font-heading text-xl font-bold text-midnight">
              2. Processing & Dispatch Timelines
            </h2>
            <p>
              • <strong>Order Verification:</strong> Orders are verified within 12 to 24 hours of receiving your WhatsApp order message.<br />
              • <strong>Dispatch:</strong> Confirmed orders are typically packaged and handed to our logistics partners within 24 to 48 hours (excluding Sundays and national holidays).
            </p>

            <h2 className="font-heading text-xl font-bold text-midnight">
              3. Pan-India Delivery Estimates
            </h2>
            <p>
              • <strong>Metro Cities:</strong> Estimated 3 to 4 business days post-dispatch.<br />
              • <strong>Tier 2 & Tier 3 Cities / Rest of India:</strong> Estimated 4 to 7 business days.<br />
              • <strong>Remote Locations:</strong> Up to 7 to 9 business days depending on local courier coverage.
            </p>

            <h2 className="font-heading text-xl font-bold text-midnight">
              4. Shipping Charges
            </h2>
            <p>
              Standard shipping fees (if applicable) are communicated transparently during the WhatsApp order confirmation conversation prior to payment finalization.
            </p>

            <h2 className="font-heading text-xl font-bold text-midnight">
              5. Shipment Tracking
            </h2>
            <p>
              Upon parcel handover to the courier service, an official tracking link and AWB tracking code will be shared with you directly inside your WhatsApp chat for convenient parcel monitoring.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

