import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Heart } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/products/Breadcrumbs';
import { storeConfig } from '../config/store';

export default function AboutPage() {
  return (
    <div className="py-8 md:py-16 bg-cream min-h-screen">
      <SEOHead
        title="About Us"
        description="Learn about Arabian Mens Collection - combining Dubai-inspired luxury menswear aesthetics with timeless Indian festive elegance."
        canonical="/about"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'About Us' },
          ]}
        />

        {/* Hero Section */}
        <div className="text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-gold font-bold">
            Our Heritage & Vision
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-midnight leading-tight">
            About Arabian Mens Collection
          </h1>
          <div className="w-16 h-0.5 bg-gold mx-auto" />
          <p className="text-sm sm:text-base text-warm-gray max-w-2xl mx-auto leading-relaxed font-light">
            Bringing the grandeur of Arabian luxury aesthetics and the precision of modern men's tailoring to distinguished gentlemen across India.
          </p>
        </div>

        {/* Main Story Content */}
        <div className="bg-white p-8 sm:p-12 rounded-xl border border-light-gray shadow-xs space-y-6 text-charcoal leading-relaxed text-sm sm:text-base">
          <h2 className="font-heading text-2xl font-bold text-midnight">
            A New Standard for Everyday & Festive Menswear
          </h2>

          <p>
            Arabian Mens Collection was conceived with a clear ethos: luxury menswear should be accessible, effortlessly wearable, and tailored with utmost respect for the male silhouette. Inspired by the understated opulence of Dubai's fashion avenues and rooted in the celebrations of Indian culture, our catalog is curated for the man who values poise over fleeting trends.
          </p>

          <p>
            Whether it is an Oxford button-down for executive meetings, a relaxed polo for casual weekends, or a regal embroidered kurta for festive family gatherings, each garment is selected for fabric breathability, drape, and enduring craftsmanship.
          </p>

          <div className="my-8 p-6 bg-ivory rounded-lg border-l-4 border-gold italic text-midnight text-sm">
            "We believe true presence is defined not by how loud an outfit speaks, but by the quiet confidence it inspires in the man who wears it."
          </div>

          <h3 className="font-heading text-xl font-bold text-midnight pt-4">
            Direct-to-Customer via WhatsApp
          </h3>

          <p>
            Unlike impersonal e-commerce websites with automated gateways and rigid support tickets, we run an attentive storefront powered by WhatsApp. Our team personally confirms your sizing, advises on fit questions, arranges convenient payment methods, and keeps you updated on dispatch until the package reaches your door.
          </p>
        </div>

        {/* Pillars / Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-light-gray text-center space-y-3">
            <Sparkles className="w-8 h-8 text-gold mx-auto" />
            <h4 className="font-heading text-lg font-bold text-midnight">Curated Distinction</h4>
            <p className="text-xs text-warm-gray leading-relaxed">
              Every design is handpicked for timeless visual appeal, avoiding fast-fashion clichés.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-light-gray text-center space-y-3">
            <Shield className="w-8 h-8 text-gold mx-auto" />
            <h4 className="font-heading text-lg font-bold text-midnight">Verified Sizing</h4>
            <p className="text-xs text-warm-gray leading-relaxed">
              Carefully calibrated size measurements designed specifically for Indian men's comfort.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-light-gray text-center space-y-3">
            <Heart className="w-8 h-8 text-gold mx-auto" />
            <h4 className="font-heading text-lg font-bold text-midnight">Direct Relationship</h4>
            <p className="text-xs text-warm-gray leading-relaxed">
              One-on-one personal attention via WhatsApp for seamless ordering and styling advice.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center pt-6">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-midnight text-gold text-xs uppercase tracking-[0.2em] font-bold rounded shadow hover:bg-black transition-colors"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

