# Etalase · Tugas 4

Dashboard pengelolaan produk dengan React Router, Tailwind CSS, dan API Express dari tugas sebelumnya. Struktur komponen mengikuti atomic design pada [template perkuliahan](https://github.com/anasmcfudy/react-template). Identitas oranye Etalase dari Tugas 3 dipertahankan.

## Halaman dan fitur

- `/` mengarahkan ke `/dashboard` melalui index route.
- `/dashboard` menampilkan jumlah produk dan rentang harga dari API.
- `/products` menampilkan katalog, pencarian, serta dialog tambah, edit, dan hapus.
- `/products/:id` mengambil detail produk sesuai ID. Setelah produk dibuat, aplikasi membuka detailnya.
- URL lain menampilkan halaman 404. Produk yang tidak tersedia memiliki pesan tersendiri.
- Sidebar bersama menggunakan `NavLink` dan `Outlet`. Navigasi tidak memuat ulang seluruh dokumen.
- Semua operasi produk menggunakan API. Data tersimpan di PostgreSQL backend. Data lokal Tugas 3 tetap berada di browser, tetapi tidak digunakan sebagai sumber katalog Tugas 4.

## Menjalankan backend

Gunakan service [Tugas ExpressJS Database](https://github.com/ZackAreNot/Tugas_ExpressJS_Database) yang sudah dikerjakan sebelumnya. Butuh Node.js 22 dan Docker Compose. Dari folder backend tersebut, jalankan langkah berikut.

```sh
npm ci
cp .env.example .env
docker compose up -d
npx prisma generate
npx prisma migrate deploy
npm start
```

Lewati penyalinan `.env` jika konfigurasi lokal sudah tersedia. Endpoint `http://127.0.0.1:3000/health` memeriksa koneksi database. Database baru dapat dimulai dengan katalog kosong dan ditambah melalui antarmuka. Database yang sudah ada memakai produk tersimpannya.

API yang digunakan menerima `{ "name": "Pulpen", "price": 5000 }` untuk POST/PUT dan mengembalikan `{ "status": true, "message": "...", "data": ... }`.

| Metode | Endpoint | Operasi |
|---|---|---|
| GET | `/products` | Daftar produk |
| GET | `/products/:id` | Detail produk |
| POST | `/products` | Tambah produk |
| PUT | `/products/:id` | Edit produk |
| DELETE | `/products/:id` | Hapus produk |

## Menjalankan frontend

Dari folder repo ini, buka terminal lain.

```sh
npm ci
npm run dev
```

Buka alamat yang ditampilkan Vite, biasanya `http://localhost:5173`. Vite meneruskan `/api/products` ke backend `/products` melalui proxy. Untuk port atau host backend lain, salin `.env.example` ke `.env.local`, ubah `API_TARGET`, lalu restart Vite.

```sh
npm test
npm run build
npm run preview
```

Proxy juga tersedia pada `npm run preview`. Hosting produksi memerlukan fallback SPA ke `index.html` untuk deep link dan penerusan `/api` ke backend. Variabel `API_TARGET` mengatur proxy Vite pada pengembangan dan preview.

## Struktur

```text
app/routes.jsx                 # Nested routes dan index route
src/main.jsx                   # BrowserRouter dan entry React
src/components/atoms/          # Button
src/components/molecules/      # ProductCard, ProductArt, RequestState
src/components/organisms/      # ProductGrid dan ProductDialog
src/components/templates/      # PageLayout bersama dengan Outlet
src/components/pages/          # Dashboard, katalog, detail, dan 404
src/data/product/              # Permintaan API dan hook pembacaan produk
src/style.css                  # Tailwind v4, warna tema, dan gaya dasar
```

## Bukti pengujian

Dua unit test memeriksa kontrak API, pemetaan respons, dan penanganan kesalahan. Dua tes browser memeriksa routing, CRUD hingga API PostgreSQL, persistensi setelah muat ulang, 404, validasi formulir, kegagalan API, dan layar mobile. Tes browser membutuhkan backend aktif dan Google Chrome di `/usr/bin/google-chrome`.

```sh
npm run test:e2e
```

Tes membuat produk uji sendiri dan membersihkannya setelah selesai. [Screenshot dan hasil pengujian Tugas 4](docs/tugas-4/bukti-pengujian.md) tersedia di repo. Bukti Tugas 3 tetap tersimpan di `docs/` untuk riwayat tugas sebelumnya.
