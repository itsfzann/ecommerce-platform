import { useEffect } from 'react';

export default function Toast({ message = '', show = false, onClose = () => {} }) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(t);
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed right-4 top-4 z-50 flex w-auto max-w-xs items-start gap-4 rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-900">Berhasil ditambahkan</p>
        <p className="mt-1 text-xs text-slate-600">{message}</p>
      </div>
    </div>
  );
}
