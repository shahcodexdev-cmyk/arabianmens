import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (qty: number) => void;
  max?: number;
}

export default function QuantitySelector({
  quantity,
  onChange,
  max = 10,
}: QuantitySelectorProps) {
  const decrement = () => {
    if (quantity > 1) onChange(quantity - 1);
  };

  const increment = () => {
    if (quantity < max) onChange(quantity + 1);
  };

  return (
    <div className="inline-flex items-center rounded-sm border border-light-gray" role="group" aria-label="Quantity selector">
      <button
        type="button"
        onClick={decrement}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
        className="flex h-10 w-10 items-center justify-center text-midnight transition-colors hover:bg-ivory disabled:cursor-not-allowed disabled:text-gray-300"
      >
        <Minus className="h-4 w-4" />
      </button>

      <span
        className="flex h-10 min-w-[2.5rem] items-center justify-center border-x border-light-gray text-sm font-medium text-midnight"
        aria-live="polite"
        aria-label={`Quantity: ${quantity}`}
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={increment}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        className="flex h-10 w-10 items-center justify-center text-midnight transition-colors hover:bg-ivory disabled:cursor-not-allowed disabled:text-gray-300"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
