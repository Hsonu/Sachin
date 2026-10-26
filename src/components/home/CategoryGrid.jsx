import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import categories from '../../data/categories';
import './CategoryGrid.css';

export default function CategoryGrid({ limit = 12, showViewAll = true }) {
  const displayedCategories = limit ? categories.slice(0, limit) : categories;

  return (
    <section className="category-grid-section">
      <div className="container">
        <div className="section-head">
          <div className="section-head-left">
            <span className="section-badge">Explore Range</span>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">
              Comprehensive eco-friendly packaging solutions engineered for cafes, cloud kitchens, and takeaway.
            </p>
          </div>
          {showViewAll && (
            <Link to="/categories" className="btn-section-link">
              <span>View All Categories</span>
              <ArrowRight size={16} />
            </Link>
          )}
        </div>

        <div className="categories-mosaic">
          {displayedCategories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="category-card"
              style={{ '--cat-color': category.color }}
            >
              <div className="category-card-img-wrap">
                <img
                  src={category.image}
                  alt={category.name}
                  className="category-card-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&h=500&fit=crop';
                  }}
                />
                <span className="category-accent-bar"></span>
              </div>
              <div className="category-card-info">
                <h3 className="category-name">{category.name}</h3>
                <span className="category-count">
                  {category.productCount || 8}+ Products
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
