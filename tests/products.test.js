import assert from 'node:assert/strict'
import test from 'node:test'
import { requestProduct, saveProduct } from '../src/data/product/api.js'

test('API requests unwrap the Express response and send CRUD to the correct endpoint', async () => {
  const calls = []
  const original = globalThis.fetch
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options })
    return Response.json({
      status: true,
      data: { id: 8, name: 'Pensil', price: 4000 },
    })
  }
  try {
    assert.equal((await requestProduct('/8')).id, 8)
    await saveProduct('add', undefined, { name: 'Pensil', price: 4000 })
    await saveProduct('edit', 8, { name: 'Pensil', price: 5000 })
    await saveProduct('delete', 8)
    assert.deepEqual(
      calls.map(({ url, options }) => [url, options?.method]),
      [
        ['/api/products/8', undefined],
        ['/api/products', 'POST'],
        ['/api/products/8', 'PUT'],
        ['/api/products/8', 'DELETE'],
      ]
    )
    assert.equal(JSON.parse(calls[2].options.body).price, 5000)
    assert.equal(calls[3].options.body, undefined)
  } finally {
    globalThis.fetch = original
  }
})

test('API preserves 404 errors and rejects invalid server responses', async () => {
  const original = globalThis.fetch
  try {
    globalThis.fetch = async () =>
      Response.json(
        { status: false, message: 'Produk tidak ditemukan' },
        { status: 404 }
      )
    await assert.rejects(requestProduct('/99'), {
      status: 404,
      message: 'Produk tidak ditemukan',
    })
    globalThis.fetch = async () =>
      new Response('<html>Oops</html>', { status: 502 })
    await assert.rejects(requestProduct(), /Permintaan produk gagal/)
    globalThis.fetch = async () => {
      throw new TypeError('Failed to fetch')
    }
    await assert.rejects(requestProduct(), /Server tidak dapat dihubungi/)
  } finally {
    globalThis.fetch = original
  }
})
