import { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/products/Breadcrumbs';
import { getWhatsAppContactUrl } from '../lib/whatsapp';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I place an order?',
      a: 'Add items to your cart, fill your delivery address at checkout, and tap place order. Your order summary automatically opens in WhatsApp with our store team for instant confirmation!',
    },
    {
      q: 'Why do you not have a traditional credit card payment gateway?',
      a: 'We prioritize a personalized luxury shopping experience. By handling orders directly on WhatsApp, our boutique consultants can double-check sizes, ensure fabric expectations are met, and provide personalized updates without third-party gateway transaction friction.',
    },
    {
      q: 'What payment modes are accepted on WhatsApp?',
      a: 'We accept UPI (Google Pay, PhonePe, Paytm, BHIM), direct bank transfers (NEFT/IMPS), and other convenient payment arrangements confirmed directly with our store team in the chat.',
    },
    {
      q: 'How long does delivery take across India?',
      a: 'Standard dispatch occurs within 24 to 48 hours of order confirmation. Shipments generally arrive within 3 to 6 working days depending on your destination city and state.',
    },
    {
      q: 'How do I choose the right size?',
      a: 'We provide an accurate Size Guide for both Western cuts (shirts/polos) and traditional wear (kurtas). If you are between sizes or have specific chest/shoulder requirements, send your measurements to us on WhatsApp, and our team will recommend the ideal fit.',
    },
    {
      q: 'What is your exchange and return policy?',
      a: 'We offer hassle-free size exchanges if the garment does not fit as desired. Simply notify us on WhatsApp within 48 hours of receiving the shipment with photos of the unwashed, unworn product with original tags attached.',
    },
    {
      q: 'Are the product colors and fabrics accurate to the photos?',
      a: 'All our photographs are shot under true studio lighting to present colors as authentically as possible. Note that subtle tone variations can occur depending on your mobile screen or display settings.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="py-8 md:py-16 bg-cream min-h-screen">
      <SEOHead
        title="Frequently Asked Questions"
        description="Common questions about placing orders on WhatsApp, sizing, delivery timelines, and payment methods at Arabian Mens Collection."
        canonical="/faq"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'FAQ' },
          ]}
        />

        <div className="text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            Answers & Guidance
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-midnight">
            Frequently Asked Questions
          </h1>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
          <p className="text-sm text-warm-gray max-w-xl mx-auto font-light leading-relaxed">
            Everything you need to know about our WhatsApp boutique ordering experience.
          </p>
        </div>

        {/* Accordions */}
        <div className="bg-white rounded-xl border border-light-gray shadow-xs divide-y divide-light-gray overflow-hidden">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="p-6 transition-colors hover:bg-ivory/30">
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between text-left gap-4"
                >
                  <span className="font-heading text-base sm:text-lg font-bold text-midnight">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gold flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-warm-gray flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-3 text-xs sm:text-sm text-warm-gray leading-relaxed font-light">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="bg-midnight text-white p-8 rounded-xl text-center space-y-4 border border-[#2b2723]">
          <h3 className="font-heading text-2xl font-bold">Have another question?</h3>
          <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto font-light leading-relaxed">
            Our WhatsApp boutique advisors are happy to assist with any fit, styling, or delivery queries.
          </p>
          <a
            href={getWhatsAppContactUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider rounded shadow hover:bg-[#20ba59] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}

