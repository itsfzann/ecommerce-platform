/* API Endpoints */
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
    CHECKOUT: '/orders/checkout',
    CREATE: '/orders',
    LIST: '/orders',
    DETAIL: (id) => `/orders/${id}`,
  },

  // Seller
  SELLER: {
    REGISTER_PRODUCT: '/seller/products',
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
