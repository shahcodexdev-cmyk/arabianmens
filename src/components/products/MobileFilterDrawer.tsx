import { useEffect } from 'react';
import { X } from 'lucide-react';
import ProductFilters from './ProductFilters';
import type { FilterState } from '../../types';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClear: () => void;
  resultsCount: number;
}

export default function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClear,
  resultsCount,
}: MobileFilterDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-xs bg-white text-charcoal flex flex-col h-full z-10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-light-gray bg-midnight text-white">
          <h2 className="text-base font-heading tracking-wide">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filters */}
        <div className="flex-1 overflow-y-auto p-4">
          <ProductFilters
            filters={filters}
            onFilterChange={onFilterChange}
            onClear={onClear}
          />
        </div>

        {/* Action Button Footer */}
        <div className="p-4 border-t border-light-gray bg-cream flex gap-3">
          <button
            type="button"
            onClick={onClear}
            className="flex-1 py-3 px-3 border border-charcoal text-center text-xs uppercase tracking-wider font-semibold hover:bg-gray-100 rounded"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-2 py-3 px-4 bg-midnight text-gold text-center text-xs uppercase tracking-wider font-bold rounded shadow"
          >
            Show {resultsCount} Items
          </button>
        </div>
      </div>
    </div>
  );
}

