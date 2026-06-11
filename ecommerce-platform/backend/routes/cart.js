import express from 'express';
import { pool } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const mapCartItems = (rows) =>
  rows.map((item) => ({
    id: item.id,
    cart_id: item.cart_id,
    product_id: item.product_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    product_name: item.product_name,
    product_slug: item.product_slug,
    product_stock: item.product_stock,
    product_is_active: item.product_is_active,
    image_url: item.image_url,
  }));

router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [carts] = await pool.query('SELECT id FROM carts WHERE user_id = ? LIMIT 1', [userId]);
    if (!carts.length) {
      return res.json({ cartId: null, items: [] });
    }

    const cartId = carts[0].id;
    const [items] = await pool.query(
      `SELECT
         ci.id,
         ci.cart_id,
         ci.product_id,
         ci.quantity,
         ci.unit_price,
         p.name AS product_name,
         p.slug AS product_slug,
         p.stock AS product_stock,
         p.is_active AS product_is_active,
         pi.url AS image_url
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.position = 0
       WHERE ci.cart_id = ?`,
      [cartId]
    );

    return res.json({ cartId, items: mapCartItems(items) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Gagal memuat isi keranjang' });
  }
});

router.get('/items', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [carts] = await pool.query('SELECT id FROM carts WHERE user_id = ? LIMIT 1', [userId]);
    if (!carts.length) {
      return res.json({ cartId: null, items: [] });
    }

    const cartId = carts[0].id;
    const [items] = await pool.query(
      `SELECT
         ci.id,
         ci.cart_id,
         ci.product_id,
         ci.quantity,
         ci.unit_price,
         p.name AS product_name,
         p.slug AS product_slug,
         p.stock AS product_stock,
         p.is_active AS product_is_active,
         pi.url AS image_url
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.position = 0
       WHERE ci.cart_id = ?`,
      [cartId]
    );

    return res.json({ cartId, items: mapCartItems(items) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Gagal memuat isi keranjang' });
  }
});

router.post('/items', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity } = req.body;
  const count = Number(quantity || 1);

  if (!product_id || count < 1) {
    return res.status(400).json({ message: 'product_id dan quantity valid diperlukan' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [productRows] = await connection.query(
      'SELECT id, price, is_active FROM products WHERE id = ? LIMIT 1',
      [product_id]
    );
    if (!productRows.length || productRows[0].is_active !== 1) {
      await connection.rollback();
      return res.status(404).json({ message: 'Produk tidak ditemukan atau tidak aktif' });
    }

    const product = productRows[0];
    const [cartRows] = await connection.query('SELECT id FROM carts WHERE user_id = ? LIMIT 1', [
      userId,
    ]);
    const cartId = cartRows.length ? cartRows[0].id : null;

    let activeCartId = cartId;
    if (!activeCartId) {
      const [insertCart] = await connection.query('INSERT INTO carts (user_id) VALUES (?)', [
        userId,
      ]);
      activeCartId = insertCart.insertId;
    }

    const [existingItems] = await connection.query(
      'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ? LIMIT 1',
      [activeCartId, product_id]
    );

    if (existingItems.length) {
      const newQuantity = existingItems[0].quantity + count;
      await connection.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [
        newQuantity,
        existingItems[0].id,
      ]);
    } else {
      await connection.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [activeCartId, product_id, count, product.price]
      );
    }

    await connection.commit();

    const [items] = await pool.query(
      `SELECT
         ci.id,
         ci.cart_id,
         ci.product_id,
         ci.quantity,
         ci.unit_price,
         p.name AS product_name,
         p.slug AS product_slug,
         p.stock AS product_stock,
         p.is_active AS product_is_active,
         pi.url AS image_url
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.position = 0
       WHERE ci.cart_id = ?`,
      [activeCartId]
    );

    return res.status(200).json({ cartId: activeCartId, items: mapCartItems(items) });
  } catch (error) {
    console.error(error);
    await connection.rollback();
    return res.status(500).json({ message: 'Gagal menambahkan produk ke keranjang' });
  } finally {
    connection.release();
  }
});

router.patch('/items/:id', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const itemId = Number(req.params.id);
  const quantity = Number(req.body.quantity);

  if (!itemId || quantity < 1) {
    return res.status(400).json({ message: 'Quantity valid diperlukan' });
  }

  try {
    const [result] = await pool.query(
      `UPDATE cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       SET ci.quantity = ?
       WHERE ci.id = ? AND c.user_id = ?`,
      [quantity, itemId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cart item tidak ditemukan' });
    }

    const [updatedItems] = await pool.query(
      `SELECT
         ci.id,
         ci.cart_id,
         ci.product_id,
         ci.quantity,
         ci.unit_price,
         p.name AS product_name,
         p.slug AS product_slug,
         p.stock AS product_stock,
         p.is_active AS product_is_active,
         pi.url AS image_url
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.position = 0
       JOIN carts c ON ci.cart_id = c.id
       WHERE c.user_id = ?`,
      [userId]
    );

    return res.json({ items: mapCartItems(updatedItems) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Gagal memperbarui quantity keranjang' });
  }
});

router.delete('/items/:id', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const itemId = Number(req.params.id);

  if (!itemId) {
    return res.status(400).json({ message: 'Item ID diperlukan' });
  }

  try {
    const [result] = await pool.query(
      `DELETE ci FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       WHERE ci.id = ? AND c.user_id = ?`,
      [itemId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cart item tidak ditemukan' });
    }

    const [updatedItems] = await pool.query(
      `SELECT
         ci.id,
         ci.cart_id,
         ci.product_id,
         ci.quantity,
         ci.unit_price,
         p.name AS product_name,
         p.slug AS product_slug,
         p.stock AS product_stock,
         p.is_active AS product_is_active,
         pi.url AS image_url
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.position = 0
       JOIN carts c ON ci.cart_id = c.id
       WHERE c.user_id = ?`,
      [userId]
    );

    return res.json({ items: mapCartItems(updatedItems) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Gagal menghapus item keranjang' });
  }
});

export default router;
