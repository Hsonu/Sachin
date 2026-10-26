import { Filter, X } from 'lucide-react';
import categories from '../../data/categories';
import './ProductFilters.css';

export default function ProductFilters({
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  onClearFilters,
}) {
  return (
    <div className="product-filters-box">
      <div className="filters-header">
        <div className="filters-title">
          <Filter size={18} />
          <span>Filters & Sort</span>
        </div>
        {(selectedCategory || sortBy !== 'default') && (
          <button type="button" className="btn-clear-filters" onClick={onClearFilters}>
            <X size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Sort By Dropdown */}
      <div className="filter-group">
        <label className="filter-label" htmlFor="sort-select">Sort By</label>
        <select
          id="sort-select"
          className="filter-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="default">Default / Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name-az">Name: A to Z</option>
          <option value="name-za">Name: Z to A</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="filter-group">
        <label className="filter-label">Categories</label>
        <div className="filter-categories-list">
          <button
            type="button"
            className={`filter-category-pill ${!selectedCategory ? 'active' : ''}`}
            onClick={() => onSelectCategory('')}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`filter-category-pill ${selectedCategory === cat.slug ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
