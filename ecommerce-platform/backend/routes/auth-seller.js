import express from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js';

const router = express.Router();

router.post('/register-seller', async (req, res) => {
  const { email, password, name, phone, store_name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password diperlukan' });
  }

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }

    const [roleRows] = await pool.query('SELECT id FROM roles WHERE name = ? LIMIT 1', ['seller']);
    if (!roleRows.length) {
      return res.status(500).json({ message: "Role 'seller' belum tersedia di tabel roles" });
    }

    const roleId = roleRows[0].id;
    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (role_id, email, password_hash, name, phone)
       VALUES (?, ?, ?, ?, ?)`,
      [roleId, email, password_hash, name || store_name || null, phone || null]
    );

    return res.status(201).json({
      message: 'Seller berhasil terdaftar',
      user: {
        id: result.insertId,
        email,
        name: name || store_name || null,
        phone: phone || null,
        role_id: roleId,
      },
      // stores table tidak ada di schema saat ini
      store: null,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Gagal mendaftar seller' });
  }
});

export default router;
