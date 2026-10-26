import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ChevronDown, Phone, MessageCircle } from 'lucide-react';
import { BRAND, NAV_LINKS } from '../../data/navigation';
import categories from '../../data/categories';
import { searchProducts } from '../../services/productService';
import WhatsAppIcon from '../common/WhatsAppIcon';
import './Navbar.css';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [productsOpen, setProductsOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const results = searchProducts(searchQuery);
      setSuggestions(results.slice(0, 8));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobile = () => {
    setMobileOpen(false);
    setProductsOpen(false);
  };

  const handleSearch = (slug) => {
    setSearchQuery('');
    setSuggestions([]);
    setSearchOpen(false);
    setMobileSearchOpen(false);
    navigate(`/product/${slug}`);
  };

  return (
    <>
      {/* ====== DESKTOP HEADER ====== */}
      <header className="desktop-header hide-md-down">
        <div className="container desktop-header-inner">
          <Link to="/" className="logo-link">
            <div className="logo-text">
              <span className="logo-dark">{BRAND.shortName}</span>
              <span className="logo-accent">{BRAND.accentName}</span>
            </div>
          </Link>
          <div className="header-contact">
            <label className="header-contact-label">Contact-us Support Team</label>
            <a className="header-phone" href={`tel:${BRAND.phoneRaw}`}>
              <Phone size={24} />
              <span className="header-phone-number">{BRAND.phone}</span>
            </a>
          </div>
          <div className="header-social">
            <a href={BRAND.whatsappLink} target="_blank" rel="noopener noreferrer" className="social-icon" title="WhatsApp" aria-label="Chat on WhatsApp">
              <WhatsAppIcon size={22} color="#25D366" />
            </a>
          </div>
        </div>
      </header>

      {/* ====== DESKTOP NAV BAR ====== */}
      <nav className="desktop-nav hide-md-down" id="main-nav">
        <div className="container desktop-nav-inner">
          {/* Hamburger */}
          <button className="nav-hamburger" onClick={() => setMobileOpen(true)}>
            <span></span><span></span><span></span>
          </button>

          {/* Search Btn */}
          {!searchOpen && (
            <button className="nav-search-btn" onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 100); }}>
              <Search size={20} />
            </button>
          )}

          {/* Categories Dropdown */}
          {!searchOpen && (
            <div className="nav-categories-dropdown">
              <div className="nav-categories-trigger">
                All Categories
                <ChevronDown size={18} className="nav-chevron" />
              </div>
              <div className="nav-categories-menu">
                <ul>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link to={`/category/${cat.slug}`}>{cat.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Search Input (inline) */}
          {searchOpen && (
            <div className="nav-search-inline">
              <input
                ref={searchRef}
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="nav-search-close" onClick={() => { setSearchOpen(false); setSearchQuery(''); setSuggestions([]); }}>
                <X size={18} />
              </button>
              {suggestions.length > 0 && (
                <ul className="nav-suggestions">
                  {suggestions.map((p) => (
                    <li key={p.id} onClick={() => handleSearch(p.slug)}>
                      <img src={p.image} alt={p.name} />
                      <div>
                        <strong>{p.name}</strong>
                        <small>{p.size}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Nav Links */}
          {!searchOpen && (
            <ul className="nav-links">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <NavLink to={link.path} className={({ isActive }) => isActive ? 'nav-active' : ''}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}

          {/* WhatsApp */}
          {!searchOpen && (
            <a href={BRAND.whatsappLink} target="_blank" rel="noopener noreferrer" className="nav-chat-btn">
              Chat Now
            </a>
          )}
        </div>
      </nav>

      {/* ====== MOBILE HEADER ====== */}
      <div className="mobile-header-spacer hide-md-up"></div>
      <header className="mobile-header hide-md-up">
        {!mobileSearchOpen ? (
          <div className="mobile-header-default">
            <button className="mobile-hamburger" onClick={() => setMobileOpen(true)}>
              <span></span><span></span><span></span>
            </button>
            <Link to="/" className="mobile-logo">
              <div className="logo-text">
                <span className="logo-dark">{BRAND.shortName}</span>
                <span className="logo-accent">{BRAND.accentName}</span>
              </div>
            </Link>
            <button className="mobile-search-open" onClick={() => setMobileSearchOpen(true)}>
              <Search size={22} />
            </button>
          </div>
        ) : (
          <div className="mobile-search-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button className="mobile-search-close" onClick={() => { setMobileSearchOpen(false); setSearchQuery(''); setSuggestions([]); }}>
              <X size={20} />
            </button>
          </div>
        )}
        {mobileSearchOpen && suggestions.length > 0 && (
          <ul className="mobile-suggestions">
            {suggestions.map((p) => (
              <li key={p.id} onClick={() => { handleSearch(p.slug); setMobileSearchOpen(false); }}>
                <img src={p.image} alt={p.name} />
                <div>
                  <strong>{p.name}</strong>
                  <small>{p.size}</small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </header>

      {/* ====== MOBILE SIDEBAR ====== */}
      {mobileOpen && <div className="sidebar-overlay" onClick={closeMobile}></div>}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-text">
            <span className="logo-dark">{BRAND.shortName}</span>
            <span className="logo-accent">{BRAND.accentName}</span>
          </div>
          <button className="sidebar-close" onClick={closeMobile}>
            <X size={20} />
          </button>
        </div>
        <ul className="sidebar-menu">
          {NAV_LINKS.map((link) => (
            <li key={link.path}>
              <NavLink to={link.path} onClick={closeMobile}>{link.label}</NavLink>
            </li>
          ))}
          <li>
            <Link to="/categories" onClick={closeMobile}>All Categories</Link>
          </li>
          <li className="sidebar-submenu-parent">
            <button onClick={() => setProductsOpen(!productsOpen)} className="sidebar-submenu-trigger">
              <span>Products</span>
              <ChevronDown size={16} className={`sidebar-chevron ${productsOpen ? 'open' : ''}`} />
            </button>
            {productsOpen && (
              <ul className="sidebar-submenu">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link to={`/category/${cat.slug}`} onClick={closeMobile}>{cat.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      </aside>
    </>
  );
}
