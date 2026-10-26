import products, { getProductsByCategory, getFeaturedProducts, getBestsellerProducts, getNewProducts, getProductBySlug, getProductById } from '../data/products';
import categories, { getCategoryBySlug } from '../data/categories';

// Search products by name
export const searchProducts = (query) => {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.categorySlug.replace(/-/g, ' ').includes(q) ||
      p.description.toLowerCase().includes(q)
  );
};

// Filter and sort products
export const filterProducts = (productList, { sortBy, minPrice, maxPrice, categorySlug } = {}) => {
  let filtered = [...productList];

  if (categorySlug) {
    filtered = filtered.filter((p) => p.categorySlug === categorySlug);
  }

  if (minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= minPrice);
  }

  if (maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= maxPrice);
  }

  switch (sortBy) {
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'name-az':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-za':
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      break;
  }

  return filtered;
};

export { products, categories, getProductsByCategory, getFeaturedProducts, getBestsellerProducts, getNewProducts, getProductBySlug, getProductById, getCategoryBySlug };

