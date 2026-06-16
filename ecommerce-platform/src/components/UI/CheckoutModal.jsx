import React, { useState } from 'react';
import { ordersService } from '../../api/services';
import { useCartStore } from '../../features/cart/store/cartStore';

export default function CheckoutModal({
  open = false,
  total = 0,
  onClose = () => {},
  onConfirm = () => {},
}) {
  const clearCart = useCartStore((state) => state.clearCart);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-10 w-[min(480px,90%)] rounded-2xl bg-white p-6 text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <h3 className="text-2xl font-semibold text-slate-900">Checkout Sukses!</h3>
        <p className="mt-2 text-sm text-slate-600">
          Terima kasih atas pesanan Anda. Pembayaran berhasil diproses.
        </p>

        <div className="mt-4 rounded-lg bg-slate-50 p-4">
          <div className="flex items-center justify-between text-sm text-slate-700">
            <span>Total dibayar</span>
            <strong className="text-lg text-slate-900">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0,
              }).format(total)}
            </strong>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={async () => {
              if (isSubmitting) return;
              setIsSubmitting(true);
              try {
                await ordersService.checkout({
                  // optional, schema sudah ada shipping/billing addresses
                  shipping_address_id: null,
                  billing_address_id: null,
                  notes: null,
                });
                clearCart();
                onConfirm();
              } catch (err) {
                console.error(err);
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="flex-1 rounded-2xl bg-primary-600 px-4 py-3 font-semibold text-white transition hover:bg-primary-700"
          >
            Kembali Belanja
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
