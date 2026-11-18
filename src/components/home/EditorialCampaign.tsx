import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function EditorialCampaign() {
  return (
    <section className="bg-midnight text-white overflow-hidden border-b border-[#24211e]">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left: Image */}
        <div className="relative min-h-[420px] lg:min-h-[580px] w-full">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1000&q=80"
            alt="Editorial Campaign - Contemporary Menswear"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-midnight/80 via-transparent to-transparent" />
        </div>

        {/* Right: Editorial Content */}
        <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16 space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
              The Autumn / Festive Lookbook
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              A New Standard of <br />
              <span className="text-gold italic font-normal">Everyday Elegance.</span>
            </h2>
          </div>

          <p className="text-gray-300 text-sm md:text-base leading-relaxed font-light max-w-lg">
            True luxury is wearing clothes that command respect effortlessly. Arabian Mens Collection creates impeccably balanced menswear designed for modern Indian lifestyles — crisp fabrics that breathe, cuts that flatter, and finishes that endure.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-gray-300">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span>High-thread-count cotton and rich textural weaves</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-300">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span>Tailored silhouettes providing both ease and authority</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-300">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span>Seamless direct order confirmation via WhatsApp</span>
            </div>
          </div>

          <div className="pt-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-midnight font-bold text-xs uppercase tracking-[0.2em] rounded hover:bg-gold-light transition-all shadow-md group"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

