import { products } from '../data/products'
import { useCartStore } from '../features/cart/store/cartStore'

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function ProductsPage() {
  const addItem = useCartStore((state) => state.addItem)

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

        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <article key={product.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 h-48 rounded-3xl bg-primary-50 p-6 text-primary-700">
                <p className="text-xs uppercase tracking-[0.2em]">{product.category}</p>
                <h2 className="mt-8 text-2xl font-bold text-slate-900">{product.name}</h2>
              </div>
              <p className="text-gray-600 mb-6">{product.description}</p>
              <div className="mb-6 flex items-center justify-between gap-4">
                <span className="text-2xl font-semibold text-slate-900">{formatCurrency(product.price)}</span>
                <button
                  type="button"
                  onClick={() => addItem(product)}
                  className="rounded-2xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
                >
                  Tambah ke Keranjang
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
