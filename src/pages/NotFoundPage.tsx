import { Link } from 'react-router-dom';
import { Home, ShoppingBag } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';

export default function NotFoundPage() {
  return (
    <div className="py-24 bg-cream min-h-[75vh] flex flex-col items-center justify-center px-4 text-center">
      <SEOHead title="Page Not Found (404)" />

      <span className="font-heading text-7xl sm:text-9xl font-bold text-gold tracking-widest">
        404
      </span>

      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-midnight mt-4 mb-2">
        Page Not Found
      </h1>

      <p className="text-warm-gray text-xs sm:text-sm max-w-md mx-auto mb-8 font-light leading-relaxed">
        The destination you are seeking might have been moved, renamed, or is temporarily unavailable.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-midnight text-gold text-xs uppercase tracking-[0.2em] font-bold rounded shadow hover:bg-black transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>

        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-white border border-charcoal text-midnight text-xs uppercase tracking-[0.2em] font-semibold rounded hover:bg-ivory transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Browse Shop</span>
        </Link>
      </div>
    </div>
  );
}

