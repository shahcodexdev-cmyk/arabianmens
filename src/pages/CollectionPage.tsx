import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, Grid3X3, LayoutGrid } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/products/Breadcrumbs';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilters from '../components/products/ProductFilters';
import MobileFilterDrawer from '../components/products/MobileFilterDrawer';
import SortDropdown from '../components/products/SortDropdown';
import { products } from '../data/products';
import { getCategoryBySlug } from '../data/categories';
import type { FilterState, SortOption } from '../types';

export default function CollectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = getCategoryBySlug(slug || '');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [gridColumns, setGridColumns] = useState<'normal' | 'compact'>('normal');

  const [sort, setSort] = useState<SortOption>('featured');
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: null,
    sizes: [],
    colors: [],
    availability: 'all',
  });

  const handleClear = () => {
    setFilters({
      categories: [],
      priceRange: null,
      sizes: [],
      colors: [],
      availability: 'all',
    });
  };

  if (!category) {
    return (
      <div className="py-24 text-center bg-cream min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="font-heading text-3xl font-bold text-midnight mb-4">
          Collection Not Found
        </h1>
        <p className="text-warm-gray text-sm mb-6">
          The requested collection could not be found.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3.5 bg-midnight text-gold text-xs uppercase tracking-widest font-semibold rounded-xl"
        >
          Browse All Collections
        </Link>
      </div>
    );
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (product.category !== category.slug) return false;

      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        if (product.price < min || product.price > max) return false;
      }

      if (filters.sizes.length > 0) {
        const hasSize = product.sizes.some((s) => filters.sizes.includes(s));
        if (!hasSize) return false;
      }

      if (filters.colors.length > 0) {
        const hasColor = product.colors.some((c) =>
          filters.colors.includes(c.name)
        );
        if (!hasColor) return false;
      }

      if (filters.availability === 'in-stock' && !product.available) {
        return false;
      }

      return true;
    });
  }, [category.slug, filters]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sort) {
      case 'newest':
        return list.filter((p) => p.newArrival).concat(list.filter((p) => !p.newArrival));
      case 'price-low-high':
        return list.sort((a, b) => a.price - b.price);
      case 'price-high-low':
        return list.sort((a, b) => b.price - a.price);
      case 'name-az':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'featured':
      default:
        return list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }
  }, [filteredProducts, sort]);

  return (
    <div className="py-6 sm:py-10 bg-[#FAF7F2] min-h-screen">
      <SEOHead
        title={category.seoTitle}
        description={category.seoDescription}
        canonical={`/collections/${category.slug}`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shop', href: '/shop' },
            { label: category.name },
          ]}
        />

        {/* Editorial Collection Banner with Script Typography (Zanerobe style) */}
        <div className="relative bg-midnight text-white my-6 overflow-hidden rounded-2xl shadow-xl border border-[#2b2723]">
          <div className="absolute inset-0 z-0">
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover object-center opacity-40 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/80 to-transparent" />
          </div>

          <div className="relative z-10 px-8 py-14 sm:py-20 max-w-2xl space-y-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">
              Signature Collection
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
              {category.name}
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm font-light leading-relaxed max-w-lg">
              {category.description}
            </p>
          </div>
        </div>

        {/* Controls Bar (Drexel Style) */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-8 bg-white rounded-2xl border border-light-gray shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-cream border border-light-gray rounded-xl text-xs font-bold text-charcoal hover:border-gold transition-colors"
            >
              <Filter className="w-3.5 h-3.5 text-gold" />
              <span>Filters</span>
            </button>

            <span className="text-xs text-warm-gray font-medium">
              Showing <strong className="text-midnight">{sortedProducts.length}</strong> items in {category.name}
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="hidden sm:flex items-center border border-light-gray rounded-xl overflow-hidden p-0.5 bg-cream">
              <button
                type="button"
                onClick={() => setGridColumns('normal')}
                className={`p-1.5 rounded-lg transition-colors ${
                  gridColumns === 'normal' ? 'bg-white text-midnight shadow-xs' : 'text-warm-gray hover:text-midnight'
                }`}
                title="Standard 3 Columns"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setGridColumns('compact')}
                className={`p-1.5 rounded-lg transition-colors ${
                  gridColumns === 'compact' ? 'bg-white text-midnight shadow-xs' : 'text-warm-gray hover:text-midnight'
                }`}
                title="Compact 4 Columns"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>

            <SortDropdown value={sort} onChange={setSort} />
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <div className="hidden lg:block lg:col-span-1 sticky top-28">
            <ProductFilters
              filters={filters}
              onFilterChange={setFilters}
              onClear={handleClear}
            />
          </div>

          <div className="lg:col-span-3">
            <ProductGrid
              products={sortedProducts}
              className={
                gridColumns === 'compact'
                  ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                  : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3'
              }
            />
          </div>
        </div>
      </div>

      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onClear={handleClear}
        resultsCount={sortedProducts.length}
      />
    </div>
  );
}
