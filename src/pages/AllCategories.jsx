import { Link } from 'react-router-dom';
import Breadcrumb from '../components/common/Breadcrumb';
import categories from '../data/categories';
import './AllCategories.css';

export default function AllCategories() {
  const breadcrumbItems = [
    { label: 'All Categories', path: null },
  ];

  return (
    <div className="categories-page">
      <Breadcrumb items={breadcrumbItems} />

      <section className="categories-page-header">
        <div className="container">
          <span className="section-badge">Full Catalog</span>
          <h1 className="page-main-title">All Product Categories</h1>
          <p className="page-desc">
            Browse our complete line of disposable paper cups, eco food containers, kraft boxes, paper straws, and tableware.
          </p>
        </div>
      </section>

      <section className="categories-page-content">
        <div className="container">
          <div className="categories-page-grid">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="category-showcase-card"
                style={{ '--accent': cat.color }}
              >
                <div className="showcase-img-box">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&h=500&fit=crop';
                    }}
                  />
                  <span className="showcase-bar"></span>
                </div>
                <div className="showcase-body">
                  <h2 className="showcase-title">{cat.name}</h2>
                  <p className="showcase-desc">{cat.description}</p>
                  <div className="showcase-footer">
                    <span className="showcase-count">{cat.productCount || 8}+ Products</span>
                    <span className="showcase-action">Explore &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
