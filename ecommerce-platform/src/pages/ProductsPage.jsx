import { products } from '../data/products';
import { useCartContext } from '../context/CartContext';
import Toast from '../components/UI/Toast';
import { useState } from 'react';

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProductsPage() {
  const { addItem } = useCartContext();
  const [toast, setToast] = useState({ show: false, message: '' });

  function handleAdd(product) {
    addItem(product);
    setToast({ show: true, message: `${product.name} telah ditambahkan ke keranjang` });
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">ShopHub Products</h1>
            <p className="text-gray-600 mt-2">Pilih produk terbaik untuk kebutuhan harian Anda.</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-200">
            <p className="text-sm uppercase tracking-wide text-slate-500">Jumlah produk</p>
            <p className="text-2xl font-semibold text-slate-900">{products.length}</p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative overflow-hidden bg-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-56 w-full object-cover object-center"
                />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  {product.category}
                </p>
                <h2 className="mt-4 text-2xl font-semibold text-slate-900">{product.name}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{product.description}</p>
                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-2xl font-semibold text-slate-900">
                    {formatCurrency(product.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAdd(product)}
                    className="rounded-2xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <Toast
          message={toast.message}
          show={toast.show}
          onClose={() => setToast({ show: false, message: '' })}
        />
      </div>
    </div>
  );
}
