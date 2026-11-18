import { useState } from 'react';
import { Ruler, MessageCircle } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/products/Breadcrumbs';
import { getWhatsAppContactUrl } from '../lib/whatsapp';

export default function SizeGuidePage() {
  const [activeTab, setActiveTab] = useState<'shirts' | 'kurtas'>('shirts');

  return (
    <div className="py-8 md:py-16 bg-cream min-h-screen">
      <SEOHead
        title="Size Guide"
        description="Comprehensive sizing chart for men's casual shirts, formal shirts, polo t-shirts, and traditional kurtas at Arabian Mens Collection."
        canonical="/size-guide"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Size Guide' },
          ]}
        />

        <div className="text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            Fit with Precision
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-midnight">
            Men's Size Guide
          </h1>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
          <p className="text-sm text-warm-gray max-w-xl mx-auto font-light leading-relaxed">
            All garments are tailored to standard Indian fit parameters. Use the tables below or consult with us on WhatsApp.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex p-1 bg-white border border-light-gray rounded-lg shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('shirts')}
              className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
                activeTab === 'shirts'
                  ? 'bg-midnight text-gold shadow-xs'
                  : 'text-charcoal hover:text-midnight'
              }`}
            >
              Shirts & T-Shirts
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('kurtas')}
              className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
                activeTab === 'kurtas'
                  ? 'bg-midnight text-gold shadow-xs'
                  : 'text-charcoal hover:text-midnight'
              }`}
            >
              Kurtas & Traditional
            </button>
          </div>
        </div>

        {/* Tables */}
        <div className="bg-white rounded-xl border border-light-gray shadow-xs overflow-hidden p-6 sm:p-8">
          <h2 className="font-heading text-2xl font-bold text-midnight mb-2">
            {activeTab === 'shirts'
              ? 'Western Fit: Shirts, Polos & T-Shirts'
              : 'Traditional Fit: Kurtas & Festive Ensembles'}
          </h2>
          <p className="text-xs text-warm-gray mb-6">All measurements are provided in inches.</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-ivory border-b border-light-gray text-midnight font-heading font-semibold">
                  <th className="p-3">Standard Size</th>
                  <th className="p-3">Chest (in)</th>
                  <th className="p-3">Shoulder (in)</th>
                  <th className="p-3">Garment Length (in)</th>
                  <th className="p-3">Sleeve Length (in)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-gray">
                <tr>
                  <td className="p-3 font-bold text-midnight">S (38)</td>
                  <td className="p-3">38 - 39</td>
                  <td className="p-3">17.5</td>
                  <td className="p-3">{activeTab === 'kurtas' ? '40' : '28'}</td>
                  <td className="p-3">24.5</td>
                </tr>
                <tr className="bg-cream/40">
                  <td className="p-3 font-bold text-midnight">M (40)</td>
                  <td className="p-3">40 - 41</td>
                  <td className="p-3">18.0</td>
                  <td className="p-3">{activeTab === 'kurtas' ? '42' : '29'}</td>
                  <td className="p-3">25.0</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-midnight">L (42)</td>
                  <td className="p-3">42 - 43</td>
                  <td className="p-3">18.5</td>
                  <td className="p-3">{activeTab === 'kurtas' ? '44' : '30'}</td>
                  <td className="p-3">25.5</td>
                </tr>
                <tr className="bg-cream/40">
                  <td className="p-3 font-bold text-midnight">XL (44)</td>
                  <td className="p-3">44 - 45</td>
                  <td className="p-3">19.0</td>
                  <td className="p-3">{activeTab === 'kurtas' ? '45' : '31'}</td>
                  <td className="p-3">26.0</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-midnight">XXL (46)</td>
                  <td className="p-3">46 - 47</td>
                  <td className="p-3">19.5</td>
                  <td className="p-3">{activeTab === 'kurtas' ? '46' : '31.5'}</td>
                  <td className="p-3">26.5</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Measurement Guidelines */}
          <div className="mt-8 p-5 bg-ivory rounded-lg border border-light-gray space-y-2 text-xs text-charcoal">
            <h3 className="font-heading text-sm font-bold text-midnight flex items-center gap-1.5">
              <Ruler className="w-4 h-4 text-gold" />
              <span>How to Measure Correctly</span>
            </h3>
            <p>• <strong>Chest:</strong> Wrap tape horizontally under armpits across the fullest part of your chest.</p>
            <p>• <strong>Shoulder:</strong> Measure straight across the back from the edge of one shoulder bone to the other.</p>
            <p>• <strong>Length:</strong> Measure from the base of the collar seam down to the intended hemline.</p>
          </div>
        </div>

        {/* WhatsApp Personal Fitting Assistance */}
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-light-gray text-center space-y-3">
          <h3 className="font-heading text-xl font-bold text-midnight">
            Need Personal Size Recommendation?
          </h3>
          <p className="text-xs text-warm-gray max-w-md mx-auto">
            Not sure between two sizes? Share your height, weight, or existing shirt size on WhatsApp for a custom recommendation.
          </p>
          <div className="pt-2">
            <a
              href={getWhatsAppContactUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider rounded shadow hover:bg-[#20ba59] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Ask Size Advisor on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

