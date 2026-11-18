interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSelect: (size: string) => void;
  availableSizes: string[];
}

export default function SizeSelector({
  sizes,
  selectedSize,
  onSelect,
  availableSizes,
}: SizeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select size">
      {sizes.map((size) => {
        const isAvailable = availableSizes.includes(size);
        const isSelected = selectedSize === size;

        return (
          <button
            key={size}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={`Size ${size}${!isAvailable ? ' (unavailable)' : ''}`}
            disabled={!isAvailable}
            onClick={() => isAvailable && onSelect(size)}
            className={`inline-flex min-w-[3rem] items-center justify-center rounded-sm border px-3 h-10 text-sm font-medium transition-all ${
              isSelected
                ? 'border-gold bg-midnight text-white'
                : isAvailable
                  ? 'border-light-gray bg-white text-midnight hover:border-gold'
                  : 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-300 line-through'
            }`}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
