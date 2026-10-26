import { useParams } from 'react-router-dom';
import Breadcrumb from '../components/common/Breadcrumb';
import ProductGallery from '../components/products/ProductGallery';
import ProductDetails from '../components/products/ProductDetails';
import ProductGrid from '../components/products/ProductGrid';
import NotFound from '../components/common/NotFound';
import { getProductBySlug, getProductsByCategory } from '../services/productService';
import './ProductDetail.css';

export default function ProductDetail() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);

  if (!product) {
    return <NotFound />;
  }

  const relatedProducts = getProductsByCategory(product.categorySlug)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const breadcrumbs = [
    { label: 'All Products', path: '/product' },
    { label: product.categoryName, path: `/category/${product.categorySlug}` },
    { label: product.name, path: null },
  ];

  return (
    <div className="product-detail-page">
      <Breadcrumb items={breadcrumbs} />

      <section className="product-detail-main-section">
        <div className="container">
          <div className="product-detail-layout">
            <div className="product-detail-left">
              <ProductGallery images={product.gallery} name={product.name} />
            </div>
            <div className="product-detail-right">
              <ProductDetails product={product} />
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <div className="container">
            <div className="section-head">
              <div className="section-head-left">
                <span className="section-badge">Similar Items</span>
                <h2 className="section-title">Related Packaging Products</h2>
              </div>
            </div>
            <ProductGrid products={relatedProducts} />
          </div>
        </section>
      )}
    </div>
  );
}
