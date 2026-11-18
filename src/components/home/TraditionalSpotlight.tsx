import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function TraditionalSpotlight() {
  return (
    <section className="relative py-24 bg-midnight text-white overflow-hidden border-b border-[#2b2723]">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1200&q=80"
          alt="Traditional Indian Menswear"
          className="w-full h-full object-cover opacity-25"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/90 to-midnight/80" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Festive & Occasion Spotlight</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Heritage Craft. <br />
            <span className="text-gold italic font-normal">Contemporary Panache.</span>
          </h2>

          <p className="text-gray-300 text-sm md:text-base leading-relaxed font-light">
            Whether preparing for Eid gatherings, family weddings, or cultural celebrations, our Kurtas & Traditional Collection honors traditional roots with modern cuts and refined embroideries.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              to="/collections/kurtas-traditional-wear"
              className="px-8 py-4 bg-gold text-midnight font-bold text-xs uppercase tracking-[0.2em] rounded hover:bg-gold-light transition-all flex items-center gap-2 group shadow-lg"
            >
              <span>Explore Kurtas & Traditional</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

