const rupiah = new Intl.NumberFormat('id-ID')

export const formatPrice = (price) => `Rp${rupiah.format(price)}`

export const exampleProducts = [
  { id: 1, name: 'Pulpen', price: 5000 },
  { id: 2, name: 'Buku Tulis', price: 12000 },
  { id: 3, name: 'Spidol', price: 8000 },
  { id: 4, name: 'Penggaris', price: 6000 },
  { id: 5, name: 'Penghapus', price: 3000 },
]

const storageKey = 'etalase-tugas-3:products'

function validDetails(product) {
  return typeof product?.name === 'string' && product.name.trim().length > 0
    && Number.isSafeInteger(product.price) && product.price > 0
}

export function readProducts(storage) {
  const saved = storage.getItem(storageKey)
  if (saved === null) return exampleProducts

  const products = JSON.parse(saved)
  if (!Array.isArray(products)
    || !products.every((product) => validDetails(product) && Number.isSafeInteger(product.id) && product.id > 0)
    || new Set(products.map((product) => product.id)).size !== products.length) {
    throw new Error('Format katalog tidak valid.')
  }
  return products
}

export function saveProducts(storage, products) {
  try {
    storage.setItem(storageKey, JSON.stringify(products))
  } catch {
    throw new Error('Produk tidak bisa disimpan. Periksa penyimpanan browser.')
  }
}

export function changeProducts(products, action, id, details) {
  if (action !== 'delete' && !validDetails(details)) {
    throw new Error('Isi nama produk dan harga berupa bilangan bulat positif.')
  }

  if (action === 'add') {
    const nextId = products.reduce((highest, product) => Math.max(highest, product.id), 0) + 1
    if (!Number.isSafeInteger(nextId)) throw new Error('ID produk baru tidak bisa dibuat.')
    return [...products, { id: nextId, ...details }]
  }

  if (!products.some((product) => product.id === id)) {
    throw new Error('Produk sudah tidak tersedia. Muat ulang katalog.')
  }

  return action === 'delete'
    ? products.filter((product) => product.id !== id)
    : products.map((product) => product.id === id ? { id, ...details } : product)
}
