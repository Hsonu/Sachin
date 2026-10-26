import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumb from '../components/common/Breadcrumb';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilters from '../components/products/ProductFilters';
import { products, filterProducts, searchProducts } from '../services/productService';
import './Products.css';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const filteredList = useMemo(() => {
    let baseList = products;
    if (queryParam.trim().length >= 2) {
      baseList = searchProducts(queryParam);
    }
    return filterProducts(baseList, {
      categorySlug: selectedCategory || undefined,
      sortBy,
    });
  }, [queryParam, selectedCategory, sortBy]);

  const handleCategorySelect = (slug) => {
    setSelectedCategory(slug);
    if (slug) {
      searchParams.set('category', slug);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSortBy('default');
    searchParams.delete('category');
    searchParams.delete('q');
    setSearchParams(searchParams);
  };

  const breadcrumbs = [
    { label: 'All Products', path: null },
  ];

  return (
    <div className="products-page">
      <Breadcrumb items={breadcrumbs} />

      <section className="products-page-header">
        <div className="container">
          <span className="section-badge">Wholesale Catalog</span>
          <h1 className="page-main-title">
            {queryParam ? `Search results for "${queryParam}"` : 'All Packaging Products'}
          </h1>
          <p className="page-desc">
            Direct-from-factory disposable paper cups, biodegradable cutlery, kraft containers, and meal delivery packaging.
          </p>
        </div>
      </section>

      <section className="products-page-main">
        <div className="container">
          <ProductFilters
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onClearFilters={handleClearFilters}
          />

          <div className="products-results-info">
            <span className="results-count">
              Found <strong>{filteredList.length}</strong> matching products
            </span>
          </div>

          <ProductGrid
            products={filteredList}
            emptyMessage={
              queryParam
                ? `No products found matching "${queryParam}". Try clearing your search.`
                : 'No products found matching the selected filters.'
            }
          />
        </div>
      </section>
    </div>
  );
}
