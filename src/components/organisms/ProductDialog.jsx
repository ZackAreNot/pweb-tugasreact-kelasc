import { useEffect, useRef, useState } from 'react'
import { Trash2, X } from 'lucide-react'
import Button from '../atoms/Button'
import { formatPrice } from '../../data/product/api'

export default function ProductDialog({ editor, onClose, onSave }) {
  const dialog = useRef(null)
  const initialFocus = useRef(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const { product, action } = editor
  const deleting = action === 'delete'
  const editing = action === 'edit'
  const title = deleting
    ? 'Hapus Produk?'
    : editing
      ? 'Edit Produk'
      : 'Tambah Produk'
  const submitLabel = deleting
    ? 'Hapus Produk'
    : editing
      ? 'Simpan Perubahan'
      : 'Simpan Produk'

  useEffect(() => {
    dialog.current.showModal()
    initialFocus.current.focus()
  }, [])

  async function submit(event) {
    event.preventDefault()
    if (busy) return
    const fields = new FormData(event.currentTarget)
    const name = fields.get('name')?.trim()
    const price = Number(fields.get('price'))

    if (
      !deleting &&
      (!name || !Number.isInteger(price) || price < 1 || price > 2147483647)
    ) {
      setError(
        'Isi nama dan harga berupa bilangan bulat antara Rp1 dan Rp2.147.483.647.'
      )
      return
    }
    setBusy(true)
    setError('')
    try {
      await onSave(action, product?.id, { name, price })
      dialog.current.close()
    } catch (error) {
      setError(error.message)
      setBusy(false)
    }
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      onClose={onClose}
      onCancel={(event) => {
        if (busy) event.preventDefault()
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-2xl border border-stone-200 bg-white p-6 text-stone-900 shadow-xl"
    >
      <form onSubmit={submit} onChange={() => setError('')}>
        <fieldset disabled={busy} className="min-w-0">
          <button
            type="button"
            className="absolute top-3 right-3 rounded p-2 text-stone-600 hover:bg-stone-100"
            aria-label="Tutup"
            onClick={() => dialog.current.close()}
          >
            <X size={20} />
          </button>

          {deleting && (
            <div
              className="mb-4 inline-flex rounded-lg bg-red-50 p-3 text-red-700"
              aria-hidden="true"
            >
              <Trash2 size={21} />
            </div>
          )}
          <h2 id="dialog-title" className="pr-8 text-2xl font-bold">
            {title}
          </h2>
          <p
            id="dialog-description"
            className="mt-2 text-sm leading-6 text-stone-600"
          >
            {deleting
              ? 'Produk yang dihapus tidak dapat dikembalikan.'
              : editing
                ? 'Perbarui informasi produk yang dipilih.'
                : 'Masukkan nama dan harga produk baru.'}
          </p>

          {deleting ? (
            <div className="mt-5 rounded-lg bg-stone-50 p-4 font-semibold wrap-anywhere">
              <p>{product.name}</p>
              <p className="mt-2 text-xl text-brand-600">
                {formatPrice(product.price)}
              </p>
            </div>
          ) : (
            <fieldset className="mt-5 grid min-w-0 gap-2">
              <label
                className="mt-2 text-sm font-semibold"
                htmlFor="product-name"
              >
                Nama Produk
              </label>
              <input
                id="product-name"
                name="name"
                required
                ref={initialFocus}
                placeholder="Contoh: Pulpen"
                defaultValue={product?.name}
              />
              <label
                className="mt-2 text-sm font-semibold"
                htmlFor="product-price"
              >
                Harga (Rp)
              </label>
              <input
                id="product-price"
                name="price"
                type="number"
                min="1"
                max="2147483647"
                step="1"
                required
                placeholder="Contoh: 5000"
                defaultValue={product?.price}
                aria-describedby="price-hint"
              />
              <small id="price-hint" className="text-xs text-stone-600">
                Masukkan harga dalam rupiah, minimal Rp1.
              </small>
            </fieldset>
          )}

          {error && (
            <p className="mt-4 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}
          <div className="mt-6 flex justify-end gap-2">
            <Button
              variant="secondary"
              ref={deleting ? initialFocus : undefined}
              onClick={() => dialog.current.close()}
            >
              Batal
            </Button>
            <Button type="submit" variant={deleting ? 'danger' : 'primary'}>
              {busy ? 'Memproses…' : submitLabel}
            </Button>
          </div>
        </fieldset>
      </form>
    </dialog>
  )
}
