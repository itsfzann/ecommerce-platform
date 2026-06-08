import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../features/cart/store/cartStore'

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const navigate = useNavigate()

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Keranjang Belanja</h1>
            <p className="text-gray-600 mt-2">Review produk yang sudah Anda pilih sebelum checkout.</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm border border-slate-200">
            <p className="text-sm uppercase tracking-wide text-slate-500">Item</p>
            <p className="text-2xl font-semibold text-slate-900">{items.length}</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <p className="text-xl font-semibold text-slate-900 mb-2">Keranjang Anda kosong</p>
            <p className="text-gray-600 mb-6">Tambahkan produk dari halaman Produk untuk mulai belanja.</p>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="rounded-2xl bg-primary-600 px-6 py-3 text-white transition hover:bg-primary-700"
            >
              Jelajahi Produk
            </button>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">{item.name}</h2>
                      <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                    </div>
                    <p className="text-lg font-semibold text-slate-900">{formatCurrency(item.price)}</p>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-10 w-10 rounded-2xl border border-slate-300 bg-slate-100 text-xl text-slate-700 transition hover:bg-slate-200"
                      >
                        −
                      </button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-10 w-10 rounded-2xl border border-slate-300 bg-slate-100 text-xl text-slate-700 transition hover:bg-slate-200"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Ringkasan Pesanan</h2>
              <div className="mb-4 flex items-center justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full rounded-2xl bg-primary-600 px-5 py-3 text-white font-semibold transition hover:bg-primary-700"
              >
                Checkout Sekarang
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}
