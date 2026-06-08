# 📁 ARSITEKTUR FOLDER - E-Commerce Platform

## Overview
Struktur folder yang scalable, modular, dan maintainable mengikuti best-practice industri (Clean Architecture + Feature-Based Structure).

---

## 📂 Struktur Folder Lengkap

```
ecommerce-platform/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   ├── robots.txt
│   └── images/
│       ├── logo.png
│       ├── banner/
│       └── icons/
│
├── src/
│   ├── index.css                    # Global styles + Tailwind
│   ├── index.js                     # Entry point
│   ├── App.jsx                      # Root component
│   ├── AppRoutes.jsx                # Routing configuration
│   │
│   ├── api/                         # 🔌 External API Integration
│   │   ├── client.js                # Axios instance configuration
│   │   ├── endpoints.js             # API endpoint constants
│   │   ├── auth.api.js              # Authentication endpoints
│   │   ├── product.api.js           # Product endpoints
│   │   ├── cart.api.js              # Cart endpoints
│   │   ├── order.api.js             # Order endpoints
│   │   └── user.api.js              # User profile endpoints
│   │
│   ├── assets/                      # 🖼️ Static Assets
│   │   ├── images/
│   │   │   ├── products/
│   │   │   ├── banners/
│   │   │   ├── avatars/
│   │   │   └── illustrations/
│   │   ├── icons/
│   │   ├── fonts/
│   │   └── videos/
│   │
│   ├── components/                  # 🧩 Reusable UI Components
│   │   ├── Common/
│   │   │   ├── Header/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Header.module.css
│   │   │   │   └── Header.test.jsx
│   │   │   ├── Footer/
│   │   │   ├── Navbar/
│   │   │   ├── Sidebar/
│   │   │   └── Loading/
│   │   │
│   │   ├── UI/
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Button.module.css
│   │   │   │   └── Button.test.jsx
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   ├── Toast/
│   │   │   ├── Badge/
│   │   │   ├── Rating/
│   │   │   ├── Dropdown/
│   │   │   ├── Checkbox/
│   │   │   └── Radio/
│   │   │
│   │   ├── Product/
│   │   │   ├── ProductCard/
│   │   │   ├── ProductGrid/
│   │   │   ├── ProductDetail/
│   │   │   └── ProductImage/
│   │   │
│   │   ├── Cart/
│   │   │   ├── CartItem/
│   │   │   ├── CartSummary/
│   │   │   └── CartEmpty/
│   │   │
│   │   └── Form/
│   │       ├── AddressForm/
│   │       ├── PaymentForm/
│   │       └── ShippingForm/
│   │
│   ├── features/                    # 📦 Feature Modules (Domain Logic)
│   │   ├── auth/
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── RegisterPage.jsx
│   │   │   │   └── ForgotPasswordPage.jsx
│   │   │   ├── components/
│   │   │   ├── store/
│   │   │   │   ├── authStore.js     # Zustand auth store
│   │   │   │   └── authSlice.js
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.js
│   │   │   │   └── useLogin.js
│   │   │   └── types/
│   │   │       └── auth.types.js
│   │   │
│   │   ├── product/
│   │   │   ├── pages/
│   │   │   │   ├── ProductListPage.jsx
│   │   │   │   └── ProductDetailPage.jsx
│   │   │   ├── components/
│   │   │   ├── store/
│   │   │   │   └── productStore.js
│   │   │   ├── hooks/
│   │   │   │   ├── useProducts.js
│   │   │   │   ├── useProductDetail.js
│   │   │   │   └── useFilters.js
│   │   │   ├── services/
│   │   │   │   └── productService.js
│   │   │   └── types/
│   │   │
│   │   ├── cart/
│   │   │   ├── pages/
│   │   │   │   └── CartPage.jsx
│   │   │   ├── components/
│   │   │   ├── store/
│   │   │   │   └── cartStore.js
│   │   │   ├── hooks/
│   │   │   │   ├── useCart.js
│   │   │   │   └── useCartItem.js
│   │   │   ├── services/
│   │   │   │   └── cartService.js
│   │   │   └── types/
│   │   │
│   │   ├── checkout/
│   │   │   ├── pages/
│   │   │   │   ├── CheckoutPage.jsx
│   │   │   │   ├── ShippingPage.jsx
│   │   │   │   ├── PaymentPage.jsx
│   │   │   │   └── OrderConfirmationPage.jsx
│   │   │   ├── components/
│   │   │   ├── store/
│   │   │   │   └── checkoutStore.js
│   │   │   ├── hooks/
│   │   │   │   ├── useCheckout.js
│   │   │   │   └── usePayment.js
│   │   │   ├── services/
│   │   │   │   └── checkoutService.js
│   │   │   └── types/
│   │   │
│   │   ├── user/
│   │   │   ├── pages/
│   │   │   │   ├── ProfilePage.jsx
│   │   │   │   ├── AddressBookPage.jsx
│   │   │   │   └── OrderHistoryPage.jsx
│   │   │   ├── components/
│   │   │   ├── store/
│   │   │   │   └── userStore.js
│   │   │   └── hooks/
│   │   │
│   │   └── search/
│   │       ├── pages/
│   │       │   └── SearchPage.jsx
│   │       ├── components/
│   │       ├── store/
│   │       │   └── searchStore.js
│   │       └── hooks/
│   │
│   ├── hooks/                       # 🎣 Global Custom Hooks
│   │   ├── useAuth.js
│   │   ├── useQuery.js
│   │   ├── useFetch.js
│   │   ├── useDebounce.js
│   │   ├── useLocalStorage.js
│   │   ├── usePagination.js
│   │   ├── useInfiniteScroll.js
│   │   └── useNotification.js
│   │
│   ├── layouts/                     # 🎨 Layout Components
│   │   ├── MainLayout.jsx
│   │   ├── AuthLayout.jsx
│   │   ├── AdminLayout.jsx
│   │   ├── BaseLayout.module.css
│   │   └── LayoutContext.js
│   │
│   ├── middleware/                  # 🛡️ Middleware & Interceptors
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── requestInterceptor.js
│   │   └── responseInterceptor.js
│   │
│   ├── pages/                       # 📄 Page Components
│   │   ├── HomePage.jsx
│   │   ├── NotFoundPage.jsx
│   │   ├── ErrorPage.jsx
│   │   └── MaintenancePage.jsx
│   │
│   ├── store/                       # 🏪 Global State Management (Zustand)
│   │   ├── index.js                 # Export all stores
│   │   ├── appStore.js              # App-wide state
│   │   ├── notificationStore.js     # Toast/notification state
│   │   ├── filterStore.js           # Global filter state
│   │   └── devtools.js              # Redux DevTools integration
│   │
│   ├── styles/                      # 🎨 Global Styles
│   │   ├── globals.css              # Global utilities & resets
│   │   ├── colors.css               # CSS Variables for colors
│   │   ├── typography.css           # Font definitions
│   │   ├── animations.css           # Animation keyframes
│   │   └── tailwind.config.js
│   │
│   ├── types/                       # 📋 TypeScript/JSDoc Types
│   │   ├── index.d.ts
│   │   ├── api.types.js
│   │   ├── product.types.js
│   │   ├── user.types.js
│   │   └── cart.types.js
│   │
│   ├── utils/                       # 🛠️ Utility Functions
│   │   ├── helpers/
│   │   │   ├── formatters.js        # Format currency, date, etc
│   │   │   ├── validators.js        # Email, phone validation
│   │   │   ├── calculations.js      # Cart totals, discounts
│   │   │   └── constants.js         # App constants
│   │   ├── storage/
│   │   │   ├── localStorage.js
│   │   │   ├── sessionStorage.js
│   │   │   └── cookieManager.js
│   │   └── logger/
│   │       └── logger.js            # Centralized logging
│   │
│   ├── constants/                   # 📌 Application Constants
│   │   ├── app.constants.js
│   │   ├── api.constants.js
│   │   ├── error.constants.js
│   │   ├── validation.constants.js
│   │   └── feature.flags.js
│   │
│   └── context/                     # 🎯 React Context (untuk data non-store)
│       ├── ThemeContext.js
│       ├── LanguageContext.js
│       └── NotificationContext.js
│
├── tests/                           # 🧪 Testing
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   ├── setup.js
│   └── mocks/
│
├── .env.example                     # Environment variables template
├── .env.local                       # Local env (gitignored)
├── .gitignore
├── package.json
├── package-lock.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js                   # atau webpack.config.js
├── .eslintrc.js
├── .prettierrc
├── .babelrc
├── README.md
└── CONTRIBUTING.md
```

---

## 🎯 Penjelasan Struktur

### **1. `src/components/`** - Presentational Components
- **Reusable**, stateless, menerima props
- Tidak memiliki business logic
- Mudah untuk ditest dan di-reuse

### **2. `src/features/`** - Feature Modules
- **Feature-based organization** (auth, product, cart, checkout)
- Setiap feature memiliki:
  - `pages/` - Halaman/screen
  - `components/` - Sub-components khusus feature
  - `store/` - Zustand state management
  - `hooks/` - Custom hooks
  - `services/` - Business logic & API calls
  - `types/` - Type definitions

### **3. `src/store/`** - Global State (Zustand)
- Centralized state management
- Shared across features

### **4. `src/api/`** - API Integration
- Centralized HTTP client configuration
- API endpoints definitions
- Request/response interceptors

### **5. `src/hooks/`** - Reusable Hooks
- Custom logic yang bisa dipakai di mana-mana
- `useQuery`, `useFetch`, `usePagination`, dll

### **6. `src/utils/`** - Utility Functions
- Helpers, formatters, validators
- Pure functions
- No side effects

---

## ✅ Best Practices Applied

1. **Modular & Scalable**: Mudah add fitur baru
2. **Separation of Concerns**: Logic terpisah dari presentasi
3. **DRY Principle**: Reusable components & hooks
4. **Easy Navigation**: Clear folder hierarchy
5. **Feature-Based**: Organized by business features
6. **Type Safety**: Centralized type definitions
7. **Testing**: Dedicated test structure
8. **Performance**: Split code, lazy loading ready

---

## 🚀 Contoh Workflow Menambah Feature Baru

**Scenario: Menambah fitur "Wishlist"**

```
src/features/wishlist/
├── pages/
│   └── WishlistPage.jsx
├── components/
│   ├── WishlistItem.jsx
│   └── WishlistEmpty.jsx
├── store/
│   └── wishlistStore.js
├── hooks/
│   └── useWishlist.js
├── services/
│   └── wishlistService.js
└── types/
    └── wishlist.types.js
```

Cukup buat folder `wishlist` dengan struktur yang sama, dan sudah siap go!

---

## 📊 Folder Statistics

- **Total Base Folders**: ~40+
- **Easily Extensible**: New features tidak perlu restructure
- **Scalable to**: 200k+ LOC applications
- **Team Friendly**: Clear ownership & responsibilities
