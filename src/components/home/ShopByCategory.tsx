import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { categories } from '../../data/categories';

export default function ShopByCategory() {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-semibold mb-2">
            Curated Collections
          </p>
          <h2 className="font-heading text-3xl md:text-4xl text-midnight font-bold tracking-tight">
            Shop By Category
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/collections/${category.slug}`}
              className="group relative aspect-[3/4] rounded-lg overflow-hidden shadow-md bg-charcoal border border-[#2b2723] flex flex-col justify-end p-6"
            >
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-90"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/40 to-transparent" />

              <div className="relative z-10 space-y-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">
                  Collection
                </span>
                <h3 className="font-heading text-2xl text-white font-bold group-hover:text-gold transition-colors flex items-center justify-between">
                  <span>{category.name}</span>
                  <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 text-gold" />
                </h3>
                <p className="text-xs text-gray-300 line-clamp-2 font-light">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

