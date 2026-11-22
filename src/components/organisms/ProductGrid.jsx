import ProductCard from '../molecules/ProductCard'

export default function ProductGrid({ products, onEdit, onDelete }) {
  return (
    <ul className="grid grid-cols-1 gap-4 min-[380px]:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={() => onEdit(product)}
          onDelete={() => onDelete(product)}
        />
      ))}
    </ul>
  )
}
