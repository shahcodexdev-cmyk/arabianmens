import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { storeConfig } from '../../config/store';

export default function HeroBanner() {
  return (
    <section className="relative bg-midnight text-white overflow-hidden border-b border-[#2b2723]">
      {/* Background decoration elements */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gold/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gold/20 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1916] border border-gold/40 text-gold text-xs uppercase tracking-[0.2em] font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Upscale Menswear Boutique</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              Elevate Your Style. <br />
              <span className="text-gold italic font-normal">Define Your Presence.</span>
            </h1>

            <p className="text-gray-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              Discover refined menswear inspired by luxury aesthetics — tailored for everyday confidence, festive celebrations, and distinguished occasions.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/shop"
                className="w-full sm:w-auto px-8 py-4 bg-gold text-midnight font-bold text-xs uppercase tracking-[0.2em] rounded-md shadow-lg hover:bg-gold-light transition-all flex items-center justify-center gap-2 group"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                to="/collections/kurtas-traditional-wear"
                className="w-full sm:w-auto px-8 py-4 border border-gold/60 text-white font-medium text-xs uppercase tracking-[0.2em] rounded-md hover:border-gold hover:text-gold transition-colors flex items-center justify-center"
              >
                Festive & Kurtas
              </Link>
            </div>

            {/* Features micro-row */}
            <div className="pt-8 border-t border-[#26231f] grid grid-cols-3 gap-4 text-center lg:text-left max-w-md mx-auto lg:mx-0">
              <div>
                <span className="block font-heading text-xl md:text-2xl text-gold font-bold">100%</span>
                <span className="block text-[11px] text-gray-400 uppercase tracking-wider">Premium Cuts</span>
              </div>
              <div>
                <span className="block font-heading text-xl md:text-2xl text-gold font-bold">Direct</span>
                <span className="block text-[11px] text-gray-400 uppercase tracking-wider">WhatsApp Orders</span>
              </div>
              <div>
                <span className="block font-heading text-xl md:text-2xl text-gold font-bold">Pan India</span>
                <span className="block text-[11px] text-gray-400 uppercase tracking-wider">Shipping</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-xl overflow-hidden shadow-2xl border border-gold/30 group">
              <img
                src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80"
                alt="Arabian Mens Collection Model"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/20 to-transparent" />

              {/* Float badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-lg bg-midnight/90 backdrop-blur-md border border-gold/40">
                <div className="flex items-center gap-3">
                  <img
                    src={storeConfig.logoPath}
                    alt="Logo"
                    className="w-10 h-10 object-contain rounded"
                  />
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gold font-semibold">
                      New Season 2026
                    </p>
                    <p className="text-sm font-heading text-white">
                      Modern Silhouettes & Heritage Kurtas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

