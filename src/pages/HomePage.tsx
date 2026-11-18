import SEOHead from '../components/seo/SEOHead';
import StructuredData from '../components/seo/StructuredData';
import HeroBanner from '../components/home/HeroBanner';
import BrandBenefits from '../components/home/BrandBenefits';
import ShopByCategory from '../components/home/ShopByCategory';
import NewArrivals from '../components/home/NewArrivals';
import BestSellers from '../components/home/BestSellers';
import EditorialCampaign from '../components/home/EditorialCampaign';
import TraditionalSpotlight from '../components/home/TraditionalSpotlight';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Testimonials from '../components/home/Testimonials';
import NewsletterSection from '../components/home/NewsletterSection';
import { storeConfig } from '../config/store';

export default function HomePage() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'FashionStore',
    name: storeConfig.brandName,
    url: storeConfig.websiteUrl,
    logo: `${storeConfig.websiteUrl}${storeConfig.logoPath}`,
    description: 'Upscale Dubai-inspired menswear and Indian festive wear boutique.',
    telephone: storeConfig.contactPhone,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
    currenciesAccepted: 'INR',
    paymentAccepted: 'WhatsApp Order Direct Settlement',
  };

  return (
    <>
      <SEOHead
        title="Elevate Your Style. Define Your Presence"
        description="Shop Arabian Mens Collection. Premium men's casual shirts, formal office wear, polo t-shirts, and traditional festive kurtas with easy WhatsApp ordering."
        canonical="/"
      />
      <StructuredData data={organizationSchema} />

      <HeroBanner />
      <BrandBenefits />
      <ShopByCategory />
      <NewArrivals />
      <EditorialCampaign />
      <BestSellers />
      <TraditionalSpotlight />
      <WhyChooseUs />
      <Testimonials />
      <NewsletterSection />
    </>
  );
}

