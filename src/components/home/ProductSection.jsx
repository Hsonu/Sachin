import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import ProductGrid from '../products/ProductGrid';
import { getFeaturedProducts, getBestsellerProducts, getNewProducts } from '../../services/productService';
import './ProductSection.css';

export default function ProductSection({ title = "Trending Wholesale Products", badge = "Top Picks" }) {
  const [activeTab, setActiveTab] = useState('featured');

  const featured = getFeaturedProducts();
  const bestsellers = getBestsellerProducts();
  const newArrivals = getNewProducts();

  const getActiveProducts = () => {
    switch (activeTab) {
      case 'bestsellers':
        return bestsellers.slice(0, 8);
      case 'new':
        return newArrivals.slice(0, 8);
      case 'featured':
      default:
        return featured.slice(0, 8);
    }
  };

  return (
    <section className="product-section">
      <div className="container">
        <div className="section-head">
          <div className="section-head-left">
            <span className="section-badge">
              <Sparkles size={13} />
              <span>{badge}</span>
            </span>
            <h2 className="section-title">{title}</h2>
            <p className="section-subtitle">
              High volume food packaging manufactured to international standards.
            </p>
          </div>

          {/* Section Tabs */}
          <div className="product-tabs">
            <button
              type="button"
              className={`tab-btn ${activeTab === 'featured' ? 'active' : ''}`}
              onClick={() => setActiveTab('featured')}
            >
              Featured ({featured.length})
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'bestsellers' ? 'active' : ''}`}
              onClick={() => setActiveTab('bestsellers')}
            >
              Best Sellers ({bestsellers.length})
            </button>
            <button
              type="button"
              className={`tab-btn ${activeTab === 'new' ? 'active' : ''}`}
              onClick={() => setActiveTab('new')}
            >
              New Arrivals ({newArrivals.length})
            </button>
          </div>
        </div>

        <ProductGrid products={getActiveProducts()} />

        <div className="product-section-footer">
          <Link to="/product" className="btn btn-outline-primary">
            <span>Explore All Wholesale Products</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
