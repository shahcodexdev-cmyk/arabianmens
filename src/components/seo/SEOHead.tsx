import { Helmet } from 'react-helmet-async';
import { storeConfig } from '../../config/store';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  type?: 'website' | 'article' | 'product';
}

export default function SEOHead({
  title,
  description = "Arabian Mens Collection - Premium menswear, shirts, polos, and traditional kurtas for distinguished Indian gentlemen.",
  canonical,
  ogImage = storeConfig.logoPath,
  type = 'website',
}: SEOHeadProps) {
  const fullTitle = title
    ? `${title} | ${storeConfig.brandName}`
    : `${storeConfig.brandName} | Premium Men's Fashion`;

  const canonicalUrl = canonical
    ? `${storeConfig.websiteUrl}${canonical}`
    : storeConfig.websiteUrl;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={storeConfig.brandName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}

