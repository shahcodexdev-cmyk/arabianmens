import { useState } from 'react';
import { X, Truck, MessageCircle } from 'lucide-react';
import { storeConfig } from '../../config/store';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || !storeConfig.announcementBar) return null;

  return (
    <div
      className="bg-midnight text-white text-[11px] sm:text-xs py-2 px-4 border-b border-[#221f1c] relative z-50 select-none"
      role="banner"
      aria-label="Store announcement"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-1.5 text-gold font-medium">
          <Truck className="w-3.5 h-3.5" />
          <span>Pan-India Shipping via WhatsApp Orders</span>
        </div>

        <p className="flex-1 text-center font-medium tracking-wide text-gray-200">
          {storeConfig.announcementBar}
        </p>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-gold font-bold uppercase tracking-wider">
            <span>INR (₹)</span>
          </span>

          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            aria-label="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
