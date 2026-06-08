# 🎨 PANDUAN UI/UX & KOMPONEN - E-Commerce Platform

---

## 1️⃣ DESIGN SYSTEM OVERVIEW

Kami menggunakan **Atomic Design** dengan struktur:
- **Atoms**: Tombol, Input, Badge, Icon
- **Molecules**: Card, Form Group, Rating
- **Organisms**: Header, Footer, ProductGrid
- **Templates**: Layouts
- **Pages**: Full pages

---

## 2️⃣ COLOR PALETTE (Palet Warna)

### **Primary Colors (Warna Utama)**
```css
/* Modern, Professional E-Commerce */
Primary Blue:    #0066CC  (atau #005EE6)
Primary Dark:    #003366  (atau #004299)
Primary Light:   #E6F2FF
Accent:          #FF6B35  (Orange - untuk CTA)
```

### **Neutral Colors (Warna Netral)**
```css
White:           #FFFFFF
Light Gray:      #F5F5F5
Gray:            #CCCCCC
Dark Gray:       #666666
Black:           #000000
```

### **Status Colors**
```css
Success:         #10B981  (Green)
Warning:         #F59E0B  (Amber)
Error:           #EF4444  (Red)
Info:            #0066CC  (Blue)
```

### **CSS Variables (Tailwind Config)**
```css
/* tailwind.config.js */
module.exports = {
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
          700: '#CC4919',
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
    },
  },
};
```

### **Gradient Examples**
```css
/* Hero gradient */
background: linear-gradient(135deg, #0066CC 0%, #003366 100%);

/* Card hover gradient */
background: linear-gradient(135deg, #E6F2FF 0%, #F0F9FF 100%);

/* Success state */
background: linear-gradient(135deg, #10B981 0%, #059669 100%);
```

---

## 3️⃣ TYPOGRAPHY (Tipografi)

### **Font Families**
```css
/* Clean, modern, highly readable */
Primary Font:    'Inter' atau 'Segoe UI' (Sans-serif)
Fallback:        -apple-system, BlinkMacSystemFont, system-ui

Code Font:       'Courier New', 'Monaco' (Monospace)
```

### **Font Sizes & Line Heights (Tailwind)**
```css
/* tailwind.config.js */
fontSize: {
  xs: ['12px', { lineHeight: '16px' }],      // Small labels
  sm: ['14px', { lineHeight: '20px' }],      // Small text
  base: ['16px', { lineHeight: '24px' }],    // Body text (default)
  lg: ['18px', { lineHeight: '28px' }],      // Larger body
  xl: ['20px', { lineHeight: '28px' }],      // Section heading
  '2xl': ['24px', { lineHeight: '32px' }],   // Page title
  '3xl': ['30px', { lineHeight: '36px' }],   // Large title
  '4xl': ['36px', { lineHeight: '44px' }],   // Hero title
}
```

### **Font Weights**
```css
Regular:         400  (default)
Medium:          500  (semi-bold)
Semibold:        600  (headings)
Bold:            700  (emphasis)
```

### **Typography System**
```css
/* Body Text */
.text-body {
  @apply text-base font-regular leading-normal text-gray-900;
}

/* Small Text */
.text-small {
  @apply text-sm font-regular leading-normal text-gray-700;
}

/* Heading 1 */
.heading-1 {
  @apply text-4xl font-bold leading-tight text-gray-900;
}

/* Heading 2 */
.heading-2 {
  @apply text-3xl font-bold leading-tight text-gray-900;
}

/* Heading 3 */
.heading-3 {
  @apply text-2xl font-semibold leading-snug text-gray-900;
}

/* Heading 4 */
.heading-4 {
  @apply text-xl font-semibold leading-snug text-gray-900;
}

/* Button Text */
.button-text {
  @apply text-base font-semibold leading-normal text-white;
}

/* Label Text */
.label-text {
  @apply text-sm font-medium leading-normal text-gray-700;
}

/* Caption Text */
.caption-text {
  @apply text-xs font-regular leading-normal text-gray-600;
}
```

---

## 4️⃣ SPACING & SIZING SYSTEM

### **Spacing Scale (Tailwind Default)**
```css
0:    0px
1:    4px
2:    8px
3:    12px
4:    16px
5:    20px
6:    24px
8:    32px
10:   40px
12:   48px
16:   64px
20:   80px
```

### **Common Breakpoints**
```css
Mobile:    640px  (sm)
Tablet:    768px  (md)
Laptop:    1024px (lg)
Desktop:   1280px (xl)
```

### **Container Sizes**
```css
.container {
  @apply w-full mx-auto px-4;
  
  @screen sm { @apply px-6; }
  @screen md { @apply px-8 max-w-6xl; }
  @screen lg { @apply px-10 max-w-7xl; }
}
```

---

## 5️⃣ KOMPONEN UI (UI COMPONENTS)

### **1. Button Component**

```javascript
// src/components/UI/Button/Button.jsx

import cn from 'clsx';

export default function Button({
  children,
  variant = 'primary', // primary, secondary, outline, ghost, danger
  size = 'md', // sm, md, lg
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className,
  ...props
}) {
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50',
    ghost: 'text-primary-500 hover:bg-primary-50',
    danger: 'bg-error-500 hover:bg-error-600 text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
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
        <span className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
```

**Usage Examples:**
```javascript
// Variants
<Button variant="primary">Tambah ke Keranjang</Button>
<Button variant="secondary">Batal</Button>
<Button variant="outline">Simpan</Button>
<Button variant="ghost">Baca Selengkapnya</Button>
<Button variant="danger">Hapus</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button disabled>Disabled</Button>
<Button loading>Loading...</Button>
<Button fullWidth>Full Width</Button>
```

---

### **2. Card Component**

```javascript
// src/components/UI/Card/Card.jsx

import cn from 'clsx';

export default function Card({
  children,
  variant = 'default', // default, elevated, outlined
  hover = false,
  onClick,
  className,
  ...props
}) {
  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm',
    elevated: 'bg-white shadow-lg',
    outlined: 'bg-white border-2 border-gray-300',
  };

  return (
    <div
      className={cn(
        'rounded-lg p-6 transition-all duration-200',
        hover && 'hover:shadow-lg hover:-translate-y-1 cursor-pointer',
        variants[variant],
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
```

**States Examples:**
```javascript
// Loading State
<Card>
  <div className="space-y-4 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-3/4" />
    <div className="h-4 bg-gray-200 rounded" />
    <div className="h-4 bg-gray-200 rounded w-5/6" />
  </div>
</Card>

// Empty State
<Card className="text-center py-12">
  <div className="text-4xl mb-3">📦</div>
  <h3 className="text-lg font-semibold text-gray-900">Produk Tidak Ditemukan</h3>
  <p className="text-gray-600 mt-2">Coba ubah filter atau cari dengan kata kunci lain</p>
</Card>

// Error State
<Card className="border-error-500 bg-error-50">
  <div className="flex gap-4">
    <span className="text-2xl">⚠️</span>
    <div>
      <h3 className="font-semibold text-error-900">Terjadi Kesalahan</h3>
      <p className="text-error-700 text-sm mt-1">Gagal memuat produk. Silakan coba lagi.</p>
    </div>
  </div>
</Card>
```

---

### **3. Input Component**

```javascript
// src/components/UI/Input/Input.jsx

import cn from 'clsx';

export default function Input({
  label,
  placeholder,
  error,
  type = 'text',
  disabled = false,
  required = false,
  helperText,
  startIcon,
  endIcon,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-error-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {startIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {startIcon}
          </div>
        )}
        
        <input
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
              : 'border-gray-300 focus:border-primary-500'
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
}
```

**Usage Examples:**
```javascript
// Basic Input
<Input label="Email" placeholder="nama@email.com" type="email" />

// With Icon
<Input 
  placeholder="Cari produk..." 
  startIcon={<span>🔍</span>}
/>

// With Error
<Input 
  label="Password"
  type="password"
  error="Password minimal 8 karakter"
/>

// With Helper Text
<Input 
  label="Nomor Telepon"
  placeholder="08..."
  helperText="Format: 08xx-xxxx-xxxx"
/>

// Disabled State
<Input placeholder="Tidak bisa diedit" disabled />
```

---

### **4. Badge Component**

```javascript
// src/components/UI/Badge/Badge.jsx

export default function Badge({
  children,
  variant = 'primary', // primary, success, warning, error, info
  size = 'md', // sm, md, lg
  icon,
  className,
}) {
  const variants = {
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    error: 'bg-error-100 text-error-800',
    info: 'bg-info-100 text-info-800',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full font-medium',
      variants[variant],
      sizes[size],
      className
    )}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
}
```

**Usage Examples:**
```javascript
// Stock Status
<Badge variant="success" icon="✓">Stok Tersedia</Badge>
<Badge variant="warning" icon="⚠">Stok Terbatas (5 item)</Badge>
<Badge variant="error" icon="✕">Stok Habis</Badge>

// Pricing Tags
<Badge variant="success">Gratis Ongkir</Badge>
<Badge variant="error">Flash Sale</Badge>

// Rating
<Badge variant="primary">4.8 ★ (152 Review)</Badge>
```

---

### **5. Rating Component**

```javascript
// src/components/UI/Rating/Rating.jsx

export default function Rating({
  value = 0, // 0-5
  count = 0, // review count
  onChange,
  readonly = false,
  size = 'md',
}) {
  const stars = [1, 2, 3, 4, 5];
  const sizeClass = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  }[size];

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {stars.map(star => (
          <button
            key={star}
            onClick={() => !readonly && onChange?.(star)}
            className={cn(
              sizeClass,
              'transition-colors',
              !readonly && 'hover:scale-110 cursor-pointer',
              readonly && 'cursor-default',
              star <= value ? 'text-yellow-400' : 'text-gray-300'
            )}
          >
            ★
          </button>
        ))}
      </div>
      
      {count > 0 && (
        <span className="text-sm text-gray-600">
          {value.toFixed(1)} ({count} review)
        </span>
      )}
    </div>
  );
}
```

**Usage Examples:**
```javascript
// Display Rating (readonly)
<Rating value={4.5} count={152} readonly />

// Interactive Rating (for reviews)
<Rating value={0} onChange={(rating) => setUserRating(rating)} />
```

---

### **6. Modal Component**

```javascript
// src/components/UI/Modal/Modal.jsx

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md', // sm, md, lg
  closeButton = true,
}) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className={cn(
          'bg-white rounded-lg shadow-xl overflow-hidden',
          sizes[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          {closeButton && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          )}
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t bg-gray-50 flex gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
```

**Usage Example:**
```javascript
const [isOpen, setIsOpen] = useState(false);

return (
  <>
    <Button onClick={() => setIsOpen(true)}>Buka Modal</Button>

    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Konfirmasi Pembelian"
      footer={
        <>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Batal
          </Button>
          <Button variant="primary">Pesan Sekarang</Button>
        </>
      }
    >
      <p className="text-gray-700">
        Apakah Anda yakin ingin memesan produk ini?
      </p>
    </Modal>
  </>
);
```

---

### **7. Toast/Notification Component**

```javascript
// src/components/UI/Toast/Toast.jsx & Store

import { create } from 'zustand';

export const useToastStore = create((set) => ({
  toasts: [],
  
  addToast: (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    set(state => ({
      toasts: [...state.toasts, { id, message, type }]
    }));
    
    setTimeout(() => {
      set(state => ({
        toasts: state.toasts.filter(t => t.id !== id)
      }));
    }, duration);
  },
  
  removeToast: (id) =>
    set(state => ({
      toasts: state.toasts.filter(t => t.id !== id)
    })),
}));

// Toast Container
export function ToastContainer() {
  const toasts = useToastStore(state => state.toasts);
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}

function Toast({ id, message, type }) {
  const removeToast = useToastStore(state => state.removeToast);
  
  const variants = {
    success: 'bg-success-500 text-white',
    error: 'bg-error-500 text-white',
    warning: 'bg-warning-500 text-white',
    info: 'bg-info-500 text-white',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={cn(
      'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-slide-in',
      variants[type]
    )}>
      <span className="text-xl">{icons[type]}</span>
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={() => removeToast(id)}
        className="ml-auto text-lg opacity-70 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}
```

**Usage:**
```javascript
import { useToastStore } from '@/components/UI/Toast/Toast';

function MyComponent() {
  const addToast = useToastStore(state => state.addToast);

  const handleAddToCart = () => {
    addToast('Produk berhasil ditambahkan ke keranjang', 'success');
  };

  const handleError = () => {
    addToast('Terjadi kesalahan, silakan coba lagi', 'error');
  };

  return (
    <div>
      <Button onClick={handleAddToCart}>Tambah ke Keranjang</Button>
      <Button onClick={handleError}>Trigger Error</Button>
    </div>
  );
}
```

---

### **8. Product Card Component**

```javascript
// src/components/Product/ProductCard/ProductCard.jsx

export default function ProductCard({ product, onAddCart, onView }) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <Card hover onClick={() => onView(product.id)} className="flex flex-col h-full">
      {/* Image Container */}
      <div className="relative mb-4 overflow-hidden rounded-lg bg-gray-100 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          loading="lazy"
        />
        
        {/* Badge */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-error-500 text-white px-2 py-1 rounded text-sm font-bold">
            -{discount}%
          </div>
        )}
        
        {product.isFreeShipping && (
          <Badge variant="success" size="sm" className="absolute bottom-2 left-2">
            Gratis Ongkir
          </Badge>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-2 left-2 p-2 rounded-full bg-white hover:bg-gray-100 transition"
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 my-2 text-sm">
          <span className="text-yellow-400">★</span>
          <span className="font-medium">{product.rating}</span>
          <span className="text-gray-600">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="text-lg font-bold text-primary-600">
            Rp {product.price.toLocaleString('id-ID')}
          </div>
          {product.originalPrice > product.price && (
            <div className="text-sm text-gray-500 line-through">
              Rp {product.originalPrice.toLocaleString('id-ID')}
            </div>
          )}
        </div>

        {/* Stock Status */}
        <div className="text-xs text-gray-600 mb-4">
          {product.stock > 10 ? (
            <span className="text-success-600">Stok Tersedia</span>
          ) : product.stock > 0 ? (
            <span className="text-warning-600">Stok Terbatas ({product.stock})</span>
          ) : (
            <span className="text-error-600">Stok Habis</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          size="sm"
          fullWidth
          disabled={product.stock === 0}
          onClick={(e) => {
            e.stopPropagation();
            onAddCart(product);
          }}
        >
          {product.stock === 0 ? 'Stok Habis' : 'Tambah Keranjang'}
        </Button>
      </div>
    </Card>
  );
}
```

---

## 6️⃣ COMPONENT STATES MAPPING

### **Loading State**
```javascript
// Show skeleton/placeholder while loading
<div className="space-y-4 animate-pulse">
  <div className="h-64 bg-gray-200 rounded-lg" />
  <div className="h-6 bg-gray-200 rounded w-3/4" />
  <div className="h-4 bg-gray-200 rounded" />
</div>
```

### **Empty State**
```javascript
<div className="text-center py-12">
  <div className="text-6xl mb-4">📦</div>
  <h3 className="text-xl font-bold text-gray-900">Tidak Ada Produk</h3>
  <p className="text-gray-600 mt-2">Coba ubah pencarian atau filter Anda</p>
  <Button className="mt-6">Jelajahi Kategori</Button>
</div>
```

### **Error State**
```javascript
<div className="p-6 bg-error-50 border-l-4 border-error-500 rounded">
  <div className="flex gap-4">
    <span className="text-3xl">⚠️</span>
    <div>
      <h3 className="font-bold text-error-900">Terjadi Kesalahan</h3>
      <p className="text-error-700">Gagal memuat data. Silakan coba lagi.</p>
      <Button variant="outline" size="sm" className="mt-3">
        Coba Lagi
      </Button>
    </div>
  </div>
</div>
```

### **Success State**
```javascript
<div className="p-6 bg-success-50 border-l-4 border-success-500 rounded">
  <div className="flex gap-4">
    <span className="text-3xl">✓</span>
    <div>
      <h3 className="font-bold text-success-900">Berhasil</h3>
      <p className="text-success-700">Produk berhasil ditambahkan ke keranjang</p>
    </div>
  </div>
</div>
```

---

## 7️⃣ RESPONSIVE DESIGN GUIDELINES

### **Mobile First Approach**
```css
/* Base styles (mobile) */
.container { @apply px-4; }

/* Tablet */
@screen md {
  .container { @apply px-6; }
}

/* Desktop */
@screen lg {
  .container { @apply px-8 max-w-7xl mx-auto; }
}
```

### **Grid Layouts**
```javascript
// Product Grid (responsive)
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {products.map(p => <ProductCard key={p.id} product={p} />)}
</div>

// 2-Column Layout (sidebar + content)
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  <aside className="md:col-span-1">
    {/* Filters */}
  </aside>
  <main className="md:col-span-3">
    {/* Products */}
  </main>
</div>
```

---

## 8️⃣ ANIMATIONS & TRANSITIONS

### **Tailwind Animations**
```css
/* Add to tailwind.config.js */
animation: {
  'slide-in': 'slideIn 0.3s ease-out',
  'fade-in': 'fadeIn 0.3s ease-out',
  'bounce-in': 'bounceIn 0.5s ease-out',
}

@keyframes slideIn {
  from { @apply translate-x-4 opacity-0; }
  to { @apply translate-x-0 opacity-100; }
}

@keyframes fadeIn {
  from { @apply opacity-0; }
  to { @apply opacity-100; }
}
```

### **Common Transitions**
```css
/* Hover effects */
.btn-hover {
  @apply transition-all duration-200 hover:shadow-lg hover:-translate-y-1;
}

/* Loading spinner */
.spinner {
  @apply inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin;
}

/* Fade transition */
.fade {
  @apply transition-opacity duration-200;
}
```

---

## ✅ UI/UX Best Practices

- ✅ **Consistency**: Gunakan design system yang konsisten
- ✅ **Accessibility**: WCAG 2.1 AA standard (contrast ratio, keyboard navigation)
- ✅ **Mobile First**: Design untuk mobile terlebih dahulu
- ✅ **Performance**: Lazy load images, minimize animations
- ✅ **Feedback**: Berikan visual feedback untuk setiap user action
- ✅ **Error Handling**: Show helpful error messages
- ✅ **Loading States**: Jangan biarkan user waiting tanpa feedback
- ✅ **Micro-interactions**: Smooth transitions & animations
- ✅ **White Space**: Proper spacing untuk readability
- ✅ **Typography Hierarchy**: Clear visual hierarchy dengan typography

---

## 📊 Component Library Summary

| Component | Variants | States | Usage |
|-----------|----------|--------|-------|
| **Button** | primary, secondary, outline, ghost, danger | normal, hover, active, disabled, loading | CTAs, form submission |
| **Card** | default, elevated, outlined | normal, hover | Content containers |
| **Input** | text, email, password, number | normal, focused, error, disabled | Form fields |
| **Badge** | primary, success, warning, error, info | sm, md, lg | Status indicators |
| **Rating** | interactive, readonly | 0-5 stars | Product ratings, reviews |
| **Modal** | sm, md, lg | open, close | Confirmations, forms |
| **Toast** | success, error, warning, info | appear, disappear | Notifications |
| **ProductCard** | - | normal, loading, error | Product display |

