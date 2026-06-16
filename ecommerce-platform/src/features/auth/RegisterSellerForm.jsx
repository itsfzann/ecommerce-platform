import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/services';

export default function RegisterSellerForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    store_name: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const setField = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!form.email || !form.password) {
      setError('Email dan password wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.registerSeller({
        email: form.email,
        password: form.password,
        name: form.name,
        phone: form.phone,
        store_name: form.store_name,
      });

      setSuccessMessage('Seller berhasil terdaftar. Silakan login.');
      setTimeout(() => navigate('/login'), 800);
    } catch (err) {
      setError(err?.message || 'Gagal mendaftar seller');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Daftar Seller</h1>
          <p className="text-slate-600 mb-8">
            Buat akun seller untuk menambahkan produk ke marketplace.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nama</label>
              <input
                value={form.name}
                onChange={setField('name')}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                placeholder="Nama penjual"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={setField('email')}
                required
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={setField('password')}
                required
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nomor HP</label>
              <input
                value={form.phone}
                onChange={setField('phone')}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                placeholder="+62 812-3456-7890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nama Toko</label>
              <input
                value={form.store_name}
                onChange={setField('store_name')}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                placeholder="Nama toko"
              />
              <p className="mt-2 text-xs text-slate-500">
                (Di schema kamu saat ini tabel stores belum ada, jadi input ini belum disimpan.)
              </p>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {successMessage && <p className="text-sm text-emerald-700">{successMessage}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-primary-600 px-5 py-3 text-white font-semibold transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting ? 'Memproses...' : 'Daftar Seller'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
