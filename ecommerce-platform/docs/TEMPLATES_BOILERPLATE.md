# 📋 TEMPLATE & BOILERPLATE CODE - Ready to Use!

Kumpulan template siap pakai untuk mempercepat development. Semua code sudah production-ready dan mengikuti best practices yang dijelaskan di dokumentasi.

---

## 🎯 Quick Navigation

- [1. Project Setup Template](#1-project-setup-template)
- [2. API Client Setup](#2-api-client-setup)
- [3. Zustand Store Template](#3-zustand-store-template)
- [4. Custom Hook Template](#4-custom-hook-template)
- [5. Feature Module Template](#5-feature-module-template)
- [6. Component Template](#6-component-template)
- [7. Page Template](#7-page-template)
- [8. Form Component Template](#8-form-component-template)
- [9. API Service Template](#9-api-service-template)

---

## 1. Project Setup Template

### **vite.config.js**
```javascript
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
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
```

### **tailwind.config.js**
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F9FF',
          100: '#E6F2FF',
          200: '#BAD9FF',
          300: '#7EC0FF',
          400: '#44A8FF',
          500: '#0066CC',
          600: '#0052A3',
          700: '#003D7A',
          800: '#002851',
          900: '#001328',
        },
        accent: {
          50: '#FFF5F0',
          500: '#FF6B35',
          600: '#E55A27',
        },
        success: {
          500: '#10B981',
          600: '#059669',
        },
        warning: {
          500: '#F59E0B',
          600: '#D97706',
        },
        error: {
          500: '#EF4444',
          600: '#DC2626',
        },
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        slideIn: {
          'from': { transform: 'translateX(16px)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
```

### **postcss.config.js**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### **.eslintrc.js**
```javascript
export default {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
  },
}
```

### **.prettierrc**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "bracketSpacing": true,
  "endOfLine": "lf"
}
```

---

## 2. API Client Setup

### **src/api/client.js**
```javascript
import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/authStore';

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const TIMEOUT = parseInt(import.meta.env.REACT_APP_API_TIMEOUT) || 10000;

const client = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
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
    const originalRequest = error.config;

    // Handle 401 - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { token } = response.data;
        localStorage.setItem('authToken', token);

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return client(originalRequest);
      } catch (refreshError) {
        // Logout user
        const authStore = useAuthStore();
        authStore.logout();
        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default client;
```

### **src/api/endpoints.js**
```javascript
export const endpoints = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },

  // Products
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id) => `/products/${id}`,
    SEARCH: '/products/search',
  },

  // Cart
  CART: {
    LIST: '/cart',
    ADD: '/cart/items',
    UPDATE: (id) => `/cart/items/${id}`,
    REMOVE: (id) => `/cart/items/${id}`,
  },

  // Orders
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    DETAIL: (id) => `/orders/${id}`,
  },

  // User
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/profile',
    ADDRESSES: '/user/addresses',
    ADDRESS_CREATE: '/user/addresses',
    ADDRESS_UPDATE: (id) => `/user/addresses/${id}`,
    ADDRESS_DELETE: (id) => `/user/addresses/${id}`,
  },
};
```

---

## 3. Zustand Store Template

### **Store dengan Persist & DevTools**
```javascript
// src/store/appStore.js

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useAppStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Theme
        theme: 'light',
        setTheme: (theme) => set({ theme }),

        // Language
        language: 'id',
        setLanguage: (language) => set({ language }),

        // Sidebar
        sidebarOpen: true,
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

        // User preferences
        preferences: {
          emailNotifications: true,
          pushNotifications: false,
        },
        updatePreferences: (prefs) =>
          set((state) => ({
            preferences: { ...state.preferences, ...prefs },
          })),
      }),
      {
        name: 'app-store',
        partialize: (state) => ({
          theme: state.theme,
          language: state.language,
          preferences: state.preferences,
        }),
      }
    ),
    { name: 'App Store' }
  )
);
```

---

## 4. Custom Hook Template

### **src/hooks/useFetch.js** (Reusable data fetching)
```javascript
import { useState, useEffect } from 'react';
import client from '@/api/client';

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await client.get(url);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error fetching data');
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  const refetch = async () => {
    setIsLoading(true);
    try {
      const result = await client.get(url);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, refetch };
};
```

### **src/hooks/useDebounce.js**
```javascript
import { useState, useEffect } from 'react';

export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
```

### **src/hooks/useAsync.js**
```javascript
import { useEffect, useState, useCallback } from 'react';

export const useAsync = (asyncFn, immediate = true) => {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setValue(null);
    setError(null);
    try {
      const response = await asyncFn();
      setValue(response);
      setStatus('success');
      return response;
    } catch (err) {
      setError(err);
      setStatus('error');
      throw err;
    }
  }, [asyncFn]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error };
};
```

---

## 5. Feature Module Template

### **Complete Feature Folder Structure**

```javascript
// src/features/newFeature/store/newFeatureStore.js

import { create } from 'zustand';

export const useNewFeatureStore = create((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  setItems: (items) => set({ items }),
  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
```

```javascript
// src/features/newFeature/hooks/useNewFeature.js

import { useNewFeatureStore } from '../store/newFeatureStore';
import { useAsync } from '@/hooks/useAsync';
import * as service from '../services/newFeatureService';

export const useNewFeature = () => {
  const { items, isLoading, error } = useNewFeatureStore();
  const setItems = useNewFeatureStore((state) => state.setItems);

  const { execute: fetchItems } = useAsync(async () => {
    const data = await service.getItems();
    setItems(data);
    return data;
  });

  return {
    items,
    isLoading,
    error,
    fetchItems,
  };
};
```

```javascript
// src/features/newFeature/services/newFeatureService.js

import client from '@/api/client';
import { endpoints } from '@/api/endpoints';

export const newFeatureService = {
  async getItems() {
    return await client.get(endpoints.ITEMS.LIST);
  },

  async getItemById(id) {
    return await client.get(endpoints.ITEMS.DETAIL(id));
  },

  async createItem(data) {
    return await client.post(endpoints.ITEMS.CREATE, data);
  },

  async updateItem(id, data) {
    return await client.patch(endpoints.ITEMS.UPDATE(id), data);
  },

  async deleteItem(id) {
    return await client.delete(endpoints.ITEMS.DELETE(id));
  },
};
```

---

## 6. Component Template

### **Reusable Component Best Practice**
```javascript
// src/components/UI/Button/Button.jsx

import { useState, forwardRef } from 'react';
import cn from 'clsx';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  className,
  onClick,
  ...props
}, ref) => {
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
    danger: 'bg-error-500 hover:bg-error-600 text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        'font-semibold rounded-lg transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
```

---

## 7. Page Template

### **Feature Page Template**
```javascript
// src/features/newFeature/pages/NewFeaturePage.jsx

import { useEffect } from 'react';
import { useNewFeature } from '../hooks/useNewFeature';
import NewFeatureList from '../components/NewFeatureList';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import ErrorAlert from '@/components/Common/ErrorAlert';

export default function NewFeaturePage() {
  const { items, isLoading, error, fetchItems } = useNewFeature();

  useEffect(() => {
    fetchItems();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorAlert
        message={error}
        onRetry={fetchItems}
      />
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📦</div>
        <p className="text-gray-600">No items found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">New Feature</h1>
      <NewFeatureList items={items} />
    </div>
  );
}
```

---

## 8. Form Component Template

### **Reusable Form Component**
```javascript
// src/components/Form/FormInput.jsx

import { forwardRef } from 'react';
import cn from 'clsx';

const FormInput = forwardRef(({
  label,
  placeholder,
  error,
  type = 'text',
  disabled = false,
  required = false,
  helperText,
  startIcon,
  endIcon,
  className,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {startIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {startIcon}
          </div>
        )}

        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full px-4 py-2.5 border rounded-lg transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
            startIcon && 'pl-10',
            endIcon && 'pr-10',
            error
              ? 'border-error-500 focus:ring-error-500'
              : 'border-gray-300 focus:border-primary-500',
            className
          )}
          {...props}
        />

        {endIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {endIcon}
          </div>
        )}
      </div>

      {error && (
        <p className="text-error-500 text-sm mt-1">{error}</p>
      )}

      {helperText && !error && (
        <p className="text-gray-600 text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;
```

---

## 9. API Service Template

### **Complete API Service Pattern**
```javascript
// src/api/services/productService.js

import client from '@/api/client';
import { endpoints } from '@/api/endpoints';

class ProductService {
  async getProducts(params = {}) {
    return client.get(endpoints.PRODUCTS.LIST, { params });
  }

  async getProductById(id) {
    return client.get(endpoints.PRODUCTS.DETAIL(id));
  }

  async searchProducts(query, params = {}) {
    return client.get(endpoints.PRODUCTS.SEARCH, {
      params: { ...params, q: query },
    });
  }

  async createProduct(data) {
    return client.post(endpoints.PRODUCTS.CREATE, data);
  }

  async updateProduct(id, data) {
    return client.patch(endpoints.PRODUCTS.UPDATE(id), data);
  }

  async deleteProduct(id) {
    return client.delete(endpoints.PRODUCTS.DELETE(id));
  }
}

export default new ProductService();
```

---

## 📋 Checklist Menggunakan Template

- [ ] Copy template yang sesuai
- [ ] Replace `newFeature` dengan nama feature Anda
- [ ] Update API endpoints di `src/api/endpoints.js`
- [ ] Sesuaikan store actions dengan kebutuhan
- [ ] Implementasikan UI components
- [ ] Test dengan data dummy terlebih dahulu
- [ ] Connect ke API backend
- [ ] Test dengan real data

---

## 🚀 Usage Example

```bash
# 1. Copy store template
# 2. Create folder
mkdir -p src/features/products/{store,hooks,services,pages,components}

# 3. Create files
touch src/features/products/store/productStore.js
touch src/features/products/hooks/useProducts.js
touch src/features/products/services/productService.js
touch src/features/products/pages/ProductListPage.jsx

# 4. Paste & customize templates
# 5. Start development!
```

---

**Semua template siap untuk copy-paste dan customize sesuai kebutuhan project Anda!**

