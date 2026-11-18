import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import type { SortOption } from '../../types';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const sortLabels: Record<SortOption, string> = {
  featured: 'Featured',
  newest: 'Newest Arrivals',
  'price-low-high': 'Price: Low to High',
  'price-high-low': 'Price: High to Low',
  'name-az': 'Name: A to Z',
};

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options: SortOption[] = [
    'featured',
    'newest',
    'price-low-high',
    'price-high-low',
    'name-az',
  ];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-between gap-2 px-3.5 py-2 text-xs font-medium text-charcoal bg-white border border-light-gray rounded-md hover:border-gold transition-colors shadow-2xs"
      >
        <span>
          Sort by: <strong className="text-midnight">{sortLabels[value]}</strong>
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-warm-gray" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-light-gray rounded-md shadow-lg z-20 py-1">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                value === option
                  ? 'bg-midnight text-gold font-bold'
                  : 'text-charcoal hover:bg-ivory'
              }`}
            >
              {sortLabels[option]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

