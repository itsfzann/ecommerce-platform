import express from 'express';
import { pool } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const ensureSeller = (req) => {
  // role comes from JWT payload: role: user.role_name || 'customer'
  return (req.user?.role || req.user?.role_name || '').toLowerCase() === 'seller';
};

router.post('/', authenticateToken, async (req, res) => {
  if (!ensureSeller(req)) {
    return res.status(403).json({ message: 'Hanya seller yang bisa menambahkan produk' });
  }

  const { name, category_id, price, stock, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'name wajib diisi' });
  }

  const priceNum = Number(price);
  const stockNum = Number(stock);

  if (Number.isNaN(priceNum) || priceNum < 0) {
    return res.status(400).json({ message: 'price harus berupa angka >= 0' });
  }

  if (!Number.isInteger(stockNum) || stockNum < 0) {
    return res.status(400).json({ message: 'stock harus berupa bilangan bulat >= 0' });
  }

  const sku = `SKU-${Date.now()}`;
  const slug = name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .slice(0, 60);

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // optional: check category exists
    let finalCategoryId = null;
    if (category_id) {
      const [catRows] = await connection.query('SELECT id FROM categories WHERE id = ? LIMIT 1', [
        category_id,
      ]);
      if (!catRows.length) {
        await connection.rollback();
        return res.status(400).json({ message: 'category_id tidak valid' });
      }
      finalCategoryId = category_id;
    }

    // Insert product
    const finalSlug = slug || `product-${Date.now()}`;

    const [result] = await connection.query(
      `INSERT INTO products (sku, slug, name, description, price, stock, category_id, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [sku, finalSlug, name, description || null, priceNum, stockNum, finalCategoryId]
    );

    const productId = result.insertId;

    const [productRows] = await connection.query(
      `SELECT id, sku, slug, name, description, price, stock, category_id, is_active, created_at, updated_at
       FROM products WHERE id = ? LIMIT 1`,
      [productId]
    );

    await connection.commit();

    return res.status(201).json({
      message: 'Produk berhasil ditambahkan',
      product: productRows[0],
    });
  } catch (error) {
    console.error(error);
    try {
      await connection.rollback();
    } catch (_) {}
    return res.status(500).json({ message: 'Gagal menambahkan produk' });
  } finally {
    connection.release();
  }
});

export default router;
