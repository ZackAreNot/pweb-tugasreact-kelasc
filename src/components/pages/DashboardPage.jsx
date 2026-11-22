import { Link } from 'react-router'
import { ArrowRight, PackageOpen } from 'lucide-react'
import useProducts from '../../data/product/useProducts'
import { formatPrice } from '../../data/product/api'
import RequestState from '../molecules/RequestState'
import { buttonClass, buttonStyles } from '../atoms/Button'

export default function DashboardPage() {
  const { data: products, pending, error, reload } = useProducts()
  return (
    <>
      <section className="mb-7 flex items-center justify-between gap-5 rounded-2xl border border-orange-200 bg-brand-50 p-6 md:p-8">
        <div>
          <p className="text-sm font-semibold text-brand-700">
            Selamat datang di Etalase
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Dashboard
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-stone-600">
            Pantau katalog dan kelola informasi produkmu dalam satu tempat.
          </p>
        </div>
        <PackageOpen
          className="hidden shrink-0 -rotate-12 text-brand-600 sm:block"
          size={88}
          strokeWidth={1.3}
          aria-hidden="true"
        />
      </section>
      {pending || error ? (
        <RequestState pending={pending} error={error} onRetry={reload} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-stone-200 bg-white p-6">
              <h2 className="text-sm text-stone-600">Total produk</h2>
              <p className="mt-2 text-3xl font-bold">{products.length}</p>
              <p className="mt-2 text-xs text-stone-500">
                Produk dalam katalog saat ini
              </p>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-6">
              <h2 className="text-sm text-stone-600">Rentang harga</h2>
              <p className="mt-2 text-xl font-bold">
                {products.length
                  ? `${formatPrice(Math.min(...products.map((p) => p.price)))} – ${formatPrice(Math.max(...products.map((p) => p.price)))}`
                  : 'Belum ada produk'}
              </p>
              <p className="mt-2 text-xs text-stone-500">
                Harga terendah hingga tertinggi
              </p>
            </div>
          </div>
          <section className="mt-7 rounded-xl border border-stone-200 bg-white p-6">
            <h2 className="text-lg font-bold">Katalog produkmu</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Tambahkan produk baru, perbarui harga, atau lihat informasi
              lengkap setiap produk.
            </p>
            <Link
              to="/products"
              className={`${buttonClass} ${buttonStyles.primary} mt-5`}
            >
              Kelola produk
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </section>
        </>
      )}
    </>
  )
}
