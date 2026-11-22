import { Link, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import useProducts from '../../data/product/useProducts'
import { formatPrice } from '../../data/product/api'
import ProductArt from '../molecules/ProductArt'
import RequestState from '../molecules/RequestState'
import NotFoundPage from './NotFoundPage'

export default function ProductDetailPage() {
  const { id } = useParams()
  const {
    data: product,
    pending,
    error,
    reload,
  } = useProducts(`/${encodeURIComponent(id)}`)
  if (error?.status === 404 || error?.status === 400)
    return <NotFoundPage product />
  return (
    <>
      <Link
        to="/products"
        className="mb-6 inline-flex items-center gap-2 rounded text-sm font-semibold text-brand-700 hover:underline"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Kembali ke daftar produk
      </Link>
      {pending || error ? (
        <RequestState pending={pending} error={error} onRetry={reload} />
      ) : (
        <section className="rounded-2xl border border-stone-200 bg-white p-5 md:p-8">
          <p className="mb-6 text-sm text-stone-500">
            Daftar produk / Detail produk
          </p>
          <div className="grid gap-8 md:grid-cols-2">
            <ProductArt product={product} large />
            <div className="py-3">
              <span className="rounded bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700">
                Produk #{product.id}
              </span>
              <h1 className="mt-4 text-3xl font-bold wrap-anywhere">
                {product.name}
              </h1>
              <p className="mt-3 text-3xl font-bold text-brand-600">
                {formatPrice(product.price)}
              </p>
              <dl className="mt-7 border-t border-stone-200 pt-5 text-sm">
                <dt className="text-stone-500">ID produk</dt>
                <dd className="mt-1 font-semibold">{product.id}</dd>
                <dt className="mt-4 text-stone-500">Nama produk</dt>
                <dd className="mt-1 font-semibold wrap-anywhere">
                  {product.name}
                </dd>
              </dl>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
