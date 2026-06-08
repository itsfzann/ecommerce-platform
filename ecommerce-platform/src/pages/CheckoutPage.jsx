import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../features/cart/store/cartStore'
import { useAuthStore } from '../features/auth/store/authStore'

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const items = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)
  const user = useAuthStore((state) => state.user)

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handlePlaceOrder = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
      clearCart()
    }, 900)
  }

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-3xl font-semibold text-slate-900 mb-4">Checkout</h1>
            <p className="text-slate-600 mb-6">Keranjang Anda kosong. Tambahkan produk terlebih dahulu.</p>
            <button
              onClick={() => navigate('/products')}
              className="rounded-2xl bg-primary-600 px-6 py-3 text-white transition hover:bg-primary-700"
            >
              Kembali ke Produk
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Checkout</h1>
            <div className="mb-8 rounded-3xl bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Detail Pengiriman</h2>
              <p className="text-slate-600">{user?.name}</p>
              <p className="text-slate-600">{user?.email}</p>
              <p className="text-slate-600">{user?.phone}</p>
              <p className="text-slate-600">{user?.address}</p>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="rounded-3xl border border-slate-200 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">{item.name}</h3>
                      <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-lg font-semibold text-slate-900">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Ringkasan Pesanan</h2>
              <div className="flex items-center justify-between text-slate-600 mb-3">
                <span>Subtotal</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 mb-3">
                <span>Biaya Pengiriman</span>
                <span>{formatCurrency(25000)}</span>
              </div>
              <div className="border-t border-slate-200 pt-4 text-slate-900 font-semibold flex items-center justify-between">
                <span>Total</span>
                <span>{formatCurrency(totalAmount + 25000)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isProcessing || isSuccess}
              className="w-full rounded-2xl bg-primary-600 px-5 py-3 text-white font-semibold transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isProcessing ? 'Memproses...' : isSuccess ? 'Pesanan Berhasil' : 'Place Order'}
            </button>

            {isSuccess && (
              <div className="mt-6 rounded-3xl bg-emerald-50 p-4 text-emerald-800">
                <p className="font-semibold">Pesanan Anda berhasil!</p>
                <p>Terima kasih telah berbelanja di ShopHub.</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
