import { Link } from 'react-router'
import { buttonClass, buttonStyles } from '../atoms/Button'

export default function NotFoundPage({ product = false }) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white px-5 py-16 text-center">
      <p className="text-6xl font-extrabold text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-bold">
        {product ? 'Produk tidak ditemukan' : 'Halaman tidak ditemukan'}
      </h1>
      <p className="mx-auto mt-3 max-w-md text-stone-600">
        {product
          ? 'Produk dengan ID ini tidak tersedia atau sudah dihapus.'
          : 'Alamat yang kamu buka tidak terdaftar. Kembali ke katalog untuk melanjutkan.'}
      </p>
      <Link
        to="/products"
        className={`${buttonClass} ${buttonStyles.primary} mt-6`}
      >
        Kembali ke daftar produk
      </Link>
    </section>
  )
}
