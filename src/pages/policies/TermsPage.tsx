import SEOHead from '../../components/seo/SEOHead';
import Breadcrumbs from '../../components/products/Breadcrumbs';
import { storeConfig } from '../../config/store';

export default function TermsPage() {
  return (
    <div className="py-8 md:py-16 bg-cream min-h-screen">
      <SEOHead
        title="Terms & Conditions"
        description="Terms and conditions governing the use of Arabian Mens Collection website and WhatsApp ordering services."
        canonical="/policies/terms"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Terms & Conditions' },
          ]}
        />

        <div className="bg-white p-8 sm:p-12 rounded-xl border border-light-gray shadow-xs space-y-6 text-charcoal text-xs sm:text-sm leading-relaxed">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-midnight border-b border-light-gray pb-4">
            Terms & Conditions
          </h1>

          <div className="space-y-4">
            <h2 className="font-heading text-xl font-bold text-midnight">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using this website ({storeConfig.brandName}), you acknowledge and agree to comply with these terms of service, all applicable laws and regulations in India, and agree that you are responsible for compliance with any applicable local laws.
            </p>

            <h2 className="font-heading text-xl font-bold text-midnight">
              2. Nature of WhatsApp Order Requests
            </h2>
            <p>
              Submitting an order form on this website generates a structured request message to our official WhatsApp chat. <strong>A submitted form or launched WhatsApp window does not constitute a legally binding sale or guarantee of inventory availability.</strong> An order is only confirmed once accepted and confirmed in conversation by our authorized store representative.
            </p>

            <h2 className="font-heading text-xl font-bold text-midnight">
              3. Pricing and Product Information
            </h2>
            <p>
              Prices, product descriptions, and availability are subject to change without prior notice. While we strive for photographic accuracy, minor color variations may occur due to individual screen calibration and studio lighting conditions.
            </p>

            <h2 className="font-heading text-xl font-bold text-midnight">
              4. Intellectual Property
            </h2>
            <p>
              All trademarks, logos, brand emblems, and styling photographs appearing on this platform are the property of {storeConfig.brandName}. Unauthorized reproduction or misuse of any visual brand asset is strictly prohibited.
            </p>

            <h2 className="font-heading text-xl font-bold text-midnight">
              5. Jurisdiction
            </h2>
            <p>
              Any disputes relating to transactions or use of this website shall be governed by and construed in accordance with the laws of India.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

