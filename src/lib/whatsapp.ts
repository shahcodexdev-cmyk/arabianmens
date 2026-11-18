import { storeConfig, formatPrice } from '../config/store';
import type { PaymentMode } from '../types';

/**
 * Generate WhatsApp click-to-chat URL with encoded message
 */
export const generateWhatsAppUrl = (message: string): string => {
  // Ensure whatsapp number contains digits only
  const phone = storeConfig.whatsappNumber.replace(/\D/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
};

/**
 * Generate a clean Order Reference ID (e.g. ORD-74921)
 */
export const generateOrderReference = (): string => {
  const random5Digits = Math.floor(10000 + Math.random() * 90000);
  return `ORD-${random5Digits}`;
};

export interface OrderItemDetail {
  name: string;
  size?: string;
  color?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  productUrl?: string;
}

export interface OrderCustomerDetail {
  fullName: string;
  mobile: string;
  whatsapp?: string;
  email?: string;
}

export interface OrderAddressDetail {
  house: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
  country?: string;
  instructions?: string;
}

export interface BuildOrderMessageParams {
  orderId?: string;
  items: OrderItemDetail[];
  subtotal: number;
  shippingFee: number;
  grandTotal: number;
  paymentMode: PaymentMode | string;
  customer: OrderCustomerDetail;
  address: OrderAddressDetail;
  notes?: string;
}

/**
 * Construct an emoji-formatted WhatsApp message containing:
 * - Store Name Header
 * - Order ID & Timestamp
 * - Customer Name, Phone, and Full Delivery Address
 * - Itemized list: Product Name (Variant) — Qty × Price = Line Total
 * - Subtotal, Shipping fee, and Grand Total
 * - Selected Payment Method & Customer Notes
 * - Polite confirmation closing note
 */
export const buildFormattedWhatsAppMessage = (
  params: BuildOrderMessageParams
): { orderId: string; message: string; url: string } => {
  const orderId = params.orderId || generateOrderReference();

  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const shippingText =
    params.shippingFee === 0 ? 'FREE' : formatPrice(params.shippingFee);

  let msg = `🛍️ *NEW ORDER — ${storeConfig.brandName}*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📦 *Order ID:* ${orderId}\n`;
  msg += `🗓️ *Timestamp:* ${formattedDate}, ${formattedTime}\n\n`;

  msg += `👤 *CUSTOMER DETAILS*\n`;
  msg += `• *Full Name:* ${params.customer.fullName}\n`;
  msg += `• *Phone:* +91 ${params.customer.mobile.replace(/\D/g, '')}\n`;
  if (
    params.customer.whatsapp &&
    params.customer.whatsapp.replace(/\D/g, '') !==
      params.customer.mobile.replace(/\D/g, '')
  ) {
    msg += `• *WhatsApp:* +91 ${params.customer.whatsapp.replace(/\D/g, '')}\n`;
  }
  if (params.customer.email) {
    msg += `• *Email:* ${params.customer.email}\n`;
  }
  msg += `\n`;

  msg += `📍 *DELIVERY ADDRESS*\n`;
  msg += `${params.address.house}, ${params.address.street}`;
  if (params.address.landmark) {
    msg += ` (Landmark: ${params.address.landmark})`;
  }
  msg += `\n`;
  msg += `${params.address.city}, ${params.address.state} - ${params.address.pinCode}\n`;
  msg += `${params.address.country || 'India'}\n\n`;

  msg += `🛒 *ORDER ITEMS (${params.items.length})*\n`;
  params.items.forEach((item, index) => {
    const variantParts = [
      item.size ? `Size: ${item.size}` : '',
      item.color ? `Color: ${item.color}` : '',
    ].filter(Boolean);
    const variantStr = variantParts.length > 0 ? ` (${variantParts.join(', ')})` : '';

    msg += `${index + 1}. *${item.name}*${variantStr}\n`;
    msg += `   • Qty: ${item.quantity} × ${formatPrice(item.unitPrice)} = *${formatPrice(item.lineTotal)}*\n`;
    if (item.productUrl) {
      msg += `   • Link: ${item.productUrl}\n`;
    }
  });
  msg += `\n`;

  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💰 *ORDER SUMMARY*\n`;
  msg += `• *Subtotal:* ${formatPrice(params.subtotal)}\n`;
  msg += `• *Shipping Fee:* ${shippingText}\n`;
  msg += `• *Grand Total:* *${formatPrice(params.grandTotal)}*\n`;
  msg += `• *Payment Mode:* *${params.paymentMode}*\n\n`;

  const notesList = [params.address.instructions, params.notes]
    .filter(Boolean)
    .join(' | ');

  if (notesList) {
    msg += `📝 *Customer Notes:* ${notesList}\n\n`;
  }

  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💬 *Please confirm my order availability and delivery timeline. Thank you!*`;

  return {
    orderId,
    message: msg,
    url: generateWhatsAppUrl(msg),
  };
};

/**
 * Backward-compatible helper for cart order message
 */
export const generateCartOrderMessage = (params: {
  items: Array<{
    name: string;
    size: string;
    color: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    productUrl: string;
  }>;
  subtotal: number;
  customer: {
    fullName: string;
    mobile: string;
    whatsapp: string;
    email?: string;
  };
  address: {
    house: string;
    street: string;
    landmark?: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
    instructions?: string;
  };
  paymentMode?: PaymentMode;
  preferences?: {
    isGift?: boolean;
    giftMessage?: string;
    specialInstructions?: string;
  };
}): string => {
  const shippingFee =
    params.subtotal >= storeConfig.freeShippingThreshold
      ? 0
      : storeConfig.shippingCharge;
  const grandTotal = params.subtotal + shippingFee;

  let notes = params.preferences?.specialInstructions || '';
  if (params.preferences?.isGift) {
    notes += notes ? ' | ' : '';
    notes += 'Gift Order';
    if (params.preferences.giftMessage) {
      notes += `: "${params.preferences.giftMessage}"`;
    }
  }

  const result = buildFormattedWhatsAppMessage({
    items: params.items,
    subtotal: params.subtotal,
    shippingFee,
    grandTotal,
    paymentMode: params.paymentMode || 'Cash on Delivery',
    customer: params.customer,
    address: params.address,
    notes,
  });

  return result.message;
};

/**
 * Generate WhatsApp message for a single product quick order (from PDP)
 */
export const generateProductOrderMessage = (params: {
  productName: string;
  productUrl: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}): string => {
  const { productName, productUrl, size, color, quantity, price } = params;
  const total = price * quantity;
  const orderRef = generateOrderReference();

  return `🛍️ *QUICK INQUIRY / ORDER — ${storeConfig.brandName}*
━━━━━━━━━━━━━━━━━━━━
📦 *Ref:* ${orderRef}

I would like to order:
• *Product:* ${productName}
• *Size:* ${size}
• *Color:* ${color}
• *Quantity:* ${quantity}
• *Unit Price:* ${formatPrice(price)}
• *Total:* *${formatPrice(total)}*
🔗 *Link:* ${productUrl}

💬 *Please confirm item availability and help me place this order. Thank you!*`;
};

/**
 * Open WhatsApp with a general inquiry
 */
export const getWhatsAppContactUrl = (): string => {
  return generateWhatsAppUrl(
    `Hello ${storeConfig.brandName},\n\nI have an inquiry about your menswear collection.`
  );
};

/**
 * Check if WhatsApp number is configured (not placeholder)
 */
export const isWhatsAppConfigured = (): boolean => {
  const num = storeConfig.whatsappNumber.replace(/\D/g, '');
  return num !== '919999999999' && num.length >= 10;
};
