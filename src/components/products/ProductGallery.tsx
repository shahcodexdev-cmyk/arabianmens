import { useState, useRef } from 'react';
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProductImage } from '../../types';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[3/4] w-full bg-[#F3EFE6] rounded-2xl flex items-center justify-center text-warm-gray">
        No image available
      </div>
    );
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50 && activeIndex < images.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
    if (distance < -50 && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 lg:gap-6 items-start">
      {/* Vertical Thumbnails Column on Desktop (Velora PDP style) */}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[640px] w-full md:w-24 flex-shrink-0 scrollbar-thin py-1">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-16 sm:w-20 md:w-24 aspect-[3/4] rounded-xl overflow-hidden bg-[#F3EFE6] transition-all duration-200 border-2 ${
                activeIndex === idx
                  ? 'border-gold shadow-md scale-95 ring-1 ring-gold'
                  : 'border-transparent opacity-70 hover:opacity-100 hover:border-light-gray'
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <img
                src={img.url}
                alt={img.alt || `Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Large Display Canvas */}
      <div
        className="relative flex-1 w-full aspect-[3/4] bg-[#F3EFE6] rounded-2xl overflow-hidden shadow-sm border border-light-gray/60 group select-none cursor-crosshair"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={images[activeIndex]?.url}
          alt={images[activeIndex]?.alt || `${productName} view ${activeIndex + 1}`}
          className={`w-full h-full object-cover object-center transition-all duration-300 ${
            isZoomed ? 'scale-150 origin-top-left' : 'scale-100'
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                }
              : undefined
          }
          loading="eager"
        />

        {/* Counter & Zoom Badge */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 pointer-events-none z-10">
          <div className="p-2 rounded-full bg-white/80 backdrop-blur-md text-charcoal shadow-sm">
            <ZoomIn className="w-4 h-4" />
          </div>
          {images.length > 1 && (
            <span className="bg-midnight/80 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
              {activeIndex + 1} / {images.length}
            </span>
          )}
        </div>

        {/* Desktop Prev / Next Buttons */}
        {images.length > 1 && (
          <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              disabled={activeIndex === 0}
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((prev) => Math.max(0, prev - 1));
              }}
              className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-midnight shadow-md hover:bg-gold hover:text-midnight transition-all pointer-events-auto disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={activeIndex === images.length - 1}
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((prev) => Math.min(images.length - 1, prev + 1));
              }}
              className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-midnight shadow-md hover:bg-gold hover:text-midnight transition-all pointer-events-auto disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
