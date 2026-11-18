// Central Store Configuration — Update these values for your business

export interface StoreConfiguration {
  brandName: string;
  brandTagline: string;
  logoPath: string;
  websiteUrl: string;
  whatsappNumber: string;
  contactPhone: string;
  contactEmail: string;
  businessAddress: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
  };
  socialMedia: {
    instagram: string;
    facebook: string;
  };
  currency: 'INR';
  currencySymbol: string;
  locale: string;
  shippingCharge: number;
  freeShippingThreshold: number;
  deliveryNote: string;
  announcementBar: string;
  isPlaceholderConfig: boolean;
}

export const storeConfig: StoreConfiguration = {
  // Brand
  brandName: 'Arabian Mens Collection',
  brandTagline: 'Elevate Your Style. Define Your Presence.',
  logoPath: '/images/brand/arabian-mens-collection-logo.jpg',
  websiteUrl: 'https://arabianmenscollection.com', // Update with actual domain

  // Contact — REPLACE with actual business details
  whatsappNumber: '919999999999', // Format: country code + number, digits only
  contactPhone: '+91 99999 99999', // Display format
  contactEmail: 'info@arabianmenscollection.com',
  businessAddress: {
    line1: 'Arabian Mens Collection',
    line2: '',
    city: '',
    state: '',
    pinCode: '',
    country: 'India',
  },

  // Social Media — REPLACE with actual URLs
  socialMedia: {
    instagram: 'https://instagram.com/arabianmenscollection',
    facebook: 'https://facebook.com/arabianmenscollection',
  },

  // Currency
  currency: 'INR',
  currencySymbol: '₹',
  locale: 'en-IN',

  // Shipping
  shippingCharge: 99,
  freeShippingThreshold: 999,
  deliveryNote: 'Free delivery on orders above ₹999. Orders confirmed directly via WhatsApp.',

  // Announcements
  announcementBar: '🚚 Free Delivery on Orders Over ₹999 | 💬 Fast & Direct WhatsApp Ordering',

  // Development flag
  isPlaceholderConfig: true,
};

// Currency formatter
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat(storeConfig.locale, {
    style: 'currency',
    currency: storeConfig.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Calculate discount percentage
export const getDiscountPercentage = (price: number, compareAtPrice: number): number => {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
};
