import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import sellerProductsRoutes from './routes/seller-products.js';
import ordersRoutes from './routes/orders.js';
import authSellerRoutes from './routes/auth-seller.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/auth', authSellerRoutes);

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/seller-products', sellerProductsRoutes);
app.use('/api/orders', ordersRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`E-Commerce API running on http://localhost:${PORT}`);
});
