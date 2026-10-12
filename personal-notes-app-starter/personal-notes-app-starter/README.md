# CatatanKita — Personal Notes App

A React Single Page Application (SPA) for the Dicoding React submission.

## Fitur

- Daftar catatan aktif pada route `/`.
- Detail catatan berdasarkan path parameter pada route `/notes/:id`.
- Tambah catatan pada route `/notes/new`.
- Hapus catatan dari halaman detail.
- Arsip dan batal arsip, dengan daftar arsip pada route `/archives`.
- Pencarian berdasarkan judul dengan query parameter `?search=`.
- Halaman 404 untuk route yang tidak dikenali.
- Responsive layout untuk desktop dan mobile.
- Menggunakan fungsi pengelolaan data starter dari `src/utils/local-data.js`.

## Menjalankan aplikasi

Pastikan Node.js dan npm sudah terpasang. Dari folder proyek:

```bash
npm install
npm run dev
```

Buka URL lokal yang ditampilkan oleh Vite di terminal.

## Validasi build

```bash
npm run build
npm run preview
```

Periksa seluruh route dan fungsi sebelum mengumpulkan submission. Data catatan disimpan dalam memori sesuai instruksi starter project dan akan kembali ke data awal setelah halaman dimuat ulang.

## Struktur proyek

- `src/App.jsx` — route dan komponen halaman React.
- `src/index.jsx` — entry point React serta BrowserRouter.
- `src/styles/style.css` — styling responsif.
- `src/utils/local-data.js` — data awal serta fungsi catatan dari starter project.
- `src/utils/index.js` — helper format tanggal.
