import { useEffect, useState } from 'react';
import { useCartContext } from '../context/CartContext';
import { productService } from '../api/services';
import Toast from '../components/UI/Toast';

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProductsPage() {
  const { addItem } = useCartContext();
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await productService.getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError('Gagal memuat produk. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleAdd = (product) => {
    addItem({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image_url || '/placeholder-image.png',
      slug: product.slug,
    });
    setToast({ show: true, message: `${product.name} telah ditambahkan ke keranjang` });
  };

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

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm text-center">
            <p className="text-lg text-slate-500">Memuat produk...</p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-10 shadow-sm text-center">
            <p className="text-lg font-semibold text-red-700">{error}</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative overflow-hidden bg-slate-100">
                  <img
                    src={product.image_url || '/placeholder-image.png'}
                    alt={product.name}
                    className="h-56 w-full object-cover object-center"
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {product.category_name || 'Uncategorized'}
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
        )}

        <Toast
          message={toast.message}
          show={toast.show}
          onClose={() => setToast({ show: false, message: '' })}
        />
      </div>
    </div>
  );
}
