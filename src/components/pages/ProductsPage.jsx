import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Plus, Search } from 'lucide-react'
import useProducts from '../../data/product/useProducts'
import { saveProduct } from '../../data/product/api'
import Button from '../atoms/Button'
import RequestState from '../molecules/RequestState'
import ProductGrid from '../organisms/ProductGrid'
import ProductDialog from '../organisms/ProductDialog'

export default function ProductsPage() {
  const { data: products, pending, error, reload } = useProducts()
  const [query, setQuery] = useState('')
  const [editor, setEditor] = useState(null)
  const [notice, setNotice] = useState('')
  const addButton = useRef(null)
  const navigate = useNavigate()
  const visible = (products ?? []).filter((product) =>
    product.name.toLowerCase().includes(query.trim().toLowerCase())
  )

  async function handleSave(action, id, details) {
    const saved = await saveProduct(action, id, details)
    setNotice(
      action === 'delete'
        ? 'Produk berhasil dihapus.'
        : 'Produk berhasil disimpan.'
    )
    if (action === 'add') navigate(`/products/${saved.id}`)
    else reload()
  }

  function openEditor(action, product) {
    setNotice('')
    setEditor({ action, product })
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daftar Produk</h1>
          <p className="mt-2 text-sm text-stone-600">
            Kelola nama, harga, dan informasi produkmu.
          </p>
        </div>
        <Button
          ref={addButton}
          disabled={pending || Boolean(error)}
          onClick={() => openEditor('add')}
        >
          <Plus size={17} aria-hidden="true" />
          Tambah Produk
        </Button>
      </div>
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-1">
        <Search
          size={19}
          className="shrink-0 text-stone-500"
          aria-hidden="true"
        />
        <input
          type="search"
          aria-label="Cari produk"
          placeholder="Cari nama produk..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="border-0 px-0"
        />
      </div>
      <p
        role="status"
        className={
          notice ? 'mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800' : ''
        }
      >
        {notice}
      </p>
      {pending || error ? (
        <RequestState pending={pending} error={error} onRetry={reload} />
      ) : (
        <>
          {visible.length ? (
            <ProductGrid
              products={visible}
              onEdit={(product) => openEditor('edit', product)}
              onDelete={(product) => openEditor('delete', product)}
            />
          ) : (
            <p
              role="status"
              className="rounded-xl border border-stone-200 bg-white p-10 text-center text-stone-600"
            >
              {query.trim()
                ? 'Produk yang kamu cari tidak ditemukan.'
                : 'Belum ada produk. Tambahkan produk pertamamu.'}
            </p>
          )}
          <p aria-live="polite" className="mt-5 text-sm text-stone-500">
            Menampilkan {visible.length} dari {products.length} produk
          </p>
        </>
      )}
      {editor && (
        <ProductDialog
          editor={editor}
          onSave={handleSave}
          onClose={() => {
            if (document.activeElement === document.body)
              addButton.current?.focus()
            setEditor(null)
          }}
        />
      )}
    </>
  )
}
