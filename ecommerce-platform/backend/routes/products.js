import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         p.id,
         p.sku,
         p.name,
         p.slug,
         p.description,
         p.price,
         p.stock,
         p.is_active,
         p.created_at,
         p.updated_at,
         c.id AS category_id,
         c.name AS category_name,
         pi.url AS image_url
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.position = 0
       WHERE p.is_active = 1
       ORDER BY p.created_at DESC`
    );

    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Gagal memuat daftar produk' });
  }
});

router.get('/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    const [productRows] = await pool.query(
      `SELECT
         p.id,
         p.sku,
         p.name,
         p.slug,
         p.description,
         p.price,
         p.stock,
         p.is_active,
         p.created_at,
         p.updated_at,
         c.id AS category_id,
         c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = ?
       LIMIT 1`,
      [slug]
    );

    if (!productRows.length) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    const product = productRows[0];
    const [images] = await pool.query(
      `SELECT id, url, alt_text, position
       FROM product_images
       WHERE product_id = ?
       ORDER BY position ASC`,
      [product.id]
    );

    return res.json({ ...product, images });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Gagal memuat detail produk' });
  }
});

export default router;
