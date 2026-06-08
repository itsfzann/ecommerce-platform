# 🏗️ TECHNICAL ARCHITECTURE - E-Commerce Platform

## Tech Stack yang Digunakan

```
Frontend Framework    : React.js 18+
State Management     : Zustand
Styling             : Tailwind CSS
HTTP Client         : Axios
Authentication      : JWT (JSON Web Token)
Form Management     : React Hook Form
Data Fetching       : React Query / TanStack Query
Build Tool          : Vite / Webpack
Testing             : Vitest / Jest
Code Quality        : ESLint + Prettier
CSS-in-JS (optional): Styled Components
```

---

## 🎯 Architecture Principles

### 1. **Clean Architecture**
- Separation of concerns
- Dependency inversion
- Independent testable
- Framework agnostic business logic

### 2. **Feature-Based Structure**
- Organized by business features
- Each feature is self-contained
- Easy to locate & maintain code

### 3. **Component Composition**
- Small, focused components
- Reusable across features
- Props-based configuration

### 4. **State Management Strategy**
```
┌─────────────────────────────────────────┐
│           Global State (Zustand)         │
│  - Auth, Notification, Theme, UI State  │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│         Feature State (Zustand)         │
│  - Product, Cart, Checkout, User       │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│         Component Local State (useState) │
│  - Form input, UI toggles, temp data   │
└─────────────────────────────────────────┘
```

---

## 📊 Data Flow Architecture

### **Unidirectional Data Flow**
```
UI Component
    ↓
Hook (useProduct, useCart, etc)
    ↓
Zustand Store / Local State
    ↓
API Service
    ↓
HTTP Client (Axios)
    ↓
Backend API
```

### **Reactive Updates**
```
Backend API sends data
    ↓
Zustand store updates
    ↓
Components subscribed to store re-render
    ↓
UI reflects changes
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────┐
│            User Login                        │
├─────────────────────────────────────────────┤
│ 1. User enters credentials                  │
│ 2. POST /api/auth/login                     │
│ 3. Backend validates & returns JWT token    │
│ 4. Store token in localStorage/sessionStore│
│ 5. Add token to every API request header    │
│ 6. Redirect to home/dashboard               │
└─────────────────────────────────────────────┘

Token in Request Header:
├─ Authorization: Bearer {JWT_TOKEN}
└─ Refresh token rotation (optional)

Token Expiration Handling:
├─ 401 response → Attempt refresh token
├─ If success → Retry original request
└─ If fail → Logout & redirect to login
```

### **Auth Store (Zustand)**
```javascript
// src/features/auth/store/authStore.js

import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('authToken'),
  isAuthenticated: !!localStorage.getItem('authToken'),
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem('authToken', token);
    set({ token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('authToken');
    set({ user: null, token: null, isAuthenticated: false });
  },
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
```

---

## 🛒 Cart State Management (Zustand)

```javascript
// src/features/cart/store/cartStore.js

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useCartStore = create(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        
        // Add to cart
        addItem: (product, quantity = 1) => 
          set((state) => ({
            items: [...state.items, { ...product, quantity }]
          })),
        
        // Remove from cart
        removeItem: (productId) =>
          set((state) => ({
            items: state.items.filter(item => item.id !== productId)
          })),
        
        // Update quantity
        updateQuantity: (productId, quantity) =>
          set((state) => ({
            items: state.items.map(item =>
              item.id === productId ? { ...item, quantity } : item
            )
          })),
        
        // Calculate totals
        getTotals: () => {
          const { items } = get();
          const subtotal = items.reduce(
            (sum, item) => sum + (item.price * item.quantity),
            0
          );
          const tax = subtotal * 0.1;
          const shipping = subtotal > 100 ? 0 : 10;
          const total = subtotal + tax + shipping;
          
          return { subtotal, tax, shipping, total };
        },
        
        // Clear cart
        clearCart: () => set({ items: [] }),
      }),
      {
        name: 'cart-store' // Persist to localStorage
      }
    )
  )
);
```

---

## 💳 Checkout Flow

```
┌──────────────────────────────────────────────────┐
│            CHECKOUT FLOW DIAGRAM                  │
├──────────────────────────────────────────────────┤
│                                                   │
│  1. CART REVIEW                                   │
│     ├─ Review items                              │
│     ├─ Edit quantities                           │
│     └─ Apply coupon                              │
│         ↓                                         │
│  2. SHIPPING ADDRESS                             │
│     ├─ Select saved address                      │
│     ├─ Or enter new address                      │
│     └─ Validate address                          │
│         ↓                                         │
│  3. SHIPPING METHOD                              │
│     ├─ Display available methods                 │
│     ├─ Show cost & delivery time                 │
│     └─ Select preferred method                   │
│         ↓                                         │
│  4. PAYMENT METHOD                               │
│     ├─ Credit Card                               │
│     ├─ E-Wallet                                  │
│     ├─ Bank Transfer                             │
│     └─ COD (Cash on Delivery)                    │
│         ↓                                         │
│  5. ORDER REVIEW & CONFIRMATION                  │
│     ├─ Final summary                             │
│     ├─ Verify details                            │
│     └─ Submit order                              │
│         ↓                                         │
│  6. PAYMENT PROCESSING                           │
│     ├─ Process payment                           │
│     ├─ Handle callbacks                          │
│     └─ Update order status                       │
│         ↓                                         │
│  7. ORDER CONFIRMATION                           │
│     ├─ Display order number                      │
│     ├─ Show tracking info                        │
│     └─ Send confirmation email                   │
│                                                   │
└──────────────────────────────────────────────────┘
```

### **Checkout Store (Zustand)**
```javascript
// src/features/checkout/store/checkoutStore.js

import { create } from 'zustand';

export const useCheckoutStore = create((set, get) => ({
  // State
  currentStep: 1, // 1: Cart, 2: Address, 3: Shipping, 4: Payment, 5: Review
  shippingAddress: null,
  shippingMethod: null,
  paymentMethod: null,
  orderData: null,
  isProcessing: false,
  error: null,

  // Actions
  setStep: (step) => set({ currentStep: step }),
  
  setShippingAddress: (address) => set({ shippingAddress: address }),
  
  setShippingMethod: (method) => set({ shippingMethod: method }),
  
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  
  submitOrder: async () => {
    const { shippingAddress, shippingMethod, paymentMethod } = get();
    
    set({ isProcessing: true });
    try {
      // Validate all required fields
      if (!shippingAddress || !shippingMethod || !paymentMethod) {
        throw new Error('Missing required information');
      }
      
      // Submit to API
      const response = await submitOrderAPI({
        shippingAddress,
        shippingMethod,
        paymentMethod,
      });
      
      set({ orderData: response.data });
      set({ currentStep: 7 }); // Go to confirmation
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isProcessing: false });
    }
  },

  reset: () => set({
    currentStep: 1,
    shippingAddress: null,
    shippingMethod: null,
    paymentMethod: null,
    orderData: null,
  }),
}));
```

---

## 🔍 Search & Filter Architecture

```
┌──────────────────────────────────────────────┐
│         Search Query Input                    │
├──────────────────────────────────────────────┤
│              ↓                                 │
│         Debounce (300ms)                      │
│              ↓                                 │
│    Update Search Store                        │
│              ↓                                 │
│    Combine with Filters                       │
│              ↓                                 │
│    Build Query String                         │
│              ↓                                 │
│    Fetch Products from API                    │
│              ↓                                 │
│    Update Products Store                      │
│              ↓                                 │
│    Render Product Grid                        │
└──────────────────────────────────────────────┘
```

### **Filter Categories**
- **Category**: Electronics, Clothing, Home, etc
- **Price Range**: Min - Max
- **Rating**: 1-5 stars
- **Availability**: In Stock, Low Stock
- **Sort**: Price (asc/desc), Newest, Most Popular, Highest Rating

### **Search Store**
```javascript
export const useSearchStore = create((set) => ({
  query: '',
  filters: {
    category: [],
    priceRange: [0, 1000000],
    rating: 0,
    availability: 'all',
  },
  sortBy: 'relevant', // relevant, price_asc, price_desc, newest, popular
  
  setQuery: (query) => set({ query }),
  setFilters: (filters) => set({ filters }),
  setSortBy: (sort) => set({ sortBy: sort }),
  
  // Get combined URL params for API
  getQueryParams: () => {
    const state = get();
    return {
      q: state.query,
      category: state.filters.category.join(','),
      minPrice: state.filters.priceRange[0],
      maxPrice: state.filters.priceRange[1],
      rating: state.filters.rating,
      availability: state.filters.availability,
      sort: state.sortBy,
    };
  },
}));
```

---

## 🎣 Custom Hooks Architecture

### **useProducts - Fetch Products with Caching**
```javascript
export const useProducts = (filters, options = {}) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await productAPI.getProducts(filters);
        setProducts(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  return { products, isLoading, error };
};
```

### **useCart - Cart Operations**
```javascript
export const useCart = () => {
  const cartStore = useCartStore();

  const addToCart = (product, quantity = 1) => {
    cartStore.addItem(product, quantity);
    // Show success toast
  };

  const removeFromCart = (productId) => {
    cartStore.removeItem(productId);
  };

  const updateQty = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      cartStore.updateQuantity(productId, quantity);
    }
  };

  const { subtotal, tax, shipping, total } = cartStore.getTotals();

  return {
    items: cartStore.items,
    addToCart,
    removeFromCart,
    updateQty,
    subtotal,
    tax,
    shipping,
    total,
  };
};
```

---

## 🚀 Performance Optimization

### **1. Code Splitting**
- Lazy load pages using React.lazy()
- Dynamic imports for heavy components

```javascript
const ProductPage = lazy(() => import('./features/product/pages/ProductDetailPage'));
const CheckoutPage = lazy(() => import('./features/checkout/pages/CheckoutPage'));

// In Routes:
<Route path="/product/:id" element={<Suspense fallback={<Loader />}><ProductPage /></Suspense>} />
```

### **2. Memoization**
```javascript
const ProductCard = memo(({ product, onAddCart }) => (
  // Component
));

export default ProductCard;
```

### **3. Image Optimization**
- Use next-gen formats (WebP)
- Lazy loading images
- Responsive images with srcset

### **4. Bundle Size**
- Tree-shaking unused code
- Use lighter libraries (zustand vs Redux)
- Minimize dependencies

---

## 📋 API Request/Response Pattern

### **Standardized API Response**
```javascript
{
  success: true,
  status: 200,
  data: { /* actual data */ },
  message: "Success message",
  timestamp: "2024-01-15T10:30:00Z"
}

// Error Response
{
  success: false,
  status: 400,
  error: "Error code",
  message: "Human readable error",
  details: { /* validation errors */ }
}
```

### **Axios Instance with Interceptors**
```javascript
// src/api/client.js

import axios from 'axios';
import { useAuthStore } from '../features/auth/store/authStore';

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});

// Request Interceptor
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
client.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data);
  }
);

export default client;
```

---

## 🔄 Component Lifecycle & Hooks Usage

### **Product Detail Page Example**
```javascript
// src/features/product/pages/ProductDetailPage.jsx

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCart } from '../hooks/useCart';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productAPI.getProductById(id);
        setProduct(data);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  if (isLoading) return <LoadingSkeletons />;
  if (!product) return <NotFound />;

  return (
    <div className="product-detail">
      <ProductImage images={product.images} />
      <ProductInfo 
        product={product}
        onAddCart={() => addToCart(product)}
      />
      <RelatedProducts category={product.category} />
    </div>
  );
}
```

---

## ✅ Best Practices Checklist

- [x] Separation of concerns (components, hooks, stores, services)
- [x] DRY principle (reusable components, utilities, hooks)
- [x] SOLID principles (especially Single Responsibility)
- [x] Proper error handling with try-catch
- [x] Loading states for better UX
- [x] Proper TypeScript/JSDoc types
- [x] Performance optimization (memoization, code splitting)
- [x] Consistent naming conventions
- [x] Proper git workflow & commits
- [x] Testing coverage (unit, integration, e2e)
- [x] Accessibility (WCAG 2.1)
- [x] Mobile-first responsive design

