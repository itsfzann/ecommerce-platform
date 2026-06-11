import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '../features/auth/store/authStore';
import { cartService } from '../api/services';

const CartContext = createContext(null);

const mapCartItem = (item) => ({
  id: item.id,
  product_id: item.product_id,
  name: item.product_name,
  slug: item.product_slug,
  quantity: item.quantity,
  price: item.unit_price,
  image: item.image_url || '/placeholder-image.png',
  description: item.description || '',
});

export function CartProvider({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      try {
        const response = await cartService.getCart();
        setItems((response.items || []).map(mapCartItem));
      } catch (error) {
        console.error('Unable to load cart:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadCart();
    } else {
      setItems([]);
    }
  }, [isAuthenticated]);

  const addItem = async (product) => {
    if (isAuthenticated) {
      try {
        const response = await cartService.addItem(product.id, 1);
        setItems((response.items || []).map(mapCartItem));
        return;
      } catch (error) {
        console.error('Unable to add cart item:', error);
      }
    }

    setItems((currentItems) => {
      const existing = currentItems.find((item) => item.id === product.id);

      if (existing) {
        return currentItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  const removeItem = async (id) => {
    if (isAuthenticated) {
      try {
        const response = await cartService.removeItem(id);
        setItems((response.items || []).map(mapCartItem));
        return;
      } catch (error) {
        console.error('Unable to remove cart item:', error);
      }
    }

    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }

    if (isAuthenticated) {
      try {
        const response = await cartService.updateItem(id, quantity);
        setItems((response.items || []).map(mapCartItem));
        return;
      } catch (error) {
        console.error('Unable to update cart item:', error);
      }
    }

    setItems((currentItems) =>
      currentItems
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQuantity, clearCart, totalItems, loading }),
    [items, totalItems, loading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}
