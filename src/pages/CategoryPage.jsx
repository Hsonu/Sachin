import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Breadcrumb from '../components/common/Breadcrumb';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilters from '../components/products/ProductFilters';
import NotFound from '../components/common/NotFound';
import { getCategoryBySlug } from '../data/categories';
import { getProductsByCategory, filterProducts } from '../services/productService';
import './CategoryPage.css';

export default function CategoryPage() {
  const { slug } = useParams();
  const category = getCategoryBySlug(slug);

  const [sortBy, setSortBy] = useState('default');

  const rawProducts = useMemo(() => {
    return category ? getProductsByCategory(slug) : [];
  }, [category, slug]);

  const displayedProducts = useMemo(() => {
    return filterProducts(rawProducts, { sortBy });
  }, [rawProducts, sortBy]);

  if (!category) {
    return <NotFound />;
  }

  const breadcrumbs = [
    { label: 'All Categories', path: '/categories' },
    { label: category.name, path: null },
  ];

  return (
    <div className="category-detail-page">
      <Breadcrumb items={breadcrumbs} />

      {/* Category Hero Banner */}
      <section
        className="category-hero-banner"
        style={{ '--cat-accent': category.color }}
      >
        <div className="container category-hero-inner">
          <div className="category-hero-text">
            <span className="category-hero-tag">Category</span>
            <h1 className="category-hero-title">{category.name}</h1>
            <p className="category-hero-desc">{category.description}</p>
            <div className="category-stats-bar">
              <span className="stat-pill">{displayedProducts.length} Products Available</span>
              <span className="stat-pill">Direct Factory Rates</span>
              <span className="stat-pill">Custom Printing Available</span>
            </div>
          </div>
          <div className="category-hero-visual">
            <img src={category.image} alt={category.name} />
          </div>
        </div>
      </section>

      {/* Products & Filters Section */}
      <section className="category-products-section">
        <div className="container">
          <div className="category-controls-row">
            <div className="results-count-text">
              Showing <strong>{displayedProducts.length}</strong> items in {category.name}
            </div>

            <div className="sort-mini-group">
              <label htmlFor="cat-sort">Sort By:</label>
              <select
                id="cat-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-mini-select"
              >
                <option value="default">Default / Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-az">Name: A to Z</option>
              </select>
            </div>
          </div>

          <ProductGrid
            products={displayedProducts}
            emptyMessage={`No products listed under ${category.name} at the moment. Contact us for custom orders.`}
          />
        </div>
      </section>
    </div>
  );
}
