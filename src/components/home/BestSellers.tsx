import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getBestSellers } from '../../data/products';
import ProductCard from '../products/ProductCard';

export default function BestSellers() {
  const bestSellers = getBestSellers().slice(0, 4);

  return (
    <section className="py-20 bg-cream border-b border-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gold font-semibold mb-2">
              Customer Favorites
            </p>
            <h2 className="font-heading text-3xl md:text-4xl text-midnight font-bold tracking-tight">
              Best Sellers
            </h2>
            <p className="text-[11px] text-warm-gray mt-1">
              Curated selection based on our most requested WhatsApp orders
            </p>
          </div>

          <Link
            to="/shop"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-midnight font-semibold hover:text-gold transition-colors group"
          >
            <span>Explore All Pieces</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-gold" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

