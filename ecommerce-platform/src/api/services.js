import client from './client';
import { endpoints } from './endpoints';

export const authService = {
  login: (payload) => client.post(endpoints.AUTH.LOGIN, payload),
  register: (payload) => client.post(endpoints.AUTH.REGISTER, payload),
  me: () => client.get(endpoints.AUTH.ME),
  logout: () => client.post(endpoints.AUTH.LOGOUT),
};

export const productService = {
  getProducts: () => client.get(endpoints.PRODUCTS.LIST),
  getProductBySlug: (slug) => client.get(endpoints.PRODUCTS.DETAIL(slug)),
};

export const cartService = {
  getCart: () => client.get(endpoints.CART.LIST),
  addItem: (productId, quantity) =>
    client.post(endpoints.CART.ADD, { product_id: productId, quantity }),
  updateItem: (itemId, quantity) => client.patch(endpoints.CART.UPDATE(itemId), { quantity }),
  removeItem: (itemId) => client.delete(endpoints.CART.REMOVE(itemId)),
};
