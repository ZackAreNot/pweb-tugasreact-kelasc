import { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BookOpen, Box, Eraser, Highlighter, LayoutGrid, PackageOpen, Pencil, PenLine, Plus, Ruler, Search, ShoppingBag, Trash2,
} from 'lucide-react'
import { changeProducts, formatPrice, readProducts, saveProducts } from './products'
import ProductDialog from './ProductDialog'
import './style.css'

const productArt = new Map([
  ['pulpen', [PenLine, 'peach']],
  ['buku tulis', [BookOpen, 'green']],
  ['spidol', [Highlighter, 'lilac']],
  ['penggaris', [Ruler, 'sand']],
  ['penghapus', [Eraser, 'rose']],
])

function ProductCard({ product, onEdit, onDelete }) {
  const [Illustration, tone] = productArt.get(product.name.toLowerCase()) ?? [Box, 'peach']

  return (
    <li className="product">
      <div className={`product-art ${tone}`} aria-hidden="true">
        <span>#{String(product.id).padStart(2, '0')}</span>
        <Illustration size={56} strokeWidth={1.4} />
      </div>
      <div className="product-content">
        <h3>{product.name}</h3>
        <p className="price">{formatPrice(product.price)}</p>
      </div>
      <div className="product-actions">
        <button className="button secondary" aria-label={'Edit ' + product.name} onClick={onEdit}>
          <Pencil size={13} aria-hidden="true" /> Edit
        </button>
        <button className="button delete" aria-label={'Hapus ' + product.name} onClick={onDelete}>
          <Trash2 size={13} aria-hidden="true" /> Hapus
        </button>
      </div>
    </li>
  )
}

function loadCatalog() {
  try {
    return { products: readProducts(window.localStorage), error: '' }
  } catch {
    return { products: [], error: 'Katalog tidak bisa dibaca. Periksa penyimpanan browser.' }
  }
}

function App() {
  const [{ products, error }, setCatalog] = useState(loadCatalog)
  const [query, setQuery] = useState('')
  const [editor, setEditor] = useState(null)
  const [notice, setNotice] = useState('')
  const addButton = useRef(null)

  function openEditor(action, product) {
    setNotice('')
    setEditor({ action, product })
  }

  function saveProduct(action, id, details) {
    const storage = window.localStorage
    const next = changeProducts(readProducts(storage), action, id, details)
    saveProducts(storage, next)
    setCatalog({ products: next, error: '' })

    if (action === 'delete') {
      setNotice('Produk berhasil dihapus.')
    } else if (action === 'edit') {
      setNotice('Perubahan produk tersimpan.')
    } else {
      setQuery('')
      setNotice('Produk berhasil ditambahkan.')
    }
  }

  const term = query.trim().toLowerCase()
  const visible = products.filter((product) => product.name.toLowerCase().includes(term))

  return (
    <>
      <header className="masthead">
        <div className="wrap">
          <div className="utility"><span>Pusat Penjual</span><span>Tugas 3 · Pemrograman Web</span></div>
          <div className="header-main">
            <div className="brand"><ShoppingBag aria-hidden="true" size={30} />Etalase<span>.</span></div>
            <div className="search">
              <input type="search" aria-label="Cari produk" placeholder="Cari nama produk..." value={query}
                onChange={(event) => setQuery(event.target.value)} />
              <span aria-hidden="true"><Search size={19} /></span>
            </div>
            <span className="header-section"><LayoutGrid aria-hidden="true" size={16} /> Katalog</span>
          </div>
        </div>
      </header>

      <main className="wrap">
        <section className="intro" aria-labelledby="page-title">
          <div>
            <p className="breadcrumb">Pusat Penjual <span aria-hidden="true">/</span> Katalog</p>
            <h1 id="page-title">Manajemen Produk</h1>
            <p>Kelola daftar produk dan harga dalam satu tempat.</p>
          </div>
          <div className="intro-art" aria-hidden="true"><PackageOpen size={94} strokeWidth={1.15} /></div>
        </section>

        <section className="catalog" aria-labelledby="catalog-title">
          <div className="catalog-header">
            <div>
              <h2 id="catalog-title">Daftar Produk</h2>
              <p aria-live="polite">{error ? 'Katalog produk' : `${products.length} produk di katalog`}</p>
            </div>
            <button ref={addButton} className="button add" disabled={Boolean(error)}
              onClick={() => openEditor('add')}><Plus size={17} aria-hidden="true" /> Tambah Produk</button>
          </div>

          <p className={notice ? 'notice' : undefined} role="status">{notice}</p>
          {error ? <p className="empty" role="alert">{error}</p> : visible.length ? (
            <ul className="product-grid">
              {visible.map((product) => <ProductCard key={product.id} product={product}
                onEdit={() => openEditor('edit', product)} onDelete={() => openEditor('delete', product)} />)}
            </ul>
          ) : <p className="empty" role="status">{term ? 'Produk yang kamu cari tidak ditemukan.' : 'Belum ada produk di katalog.'}</p>}

          {!error && <p className="results" aria-live="polite">
            Menampilkan {visible.length} dari {products.length} produk
          </p>}
        </section>
      </main>

      {editor && <ProductDialog editor={editor} onSave={saveProduct} onClose={() => {
        if (document.activeElement === document.body) {
          addButton.current.focus()
        }
        setEditor(null)
      }} />}
    </>
  )
}

createRoot(document.getElementById('root')).render(<App />)
