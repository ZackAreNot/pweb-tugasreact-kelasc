export const formatPrice = (price) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price)

export async function requestProduct(path = '', options) {
  const response = await fetch(`/api/products${path}`, options).catch(
    (error) => {
      if (error.name === 'AbortError') throw error
      throw new Error(
        'Server tidak dapat dihubungi. Pastikan backend aktif, lalu coba lagi.'
      )
    }
  )
  const body = await response.json().catch(() => null)
  if (!response.ok || body?.status !== true) {
    const error = new Error(
      body?.message || 'Permintaan produk gagal. Silakan coba lagi.'
    )
    error.status = response.status
    throw error
  }
  return body.data
}

export function saveProduct(action, id, details) {
  return requestProduct(action === 'add' ? '' : `/${id}`, {
    method: action === 'delete' ? 'DELETE' : action === 'edit' ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: action === 'delete' ? undefined : JSON.stringify(details),
  })
}
