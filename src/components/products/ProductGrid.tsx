import { Link } from 'react-router-dom';
import { PackageOpen, RotateCcw } from 'lucide-react';
import type { Product } from '../../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  className?: string;
}

export default function ProductGrid({
  products,
  className = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border border-light-gray">
        <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center text-warm-gray mb-4">
          <PackageOpen className="w-8 h-8 text-gold" strokeWidth={1.5} />
        </div>
        <h3 className="font-heading text-2xl font-bold text-midnight">No Products Found</h3>
        <p className="mt-2 max-w-sm text-xs sm:text-sm text-warm-gray leading-relaxed font-light">
          We couldn't find any products matching your selected filters. Try broadening your criteria or reset filters.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-midnight px-6 py-3 text-xs uppercase tracking-widest font-bold text-gold transition-colors hover:bg-black shadow-md"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </Link>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 md:gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
