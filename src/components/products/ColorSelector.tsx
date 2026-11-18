import type { ProductColor } from '../../types';

interface ColorSelectorProps {
  colors: ProductColor[];
  selectedColor: string;
  onSelect: (color: string) => void;
}

export default function ColorSelector({
  colors,
  selectedColor,
  onSelect,
}: ColorSelectorProps) {
  const isLightColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.85;
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Select color">
        {colors.map((color) => {
          const isSelected = selectedColor === color.name;
          const light = isLightColor(color.hex);

          return (
            <button
              key={color.name}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`Color: ${color.name}`}
              title={color.name}
              onClick={() => onSelect(color.name)}
              className={`h-8 w-8 rounded-full transition-all ${
                isSelected
                  ? 'ring-2 ring-gold ring-offset-2'
                  : 'hover:ring-2 hover:ring-warm-gray hover:ring-offset-1'
              } ${light ? 'border border-light-gray' : ''}`}
              style={{ backgroundColor: color.hex }}
            />
          );
        })}
      </div>
      {selectedColor && (
        <p className="mt-2 text-sm text-warm-gray">
          Color: <span className="font-medium text-midnight">{selectedColor}</span>
        </p>
      )}
    </div>
  );
}
