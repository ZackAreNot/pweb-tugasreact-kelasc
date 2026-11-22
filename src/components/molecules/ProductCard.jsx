import { Link } from 'react-router'
import { Pencil, Trash2 } from 'lucide-react'
import Button from '../atoms/Button'
import ProductArt from './ProductArt'
import { formatPrice } from '../../data/product/api'

export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <li className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-stone-200 bg-white">
      <Link
        to={`/products/${product.id}`}
        aria-label={`Detail ${product.name}`}
        className="group block"
      >
        <ProductArt product={product} />
        <div className="p-4">
          <h2 className="wrap-anywhere font-semibold group-hover:text-brand-600">
            {product.name}
          </h2>
          <p className="mt-1 text-lg font-bold text-brand-600">
            {formatPrice(product.price)}
          </p>
          <p className="mt-2 text-xs text-stone-500">Lihat detail →</p>
        </div>
      </Link>
      <div className="mt-auto flex flex-wrap gap-2 px-3 pb-3">
        <Button
          variant="secondary"
          className="flex-1"
          aria-label={`Edit ${product.name}`}
          onClick={onEdit}
        >
          <Pencil size={14} aria-hidden="true" />
          Edit
        </Button>
        <Button
          variant="danger"
          className="flex-1"
          aria-label={`Hapus ${product.name}`}
          onClick={onDelete}
        >
          <Trash2 size={14} aria-hidden="true" />
          Hapus
        </Button>
      </div>
    </li>
  )
}
