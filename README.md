# Etalase · Manajemen Produk

Aplikasi React untuk Tugas 3 Pemrograman Web. Pengguna bisa mencari, menambah, mengedit, dan menghapus produk. Katalog menampilkan lima produk contoh saat pertama kali dibuka.

## Menjalankan aplikasi

Butuh Node.js 22. Jalankan perintah berikut dari folder utama repo.

```sh
npm ci
npm run dev
```

Buka http://localhost:5173. Perubahan produk disimpan di `localStorage` pada browser dan alamat aplikasi yang sama. Menghapus data situs akan mengembalikan katalog ke data contoh.

## Pengujian

```sh
npm test
npm run build
```

Lihat [hasil pengujian dan screenshot](docs/bukti-pengujian.md).
