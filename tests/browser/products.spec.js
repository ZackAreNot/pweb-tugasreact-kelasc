import { expect, test } from '@playwright/test'

test('routes and CRUD persist through the Express API', async ({
  page,
  request,
}) => {
  const name = 'Produk uji ' + Date.now()
  let createdId
  const consoleErrors = []
  page.on('pageerror', (error) => consoleErrors.push(error.message))
  try {
    await page.goto('/')
    await expect(page).toHaveURL(/\/dashboard$/)
    await expect(
      page.getByRole('heading', { name: 'Dashboard', exact: true })
    ).toBeVisible()
    await expect(page.getByText('Total produk', { exact: true })).toBeVisible()
    await expect(page.getByRole('status')).toHaveCount(0)
    await page.screenshot({
      path: 'docs/tugas-4/dashboard.png',
      fullPage: true,
    })
    await page.evaluate(() => {
      window.navigationMarker = 'preserved'
    })
    await page.getByRole('link', { name: 'Daftar produk', exact: true }).click()
    await expect(
      page.getByRole('button', { name: 'Tambah Produk' })
    ).toBeEnabled()
    expect(await page.evaluate(() => window.navigationMarker)).toBe('preserved')
    await page.screenshot({ path: 'docs/tugas-4/products.png', fullPage: true })
    await page.getByRole('button', { name: 'Tambah Produk' }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByLabel('Nama Produk')).toBeFocused()
    await dialog.getByLabel('Nama Produk').fill('   ')
    await dialog.getByLabel('Harga (Rp)').fill('4000')
    await dialog.getByRole('button', { name: 'Simpan Produk' }).click()
    await expect(dialog.getByRole('alert')).toBeVisible()
    await dialog.getByLabel('Nama Produk').fill(name)
    await dialog.getByLabel('Harga (Rp)').fill('0')
    await dialog.getByRole('button', { name: 'Simpan Produk' }).click()
    expect(
      await dialog
        .getByLabel('Harga (Rp)')
        .evaluate((input) => input.validity.rangeUnderflow)
    ).toBe(true)
    await dialog.getByLabel('Harga (Rp)').fill('4000')
    await page.screenshot({ path: 'docs/tugas-4/add-dialog.png' })
    const created = page.waitForResponse(
      (response) =>
        response.url().endsWith('/api/products') &&
        response.request().method() === 'POST'
    )
    await dialog.getByRole('button', { name: 'Simpan Produk' }).click()
    const response = await created
    expect(response.status()).toBe(201)
    createdId = (await response.json()).data.id
    await expect(page).toHaveURL(new RegExp('/products/' + createdId + '$'))
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible()
    await page.reload()
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible()
    await page.screenshot({ path: 'docs/tugas-4/detail.png', fullPage: true })
    await page.getByRole('link', { name: 'Kembali ke daftar produk' }).click()
    const search = page.getByRole('searchbox', { name: 'Cari produk' })
    await search.fill('  ' + name.toUpperCase() + '  ')
    const card = page.getByRole('listitem').filter({ hasText: name })
    await expect(card).toHaveCount(1)
    await card.getByRole('button', { name: 'Edit ' + name }).click()
    await expect(dialog.getByLabel('Harga (Rp)')).toHaveValue('4000')
    await dialog.getByLabel('Nama Produk').fill(name + ' revisi')
    await dialog.getByLabel('Harga (Rp)').fill('4500')
    await dialog.getByRole('button', { name: 'Simpan Perubahan' }).click()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(card).toContainText('4.500')
    await page.reload()
    await expect(card).toContainText('4.500')
    const saved = await request.get('/api/products/' + createdId)
    expect((await saved.json()).data).toMatchObject({
      name: name + ' revisi',
      price: 4500,
    })
    await card.getByRole('link', { name: 'Detail ' + name + ' revisi' }).click()
    await expect(
      page.getByRole('heading', { name: name + ' revisi', exact: true })
    ).toBeVisible()
    await page.goBack()
    await expect(card).toBeVisible()
    await card
      .getByRole('button', { name: 'Hapus ' + name + ' revisi' })
      .click()
    await expect(dialog.getByRole('button', { name: 'Batal' })).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(card).toBeVisible()
    await card
      .getByRole('button', { name: 'Hapus ' + name + ' revisi' })
      .click()
    await dialog
      .getByRole('button', { name: 'Hapus Produk', exact: true })
      .click()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(card).toHaveCount(0)
    expect((await request.get('/api/products/' + createdId)).status()).toBe(404)
    await page.goto('/products/' + createdId)
    await expect(
      page.getByRole('heading', { name: 'Produk tidak ditemukan' })
    ).toBeVisible()
    await page.screenshot({
      path: 'docs/tugas-4/missing-product.png',
      fullPage: true,
    })
    await page.goto('/alamat-tidak-ada')
    await expect(
      page.getByRole('heading', { name: 'Halaman tidak ditemukan' })
    ).toBeVisible()
    await page.screenshot({ path: 'docs/tugas-4/404.png', fullPage: true })
    await page.getByRole('link', { name: 'Kembali ke daftar produk' }).click()
    await expect(
      page.getByRole('button', { name: 'Tambah Produk' })
    ).toBeEnabled()
    await page.setViewportSize({ width: 390, height: 844 })
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth)
    ).toBe(390)
    await page.screenshot({ path: 'docs/tugas-4/mobile.png', fullPage: true })
    expect(consoleErrors).toEqual([])
  } finally {
    if (createdId) await request.delete('/api/products/' + createdId)
  }
})

test('API failures show retry and keep unsaved forms open', async ({
  page,
}) => {
  await page.route(
    '**/api/products',
    (route) =>
      route.fulfill({
        status: 503,
        json: { status: false, message: 'Server sementara tidak tersedia.' },
      }),
    { times: 1 }
  )
  await page.goto('/products')
  await expect(page.getByRole('alert')).toContainText(
    'Server sementara tidak tersedia'
  )
  await page.getByRole('button', { name: 'Coba lagi' }).click()
  await expect(
    page.getByRole('button', { name: 'Tambah Produk' })
  ).toBeEnabled()
  await page.route('**/api/products', (route) =>
    route.request().method() === 'POST'
      ? route.fulfill({
          status: 503,
          json: { status: false, message: 'Gagal menyimpan. Coba lagi.' },
        })
      : route.continue()
  )
  await page.getByRole('button', { name: 'Tambah Produk' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('Nama Produk').fill('Produk gagal')
  await dialog.getByLabel('Harga (Rp)').fill('5000')
  await dialog.getByRole('button', { name: 'Simpan Produk' }).click()
  await expect(dialog.getByRole('alert')).toContainText('Gagal menyimpan')
  await expect(dialog.getByLabel('Nama Produk')).toHaveValue('Produk gagal')
  await expect(
    dialog.getByRole('button', { name: 'Simpan Produk' })
  ).toBeEnabled()
})
