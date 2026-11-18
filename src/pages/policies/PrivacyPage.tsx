import SEOHead from '../../components/seo/SEOHead';
import Breadcrumbs from '../../components/products/Breadcrumbs';
import { storeConfig } from '../../config/store';

export default function PrivacyPage() {
  return (
    <div className="py-8 md:py-16 bg-cream min-h-screen">
      <SEOHead
        title="Privacy Policy"
        description="Learn how customer data is processed and protected at Arabian Mens Collection."
        canonical="/policies/privacy"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Privacy Policy' },
          ]}
        />

        <div className="bg-white p-8 sm:p-12 rounded-xl border border-light-gray shadow-xs space-y-6 text-charcoal text-xs sm:text-sm leading-relaxed">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-midnight border-b border-light-gray pb-4">
            Privacy Policy
          </h1>

          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-midnight">
              1. Information We Collect
            </h2>
            <p>
              When you browse our storefront and use our WhatsApp order checkout form, we collect the necessary contact details you submit, including your Full Name, Mobile Number, WhatsApp Number, and Delivery Address.
            </p>

            <h2 className="font-heading text-xl font-bold text-midnight">
              2. No Financial or Card Details Stored
            </h2>
            <p>
              Arabian Mens Collection operates without an online card payment processor. We never collect, transmit, or store debit card, credit card, net banking credentials, or CVVs on our website servers.
            </p>

            <h2 className="font-heading text-xl font-bold text-midnight">
              3. Purpose of Processing
            </h2>
            <p>
              Your contact details are used exclusively to:
              <br />• Format and populate your WhatsApp order request message.
              <br />• Coordinate shipment delivery with logistics couriers.
              <br />• Provide customer assistance regarding sizing, order status, and exchanges.
            </p>

            <h2 className="font-heading text-xl font-bold text-midnight">
              4. Local Storage
            </h2>
            <p>
              We use standard client-side browser storage (localStorage) exclusively to preserve your chosen shopping cart items across browser sessions. No tracking cookies are used to sell your information to third-party ad networks.
            </p>

            <h2 className="font-heading text-xl font-bold text-midnight">
              5. Contact Us Regarding Your Data
            </h2>
            <p>
              If you have any questions about this privacy statement, you can contact us directly at {storeConfig.contactEmail}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

