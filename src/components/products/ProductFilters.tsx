import { useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { categories } from '../../data/categories';
import { getAllSizes, getAllColors, products } from '../../data/products';
import type { FilterState, CategorySlug } from '../../types';

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClear: () => void;
}

export default function ProductFilters({
  filters,
  onFilterChange,
  onClear,
}: ProductFiltersProps) {
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    size: true,
    color: true,
    availability: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const allSizes = getAllSizes();
  const allColors = getAllColors();

  const handleCategoryToggle = (slug: CategorySlug) => {
    const nextCategories = filters.categories.includes(slug)
      ? filters.categories.filter((c) => c !== slug)
      : [...filters.categories, slug];
    onFilterChange({ ...filters, categories: nextCategories });
  };

  const handleSizeToggle = (size: string) => {
    const nextSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFilterChange({ ...filters, sizes: nextSizes });
  };

  const handleColorToggle = (colorName: string) => {
    const nextColors = filters.colors.includes(colorName)
      ? filters.colors.filter((c) => c !== colorName)
      : [...filters.colors, colorName];
    onFilterChange({ ...filters, colors: nextColors });
  };

  const priceRanges: Array<{ label: string; range: [number, number] }> = [
    { label: 'Under ₹1,000', range: [0, 999] },
    { label: '₹1,000 – ₹1,999', range: [1000, 1999] },
    { label: '₹2,000 – ₹2,999', range: [2000, 2999] },
    { label: '₹3,000 & Above', range: [3000, 100000] },
  ];

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.priceRange !== null ||
    filters.availability !== 'all';

  return (
    <div className="bg-white p-6 rounded-2xl border border-light-gray shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-light-gray">
        <h3 className="font-heading text-lg text-midnight font-bold tracking-wide">
          Filter By
        </h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-gold hover:text-midnight transition-colors font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      {/* Category Filter with Counts (Drexel style) */}
      <div className="border-b border-light-gray pb-4">
        <button
          type="button"
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-charcoal mb-3"
        >
          <span>Collections</span>
          {openSections.category ? (
            <ChevronUp className="w-4 h-4 text-warm-gray" />
          ) : (
            <ChevronDown className="w-4 h-4 text-warm-gray" />
          )}
        </button>
        {openSections.category && (
          <div className="space-y-2.5 pt-1">
            {categories.map((cat) => {
              const count = products.filter((p) => p.category === cat.slug).length;
              const isChecked = filters.categories.includes(cat.slug);
              return (
                <label
                  key={cat.slug}
                  className="flex items-center justify-between text-xs text-charcoal hover:text-midnight cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCategoryToggle(cat.slug)}
                      className="rounded border-gray-300 text-midnight focus:ring-midnight w-4 h-4"
                    />
                    <span className={isChecked ? 'font-bold text-midnight' : 'font-normal'}>
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-warm-gray bg-cream px-2 py-0.5 rounded-full font-medium">
                    {count}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border-b border-light-gray pb-4">
        <button
          type="button"
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-charcoal mb-3"
        >
          <span>Price Range</span>
          {openSections.price ? (
            <ChevronUp className="w-4 h-4 text-warm-gray" />
          ) : (
            <ChevronDown className="w-4 h-4 text-warm-gray" />
          )}
        </button>
        {openSections.price && (
          <div className="space-y-2 pt-1">
            {priceRanges.map((pr) => {
              const isChecked =
                filters.priceRange?.[0] === pr.range[0] &&
                filters.priceRange?.[1] === pr.range[1];
              return (
                <label
                  key={pr.label}
                  className="flex items-center gap-2.5 text-xs text-charcoal hover:text-midnight cursor-pointer select-none"
                >
                  <input
                    type="radio"
                    name="priceRange"
                    checked={isChecked}
                    onChange={() =>
                      onFilterChange({
                        ...filters,
                        priceRange: isChecked ? null : pr.range,
                      })
                    }
                    onClick={() => {
                      if (isChecked) {
                        onFilterChange({ ...filters, priceRange: null });
                      }
                    }}
                    className="border-gray-300 text-midnight focus:ring-midnight w-4 h-4"
                  />
                  <span className={isChecked ? 'font-bold text-midnight' : 'font-normal'}>
                    {pr.label}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Size Filter */}
      <div className="border-b border-light-gray pb-4">
        <button
          type="button"
          onClick={() => toggleSection('size')}
          className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-charcoal mb-3"
        >
          <span>Size Options</span>
          {openSections.size ? (
            <ChevronUp className="w-4 h-4 text-warm-gray" />
          ) : (
            <ChevronDown className="w-4 h-4 text-warm-gray" />
          )}
        </button>
        {openSections.size && (
          <div className="flex flex-wrap gap-2 pt-1">
            {allSizes.map((size) => {
              const isSelected = filters.sizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeToggle(size)}
                  className={`min-w-10 h-10 text-xs font-bold rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-midnight text-white border-midnight shadow-xs'
                      : 'bg-cream text-charcoal border-light-gray hover:border-midnight'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className="border-b border-light-gray pb-4">
        <button
          type="button"
          onClick={() => toggleSection('color')}
          className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-charcoal mb-3"
        >
          <span>Color Options</span>
          {openSections.color ? (
            <ChevronUp className="w-4 h-4 text-warm-gray" />
          ) : (
            <ChevronDown className="w-4 h-4 text-warm-gray" />
          )}
        </button>
        {openSections.color && (
          <div className="flex flex-wrap gap-2.5 pt-1">
            {allColors.map((color) => {
              const isSelected = filters.colors.includes(color.name);
              return (
                <button
                  key={color.name}
                  type="button"
                  title={color.name}
                  onClick={() => handleColorToggle(color.name)}
                  className={`w-7 h-7 rounded-full border border-gray-300 relative transition-transform ${
                    isSelected ? 'ring-2 ring-midnight ring-offset-2 scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  <span className="sr-only">{color.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Availability */}
      <div>
        <label className="flex items-center gap-2.5 text-xs text-charcoal hover:text-midnight cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.availability === 'in-stock'}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                availability: e.target.checked ? 'in-stock' : 'all',
              })
            }
            className="rounded border-gray-300 text-midnight focus:ring-midnight w-4 h-4"
          />
          <span className="font-semibold">In Stock Items Only</span>
        </label>
      </div>
    </div>
  );
}
