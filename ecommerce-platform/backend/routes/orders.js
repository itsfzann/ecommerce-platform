import express from 'express';
import { pool } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const ensureCustomer = (req) => {
  return (req.user?.role || '').toLowerCase() === 'customer';
};

router.post('/checkout', authenticateToken, async (req, res) => {
  if (!ensureCustomer(req)) {
    return res.status(403).json({ message: 'Hanya customer yang bisa checkout' });
  }

  const { shipping_address_id, billing_address_id, notes } = req.body || {};
  // Karena schema saat ini tidak menyediakan store_id pada order_items,
  // checkout dilakukan sebagai 1 order dengan order_items per produk (best-effort).

  const userId = req.user.id;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [cartRows] = await connection.query(
      `SELECT ci.id AS cart_item_id,
              ci.product_id,
              ci.quantity,
              ci.unit_price,
              p.price AS current_price,
              p.stock AS current_stock,
              p.is_active AS product_is_active
       FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       JOIN products p ON ci.product_id = p.id
       WHERE c.user_id = ? AND p.is_active = 1`,
      [userId]
    );

    if (!cartRows.length) {
      await connection.rollback();
      return res.status(400).json({ message: 'Keranjang kosong' });
    }

    // Validasi & perhitungan total
    let computedTotal = 0;
    const lineItems = cartRows.map((row) => {
      const qty = Number(row.quantity);
      if (!Number.isInteger(qty) || qty < 1) {
        throw new Error('Jumlah produk tidak valid');
      }
      if (qty > Number(row.current_stock)) {
        throw new Error(`Stok tidak cukup untuk product_id=${row.product_id}`);
      }

      // gunakan harga snapshot dari cart_items (unit_price)
      // agar konsisten dengan harga saat user menambah ke cart
      const lineTotal = Number(row.unit_price) * qty;
      computedTotal += lineTotal;

      return {
        cart_item_id: row.cart_item_id,
        product_id: row.product_id,
        quantity: qty,
        unit_price: row.unit_price,
        total_price: lineTotal,
      };
    });

    const [insertOrder] = await connection.query(
      `INSERT INTO orders (user_id, status, total_amount, shipping_address_id, billing_address_id, notes)
       VALUES (?, 'pending', ?, ?, ?, ?)`,
      [
        userId,
        computedTotal,
        shipping_address_id || null,
        billing_address_id || null,
        notes || null,
      ]
    );

    const orderId = insertOrder.insertId;

    // Insert order_items
    for (const item of lineItems) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, item.unit_price, item.total_price]
      );

      // kurangi stock
      await connection.query(`UPDATE products SET stock = stock - ? WHERE id = ?`, [
        item.quantity,
        item.product_id,
      ]);
    }

    // hapus cart_items
    const cartItemIds = lineItems.map((i) => i.cart_item_id);
    await connection.query(
      `DELETE FROM cart_items WHERE id IN (${cartItemIds.map(() => '?').join(',')})`,
      cartItemIds
    );

    await connection.commit();

    return res.status(201).json({
      message: 'Checkout berhasil',
      order: { id: orderId, total_amount: computedTotal, status: 'pending' },
    });
  } catch (error) {
    console.error(error);
    try {
      await connection.rollback();
    } catch (_) {}

    // error yang dibuat di atas akan jadi 400
    return res.status(400).json({ message: error.message || 'Checkout gagal' });
  } finally {
    connection.release();
  }
});

export default router;
