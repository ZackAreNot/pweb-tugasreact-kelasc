import assert from 'node:assert/strict'
import test from 'node:test'
import { changeProducts, exampleProducts, readProducts, saveProducts } from './products.js'

function testStorage(value = null) {
  return {
    getItem: () => value,
    setItem: (_key, next) => { value = next },
  }
}

test('shows sample products on first use and keeps an intentionally empty catalog', () => {
  const storage = testStorage()
  assert.deepEqual(readProducts(storage), exampleProducts)
  saveProducts(storage, [])
  assert.deepEqual(readProducts(storage), [])
})

test('adds, edits and deletes a product across storage reads', () => {
  const storage = testStorage()
  const added = changeProducts(readProducts(storage), 'add', undefined, { name: 'Pensil', price: 4000 })
  saveProducts(storage, added)
  const { id } = added.at(-1)

  saveProducts(storage, changeProducts(readProducts(storage), 'edit', id, { name: 'Pensil 2B', price: 4500 }))
  assert.deepEqual(readProducts(storage).at(-1), { id, name: 'Pensil 2B', price: 4500 })

  saveProducts(storage, changeProducts(readProducts(storage), 'delete', id))
  assert.deepEqual(readProducts(storage), exampleProducts)
})

test('rejects invalid catalog data and invalid product details', () => {
  assert.throws(() => readProducts(testStorage('[{"id":1,"name":"Pensil","price":0}]')), /Format katalog/)
  assert.throws(() => changeProducts([], 'add', undefined, { name: 'Pensil', price: 1.5 }), /bilangan bulat positif/)
  assert.throws(() => changeProducts([], 'delete', 1), /sudah tidak tersedia/)
})
