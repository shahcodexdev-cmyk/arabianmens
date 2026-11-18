import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid3X3, LayoutGrid } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/products/Breadcrumbs';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilters from '../components/products/ProductFilters';
import MobileFilterDrawer from '../components/products/MobileFilterDrawer';
import SortDropdown from '../components/products/SortDropdown';
import { products } from '../data/products';
import type { FilterState, SortOption, CategorySlug } from '../types';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [gridColumns, setGridColumns] = useState<'normal' | 'compact'>('normal');

  const initialCategory = searchParams.get('category') as CategorySlug | null;
  const initialSort = (searchParams.get('sort') as SortOption) || 'featured';

  const [sort, setSort] = useState<SortOption>(initialSort);
  const [filters, setFilters] = useState<FilterState>({
    categories: initialCategory ? [initialCategory] : [],
    priceRange: null,
    sizes: [],
    colors: [],
    availability: 'all',
  });

  useEffect(() => {
    const cat = searchParams.get('category') as CategorySlug | null;
    if (cat && !filters.categories.includes(cat)) {
      setFilters((prev) => ({ ...prev, categories: [cat] }));
    }
  }, [searchParams]);

  const handleClear = () => {
    setFilters({
      categories: [],
      priceRange: null,
      sizes: [],
      colors: [],
      availability: 'all',
    });
    setSearchParams({});
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(product.category)
      ) {
        return false;
      }

      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        if (product.price < min || product.price > max) {
          return false;
        }
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
  }, [filters]);

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
        title="Shop All Menswear Collections"
        description="Browse all men's fashion items from Arabian Mens Collection. Shirts, Kurtas, T-shirts, and tailored clothing with direct WhatsApp ordering."
        canonical="/shop"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shop All' },
          ]}
        />

        {/* Minimalist Editorial Banner (Drexel / Zanerobe Style) */}
        <div className="mt-4 mb-8 bg-white border border-light-gray rounded-2xl p-8 sm:p-12 text-center shadow-xs">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">
            Curated Catalogue
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-midnight mt-1">
            All Collections
          </h1>
          <p className="text-xs sm:text-sm text-warm-gray max-w-lg mx-auto mt-2 font-light leading-relaxed">
            Discover refined silhouettes, premium combed cottons, and festive kurtas crafted for timeless personal presence.
          </p>
        </div>

        {/* Controls Bar (Drexel Style: Filter trigger + results counter + layout toggle + sort) */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-8 bg-white rounded-2xl border border-light-gray shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-cream border border-light-gray rounded-xl text-xs font-bold text-charcoal hover:border-gold transition-colors"
            >
              <Filter className="w-3.5 h-3.5 text-gold" />
              <span>
                Filters ({filters.categories.length + filters.sizes.length + filters.colors.length + (filters.priceRange ? 1 : 0)})
              </span>
            </button>

            <span className="text-xs text-warm-gray font-medium">
              Showing <strong className="text-midnight">{sortedProducts.length}</strong> of {products.length} products
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* View toggle (desktop) */}
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

        {/* 2-Column Layout: Sidebar Filters + Uniform Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar (Drexel style) */}
          <div className="hidden lg:block lg:col-span-1 sticky top-28">
            <ProductFilters
              filters={filters}
              onFilterChange={setFilters}
              onClear={handleClear}
            />
          </div>

          {/* Product Grid Area */}
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

      {/* Mobile Filter Slide Drawer */}
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
