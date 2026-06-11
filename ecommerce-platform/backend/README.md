# E-Commerce Backend API

Backend API ini dibuat dengan Node.js, Express, dan MySQL.

## Install

Buka terminal di folder `backend` lalu jalankan:

```bash
npm install
```

## Konfigurasi Environment

Duplikasi file `.env.example` menjadi `.env` dan isi sesuai kredensial MySQL kamu.

Contoh `.env`:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=ecommerce
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=12h
FRONTEND_ORIGIN=http://localhost:5173
PORT=4000
```

## Menjalankan API

```bash
npm start
```

Atau saat development:

```bash
npm run dev
```

## Endpoint Utama

- `POST /api/auth/register` - registrasi user baru
- `POST /api/auth/login` - login dan menerima JWT
- `GET /api/products` - daftar produk aktif beserta kategori
- `GET /api/products/:slug` - detail produk lengkap dengan gambar
- `GET /api/cart` - ambil item keranjang user yang login
- `POST /api/cart` - tambah produk ke keranjang atau update kuantitas

## Koneksi MySQL

Pastikan database MySQL kamu sudah dibuat dan schema dijalankan dari file `database/mysql_schema.sql` di root proyek.

Jika menggunakan phpMyAdmin, import file `database/mysql_schema.sql` setelah membuat database `ecommerce`.
