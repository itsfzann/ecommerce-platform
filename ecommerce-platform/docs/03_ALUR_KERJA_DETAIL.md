# 🔄 DETAIL ALUR KERJA (WORKFLOW) - E-Commerce Platform

---

## 1️⃣ ALUR AUTENTIKASI (Authentication Flow)

### **User Journey: Login & Registration**

```
┌─────────────────────────────────────────────────────────┐
│                   LANDING PAGE                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ [Sign In Button] ──→ OR ← [Sign Up Button]          │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                         ↓
        ┌────────────────┴────────────────┐
        ↓                                   ↓
  ┌─────────────┐                  ┌──────────────┐
  │  LOGIN PAGE │                  │ REGISTER PAGE│
  └─────────────┘                  └──────────────┘
        ↓                                   ↓
  [Email/Password]                [Full Name, Email, Password]
        ↓                                   ↓
  [Sign In Button]                [Sign Up Button]
        ↓                                   ↓
  POST /auth/login            POST /auth/register
        ↓                                   ↓
        └────────────────┬────────────────┘
                         ↓
              VALIDATE & GET JWT TOKEN
                         ↓
        ┌────────────────┴────────────────┐
        ↓                                   ↓
    SUCCESS                             ERROR
        ↓                                   ↓
  Store token in                  Show error message
  localStorage                    "Invalid credentials"
        ↓                          or
  Update authStore              "Email already exists"
        ↓
  Redirect to Home
  or Dashboard
```

### **Implementation Details**

#### **Step 1: Register Page Component**
```javascript
// src/features/auth/pages/RegisterPage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authAPI } from '../../../api/auth.api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore(state => state.setUser);
  const setToken = useAuthStore(state => state.setToken);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nama lengkap harus diisi';
    }
    
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Email tidak valid';
    }
    
    if (formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }
    
    return Object.keys(newErrors).length === 0 ? null : newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      // Save token & user data
      setToken(response.data.token);
      setUser(response.data.user);
      
      // Show success toast
      showSuccessToast('Berhasil mendaftar! Selamat datang di platform kami.');
      
      // Redirect to home
      navigate('/');
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Registrasi gagal';
      setErrors({ submit: errMsg });
      showErrorToast(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Daftar Akun</h1>
        
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.submit}
          </div>
        )}

        {/* Full Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Masukkan nama lengkap"
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="nama@email.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Minimal 8 karakter"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* Confirm Password Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Konfirmasi Password</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ulangi password"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
        >
          {isLoading ? 'Mendaftar...' : 'Daftar'}
        </button>

        {/* Sign In Link */}
        <p className="text-center mt-4 text-gray-600">
          Sudah punya akun? <a href="/login" className="text-blue-600 hover:underline font-semibold">Masuk di sini</a>
        </p>
      </form>
    </div>
  );
}
```

#### **Step 2: Login Page Component**
```javascript
// src/features/auth/pages/LoginPage.jsx

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { authAPI } from '../../../api/auth.api';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const setUser = useAuthStore(state => state.setUser);
  const setToken = useAuthStore(state => state.setToken);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!credentials.email) newErrors.email = 'Email harus diisi';
    if (!credentials.password) newErrors.password = 'Password harus diisi';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.login(credentials);
      
      setToken(response.data.token);
      setUser(response.data.user);
      
      if (rememberMe) {
        localStorage.setItem('rememberEmail', credentials.email);
      }

      const redirectPath = location.state?.from?.pathname || '/';
      navigate(redirectPath);
      showSuccessToast('Berhasil masuk!');
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Login gagal';
      setErrors({ submit: errMsg });
      showErrorToast(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center">
      <form onSubmit={handleLogin} className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Masuk Akun</h1>
        
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.submit}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded"
            />
            <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
          </label>
          <a href="/forgot-password" className="text-blue-600 hover:underline text-sm">Lupa password?</a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
        >
          {isLoading ? 'Masuk...' : 'Masuk'}
        </button>

        <p className="text-center mt-4 text-gray-600">
          Belum punya akun? <a href="/register" className="text-blue-600 hover:underline font-semibold">Daftar di sini</a>
        </p>
      </form>
    </div>
  );
}
```

#### **Step 3: API Integration**
```javascript
// src/api/auth.api.js

import client from './client';

export const authAPI = {
  login: (credentials) => 
    client.post('/auth/login', credentials),
  
  register: (userData) => 
    client.post('/auth/register', userData),
  
  logout: () => 
    client.post('/auth/logout'),
  
  refreshToken: (refreshToken) => 
    client.post('/auth/refresh', { refreshToken }),
  
  forgotPassword: (email) => 
    client.post('/auth/forgot-password', { email }),
  
  resetPassword: (token, newPassword) => 
    client.post('/auth/reset-password', { token, newPassword }),
  
  getCurrentUser: () => 
    client.get('/auth/me'),
};
```

#### **Step 4: Protected Routes**
```javascript
// src/components/ProtectedRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/authStore';

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
}

// Usage in AppRoutes.jsx:
// <Route 
//   path="/checkout" 
//   element={
//     <ProtectedRoute>
//       <CheckoutPage />
//     </ProtectedRoute>
//   } 
// />
```

---

## 2️⃣ ALUR KERANJANG BELANJA (Cart Flow)

### **User Journey: Browse → Add to Cart → Review**

```
┌─────────────────────────────────────────────────────────┐
│            PRODUCT LISTING PAGE                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │ [Product 1]  [Product 2]  [Product 3]             │  │
│  │ Rp 50.000    Rp 100.000   Rp 75.000               │  │
│  │ [Add to Cart] [Add to Cart] [Add to Cart]         │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
           ↓ (Click "Add to Cart")
┌─────────────────────────────────────────────────────────┐
│  Quantity Modal                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Quantity: [1] [+][-]                            │   │
│  │ Available Stock: 50                             │   │
│  │ [Confirm Add to Cart]                           │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
           ↓
  Update cartStore
           ↓
  Show success toast
  "Produk ditambahkan ke keranjang"
           ↓
  Cart icon in navbar shows count
           ↓ (Click cart icon)
┌─────────────────────────────────────────────────────────┐
│              CART PAGE                                   │
│  ┌────────────────────────────────────────────────────┐ │
│  │ KERANJANG BELANJA                                  │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ [Checkbox] Product 1          Qty: [1][+][-] Rp 50k│ │
│  │ [Checkbox] Product 2          Qty: [2][+][-] Rp200k│ │
│  │ [Checkbox] Product 3          Qty: [1][+][-] Rp75k │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ Select All | Delete Selected | Continue Shopping   │ │
│  ├────────────────────────────────────────────────────┤ │
│  │                                                     │ │
│  │                   SUMMARY                          │ │
│  │  Subtotal ........... Rp 325.000                   │ │
│  │  Shipping ........... Rp 10.000                    │ │
│  │  Discount/Coupon ... - Rp 0                        │ │
│  │  ─────────────────────────────                     │ │
│  │  TOTAL ............. Rp 335.000                    │ │
│  │                                                     │ │
│  │  [Apply Coupon] [Checkout]                        │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### **Implementation: Cart Operations**

#### **Add to Cart Function**
```javascript
// src/features/product/pages/ProductDetailPage.jsx

import { useCart } from '../hooks/useCart';
import { useState } from 'react';

export default function ProductDetailPage() {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showQtyModal, setShowQtyModal] = useState(false);
  const product = { id: 1, name: 'Laptop', price: 5000000 };

  const handleAddToCart = async () => {
    if (quantity > product.stock) {
      showErrorToast('Stok tidak cukup');
      return;
    }

    try {
      addToCart(product, quantity);
      setShowQtyModal(false);
      setQuantity(1);
      showSuccessToast('Produk ditambahkan ke keranjang');
    } catch (error) {
      showErrorToast('Gagal menambahkan ke keranjang');
    }
  };

  return (
    <div>
      <button 
        onClick={() => setShowQtyModal(true)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Tambah ke Keranjang
      </button>

      {showQtyModal && (
        <QuantityModal
          product={product}
          onConfirm={handleAddToCart}
          onClose={() => setShowQtyModal(false)}
          quantity={quantity}
          setQuantity={setQuantity}
        />
      )}
    </div>
  );
}
```

#### **Cart Item Component**
```javascript
// src/features/cart/components/CartItem.jsx

import { useCart } from '../hooks/useCart';

export default function CartItem({ item }) {
  const { updateQty, removeFromCart } = useCart();

  return (
    <div className="flex items-center border-b pb-4 mb-4">
      <img 
        src={item.image} 
        alt={item.name}
        className="w-20 h-20 object-cover rounded"
      />
      
      <div className="flex-1 ml-4">
        <h3 className="font-semibold text-gray-800">{item.name}</h3>
        <p className="text-gray-600">Rp {item.price.toLocaleString('id-ID')}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2 mx-4">
        <button 
          onClick={() => updateQty(item.id, item.quantity - 1)}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          −
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button 
          onClick={() => updateQty(item.id, item.quantity + 1)}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div className="w-24 text-right font-semibold text-gray-800">
        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
      </div>

      {/* Delete Button */}
      <button 
        onClick={() => removeFromCart(item.id)}
        className="ml-4 text-red-600 hover:text-red-800"
        title="Hapus dari keranjang"
      >
        🗑️
      </button>
    </div>
  );
}
```

#### **Cart Page Component**
```javascript
// src/features/cart/pages/CartPage.jsx

import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import CartItem from '../components/CartItem';
import CartEmpty from '../components/CartEmpty';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, subtotal, tax, shipping, total } = useCart();
  const [selectedItems, setSelectedItems] = useState(new Set(items.map(i => i.id)));

  if (items.length === 0) {
    return <CartEmpty />;
  }

  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      showWarningToast('Pilih produk untuk checkout');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Keranjang Belanja</h1>

      <div className="grid grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="col-span-2">
          {items.map(item => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Summary */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit sticky top-20">
          <h2 className="text-xl font-bold mb-4">Ringkasan Belanja</h2>
          
          <div className="space-y-3 mb-4 pb-4 border-b">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Pajak (10%)</span>
              <span className="font-semibold">Rp {tax.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Pengiriman</span>
              <span className="font-semibold">Rp {shipping.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="flex justify-between text-lg font-bold mb-6">
            <span>Total</span>
            <span>Rp {total.toLocaleString('id-ID')}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Lanjut ke Checkout
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition"
          >
            Lanjut Belanja
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 3️⃣ ALUR CHECKOUT (Checkout Flow)

### **Checkout Journey: 5-Step Process**

```
STEP 1: REVIEW CART
├─ Show cart items
├─ Allow quantity changes
├─ Show summary
└─ [Continue] → STEP 2

STEP 2: SHIPPING ADDRESS
├─ Show saved addresses
├─ Allow add new address
├─ Form validation
└─ [Continue] → STEP 3

STEP 3: SHIPPING METHOD
├─ Show available methods:
│  ├─ Standard (5-7 hari)
│  ├─ Express (2-3 hari)
│  └─ Overnight
├─ Show cost per method
└─ [Continue] → STEP 4

STEP 4: PAYMENT METHOD
├─ Credit Card
├─ E-Wallet (GCash, PayMaya)
├─ Bank Transfer
└─ [Continue] → STEP 5

STEP 5: REVIEW & CONFIRM
├─ Final summary
├─ All details
└─ [Place Order] → PAYMENT PROCESSING
     ↓
  [Order Confirmation]
  ├─ Order number
  ├─ Tracking
  └─ Email confirmation
```

### **Implementation: Step-by-Step Checkout**

#### **Checkout Store (Zustand)**
```javascript
// src/features/checkout/store/checkoutStore.js

import { create } from 'zustand';

export const useCheckoutStore = create((set, get) => ({
  // State
  currentStep: 1,
  shippingAddress: null,
  shippingMethod: null,
  paymentMethod: null,
  couponCode: '',
  discount: 0,
  orderData: null,
  isProcessing: false,
  error: null,

  // Actions
  setStep: (step) => set({ currentStep: Math.max(1, Math.min(5, step)) }),
  
  nextStep: () => set(state => ({ currentStep: state.currentStep + 1 })),
  
  prevStep: () => set(state => ({ currentStep: state.currentStep - 1 })),
  
  setShippingAddress: (address) => {
    if (!address.street || !address.city || !address.zipCode) {
      throw new Error('Alamat tidak lengkap');
    }
    set({ shippingAddress: address });
  },
  
  setShippingMethod: (method) => set({ shippingMethod: method }),
  
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  
  applyCoupon: async (code) => {
    try {
      const response = await validateCouponAPI(code);
      set({ 
        couponCode: code,
        discount: response.discountAmount 
      });
    } catch (error) {
      throw new Error('Kode kupon tidak valid');
    }
  },
  
  submitOrder: async () => {
    const state = get();
    
    // Validate required fields
    if (!state.shippingAddress) throw new Error('Alamat pengiriman belum dipilih');
    if (!state.shippingMethod) throw new Error('Metode pengiriman belum dipilih');
    if (!state.paymentMethod) throw new Error('Metode pembayaran belum dipilih');

    set({ isProcessing: true, error: null });
    try {
      const response = await orderAPI.createOrder({
        shippingAddress: state.shippingAddress,
        shippingMethod: state.shippingMethod,
        paymentMethod: state.paymentMethod,
        couponCode: state.couponCode,
      });

      set({ 
        orderData: response.data,
        currentStep: 5,
        isProcessing: false,
      });

      return response.data;
    } catch (error) {
      set({ 
        error: error.message,
        isProcessing: false,
      });
      throw error;
    }
  },

  reset: () => set({
    currentStep: 1,
    shippingAddress: null,
    shippingMethod: null,
    paymentMethod: null,
    couponCode: '',
    discount: 0,
    orderData: null,
  }),
}));
```

#### **Step 1: Review Cart**
```javascript
// src/features/checkout/pages/CheckoutStep1.jsx

import { useCart } from '../../cart/hooks/useCart';
import { useCheckoutStore } from '../store/checkoutStore';

export default function CheckoutStep1() {
  const { items, subtotal, tax, shipping, total } = useCart();
  const { nextStep, discount } = useCheckoutStore();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Review Pesanan</h2>
      
      {items.map(item => (
        <div key={item.id} className="flex justify-between border-b pb-4 mb-4">
          <div>
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-gray-600">Qty: {item.quantity}</p>
          </div>
          <span className="font-semibold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
        </div>
      ))}

      <div className="space-y-2 mt-6 pt-6 border-t">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>Rp {subtotal.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between">
          <span>Pajak</span>
          <span>Rp {tax.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between">
          <span>Pengiriman</span>
          <span>Rp {shipping.toLocaleString('id-ID')}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Diskon</span>
            <span>- Rp {discount.toLocaleString('id-ID')}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold text-blue-600 mt-4">
          <span>TOTAL</span>
          <span>Rp {(total - discount).toLocaleString('id-ID')}</span>
        </div>
      </div>

      <button
        onClick={nextStep}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg mt-6 hover:bg-blue-700"
      >
        Lanjut ke Alamat Pengiriman
      </button>
    </div>
  );
}
```

#### **Step 2: Shipping Address**
```javascript
// src/features/checkout/pages/CheckoutStep2.jsx

import { useState } from 'react';
import { useCheckoutStore } from '../store/checkoutStore';

export default function CheckoutStep2() {
  const { shippingAddress, setShippingAddress, nextStep, prevStep } = useCheckoutStore();
  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 1,
      name: 'Rumah',
      street: 'Jl. Merdeka No. 123',
      city: 'Jakarta',
      zipCode: '12345',
      phone: '081234567890',
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    zipCode: '',
    phone: '',
  });

  const handleSelectAddress = (address) => {
    setShippingAddress(address);
    setShowForm(false);
  };

  const handleAddNewAddress = () => {
    setShippingAddress(formData);
    setShowForm(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Alamat Pengiriman</h2>

      {/* Saved Addresses */}
      {!showForm && (
        <>
          <div className="space-y-3 mb-6">
            {savedAddresses.map(address => (
              <div
                key={address.id}
                onClick={() => handleSelectAddress(address)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                  shippingAddress?.id === address.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <h3 className="font-semibold">{address.name}</h3>
                <p className="text-gray-600">{address.street}</p>
                <p className="text-gray-600">{address.city}, {address.zipCode}</p>
                <p className="text-gray-600">{address.phone}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="text-blue-600 hover:underline font-semibold mb-6"
          >
            + Tambah Alamat Baru
          </button>
        </>
      )}

      {/* Add New Address Form */}
      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
          <input
            type="text"
            placeholder="Nama Lokasi (cth: Rumah, Kantor)"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Jalan dan nomor rumah"
            value={formData.street}
            onChange={(e) => setFormData({...formData, street: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Kota"
            value={formData.city}
            onChange={(e) => setFormData({...formData, city: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Kode Pos"
            value={formData.zipCode}
            onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            placeholder="Nomor Telepon"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-3">
            <button
              onClick={handleAddNewAddress}
              className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700"
            >
              Simpan Alamat
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-400"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={prevStep}
          className="flex-1 bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-400"
        >
          Kembali
        </button>
        <button
          onClick={nextStep}
          disabled={!shippingAddress}
          className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Lanjut ke Pengiriman
        </button>
      </div>
    </div>
  );
}
```

#### **Step 3: Shipping Method**
```javascript
// src/features/checkout/pages/CheckoutStep3.jsx

import { useCheckoutStore } from '../store/checkoutStore';

export default function CheckoutStep3() {
  const { shippingMethod, setShippingMethod, nextStep, prevStep } = useCheckoutStore();

  const methods = [
    { id: 'standard', name: 'Standard (5-7 hari)', cost: 10000, icon: '📦' },
    { id: 'express', name: 'Express (2-3 hari)', cost: 25000, icon: '🚚' },
    { id: 'overnight', name: 'Overnight (1 hari)', cost: 50000, icon: '✈️' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Pilih Metode Pengiriman</h2>

      <div className="space-y-3 mb-8">
        {methods.map(method => (
          <div
            key={method.id}
            onClick={() => setShippingMethod(method)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition flex items-center justify-between ${
              shippingMethod?.id === method.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{method.icon}</span>
              <div>
                <h3 className="font-semibold">{method.name}</h3>
                <p className="text-gray-600">Estimasi waktu pengiriman</p>
              </div>
            </div>
            <span className="text-lg font-bold text-blue-600">Rp {method.cost.toLocaleString('id-ID')}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={prevStep}
          className="flex-1 bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-400"
        >
          Kembali
        </button>
        <button
          onClick={nextStep}
          disabled={!shippingMethod}
          className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Lanjut ke Pembayaran
        </button>
      </div>
    </div>
  );
}
```

#### **Step 4: Payment Method**
```javascript
// src/features/checkout/pages/CheckoutStep4.jsx

import { useCheckoutStore } from '../store/checkoutStore';

export default function CheckoutStep4() {
  const { paymentMethod, setPaymentMethod, nextStep, prevStep } = useCheckoutStore();

  const methods = [
    { id: 'cc', name: 'Kartu Kredit/Debit', icon: '💳' },
    { id: 'bank', name: 'Transfer Bank', icon: '🏦' },
    { id: 'ewallet', name: 'E-Wallet (GCash, PayMaya)', icon: '📱' },
    { id: 'cod', name: 'Bayar di Tempat (COD)', icon: '💵' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Pilih Metode Pembayaran</h2>

      <div className="space-y-3 mb-8">
        {methods.map(method => (
          <div
            key={method.id}
            onClick={() => setPaymentMethod(method)}
            className={`p-4 border-2 rounded-lg cursor-pointer transition flex items-center gap-4 ${
              paymentMethod?.id === method.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <span className="text-3xl">{method.icon}</span>
            <h3 className="font-semibold text-lg">{method.name}</h3>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={prevStep}
          className="flex-1 bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-400"
        >
          Kembali
        </button>
        <button
          onClick={nextStep}
          disabled={!paymentMethod}
          className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Lanjut ke Review
        </button>
      </div>
    </div>
  );
}
```

#### **Step 5: Review & Confirm**
```javascript
// src/features/checkout/pages/CheckoutStep5.jsx

import { useCart } from '../../cart/hooks/useCart';
import { useCheckoutStore } from '../store/checkoutStore';
import { useState } from 'react';

export default function CheckoutStep5() {
  const { items, total } = useCart();
  const { 
    shippingAddress, 
    shippingMethod, 
    paymentMethod, 
    submitOrder,
    isProcessing,
    discount
  } = useCheckoutStore();
  const [error, setError] = useState(null);

  const handlePlaceOrder = async () => {
    try {
      await submitOrder();
      // Redirect to confirmation page will be handled by store
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Review Pesanan</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Items */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold mb-4">Produk</h3>
          {items.map(item => (
            <div key={item.id} className="flex justify-between mb-2 text-sm">
              <span>{item.name} x{item.quantity}</span>
              <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
            </div>
          ))}
        </div>

        {/* Details */}
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <div>
            <h4 className="font-bold mb-2">Alamat Pengiriman</h4>
            <p className="text-sm text-gray-600">
              {shippingAddress?.street}<br/>
              {shippingAddress?.city}, {shippingAddress?.zipCode}
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Metode Pengiriman</h4>
            <p className="text-sm">{shippingMethod?.name}</p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Metode Pembayaran</h4>
            <p className="text-sm">{paymentMethod?.name}</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 p-6 rounded-lg mb-8">
        <div className="space-y-2 mb-4 pb-4 border-b">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rp {total.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between">
            <span>Pengiriman</span>
            <span>Rp {shippingMethod?.cost.toLocaleString('id-ID')}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Diskon</span>
              <span>- Rp {discount.toLocaleString('id-ID')}</span>
            </div>
          )}
        </div>
        <div className="flex justify-between text-xl font-bold text-blue-600">
          <span>TOTAL PEMBAYARAN</span>
          <span>Rp {(total + shippingMethod?.cost - discount).toLocaleString('id-ID')}</span>
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={isProcessing}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
      >
        {isProcessing ? 'Memproses...' : 'Pesan Sekarang'}
      </button>
    </div>
  );
}
```

#### **Order Confirmation**
```javascript
// src/features/checkout/pages/OrderConfirmationPage.jsx

import { useCheckoutStore } from '../store/checkoutStore';
import { useNavigate } from 'react-router-dom';

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const { orderData, reset } = useCheckoutStore();

  if (!orderData) {
    return <Navigate to="/" />;
  }

  const handleBackToHome = () => {
    reset();
    navigate('/');
  };

  const handleTrackOrder = () => {
    navigate(`/orders/${orderData.orderId}`);
  };

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="text-6xl mb-4">✅</div>
        
        <h1 className="text-3xl font-bold mb-2 text-green-600">Pesanan Berhasil!</h1>
        <p className="text-gray-600 mb-6">Terima kasih telah berbelanja</p>

        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <p className="text-sm text-gray-600">Nomor Pesanan</p>
          <h2 className="text-2xl font-bold text-blue-600">{orderData.orderId}</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Konfirmasi telah dikirim ke email Anda. <br/>
          Pesanan akan diproses dalam 1-2 jam.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleTrackOrder}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Lacak Pesanan
          </button>
          <button
            onClick={handleBackToHome}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 📊 Summary: Workflow States

| Flow | Initial State | Actions | Final State |
|------|--------------|---------|------------|
| **Auth** | Unauthenticated | Register/Login | Authenticated + Token Stored |
| **Cart** | Empty cart | Add/Remove items | Items persisted in localStorage |
| **Checkout** | Step 1 | Progress through steps | Order created + Confirmation |

---

## ✅ Workflow Best Practices

- ✅ Validate input at each step
- ✅ Store state in Zustand (persist to localStorage)
- ✅ Show loading states during API calls
- ✅ Handle errors gracefully with user-friendly messages
- ✅ Allow users to go back/edit previous steps
- ✅ Show progress indicator (Step 2 of 5, etc)
- ✅ Redirect to login if session expires
- ✅ Send confirmation emails

