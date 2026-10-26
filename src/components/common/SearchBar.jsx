import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronRight } from 'lucide-react';
import { searchProducts } from '../../services/productService';
import { formatPrice } from '../../utils/formatPrice';
import './SearchBar.css';

export default function SearchBar({ placeholder = "Search for paper cups, burger boxes, straws...", onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length >= 2) {
      const hits = searchProducts(query);
      setResults(hits.slice(0, 8));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (slug) => {
    setQuery('');
    setIsOpen(false);
    if (onClose) onClose();
    navigate(`/product/${slug}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      if (onClose) onClose();
      navigate(`/product?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="searchbar-wrapper" ref={containerRef}>
      <form className="searchbar-form" onSubmit={handleSubmit}>
        <div className="searchbar-input-group">
          <Search className="searchbar-icon" size={18} />
          <input
            type="text"
            className="searchbar-input"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          />
          {query && (
            <button
              type="button"
              className="searchbar-clear-btn"
              onClick={() => { setQuery(''); setResults([]); }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
          <button type="submit" className="searchbar-submit-btn">
            Search
          </button>
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="searchbar-dropdown">
          {results.length > 0 ? (
            <div className="searchbar-results-list">
              <div className="searchbar-dropdown-header">
                Matching Products ({results.length})
              </div>
              {results.map((item) => (
                <div
                  key={item.id}
                  className="searchbar-result-item"
                  onClick={() => handleSelect(item.slug)}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="searchbar-item-thumb"
                  />
                  <div className="searchbar-item-info">
                    <span className="searchbar-item-category">{item.categoryName}</span>
                    <span className="searchbar-item-name">{item.name}</span>
                    <span className="searchbar-item-price">{formatPrice(item.price)} / {item.unit}</span>
                  </div>
                  <ChevronRight size={16} className="searchbar-arrow" />
                </div>
              ))}
            </div>
          ) : (
            <div className="searchbar-no-results">
              No products found matching "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
