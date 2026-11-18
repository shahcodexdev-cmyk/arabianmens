import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import Breadcrumbs from '../components/products/Breadcrumbs';
import ProductGrid from '../components/products/ProductGrid';
import { searchProducts } from '../data/products';
import type { Product } from '../types';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    setQuery(queryParam);
    if (queryParam.trim()) {
      setResults(searchProducts(queryParam));
    } else {
      setResults([]);
    }
  }, [queryParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  return (
    <div className="py-8 md:py-12 bg-cream min-h-screen">
      <SEOHead
        title={queryParam ? `Search: "${queryParam}"` : 'Search Products'}
        description="Search for men's shirts, kurtas, polo t-shirts and traditional wear at Arabian Mens Collection."
        canonical="/search"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Search Results' },
          ]}
        />

        <div className="max-w-2xl mx-auto mt-6 mb-12 text-center">
          <h1 className="font-heading text-3xl font-bold text-midnight mb-4">
            Search Collections
          </h1>

          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search shirts, kurtas, colors, or materials..."
              className="w-full pl-12 pr-28 py-3.5 bg-white border border-light-gray rounded-lg text-sm text-charcoal focus:outline-none focus:border-gold shadow-xs"
            />
            <Search className="w-5 h-5 text-gold absolute left-4" />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2 bg-midnight text-gold text-xs uppercase tracking-wider font-semibold rounded hover:bg-black transition-colors"
            >
              Search
            </button>
          </form>

          {queryParam && (
            <p className="text-xs text-warm-gray mt-4">
              Found <strong>{results.length}</strong> {results.length === 1 ? 'product' : 'products'} for "
              <strong className="text-midnight">{queryParam}</strong>"
            </p>
          )}
        </div>

        {/* Results Grid */}
        <ProductGrid products={results} />
      </div>
    </div>
  );
}

