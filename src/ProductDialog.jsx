import { useEffect, useRef, useState } from 'react'
import { Trash2, X } from 'lucide-react'
import { formatPrice } from './products'

export default function ProductDialog({ editor, onClose, onSave }) {
  const dialog = useRef(null)
  const initialFocus = useRef(null)
  const [error, setError] = useState('')
  const { product, action } = editor
  const deleting = action === 'delete'
  const editing = action === 'edit'
  const title = deleting ? 'Hapus Produk?' : editing ? 'Edit Produk' : 'Tambah Produk'
  const submitLabel = deleting ? 'Hapus Produk' : editing ? 'Simpan Perubahan' : 'Simpan Produk'

  useEffect(() => {
    dialog.current.showModal()
    initialFocus.current.focus()
  }, [])

  function submit(event) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const name = fields.get('name')?.trim()
    const price = Number(fields.get('price'))

    try {
      onSave(action, product?.id, { name, price })
      dialog.current.close()
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <dialog ref={dialog} aria-labelledby="dialog-title" aria-describedby="dialog-description"
      onClose={onClose}>
      <form onSubmit={submit}>
        <button type="button" className="dialog-close" aria-label="Tutup"
          onClick={() => dialog.current.close()}><X size={20} /></button>

        {deleting && <div className="delete-icon" aria-hidden="true"><Trash2 size={21} /></div>}
        <h2 id="dialog-title">{title}</h2>
        <p id="dialog-description">{deleting ? 'Produk yang dihapus tidak dapat dikembalikan.'
          : editing ? 'Perbarui informasi produk yang dipilih.' : 'Masukkan nama dan harga produk baru.'}</p>

        {deleting ? <div className="delete-summary">
          <p>{product.name}</p>
          <p className="price">{formatPrice(product.price)}</p>
        </div> : (
          <fieldset>
            <label htmlFor="product-name">Nama Produk</label>
            <input id="product-name" name="name" required ref={initialFocus} placeholder="Contoh: Pulpen" defaultValue={product?.name} />
            <label htmlFor="product-price">Harga (Rp)</label>
            <input id="product-price" name="price" type="number" min="1" max={Number.MAX_SAFE_INTEGER} step="1"
              required placeholder="Contoh: 5000" defaultValue={product?.price} aria-describedby="price-hint" />
            <small id="price-hint">Masukkan harga dalam rupiah, minimal Rp1.</small>
          </fieldset>
        )}

        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="dialog-actions">
          <button type="button" className="button secondary" ref={deleting ? initialFocus : undefined}
            onClick={() => dialog.current.close()}>Batal</button>
          <button type="submit" className={'button' + (deleting ? ' danger' : '')}>
            {submitLabel}
          </button>
        </div>
      </form>
    </dialog>
  )
}
