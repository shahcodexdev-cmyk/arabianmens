// Types for Arabian Mens Collection E-Commerce

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  colorHex: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  available: boolean;
  images?: ProductImage[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  shortDescription: string;
  description: string;
  images: ProductImage[];
  price: number;
  compareAtPrice?: number;
  sku: string;
  available: boolean;
  featured: boolean;
  newArrival: boolean;
  bestSeller: boolean;
  colors: ProductColor[];
  sizes: string[];
  variants: ProductVariant[];
  material: string;
  fit: string;
  careInstructions: string[];
  tags: string[];
  seoTitle: string;
  seoDescription: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export type CategorySlug = 
  | 'casual-wear'
  | 'formal-wear'
  | 'shirts-t-shirts'
  | 'kurtas-traditional-wear';

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
  seoTitle: string;
  seoDescription: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  // Derived from product data
  name: string;
  slug: string;
  image: string;
  price: number;
  size: string;
  color: string;
}

export interface CustomerInfo {
  fullName: string;
  mobile: string;
  whatsapp: string;
  email: string;
}

export interface DeliveryAddress {
  house: string;
  street: string;
  landmark: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  instructions: string;
}

export interface OrderPreferences {
  isGift: boolean;
  giftMessage: string;
  specialInstructions: string;
}

export type PaymentMode = 'Cash on Delivery' | 'UPI / Online Transfer';

export interface CheckoutData {
  customer: CustomerInfo;
  address: DeliveryAddress;
  paymentMode: PaymentMode;
  preferences: OrderPreferences;
}

export type SortOption = 
  | 'featured'
  | 'newest'
  | 'price-low-high'
  | 'price-high-low'
  | 'name-az';

export interface FilterState {
  categories: CategorySlug[];
  priceRange: [number, number] | null;
  sizes: string[];
  colors: string[];
  availability: 'all' | 'in-stock';
}

export interface SizeGuideEntry {
  size: string;
  chest: string;
  shoulder: string;
  length: string;
  sleeve: string;
  waist?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  isDemo: boolean;
}

