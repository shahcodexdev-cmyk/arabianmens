import type { Category } from '../types';

export const categories: Category[] = [
  {
    slug: 'casual-wear',
    name: 'Casual Wear',
    description: 'Relaxed essentials for everyday confidence. Discover our curated selection of casual shirts, polos, and comfortable everyday pieces designed for the modern man.',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80',
    seoTitle: "Men's Casual Wear | Arabian Mens Collection",
    seoDescription: "Shop premium men's casual wear online. Discover stylish casual shirts, polo T-shirts, and relaxed essentials at Arabian Mens Collection.",
  },
  {
    slug: 'formal-wear',
    name: 'Formal Wear',
    description: 'Refined styles for professional and special occasions. Explore our collection of formal shirts, office wear, and smart-casual pieces crafted for distinguished moments.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    seoTitle: "Men's Formal Wear | Arabian Mens Collection",
    seoDescription: "Shop premium men's formal wear online. Discover elegant formal shirts, office wear, and professional attire at Arabian Mens Collection.",
  },
  {
    slug: 'shirts-t-shirts',
    name: 'Shirts & T-Shirts',
    description: 'Versatile staples for effortless everyday dressing. From crisp Oxford shirts to essential T-shirts, find your perfect wardrobe foundations.',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
    seoTitle: "Men's Shirts & T-Shirts | Arabian Mens Collection",
    seoDescription: "Shop men's shirts and T-shirts online. Discover premium Oxford shirts, casual T-shirts, and versatile wardrobe essentials at Arabian Mens Collection.",
  },
  {
    slug: 'kurtas-traditional-wear',
    name: 'Kurtas & Traditional Wear',
    description: 'Traditional elegance with a contemporary touch. Explore kurtas, festive wear, and celebration outfits that honor heritage while embracing modern style.',
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80',
    seoTitle: "Men's Kurtas & Traditional Wear | Arabian Mens Collection",
    seoDescription: "Shop men's kurtas and traditional wear online. Discover elegant kurtas, festive wear, and celebration outfits at Arabian Mens Collection.",
  },
];

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(c => c.slug === slug);
};

