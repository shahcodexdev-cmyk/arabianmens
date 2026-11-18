import { useEffect } from 'react';
import { X } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export default function SizeGuideModal({
  isOpen,
  onClose,
  category = 'shirts',
}: SizeGuideModalProps) {
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

  const isKurta = category.includes('kurta');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-light-gray bg-midnight text-white">
          <div>
            <h3 className="font-heading text-lg tracking-wide">
              {isKurta ? "Kurtas & Traditional Size Guide" : "Shirts & T-Shirts Size Guide"}
            </h3>
            <p className="text-xs text-gold">All measurements in inches</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-ivory border-b border-light-gray text-midnight font-heading font-semibold">
                  <th className="p-3">Size</th>
                  <th className="p-3">Chest (in)</th>
                  <th className="p-3">Shoulder (in)</th>
                  <th className="p-3">Length (in)</th>
                  <th className="p-3">{isKurta ? 'Kurta Sleeve (in)' : 'Sleeve (in)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-gray">
                <tr>
                  <td className="p-3 font-bold text-midnight">S (38)</td>
                  <td className="p-3">38 - 39</td>
                  <td className="p-3">17.5</td>
                  <td className="p-3">{isKurta ? '40' : '28'}</td>
                  <td className="p-3">24.5</td>
                </tr>
                <tr className="bg-cream/40">
                  <td className="p-3 font-bold text-midnight">M (40)</td>
                  <td className="p-3">40 - 41</td>
                  <td className="p-3">18.0</td>
                  <td className="p-3">{isKurta ? '42' : '29'}</td>
                  <td className="p-3">25.0</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-midnight">L (42)</td>
                  <td className="p-3">42 - 43</td>
                  <td className="p-3">18.5</td>
                  <td className="p-3">{isKurta ? '44' : '30'}</td>
                  <td className="p-3">25.5</td>
                </tr>
                <tr className="bg-cream/40">
                  <td className="p-3 font-bold text-midnight">XL (44)</td>
                  <td className="p-3">44 - 45</td>
                  <td className="p-3">19.0</td>
                  <td className="p-3">{isKurta ? '45' : '31'}</td>
                  <td className="p-3">26.0</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-midnight">XXL (46)</td>
                  <td className="p-3">46 - 47</td>
                  <td className="p-3">19.5</td>
                  <td className="p-3">{isKurta ? '46' : '31.5'}</td>
                  <td className="p-3">26.5</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-ivory/60 p-4 rounded-md border border-light-gray text-xs space-y-1.5 text-warm-gray">
            <h4 className="font-semibold text-charcoal">How to Measure:</h4>
            <p>• <strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.</p>
            <p>• <strong>Shoulder:</strong> Measure from one shoulder tip across the back to the other.</p>
            <p>• <strong>Length:</strong> Measure from the highest point of the shoulder down to the hem.</p>
            <p className="pt-2 text-[11px] italic">
              * Note: Fit may vary slightly depending on garment silhouette and fabric stretch. For customized size advice, feel free to chat with us on WhatsApp.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-light-gray bg-cream text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-midnight text-gold text-xs font-semibold rounded hover:bg-black transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}

