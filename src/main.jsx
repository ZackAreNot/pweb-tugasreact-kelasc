import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BookOpen, Box, Eraser, LayoutGrid, PackageOpen, PenLine, PenTool, Ruler, Search, ShoppingBag,
} from 'lucide-react'
import { exampleProducts, formatPrice } from './products'
import './style.css'

const productArt = {
  pulpen: [PenLine, 'peach'],
  'buku tulis': [BookOpen, 'green'],
  spidol: [PenTool, 'lilac'],
  penggaris: [Ruler, 'sand'],
  penghapus: [Eraser, 'rose'],
}

function ProductCard({ product }) {
  const [Illustration, tone] = productArt[product.name.toLowerCase()] ?? [Box, 'peach']

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
    </li>
  )
}

function App() {
  const products = exampleProducts
  const [query, setQuery] = useState('')

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
              <p aria-live="polite">{`${products.length} produk di katalog`}</p>
            </div>
          </div>

          {visible.length ? (
            <ul className="product-grid">
              {visible.map((product) => <ProductCard key={product.id} product={product} />)}
            </ul>
          ) : <p className="empty" role="status">{term ? 'Produk yang kamu cari tidak ditemukan.' : 'Belum ada produk di katalog.'}</p>}

          <p className="results" aria-live="polite">
            Menampilkan {visible.length} dari {products.length} produk
          </p>
        </section>
      </main>
    </>
  )
}

createRoot(document.getElementById('root')).render(<App />)
