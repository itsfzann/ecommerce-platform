# 🚀 PANDUAN SETUP & QUICK START - E-Commerce Platform

---

## 📋 Table of Contents

1. [Project Setup](#project-setup)
2. [Environment Configuration](#environment-configuration)
3. [Folder Structure Quick Reference](#folder-structure-quick-reference)
4. [Development Workflow](#development-workflow)
5. [Key Files & Commands](#key-files--commands)
6. [Dependencies & Packages](#dependencies--packages)
7. [Testing Strategy](#testing-strategy)
8. [Deployment Checklist](#deployment-checklist)

---

## 🛠️ Project Setup

### **Step 1: Create React Project**

```bash
# Menggunakan Vite (recommended, faster)
npm create vite@latest ecommerce-platform -- --template react
cd ecommerce-platform

# Atau menggunakan Create React App
npx create-react-app ecommerce-platform
cd ecommerce-platform
```

### **Step 2: Install Core Dependencies**

```bash
npm install

# State Management
npm install zustand

# HTTP Client
npm install axios

# Routing
npm install react-router-dom

# Styling
npm install -D tailwindcss postcss autoprefixer
npm install clsx

# Form Management (optional)
npm install react-hook-form

# Data Fetching (optional)
npm install @tanstack/react-query

# Dev Tools
npm install -D eslint prettier eslint-plugin-react
npm install -D vite @vitejs/plugin-react

# Testing
npm install -D vitest @testing-library/react jsdom
```

### **Step 3: Configure Tailwind CSS**

```bash
npx tailwindcss init -p
```

**tailwind.config.js:**
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F9FF',
          100: '#E6F2FF',
          500: '#0066CC',
          600: '#0052A3',
          700: '#003D7A',
        },
        accent: {
          500: '#FF6B35',
        },
      },
    },
  },
  plugins: [],
}
```

**src/index.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Global styles */
* {
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

input, textarea, select {
  font-family: inherit;
}

button {
  cursor: pointer;
}
```

### **Step 4: Create Project Structure**

```bash
# Create core directories
mkdir -p src/{api,assets/{images,icons,fonts},components/{Common,UI,Product,Cart,Form},features/{auth,product,cart,checkout,user,search},hooks,layouts,middleware,pages,store,styles,types,utils/{helpers,storage,logger},constants,context,tests/{unit,integration,e2e}}

# Create key files
touch src/App.jsx
touch src/AppRoutes.jsx
touch src/api/client.js
touch src/api/endpoints.js
touch src/store/index.js
touch .env.example
touch .eslintrc.js
touch .prettierrc
```

---

## 🔐 Environment Configuration

### **.env.example**
```env
# API Configuration
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_API_TIMEOUT=10000

# Frontend Configuration
REACT_APP_ENV=development
REACT_APP_LOG_LEVEL=debug
REACT_APP_SENTRY_DSN=

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_CHAT=false

# Third-party Services
REACT_APP_GOOGLE_ANALYTICS_ID=
REACT_APP_STRIPE_PUBLIC_KEY=
```

### **.env.local (git-ignored)**
```env
# Copy from .env.example dan customize untuk development
REACT_APP_API_URL=http://localhost:3001/api
```

### **Load Environment Variables**
```javascript
// src/api/client.js

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const TIMEOUT = import.meta.env.REACT_APP_API_TIMEOUT || 10000;

console.log(`API Server: ${API_URL}`);
```

---

## 📂 Folder Structure Quick Reference

```
Untuk memahami struktur dengan cepat, ingat:

src/
├── api/              → HTTP requests & endpoints
├── assets/           → Images, icons, fonts
├── components/       → Reusable UI components
├── features/         → Feature modules (auth, cart, etc)
├── hooks/            → Global custom hooks
├── layouts/          → Layout wrappers
├── pages/            → Page components
├── store/            → Global Zustand stores
├── styles/           → Global CSS
├── types/            → Type definitions
├── utils/            → Helper functions
└── constants/        → App-wide constants
```

**Golden Rule:**
- Begini kalau bingung di mana letakkan file:
  - **Reusable komponen?** → `src/components/UI/`
  - **Business logic?** → `src/features/[feature-name]/`
  - **State management?** → `src/store/` atau `src/features/[feature]/store/`
  - **Helper functions?** → `src/utils/`

---

## 💻 Development Workflow

### **1. Start Development Server**

```bash
npm run dev
# Buka http://localhost:5173 di browser
```

### **2. Create a New Feature**

**Contoh: Membuat fitur Wishlist**

```bash
# 1. Create feature folder
mkdir -p src/features/wishlist/{pages,components,store,hooks,services}

# 2. Create wishlist store (src/features/wishlist/store/wishlistStore.js)
# 3. Create hooks (src/features/wishlist/hooks/useWishlist.js)
# 4. Create components (src/features/wishlist/components/WishlistItem.jsx)
# 5. Create pages (src/features/wishlist/pages/WishlistPage.jsx)
# 6. Update routes (src/AppRoutes.jsx)
```

### **3. Component Development Pattern**

```javascript
// 1. Create component file
// src/features/product/components/ProductCard.jsx

import React, { useState } from 'react';
import Button from '../../../components/UI/Button/Button';
import { useCart } from '../../cart/hooks/useCart';

export default function ProductCard({ product, onView }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();

  // Component logic
  const handleAddCart = () => {
    addToCart(product);
  };

  // Component JSX
  return (
    <div className="product-card">
      {/* Component UI */}
    </div>
  );
}

// 2. Export dari index (opsional, untuk cleaner imports)
// src/features/product/components/index.js
export { default as ProductCard } from './ProductCard';

// 3. Import & gunakan
// import { ProductCard } from '@/features/product/components';
```

---

## 🔑 Key Files & Commands

### **Root Configuration Files**

```
ecommerce-platform/
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS customization
├── postcss.config.js       # PostCSS config (for Tailwind)
├── .eslintrc.js           # ESLint rules
├── .prettierrc             # Code formatter settings
├── .gitignore             # Git ignore patterns
├── package.json           # Dependencies & scripts
├── .env.example           # Environment variables template
└── README.md              # Project documentation
```

### **Essential NPM Scripts**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .js,.jsx",
    "format": "prettier --write 'src/**/*.{js,jsx,css}'",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "type-check": "tsc --noEmit"
  }
}
```

### **Common Commands During Development**

```bash
# Development
npm run dev                    # Start dev server
npm run lint                   # Check code quality
npm run format                 # Auto-format code

# Testing
npm run test                   # Run unit tests
npm run test:ui                # Run tests with UI
npm run test -- --coverage     # Coverage report

# Building
npm run build                  # Build for production
npm run preview                # Preview production build

# Code Quality
npm run lint -- --fix          # Auto-fix linting issues
npm run format                 # Format all files
```

---

## 📦 Dependencies & Packages

### **Core Dependencies**

```javascript
// package.json important dependencies

{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x.x",      // Routing
    "zustand": "^4.x.x",               // State management
    "axios": "^1.x.x",                 // HTTP client
    "clsx": "^2.x.x",                  // Class merging utility
    "react-hook-form": "^7.x.x"        // Form management (optional)
  },
  "devDependencies": {
    "vite": "^4.x.x",
    "@vitejs/plugin-react": "^4.x.x",
    "tailwindcss": "^3.x.x",
    "postcss": "^8.x.x",
    "autoprefixer": "^10.x.x",
    "eslint": "^8.x.x",
    "prettier": "^3.x.x",
    "vitest": "^0.x.x",
    "@testing-library/react": "^14.x.x"
  }
}
```

### **Library Choice Justification**

| Library | Why | Alternative |
|---------|-----|-------------|
| **Zustand** | Lightweight, simple, no boilerplate | Redux, Recoil |
| **Axios** | Simple API, good DX | Fetch API, SWR |
| **React Router** | Industry standard | TanStack Router |
| **Tailwind** | Utility-first, flexible | CSS Modules, Styled Components |
| **React Hook Form** | Minimal re-renders, small bundle | Formik |

---

## 🧪 Testing Strategy

### **Test Structure**

```
tests/
├── unit/
│   ├── components/
│   │   └── Button.test.jsx
│   ├── hooks/
│   │   └── useCart.test.js
│   └── utils/
│       └── formatters.test.js
├── integration/
│   ├── checkout-flow.test.js
│   └── search-filter.test.js
├── e2e/
│   ├── checkout.e2e.js
│   └── auth.e2e.js
└── setup.js
```

### **Unit Test Example**

```javascript
// src/components/UI/Button/Button.test.jsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    await userEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
```

### **Running Tests**

```bash
npm run test                   # Run all tests
npm run test -- --watch       # Watch mode
npm run test -- --ui          # Visual UI
npm run test -- --coverage    # Coverage report
```

---

## ✅ Deployment Checklist

### **Pre-Deployment**

- [ ] All tests passing (`npm run test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Environment variables configured
- [ ] API endpoints verified
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors in production build
- [ ] Images optimized
- [ ] Unused dependencies removed

### **Production Build**

```bash
# 1. Build
npm run build

# 2. Preview (test production build locally)
npm run preview

# 3. Deploy dist/ folder to hosting
# Vercel, Netlify, GitHub Pages, atau server sendiri
```

### **Performance Checklist**

- [ ] Code splitting implemented for routes
- [ ] Images lazy-loaded
- [ ] Bundle size < 200KB (gzipped)
- [ ] Core Web Vitals optimized
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1
- [ ] Service Worker for offline support (optional)
- [ ] Cache headers configured correctly

### **Security Checklist**

- [ ] No sensitive data in frontend code
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] XSS protection (sanitize user input)
- [ ] CSRF tokens for state-changing requests
- [ ] Dependencies audited (`npm audit`)
- [ ] Secrets in .env files (never committed)

---

## 📚 Useful Resources

### **Documentation**
- React: https://react.dev
- React Router: https://reactrouter.com
- Tailwind CSS: https://tailwindcss.com
- Zustand: https://github.com/pmndrs/zustand
- Axios: https://axios-http.com
- Vite: https://vitejs.dev

### **Design Resources**
- Figma UI Kits for E-Commerce
- Tailwind UI Components
- Heroicons (Icons)
- Google Fonts

### **Learning Resources**
- Web Vitals: https://web.dev/vitals
- WCAG Accessibility: https://www.w3.org/WAI/WCAG21/quickref/
- React Best Practices: https://kent.do/blog
- Web Performance: https://web.dev/performance

---

## 🎯 Next Steps

### **Week 1-2: Foundation**
1. ✅ Setup project structure
2. ✅ Configure Tailwind & styling
3. ✅ Create base components (Button, Card, Input, etc)
4. ✅ Setup routing & layouts

### **Week 3-4: Authentication**
1. ✅ Create auth pages (Login, Register)
2. ✅ Setup auth store (Zustand)
3. ✅ Implement API integration
4. ✅ Protected routes

### **Week 5-6: Product Features**
1. ✅ Product listing with filters
2. ✅ Search functionality
3. ✅ Product detail page
4. ✅ Wishlist feature

### **Week 7-8: Shopping Features**
1. ✅ Shopping cart
2. ✅ Checkout flow (5 steps)
3. ✅ Order management
4. ✅ Payment integration

### **Week 9-10: User Features**
1. ✅ User profile
2. ✅ Address book
3. ✅ Order history
4. ✅ Reviews & ratings

### **Week 11-12: Polish & Deploy**
1. ✅ Testing & bug fixes
2. ✅ Performance optimization
3. ✅ SEO optimization
4. ✅ Deployment

---

## 📞 Support & Troubleshooting

### **Common Issues**

**Issue: Tailwind styles not working**
```bash
# Solution: Ensure content paths in tailwind.config.js
# Check that your JSX files are in the content paths

# Rebuild Tailwind
npm run dev  # or restart dev server
```

**Issue: Module not found errors**
```bash
# Solution: Check import paths
# Use absolute imports with jsconfig.json or vite.config.js

// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Issue: State not updating**
```javascript
// Make sure you're not mutating state directly
// Instead of:
state.items.push(newItem)  // ❌ Wrong

// Do:
set(state => ({
  items: [...state.items, newItem]  // ✅ Correct
}))
```

---

## 🏁 Conclusion

Anda sekarang memiliki panduan lengkap untuk membangun E-Commerce Platform modern! 

**Ingat:**
- ✅ Mulai dari kecil (MVP)
- ✅ Test sambil develop
- ✅ Refactor ketika needed
- ✅ Dokumentasi adalah teman Anda
- ✅ User experience adalah prioritas

**Happy Coding! 🚀**

---

## 📋 Document Index

1. [01_ARSITEKTUR_FOLDER.md](01_ARSITEKTUR_FOLDER.md) - Folder structure
2. [02_TECHNICAL_ARCHITECTURE.md](02_TECHNICAL_ARCHITECTURE.md) - Tech stack & architecture
3. [03_ALUR_KERJA_DETAIL.md](03_ALUR_KERJA_DETAIL.md) - Authentication, Cart, Checkout flows
4. [04_SPESIFIKASI_FITUR.md](04_SPESIFIKASI_FITUR.md) - Search, Filter, Cart, Address features
5. [05_UI_UX_KOMPONEN.md](05_UI_UX_KOMPONEN.md) - Design system & UI components
6. [06_SETUP_GUIDE.md](06_SETUP_GUIDE.md) - This file!

