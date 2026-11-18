import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { searchProducts } from '../../data/products';
import { formatPrice } from '../../config/store';
import type { Product } from '../../types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length > 1) {
      setResults(searchProducts(query).slice(0, 6));
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectProduct = (slug: string) => {
    onClose();
    navigate(`/products/${slug}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-midnight/95 backdrop-blur-md text-white transition-opacity">
      {/* Top Header */}
      <div className="max-w-4xl w-full mx-auto px-4 py-6 flex items-center justify-between border-b border-[#292725]">
        <span className="text-xs uppercase tracking-[0.2em] text-gold font-medium">
          Search Arabian Mens Collection
        </span>
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Close search"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Search Input Box */}
      <div className="max-w-3xl w-full mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product, category, or style..."
            className="w-full bg-transparent border-b-2 border-gold/60 py-4 pl-12 pr-12 text-xl md:text-2xl text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors font-light"
          />
          <Search className="w-6 h-6 text-gold absolute left-1 top-5" />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-4 top-5 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </form>

        {/* Quick Categories */}
        {!query && (
          <div className="mt-8">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-3 font-semibold">
              Popular Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {['Casual Shirts', 'Kurtas', 'Formal Shirts', 'Polo T-Shirts', 'Festive Wear'].map(
                (term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 bg-[#1a1714] text-xs text-gray-300 rounded-full hover:bg-gold hover:text-midnight transition-colors border border-[#332e26]"
                  >
                    {term}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Live Search Results */}
        {results.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wider text-gray-400">
                Matching Products ({results.length})
              </span>
              <button
                type="button"
                onClick={handleSubmit}
                className="text-xs text-gold flex items-center gap-1 hover:underline"
              >
                View all results <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-1">
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product.slug)}
                  className="flex items-center gap-3 p-2 bg-[#121110] border border-[#262420] rounded hover:border-gold cursor-pointer transition-all group"
                >
                  <img
                    src={product.images[0]?.url}
                    alt={product.name}
                    className="w-16 h-20 object-cover rounded bg-charcoal"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate group-hover:text-gold transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gold mt-1 font-semibold">
                      {formatPrice(product.price)}
                    </p>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                      {product.category.replace(/-/g, ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {query.trim().length > 1 && results.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-base">No products found matching "{query}"</p>
            <p className="text-xs text-gray-500 mt-2">
              Try searching with more general terms like "shirt", "kurta", or "black"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

