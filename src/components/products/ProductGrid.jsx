import ProductCard from './ProductCard';
import './ProductGrid.css';

export default function ProductGrid({ products = [], emptyMessage = "No products found." }) {
  if (!products || products.length === 0) {
    return (
      <div className="product-grid-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
