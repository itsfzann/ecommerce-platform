import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <section className="container mx-auto py-20 px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Selamat Datang di ShopHub</h1>
        <p className="mx-auto max-w-2xl text-xl text-gray-600 mb-8">
          Platform E-Commerce modern untuk pengalaman belanja online yang cepat, aman, dan nyaman.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-2xl bg-primary-600 px-8 py-3 text-white font-semibold transition hover:bg-primary-700"
          >
            Mulai Belanja Sekarang
          </Link>
          <Link
            to="/cart"
            className="inline-flex items-center justify-center rounded-2xl border border-primary-600 bg-white px-8 py-3 text-primary-600 font-semibold transition hover:bg-primary-50"
          >
            Lihat Keranjang
          </Link>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Fitur Unggulan</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center shadow-sm">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Pencarian Cepat</h3>
              <p className="text-gray-600">Temukan produk favorit Anda dalam hitungan detik.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center shadow-sm">
              <div className="text-4xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold mb-2">Keranjang Pintar</h3>
              <p className="text-gray-600">Simpan dan kelola produk sebelum checkout.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center shadow-sm">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">Checkout Aman</h3>
              <p className="text-gray-600">Proses pembayaran cepat dan terpercaya.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
