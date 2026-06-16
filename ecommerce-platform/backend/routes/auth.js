import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '12h';

router.post('/register', async (req, res) => {
  const { email, password, name, phone } = req.body;

  // (customer register)

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email sudah terdaftar' });
    }

    const [roleRows] = await pool.query('SELECT id FROM roles WHERE name = ? LIMIT 1', [
      'customer',
    ]);
    const roleId = roleRows.length > 0 ? roleRows[0].id : null;

    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO users (role_id, email, password_hash, name, phone)
       VALUES (?, ?, ?, ?, ?)`,
      [roleId, email, password_hash, name || null, phone || null]
    );

    const user = {
      id: result.insertId,
      email,
      name: name || null,
      phone: phone || null,
      role_id: roleId,
    };

    return res.status(201).json({ message: 'User terdaftar', user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Gagal mendaftar user' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password diperlukan' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.email, u.password_hash, u.name, u.phone, r.name AS role_name
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.email = ?
       LIMIT 1`,
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const user = rows[0];
    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role_name || 'customer',
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role_name || 'customer',
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Gagal melakukan login' });
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.email, u.name, u.phone, r.name AS role_name
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?
       LIMIT 1`,
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];
    return res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role_name || 'customer',
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Gagal mengambil data user' });
  }
});

router.post('/logout', authenticateToken, async (req, res) => {
  return res.json({ message: 'Logout berhasil' });
});

export default router;
