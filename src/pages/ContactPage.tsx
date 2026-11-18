import { MessageCircle, Mail, Phone, MapPin, Clock } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/products/Breadcrumbs';
import { storeConfig } from '../config/store';
import { getWhatsAppContactUrl } from '../lib/whatsapp';

export default function ContactPage() {
  return (
    <div className="py-8 md:py-16 bg-cream min-h-screen">
      <SEOHead
        title="Contact Us"
        description="Get in touch with Arabian Mens Collection. Order via WhatsApp or contact us for sizing assistance and inquiries."
        canonical="/contact"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Contact Us' },
          ]}
        />

        <div className="text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            Customer Care & Assistance
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-midnight">
            Get in Touch
          </h1>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
          <p className="text-sm text-warm-gray max-w-xl mx-auto font-light leading-relaxed">
            Have questions about sizes, bulk orders, or specific fabric drape? Reach out to our boutique team directly.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WhatsApp Card */}
          <div className="bg-white p-8 rounded-xl border border-light-gray shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-midnight">
                WhatsApp Chat & Orders
              </h3>
              <p className="text-xs text-warm-gray leading-relaxed">
                Fastest response for order placement, size verification, real-time product videos, and tracking queries.
              </p>
              <p className="text-sm font-semibold text-charcoal">
                {storeConfig.contactPhone}
              </p>
            </div>

            <a
              href={getWhatsAppContactUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider rounded text-center hover:bg-[#20ba59] transition-colors shadow-xs"
            >
              Start WhatsApp Conversation
            </a>
          </div>

          {/* Email Card */}
          <div className="bg-white p-8 rounded-xl border border-light-gray shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-midnight text-gold flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-midnight">
                Email Inquiries
              </h3>
              <p className="text-xs text-warm-gray leading-relaxed">
                For customer service queries, formal collaboration proposals, or business communications.
              </p>
              <p className="text-sm font-semibold text-charcoal">
                {storeConfig.contactEmail}
              </p>
            </div>

            <a
              href={`mailto:${storeConfig.contactEmail}`}
              className="w-full py-3 bg-midnight text-gold font-bold text-xs uppercase tracking-wider rounded text-center hover:bg-black transition-colors"
            >
              Send an Email
            </a>
          </div>
        </div>

        {/* Additional Info Box */}
        <div className="bg-white p-8 rounded-xl border border-light-gray shadow-xs space-y-6">
          <h3 className="font-heading text-xl font-bold text-midnight border-b border-light-gray pb-3">
            Service Timings & Delivery Coverage
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-charcoal">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-midnight text-sm mb-1">WhatsApp Support Hours</strong>
                <p className="text-warm-gray leading-relaxed">
                  Monday – Saturday: 10:00 AM – 8:00 PM IST<br />
                  Sunday: 11:00 AM – 5:00 PM IST
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-midnight text-sm mb-1">Pan India Shipping</strong>
                <p className="text-warm-gray leading-relaxed">
                  We fulfill and ship to all serviced PIN codes throughout India. Delivery timelines confirmed individually.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

