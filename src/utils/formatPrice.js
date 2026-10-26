// Format price in Indian Rupees
export const formatPrice = (price) => {
  if (price >= 100) {
    return `₹${price.toLocaleString('en-IN')}`;
  }
  return `₹${price.toFixed(2)}`;
};
