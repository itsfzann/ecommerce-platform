# 🎯 SPESIFIKASI FITUR DETAIL - E-Commerce Platform

---

## 1️⃣ FITUR PENCARIAN (Search Feature)

### **User Story**
```
Sebagai pembeli,
Saya ingin bisa mencari produk dengan kata kunci,
Agar saya dapat menemukan produk yang saya cari dengan cepat.
```

### **Functional Requirements**

#### **1.1 Search Input**
- Input field pada header/navbar (selalu visible)
- Placeholder: "Cari produk, brand, atau kategori..."
- Support autofocus dengan keyboard shortcut (Ctrl+K atau Cmd+K)
- Clear button (X) untuk menghapus input

#### **1.2 Search Logic**
```javascript
// src/features/search/hooks/useSearch.js

import { useEffect, useState } from 'react';
import { useSearchStore } from '../store/searchStore';
import { debounce } from 'lodash'; // atau buat sendiri

export const useSearch = () => {
  const { query, setQuery, getResults } = useSearchStore();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce search untuk mengurangi API calls
  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      if (searchQuery.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const data = await productAPI.search(searchQuery);
        setResults(data);
        setError(null);
      } catch (err) {
        setError('Gagal mencari produk');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300), // Wait 300ms after user stops typing
    []
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  return { results, isLoading, error, query, setQuery };
};
```

#### **1.3 Search Results Display**
- Grid layout: 2-4 kolom (responsive)
- Show produk thumbnail, name, price, rating, stock status
- Highlight matching text dalam hasil
- Pagination atau infinite scroll
- "No results" state dengan saran kategori

#### **1.4 Recent Searches**
- Simpan 5-10 pencarian terakhir di localStorage
- Tampilkan saat search input aktif & kosong
- Clickable untuk repeat search
- Option untuk clear history

### **Implementation: Search Components**

```javascript
// src/components/Common/Header/SearchBar.jsx

import { useState, useEffect } from 'react';
import { useSearch } from '../../../features/search/hooks/useSearch';
import SearchSuggestions from './SearchSuggestions';

export default function SearchBar() {
  const { query, setQuery, results, isLoading } = useSearch();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(saved);
  }, []);

  const handleSearch = (searchTerm) => {
    setQuery(searchTerm);
    
    // Add to recent searches
    const updated = [searchTerm, ...recentSearches].slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    setRecentSearches(updated);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(query);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative w-full max-w-xl">
      {/* Search Input */}
      <div className="relative flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2">
        <span className="text-gray-400 mr-3">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyPress={handleKeyPress}
          placeholder="Cari produk..."
          className="flex-1 outline-none text-gray-700"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="text-gray-400 hover:text-gray-600 ml-2"
          >
            ✕
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <SearchSuggestions
          recentSearches={recentSearches}
          results={results}
          isLoading={isLoading}
          onSelectSearch={handleSearch}
          onClose={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
}
```

---

## 2️⃣ FITUR FILTER (Filter Feature)

### **User Story**
```
Sebagai pembeli,
Saya ingin memfilter produk berdasarkan kategori, harga, rating,
Agar saya dapat menemukan produk yang sesuai dengan preferensi saya.
```

### **Filter Categories**

#### **2.1 Category Filter**
- Hierarchical categories: Electronics > Laptops > Gaming Laptops
- Multi-select checkbox
- Show product count per category
- Collapse/expand sub-categories

#### **2.2 Price Range Filter**
- Slider input: Min - Max price
- Input fields untuk manual entry
- Pre-defined ranges: "Under Rp 500K", "Rp 500K - Rp 1M", etc

#### **2.3 Rating Filter**
- Minimum rating: 1 ⭐ to 5 ⭐
- Only show products with that rating or higher
- Show product count

#### **2.4 Availability Filter**
- In Stock
- Low Stock (< 10 items)
- All products

#### **2.5 Brand Filter**
- Multi-select from list of brands
- Search within brands

#### **2.6 Other Filters**
- New products (Last 7/30 days)
- On Sale / Discounted
- Free Shipping

### **Filter Implementation**

```javascript
// src/features/product/store/filterStore.js

import { create } from 'zustand';

export const useFilterStore = create((set, get) => ({
  // Filter state
  filters: {
    categories: [],
    priceRange: [0, 10000000],
    rating: 0,
    availability: 'all',
    brands: [],
    isNew: false,
    onSale: false,
    freeShipping: false,
  },

  // Sort state
  sortBy: 'relevant', // relevant, price_asc, price_desc, newest, popular, rating

  // Actions
  setFilters: (newFilters) => 
    set(state => ({
      filters: { ...state.filters, ...newFilters }
    })),

  toggleCategory: (category) =>
    set(state => ({
      filters: {
        ...state.filters,
        categories: state.filters.categories.includes(category)
          ? state.filters.categories.filter(c => c !== category)
          : [...state.filters.categories, category]
      }
    })),

  setPriceRange: (min, max) =>
    set(state => ({
      filters: { ...state.filters, priceRange: [min, max] }
    })),

  setRating: (rating) =>
    set(state => ({
      filters: { ...state.filters, rating }
    })),

  toggleBrand: (brand) =>
    set(state => ({
      filters: {
        ...state.filters,
        brands: state.filters.brands.includes(brand)
          ? state.filters.brands.filter(b => b !== brand)
          : [...state.filters.brands, brand]
      }
    })),

  setSortBy: (sort) => set({ sortBy: sort }),

  clearFilters: () =>
    set({
      filters: {
        categories: [],
        priceRange: [0, 10000000],
        rating: 0,
        availability: 'all',
        brands: [],
        isNew: false,
        onSale: false,
        freeShipping: false,
      },
      sortBy: 'relevant',
    }),

  // Get URL query params
  getQueryParams: () => {
    const state = get();
    const { filters, sortBy } = state;
    
    return {
      categories: filters.categories.join(','),
      minPrice: filters.priceRange[0],
      maxPrice: filters.priceRange[1],
      rating: filters.rating,
      availability: filters.availability,
      brands: filters.brands.join(','),
      isNew: filters.isNew,
      onSale: filters.onSale,
      freeShipping: filters.freeShipping,
      sort: sortBy,
    };
  },
}));
```

### **Filter UI Components**

```javascript
// src/features/product/components/ProductFilters.jsx

import { useFilterStore } from '../store/filterStore';
import PriceRangeSlider from './filters/PriceRangeSlider';
import CategoryFilter from './filters/CategoryFilter';
import RatingFilter from './filters/RatingFilter';
import BrandFilter from './filters/BrandFilter';

export default function ProductFilters() {
  const { filters, setFilters, toggleCategory, setPriceRange, clearFilters } = useFilterStore();

  return (
    <div className="w-full md:w-64 bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Filter</h2>
        {Object.values(filters).some(v => 
          (Array.isArray(v) ? v.length > 0 : v !== 0 && v !== 'all' && v !== false)
        ) && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-6 pb-6 border-b">
        <CategoryFilter />
      </div>

      {/* Price Range Filter */}
      <div className="mb-6 pb-6 border-b">
        <PriceRangeSlider />
      </div>

      {/* Rating Filter */}
      <div className="mb-6 pb-6 border-b">
        <RatingFilter />
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <BrandFilter />
      </div>

      {/* Availability Filter */}
      <div className="mb-6 pb-6 border-b">
        <h3 className="font-semibold mb-3">Ketersediaan</h3>
        <label className="flex items-center mb-2">
          <input
            type="radio"
            name="availability"
            value="all"
            checked={filters.availability === 'all'}
            onChange={(e) => setFilters({ availability: e.target.value })}
            className="mr-2"
          />
          <span className="text-sm">Semua Produk</span>
        </label>
        <label className="flex items-center mb-2">
          <input
            type="radio"
            name="availability"
            value="inStock"
            checked={filters.availability === 'inStock'}
            onChange={(e) => setFilters({ availability: e.target.value })}
            className="mr-2"
          />
          <span className="text-sm">Tersedia</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="availability"
            value="lowStock"
            checked={filters.availability === 'lowStock'}
            onChange={(e) => setFilters({ availability: e.target.value })}
            className="mr-2"
          />
          <span className="text-sm">Stok Terbatas</span>
        </label>
      </div>

      {/* Special Filters */}
      <div>
        <h3 className="font-semibold mb-3">Spesial</h3>
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={filters.onSale}
            onChange={(e) => setFilters({ onSale: e.target.checked })}
            className="mr-2"
          />
          <span className="text-sm">Sedang Diskon</span>
        </label>
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={filters.freeShipping}
            onChange={(e) => setFilters({ freeShipping: e.target.checked })}
            className="mr-2"
          />
          <span className="text-sm">Gratis Ongkir</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.isNew}
            onChange={(e) => setFilters({ isNew: e.target.checked })}
            className="mr-2"
          />
          <span className="text-sm">Produk Baru</span>
        </label>
      </div>
    </div>
  );
}
```

---

## 3️⃣ FITUR KERANJANG (Cart Feature)

### **User Story**
```
Sebagai pembeli,
Saya ingin menambah, mengubah, menghapus produk dari keranjang,
Agar saya dapat mengelola pembelian saya sebelum checkout.
```

### **Cart Operations**

#### **3.1 Add to Cart**
- Show quantity selector modal
- Check stock availability
- Add to store + persist localStorage
- Show success toast notification
- Update cart counter in navbar

#### **3.2 View Cart**
- Show all items dengan: image, name, price, quantity, subtotal
- Edit quantities with +/- buttons
- Remove item button
- Select multiple items (checkboxes)
- Delete selected items

#### **3.3 Cart Summary**
```
Subtotal ........... Rp 325.000
Shipping ........... Rp 10.000
Discount ........... - Rp 0
─────────────────────────────
TOTAL .............. Rp 335.000
```

#### **3.4 Coupon/Promo Code**
- Input field untuk coupon code
- Validate coupon dengan API
- Show discount amount
- Apply/remove coupon

#### **3.5 Cart States**

```javascript
// EMPTY STATE
┌─────────────────────────────────┐
│                                 │
│  🛒  Keranjang Kosong            │
│                                 │
│  [Continue Shopping]            │
│                                 │
└─────────────────────────────────┘

// LOADING STATE
┌─────────────────────────────────┐
│  [Skeleton] [Skeleton]          │
│  [Skeleton] [Skeleton]          │
│  [Skeleton] [Skeleton]          │
└─────────────────────────────────┘

// ERROR STATE
┌─────────────────────────────────┐
│  ⚠️  Gagal memuat keranjang      │
│                                 │
│  [Retry]                        │
└─────────────────────────────────┘
```

### **Implementation: Cart Components**

```javascript
// src/features/cart/components/CartSummary.jsx

import { useCart } from '../hooks/useCart';
import { useState } from 'react';

export default function CartSummary() {
  const { items, subtotal, tax, shipping, total } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isApplying, setIsApplying] = useState(false);
  const [couponError, setCouponError] = useState(null);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    
    if (!couponCode.trim()) {
      setCouponError('Masukkan kode kupon');
      return;
    }

    setIsApplying(true);
    try {
      const response = await validateCouponAPI(couponCode);
      setDiscount(response.discountAmount);
      setCouponError(null);
      showSuccessToast(`Kupon ${couponCode} berhasil diterapkan!`);
    } catch (error) {
      setCouponError('Kode kupon tidak valid');
      setDiscount(0);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-6">Ringkasan Belanja</h2>

      {/* Coupon Input */}
      <form onSubmit={handleApplyCoupon} className="mb-6 pb-6 border-b">
        <div className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Masukkan kode kupon"
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isApplying}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isApplying ? 'Cek...' : 'Gunakan'}
          </button>
        </div>
        {couponError && (
          <p className="text-red-600 text-sm mt-2">{couponError}</p>
        )}
      </form>

      {/* Summary Breakdown */}
      <div className="space-y-3 mb-4 pb-4 border-b">
        <div className="flex justify-between text-gray-700">
          <span>Subtotal ({items.length} item)</span>
          <span className="font-semibold">Rp {subtotal.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Pajak (10%)</span>
          <span className="font-semibold">Rp {tax.toLocaleString('id-ID')}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>Pengiriman</span>
          <span className="font-semibold">Rp {shipping.toLocaleString('id-ID')}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Diskon</span>
            <span className="font-semibold">- Rp {discount.toLocaleString('id-ID')}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex justify-between text-xl font-bold text-blue-600 mb-6">
        <span>TOTAL</span>
        <span>Rp {(subtotal + tax + shipping - discount).toLocaleString('id-ID')}</span>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
          Lanjut ke Checkout
        </button>
        <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition">
          Lanjut Belanja
        </button>
      </div>
    </div>
  );
}
```

---

## 4️⃣ FITUR SIMPAN ALAMAT (Save Address Feature)

### **User Story**
```
Sebagai pembeli yang sering berbelanja,
Saya ingin menyimpan beberapa alamat (rumah, kantor, teman),
Agar saya dapat memilih alamat dengan cepat saat checkout.
```

### **Address Management**

#### **4.1 Address Fields**
- Label (Rumah, Kantor, Teman, dll) *required
- Full Name *required
- Phone Number *required
- Street Address (Jalan & nomor rumah) *required
- City *required
- Province/State *required
- Postal Code / ZIP *required
- Additional Info (RT/RW, landmark, dll) *optional
- Set as default? (checkbox)

#### **4.2 Address Operations**

**Create Address**
```javascript
POST /api/user/addresses
{
  label: "Rumah",
  fullName: "John Doe",
  phone: "081234567890",
  street: "Jl. Merdeka No. 123",
  city: "Jakarta Pusat",
  province: "DKI Jakarta",
  zipCode: "12345",
  additionalInfo: "Depan masjid",
  isDefault: true
}
```

**Read Addresses**
```javascript
GET /api/user/addresses
Response: [ { id, label, fullName, phone, street, city, province, zipCode, isDefault }, ... ]
```

**Update Address**
```javascript
PATCH /api/user/addresses/:id
```

**Delete Address**
```javascript
DELETE /api/user/addresses/:id
```

**Set Default Address**
```javascript
PATCH /api/user/addresses/:id/set-default
```

### **Implementation: Address Management**

```javascript
// src/features/user/store/userStore.js

import { create } from 'zustand';

export const useUserStore = create((set, get) => ({
  addresses: [],
  defaultAddressId: null,
  isLoadingAddresses: false,

  // Fetch addresses
  fetchAddresses: async () => {
    set({ isLoadingAddresses: true });
    try {
      const response = await userAPI.getAddresses();
      const defaultAddr = response.find(a => a.isDefault);
      set({
        addresses: response,
        defaultAddressId: defaultAddr?.id || null,
        isLoadingAddresses: false,
      });
    } catch (error) {
      set({ isLoadingAddresses: false });
      throw error;
    }
  },

  // Add address
  addAddress: async (addressData) => {
    const response = await userAPI.addAddress(addressData);
    set(state => ({
      addresses: [...state.addresses, response],
      defaultAddressId: addressData.isDefault ? response.id : state.defaultAddressId,
    }));
    return response;
  },

  // Update address
  updateAddress: async (addressId, addressData) => {
    const response = await userAPI.updateAddress(addressId, addressData);
    set(state => ({
      addresses: state.addresses.map(a => a.id === addressId ? response : a),
    }));
    return response;
  },

  // Delete address
  deleteAddress: async (addressId) => {
    await userAPI.deleteAddress(addressId);
    set(state => ({
      addresses: state.addresses.filter(a => a.id !== addressId),
      defaultAddressId: state.defaultAddressId === addressId ? null : state.defaultAddressId,
    }));
  },

  // Set default address
  setDefaultAddress: async (addressId) => {
    await userAPI.setDefaultAddress(addressId);
    set({ defaultAddressId: addressId });
  },

  // Get address by ID
  getAddress: (addressId) => get().addresses.find(a => a.id === addressId),

  // Get default address
  getDefaultAddress: () => {
    const { addresses, defaultAddressId } = get();
    return addresses.find(a => a.id === defaultAddressId) || addresses[0];
  },
}));
```

#### **Address List Component**
```javascript
// src/features/user/components/AddressBook.jsx

import { useEffect, useState } from 'react';
import { useUserStore } from '../store/userStore';
import AddressForm from './AddressForm';

export default function AddressBook() {
  const { addresses, defaultAddressId, fetchAddresses, setDefaultAddress, deleteAddress } = useUserStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDeleteAddress = async (addressId) => {
    if (confirm('Yakin ingin menghapus alamat ini?')) {
      try {
        await deleteAddress(addressId);
        showSuccessToast('Alamat berhasil dihapus');
      } catch (error) {
        showErrorToast('Gagal menghapus alamat');
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Buku Alamat</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Batal' : '+ Tambah Alamat'}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <AddressForm
            addressId={editingId}
            onSuccess={() => {
              setShowForm(false);
              setEditingId(null);
            }}
          />
        </div>
      )}

      {/* Address List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map(address => (
          <div
            key={address.id}
            className={`p-6 rounded-lg border-2 transition ${
              defaultAddressId === address.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold">{address.label}</h3>
                {defaultAddressId === address.id && (
                  <span className="inline-block mt-1 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                    Default
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(address.id);
                    setShowForm(true);
                  }}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Hapus
                </button>
              </div>
            </div>

            <div className="space-y-2 text-gray-700 text-sm">
              <p><strong>Nama:</strong> {address.fullName}</p>
              <p><strong>Telepon:</strong> {address.phone}</p>
              <p><strong>Alamat:</strong> {address.street}</p>
              <p><strong>Kota:</strong> {address.city}, {address.province}</p>
              <p><strong>Kode Pos:</strong> {address.zipCode}</p>
              {address.additionalInfo && (
                <p><strong>Catatan:</strong> {address.additionalInfo}</p>
              )}
            </div>

            {defaultAddressId !== address.id && (
              <button
                onClick={() => {
                  setDefaultAddress(address.id);
                  showSuccessToast('Alamat default telah diubah');
                }}
                className="mt-4 w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold rounded"
              >
                Jadikan Default
              </button>
            )}
          </div>
        ))}
      </div>

      {addresses.length === 0 && !showForm && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Belum ada alamat tersimpan</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Tambah Alamat Pertama
          </button>
        </div>
      )}
    </div>
  );
}
```

#### **Address Form Component**
```javascript
// src/features/user/components/AddressForm.jsx

import { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';

export default function AddressForm({ addressId, onSuccess }) {
  const { addAddress, updateAddress, getAddress } = useUserStore();
  const [formData, setFormData] = useState({
    label: '',
    fullName: '',
    phone: '',
    street: '',
    city: '',
    province: '',
    zipCode: '',
    additionalInfo: '',
    isDefault: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (addressId) {
      const address = getAddress(addressId);
      if (address) setFormData(address);
    }
  }, [addressId]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.label.trim()) newErrors.label = 'Label harus diisi';
    if (!formData.fullName.trim()) newErrors.fullName = 'Nama lengkap harus diisi';
    if (!formData.phone.match(/^08\d{8,11}$/)) newErrors.phone = 'Nomor telepon tidak valid';
    if (!formData.street.trim()) newErrors.street = 'Alamat jalan harus diisi';
    if (!formData.city.trim()) newErrors.city = 'Kota harus diisi';
    if (!formData.province.trim()) newErrors.province = 'Provinsi harus diisi';
    if (!formData.zipCode.match(/^\d{5}$/)) newErrors.zipCode = 'Kode pos harus 5 digit';

    return Object.keys(newErrors).length === 0 ? null : newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (addressId) {
        await updateAddress(addressId, formData);
        showSuccessToast('Alamat berhasil diperbarui');
      } else {
        await addAddress(formData);
        showSuccessToast('Alamat berhasil ditambahkan');
      }
      onSuccess();
    } catch (error) {
      showErrorToast(error.message || 'Gagal menyimpan alamat');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (name, label, type = 'text', placeholder = '') => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} *
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={(e) => setFormData({...formData, [name]: e.target.value})}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors[name] ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {renderField('label', 'Label Alamat', 'text', 'cth: Rumah, Kantor, Teman')}
        {renderField('fullName', 'Nama Lengkap')}
      </div>

      {renderField('phone', 'Nomor Telepon', 'tel', '08xxx')}
      {renderField('street', 'Jalan & Nomor Rumah')}

      <div className="grid grid-cols-2 gap-4">
        {renderField('city', 'Kota')}
        {renderField('province', 'Provinsi')}
      </div>

      {renderField('zipCode', 'Kode Pos', 'text', '12345')}
      {renderField('additionalInfo', 'Informasi Tambahan (Opsional)', 'text', 'RT/RW, landmark, dll')}

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={formData.isDefault}
          onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
          className="rounded"
        />
        <span className="ml-2 text-sm text-gray-700">Jadikan alamat default</span>
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
      >
        {isSubmitting ? 'Menyimpan...' : addressId ? 'Perbarui Alamat' : 'Tambah Alamat'}
      </button>
    </form>
  );
}
```

---

## 📊 Feature Specifications Summary

| Feature | Input | Process | Output | State |
|---------|-------|---------|--------|-------|
| **Search** | Query string | Debounce + API call | Product list | Store |
| **Filter** | Category, Price, Rating | Build query params | Filtered products | Store |
| **Cart** | Product + Qty | Add/Remove items | Cart with totals | localStorage + Store |
| **Address** | Address form | CRUD operations | Address list | API + Store |

---

## ✅ Feature Best Practices

- ✅ Implement search with debounce (300ms) to reduce API calls
- ✅ Make filters multi-select for better UX
- ✅ Persist cart to localStorage for offline access
- ✅ Store addresses server-side for security
- ✅ Validate all form inputs on client & server
- ✅ Show loading states during API calls
- ✅ Handle errors gracefully with retry options
- ✅ Implement pagination for large result sets

