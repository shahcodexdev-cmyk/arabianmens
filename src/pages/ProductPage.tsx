import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingBag,
  MessageCircle,
  Ruler,
  Check,
  Truck,
  ShieldCheck,
  RefreshCw,
  Heart,
  Sparkles,
  Layers,
  ArrowRight,
  Clock,
} from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import StructuredData from '../components/seo/StructuredData';
import Breadcrumbs from '../components/products/Breadcrumbs';
import ProductGallery from '../components/products/ProductGallery';
import SizeGuideModal from '../components/products/SizeGuideModal';
import ProductCard from '../components/products/ProductCard';
import { getProductBySlug, getProductsByCategory } from '../data/products';
import { formatPrice, getDiscountPercentage, storeConfig } from '../config/store';
import { useCart } from '../context/CartContext';
import { generateProductOrderMessage, generateWhatsAppUrl } from '../lib/whatsapp';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || '');
  const { addItem, openCheckout } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [addedToCartFeedback, setAddedToCartFeedback] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'care' | 'shipping'>('details');

  // Preselect single color/size if only 1 exists
  useMemo(() => {
    if (product) {
      if (product.colors.length === 1 && !selectedColor) {
        setSelectedColor(product.colors[0].name);
      }
      if (product.sizes.length === 1 && !selectedSize) {
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [product, selectedColor, selectedSize]);

  if (!product) {
    return (
      <div className="py-24 text-center bg-cream min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="font-heading text-3xl font-bold text-midnight mb-4">
          Product Not Found
        </h1>
        <p className="text-warm-gray text-sm mb-6">
          The requested garment could not be found.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3.5 bg-midnight text-gold text-xs uppercase tracking-widest font-semibold rounded-xl"
        >
          Browse All Products
        </Link>
      </div>
    );
  }

  // Find matching variant
  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const availableSizesForColor = product.variants
    .filter((v) => !selectedColor || v.color === selectedColor)
    .filter((v) => v.available)
    .map((v) => v.size);

  const discount = product.compareAtPrice
    ? getDiscountPercentage(product.price, product.compareAtPrice)
    : 0;

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;

  const handleAddToCart = () => {
    setErrorMessage('');
    if (!selectedSize) {
      setErrorMessage('Please choose a size before adding to cart.');
      return;
    }
    if (!selectedColor) {
      setErrorMessage('Please choose a color before adding to cart.');
      return;
    }
    if (!selectedVariant || !selectedVariant.available) {
      setErrorMessage('This variant combination is currently out of stock.');
      return;
    }

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      quantity,
      name: product.name,
      slug: product.slug,
      image: product.images[0]?.url || '',
      price: selectedVariant.price,
      size: selectedVariant.size,
      color: selectedVariant.color,
    });

    setAddedToCartFeedback(true);
    setTimeout(() => setAddedToCartFeedback(false), 2500);
  };

  const handleQuickOrderOnWhatsApp = () => {
    setErrorMessage('');
    if (!selectedSize) {
      setErrorMessage('Please choose a size before placing your order.');
      return;
    }
    if (!selectedColor) {
      setErrorMessage('Please choose a color before placing your order.');
      return;
    }

    const variant =
      selectedVariant ||
      product.variants.find((v) => v.size === selectedSize && v.available);

    if (!variant || !variant.available) {
      setErrorMessage('Selected variant is currently out of stock.');
      return;
    }

    // Launch Checkout Modal preloaded with this single item
    openCheckout({
      productId: product.id,
      variantId: variant.id,
      quantity,
      name: product.name,
      slug: product.slug,
      image: product.images[0]?.url || '',
      price: variant.price,
      size: variant.size,
      color: variant.color,
    });
  };

  // Related products from same category
  const relatedProducts = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map((img) => img.url),
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: storeConfig.brandName,
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: storeConfig.currency,
      availability: product.available
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${storeConfig.websiteUrl}/products/${product.slug}`,
    },
  };

  return (
    <div className="py-6 sm:py-10 bg-[#FAF7F2] min-h-screen">
      <SEOHead
        title={product.seoTitle}
        description={product.seoDescription}
        canonical={`/products/${product.slug}`}
        ogImage={product.images[0]?.url}
        type="product"
      />
      <StructuredData data={productSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shop', href: '/shop' },
            {
              label: product.category.replace(/-/g, ' '),
              href: `/collections/${product.category}`,
            },
            { label: product.name },
          ]}
        />

        {/* Main PDP 2-Column Section */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Gallery Column (Thumbnails + Large Canvas) */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Product Details & Purchasing Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.newArrival && (
                  <span className="px-2.5 py-0.5 rounded-full bg-midnight text-white text-[10px] font-bold tracking-widest uppercase">
                    New Arrival
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-full bg-ivory border border-light-gray text-gold text-[10px] font-bold tracking-widest uppercase">
                  {product.category.replace(/-/g, ' ')}
                </span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-midnight leading-tight">
                {product.name}
              </h1>

              {/* Stock Dispatch Badge (Clean, Star-free) */}
              <div className="flex items-center gap-2 mt-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>In Stock • Dispatches in 24 Hours</span>
                </span>
              </div>

              {/* Price row */}
              <div className="mt-4 flex items-center gap-3">
                <span className="font-heading text-3xl font-bold text-midnight">
                  {formatPrice(currentPrice)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-base text-warm-gray line-through font-normal">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-md bg-gold text-midnight text-xs font-bold uppercase tracking-wider">
                    {discount}% OFF
                  </span>
                )}
              </div>

              {/* Short editorial description */}
              <p className="text-sm text-warm-gray mt-3 leading-relaxed font-light">
                {product.shortDescription}
              </p>
            </div>

            {/* Clear Bullet Points: Product Benefits & Specifications */}
            <div className="p-4 rounded-xl bg-white border border-light-gray/70 space-y-2">
              <span className="text-[11px] uppercase tracking-wider text-midnight font-bold block">
                Highlights & Specifications
              </span>
              <ul className="space-y-1.5 text-xs text-charcoal font-normal">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                  <span><strong>Textile:</strong> {product.material} — Crisp drape & breathability</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                  <span><strong>Silhouette:</strong> {product.fit} tailored for comfort and poise</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                  <span><strong>Logistics:</strong> Pan-India shipping with tracked courier delivery</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                  <span><strong>Sizing Guarantee:</strong> Size swap assistance within 48h via WhatsApp</span>
                </li>
              </ul>
            </div>

            {/* Color Selector */}
            <div className="pt-4 border-t border-light-gray/70">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-charcoal uppercase tracking-wider">
                  Color:{' '}
                  <span className="text-midnight font-bold">
                    {selectedColor || 'Choose a color'}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                {product.colors.map((color) => {
                  const isSelected = selectedColor === color.name;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => {
                        setSelectedColor(color.name);
                        setErrorMessage('');
                      }}
                      className={`w-8 h-8 rounded-full border border-gray-300 relative transition-all ${
                        isSelected
                          ? 'ring-2 ring-midnight ring-offset-2 scale-110'
                          : 'hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                      aria-label={`Select color ${color.name}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div className="pt-4 border-t border-light-gray/70">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-charcoal uppercase tracking-wider">
                  Size:{' '}
                  <span className="text-midnight font-bold">
                    {selectedSize || 'Choose your size'}
                  </span>
                </span>

                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-charcoal hover:text-gold transition-colors font-semibold"
                >
                  <Ruler className="w-3.5 h-3.5 text-gold" />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  const isAvailable = availableSizesForColor.includes(size);

                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => {
                        setSelectedSize(size);
                        setErrorMessage('');
                      }}
                      className={`h-11 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center ${
                        isSelected
                          ? 'bg-midnight text-white shadow-md border-2 border-midnight'
                          : isAvailable
                          ? 'bg-white border border-light-gray hover:border-midnight text-charcoal'
                          : 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed line-through'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="pt-4 border-t border-light-gray/70 flex items-center justify-between">
              <span className="text-xs font-bold text-charcoal uppercase tracking-wider">
                Quantity
              </span>
              <div className="inline-flex items-center border border-light-gray rounded-xl bg-white overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 flex items-center justify-center text-charcoal hover:bg-cream transition-colors text-sm font-bold"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-bold text-midnight">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="w-9 h-9 flex items-center justify-center text-charcoal hover:bg-cream transition-colors text-sm font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                {errorMessage}
              </div>
            )}

            {/* Pre-Checkout WhatsApp Trust Badge (Essential) */}
            <div className="bg-[#FAF7F2] border border-gold/40 rounded-xl p-3 text-xs text-charcoal flex items-center justify-center gap-2 text-center font-medium shadow-2xs">
              <span className="text-base select-none">💬</span>
              <span>Fast WhatsApp Ordering — Instant order confirmation & direct support.</span>
            </div>

            {/* Action Buttons Row */}
            <div className="space-y-3 pt-1">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!product.available}
                  className={`flex-1 py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                    addedToCartFeedback
                      ? 'bg-emerald-700 text-white'
                      : 'bg-midnight text-white hover:bg-black'
                  }`}
                >
                  {addedToCartFeedback ? (
                    <>
                      <Check className="w-4 h-4 text-gold" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-gold" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-14 h-14 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    isWishlisted
                      ? 'bg-red-50 border-red-200 text-red-500'
                      : 'bg-white border-light-gray hover:border-midnight text-charcoal'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
                </button>
              </div>

              {/* Quick Order on WhatsApp CTA (Opens Instant Checkout) */}
              <button
                type="button"
                onClick={handleQuickOrderOnWhatsApp}
                className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-[0.18em] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Quick Order on WhatsApp</span>
              </button>
            </div>

            {/* Value Proposition Badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-light-gray/70 text-center">
              <div className="p-2.5 rounded-xl bg-white border border-light-gray/60 space-y-1">
                <Truck className="w-4 h-4 text-gold mx-auto" />
                <span className="block text-[10px] font-bold text-midnight uppercase tracking-wider">
                  Pan-India Shipping
                </span>
                <span className="block text-[9px] text-warm-gray">3-5 days delivery</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-light-gray/60 space-y-1">
                <RefreshCw className="w-4 h-4 text-gold mx-auto" />
                <span className="block text-[10px] font-bold text-midnight uppercase tracking-wider">
                  Easy Sizing Swap
                </span>
                <span className="block text-[9px] text-warm-gray">48h assistance</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-light-gray/60 space-y-1">
                <ShieldCheck className="w-4 h-4 text-gold mx-auto" />
                <span className="block text-[10px] font-bold text-midnight uppercase tracking-wider">
                  Verified Quality
                </span>
                <span className="block text-[9px] text-warm-gray">100% fine cotton</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Product Details Section */}
        <div className="mt-20 bg-white rounded-2xl border border-light-gray p-6 sm:p-10 shadow-xs">
          {/* Tabs bar */}
          <div className="flex border-b border-light-gray overflow-x-auto gap-8 pb-4">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`text-xs uppercase tracking-[0.2em] font-bold transition-all relative pb-2 ${
                activeTab === 'details'
                  ? 'text-midnight after:content-[""] after:absolute after:bottom-[-17px] after:left-0 after:w-full after:h-[2px] after:bg-midnight'
                  : 'text-warm-gray hover:text-midnight'
              }`}
            >
              Details & Story
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('materials')}
              className={`text-xs uppercase tracking-[0.2em] font-bold transition-all relative pb-2 ${
                activeTab === 'materials'
                  ? 'text-midnight after:content-[""] after:absolute after:bottom-[-17px] after:left-0 after:w-full after:h-[2px] after:bg-midnight'
                  : 'text-warm-gray hover:text-midnight'
              }`}
            >
              Materials & Fit
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('care')}
              className={`text-xs uppercase tracking-[0.2em] font-bold transition-all relative pb-2 ${
                activeTab === 'care'
                  ? 'text-midnight after:content-[""] after:absolute after:bottom-[-17px] after:left-0 after:w-full after:h-[2px] after:bg-midnight'
                  : 'text-warm-gray hover:text-midnight'
              }`}
            >
              Care Instructions
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('shipping')}
              className={`text-xs uppercase tracking-[0.2em] font-bold transition-all relative pb-2 ${
                activeTab === 'shipping'
                  ? 'text-midnight after:content-[""] after:absolute after:bottom-[-17px] after:left-0 after:w-full after:h-[2px] after:bg-midnight'
                  : 'text-warm-gray hover:text-midnight'
              }`}
            >
              Shipping & Returns
            </button>
          </div>

          {/* Tab Content + Visual split */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Bullet points with icons */}
            <div className="lg:col-span-7 space-y-6">
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <p className="text-sm text-charcoal leading-relaxed font-light">
                    {product.description}
                  </p>
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3 text-xs text-charcoal">
                      <Sparkles className="w-4 h-4 text-gold" />
                      <span>Expertly tailored for modern Indian male proportions</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-charcoal">
                      <Layers className="w-4 h-4 text-gold" />
                      <span>Reinforced stitching for longevity and pristine structure</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-charcoal">
                      <ShieldCheck className="w-4 h-4 text-gold" />
                      <span>Natural drape suitable for both formal and festive settings</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'materials' && (
                <div className="space-y-4">
                  <h3 className="font-heading text-lg font-bold text-midnight">
                    Fabric & Silhouette Specifications
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-cream border border-light-gray">
                      <strong className="block text-midnight text-sm mb-1">Fabric Composition</strong>
                      <span className="text-warm-gray">{product.material}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-cream border border-light-gray">
                      <strong className="block text-midnight text-sm mb-1">Fit Silhouette</strong>
                      <span className="text-warm-gray">{product.fit}</span>
                    </div>
                  </div>
                  <p className="text-xs text-warm-gray leading-relaxed font-light">
                    Woven with precision yarns designed to retain breathability in warm climates while maintaining an unmistakable crisp luxury appearance.
                  </p>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="space-y-3">
                  <h3 className="font-heading text-lg font-bold text-midnight">
                    Garment Preservation Guidelines
                  </h3>
                  <ul className="space-y-2 text-xs text-charcoal">
                    {product.careInstructions.map((ci, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-gold" />
                        <span>{ci}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-3 text-xs text-charcoal leading-relaxed font-light">
                  <h3 className="font-heading text-lg font-bold text-midnight">
                    Delivery via WhatsApp Confirmation
                  </h3>
                  <p>
                    All orders are verified and dispatched within 24–48 hours. Our boutique team coordinates directly with you over WhatsApp to ensure delivery to your specific address or landmark.
                  </p>
                  <p>
                    Size exchanges are supported within 48 hours of parcel receipt.
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Close-up macro texture photo */}
            <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F3EFE6] shadow-md border border-light-gray">
              <img
                src={product.images[1]?.url || product.images[0]?.url}
                alt="Fabric Detail Close-up"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-gold font-bold">
                    Signature Textile
                  </span>
                  <p className="text-sm font-heading font-bold text-white">
                    {product.material} • {product.fit}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* You May Also Like Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-light-gray">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold">
                  Curated Pairings
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-midnight">
                  You May Also Like
                </h2>
              </div>

              <Link
                to={`/collections/${product.category}`}
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-midnight hover:text-gold transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* ProductCard Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product.category}
      />
    </div>
  );
}
