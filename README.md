# Himalayan Kulfi (AaharPack Clone)

A modern, high-performance, and responsive B2B eCommerce web platform for **Himalayan Kulfi**, inspired by AaharPack. Built with **React 19**, **Vite**, and **React Router v7**.

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The website will be live at: `http://localhost:5173/`

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 📁 Project Architecture

```
Sachin-1/
├── public/
│   ├── favicon.svg
│   └── images/
├── src/
│   ├── assets/
│   │   └── styles/
│   │       ├── variables.css      # Design tokens (colors, typography, spacing)
│   │       ├── global.css         # Reset, utilities, buttons, containers
│   │       └── responsive.css     # Breakpoint utilities
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── TopBar.jsx         # Support phone, hours, announcement bar
│   │   │   ├── Navbar.jsx         # Desktop & mobile navigation, search, mega-dropdown
│   │   │   └── Footer.jsx         # 4-column footer, social links, contact info
│   │   │
│   │   ├── home/
│   │   │   ├── HeroSlider.jsx     # 3-slide hero banner with auto-slide & CTAs
│   │   │   ├── TrustBar.jsx       # 4 trust pillars (eco-friendly, factory rates, etc.)
│   │   │   ├── CategoryGrid.jsx   # Shop-by-category cards
│   │   │   ├── ProductSection.jsx # Tabbed products (Featured / Bestsellers / New)
│   │   │   ├── PromotionalBanner.jsx # Custom printing solutions CTA
│   │   │   └── BulkOrderCTA.jsx   # Wholesale RFQ form with direct WhatsApp
│   │   │
│   │   ├── products/
│   │   │   ├── ProductCard.jsx    # Product thumbnail, badges, rating, price, MOQ
│   │   │   ├── ProductGrid.jsx    # Responsive product layout grid
│   │   │   ├── ProductGallery.jsx # Image viewer with thumbnail switching
│   │   │   ├── ProductFilters.jsx # Category pills and sort dropdowns
│   │   │   └── ProductDetails.jsx # Detailed specs, features, and wholesale CTA
│   │   │
│   │   └── common/
│   │       ├── SearchBar.jsx      # Instant autocomplete product search
│   │       ├── Breadcrumb.jsx     # Dynamic breadcrumb navigation
│   │       ├── WhatsAppButton.jsx # Floating bottom-right animated WhatsApp button
│   │       ├── Loading.jsx        # Loading indicator
│   │       └── NotFound.jsx       # 404 page with navigation actions
│   │
│   ├── pages/
│   │   ├── Home.jsx               # Landing page
│   │   ├── AllCategories.jsx      # Complete 15-category catalog
│   │   ├── CategoryPage.jsx       # Category-specific products & filter
│   │   ├── Products.jsx           # Full products catalog with search & filters
│   │   ├── ProductDetail.jsx      # Product specifications, gallery & RFQ
│   │   ├── About.jsx              # Factory story, facility stats, values
│   │   ├── Export.jsx             # Port logistics, international container RFQ
│   │   ├── Contact.jsx            # Contact details & instant messaging
│   │   └── Policy.jsx             # Privacy, Terms, Order & Return policies
│   │
│   ├── data/
│   │   ├── categories.js          # 15 product categories with colors & images
│   │   ├── products.js            # 20+ comprehensive demo products with specs
│   │   └── navigation.js          # Brand settings, phone, email, and social links
│   │
│   ├── services/
│   │   └── productService.js      # Search, category filter, and sorting logic
│   │
│   ├── utils/
│   │   └── formatPrice.js         # Indian Rupee (₹) price formatting
│   │
│   ├── App.jsx                    # Route configuration & global layout
│   └── main.jsx                   # React root mount
│
├── vite.config.js                 # Vite + React configuration
└── package.json                   # Dependencies & scripts
```

---

## 🛠️ How to Customize

### 1. Update Brand Details, Phone, and WhatsApp
Edit [`src/data/navigation.js`](file:///c:/Users/Sonu/Desktop/project/Sachin-1/src/data/navigation.js):
```javascript
export const BRAND = {
  name: 'Himalayan Kulfi',
  phone: '+91 86036 32642',
  phoneRaw: '918603632642',            // WhatsApp and tel: link format
  email: 'info@himalayankulfi.com',
  hours: 'Mon - Sun: 9:00 AM - 10:00 PM',
  address: 'Morbi, Gujarat, India',
  whatsappLink: 'https://wa.me/918603632642',
};
```

### 2. Update Categories
Edit [`src/data/categories.js`](file:///c:/Users/Sonu/Desktop/project/Sachin-1/src/data/categories.js):
Add, remove, or modify category names, slugs, accent colors, and description.

### 3. Update Products & Pricing
Edit [`src/data/products.js`](file:///c:/Users/Sonu/Desktop/project/Sachin-1/src/data/products.js):
Each product supports:
- `name`, `slug`, `categorySlug`, `categoryName`
- `price`, `originalPrice`, `unit`, `packSize`, `moq`
- `rating`, `reviewCount`, `inStock`, `isFeatured`, `isBestseller`, `isNew`
- `image`, `gallery`
- `shortDesc`, `description`, `features`, and `specs`

### 4. Update Colors & Theme
Edit [`src/assets/styles/variables.css`](file:///c:/Users/Sonu/Desktop/project/Sachin-1/src/assets/styles/variables.css) to adjust CSS variables such as `--color-primary`, `--color-accent`, and fonts.

---

## 🌐 Routes Overview

| Route | Page | Description |
|---|---|---|
| `/` | `Home.jsx` | Hero slider, trust bar, category grid, product showcase, promo, bulk CTA |
| `/categories` | `AllCategories.jsx` | Showcase of all 15 product categories |
| `/category/:slug` | `CategoryPage.jsx` | Products filtered by category (e.g. `/category/paper-cup`) |
| `/product` | `Products.jsx` | Full catalog with search query (`?q=...`) and category filters |
| `/product/:slug` | `ProductDetail.jsx` | Single product gallery, specifications table, and WhatsApp RFQ |
| `/about` | `About.jsx` | Company history, factory capabilities, quality certifications |
| `/export` | `Export.jsx` | Container shipping, Mundra/Kandla port logistics, global RFQ |
| `/contact` | `Contact.jsx` | Direct phone, email, WhatsApp, factory address, contact form |
| `/privacy-policy` | `Policy.jsx` | Privacy Policy |
| `/terms-and-conditions`| `Policy.jsx` | Terms & Conditions |
| `/order-policy` | `Policy.jsx` | Ordering, MOQs, and lead times |
| `/return-policy` | `Policy.jsx` | Food packaging return guidelines |
