import { useState } from 'react';
import client from '../../api/client';

export default function SellerAddProductForm() {
  const [form, setForm] = useState({
    name: '',
    category_id: '',
    price: '',
    stock: '',
    description: '',
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

    if (!form.name) {
      setError('name wajib diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: form.name,
        category_id: form.category_id ? Number(form.category_id) : null,
        price: Number(form.price),
        stock: Number(form.stock),
        description: form.description || null,
      };

      const res = await client.post('/seller-products', payload);

      setSuccessMessage(res?.message || 'Produk berhasil ditambahkan');

      setForm({ name: '', category_id: '', price: '', stock: '', description: '' });
    } catch (err) {
      setError(err?.message || err?.error || 'Gagal menambahkan produk');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Nama Produk</label>
        <input
          value={form.name}
          onChange={setField('name')}
          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
          placeholder="Nama produk"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Category ID</label>
        <input
          value={form.category_id}
          onChange={setField('category_id')}
          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
          placeholder="Misal: 1"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Harga</label>
          <input
            type="number"
            value={form.price}
            onChange={setField('price')}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
            placeholder="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Stock</label>
          <input
            type="number"
            value={form.stock}
            onChange={setField('stock')}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3"
            placeholder="0"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Deskripsi</label>
        <textarea
          value={form.description}
          onChange={setField('description')}
          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 min-h-[110px]"
          placeholder="Deskripsi produk (opsional)"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {successMessage && <p className="text-sm text-emerald-700">{successMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-primary-600 px-5 py-3 text-white font-semibold transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? 'Memproses...' : 'Tambah Produk'}
      </button>
    </form>
  );
}
