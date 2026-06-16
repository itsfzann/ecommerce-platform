import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './features/auth/store/authStore';
import ProtectedRoute from './components/Common/ProtectedRoute';
import AppLayout from './components/Layout/AppLayout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import { CartProvider } from './context/CartContext';
import RegisterSellerPage from './features/auth/RegisterSellerPage';
import SellerAddProductPage from './features/product/SellerAddProductPage';

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register-seller" element={<RegisterSellerPage />} />
            <Route
              path="/seller/add-product"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <SellerAddProductPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </CartProvider>
    </Router>
  );
}
