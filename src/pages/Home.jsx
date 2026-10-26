import HeroSlider from '../components/home/HeroSlider';
import TrustBar from '../components/home/TrustBar';
import CategoryGrid from '../components/home/CategoryGrid';
import ProductSection from '../components/home/ProductSection';
import PromotionalBanner from '../components/home/PromotionalBanner';
import BulkOrderCTA from '../components/home/BulkOrderCTA';

export default function Home() {
  return (
    <div className="home-page">
      <HeroSlider />
      <TrustBar />
      <CategoryGrid limit={12} showViewAll={true} />
      <ProductSection title="Featured Wholesale Packaging" badge="Best Quality" />
      <PromotionalBanner />
      <BulkOrderCTA />
    </div>
  );
}
