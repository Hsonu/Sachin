import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import TopBar from './components/layout/TopBar';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';
import NotFound from './components/common/NotFound';

// Pages
import Home from './pages/Home';
import AllCategories from './pages/AllCategories';
import CategoryPage from './pages/CategoryPage';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Export from './pages/Export';
import Contact from './pages/Contact';
import Policy from './pages/Policy';

import './assets/styles/variables.css';
import './assets/styles/global.css';
import './assets/styles/responsive.css';
import './App.css';

// Automatically scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <div className="app-layout">
      <ScrollToTop />
      <TopBar />
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<AllCategories />} />
          <Route path="/all-categories" element={<AllCategories />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product" element={<Products />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/export" element={<Export />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<Policy />} />
          <Route path="/terms-and-conditions" element={<Policy />} />
          <Route path="/order-policy" element={<Policy />} />
          <Route path="/return-policy" element={<Policy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
