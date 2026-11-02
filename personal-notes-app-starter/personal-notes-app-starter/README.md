# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

---

## CatatanKita — Personal Notes App (Submission React)

This section documents the implemented application. The original starter-project instructions above are intentionally retained.

### Implemented features

- Active notes at route `/`.
- Note details at `/notes/:id`, using the ID path parameter.
- Create notes at `/notes/new`.
- Delete notes from the detail page.
- Archive and unarchive notes, with the archive list at `/archives`.
- Search by title, synchronized with the URL query parameter `?search=`.
- A 404 page for unknown routes.
- Responsive layout for desktop and mobile.
- Reuses the provided functions in `src/utils/local-data.js`.

### Run the application

From `personal-notes-app-starter/personal-notes-app-starter`, run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite in the terminal.

### Build verification

```bash
npm run build
npm run preview
```

Review all routes and interactions before submitting. Note data is intentionally held in memory as required by the starter instructions and returns to its initial state after a browser refresh.

### Project structure

- `src/App.jsx` — React routes and page components.
- `src/index.jsx` — React entry point and `BrowserRouter`.
- `src/styles/style.css` — responsive application styling.
- `src/utils/local-data.js` — provided initial data and note-management functions.
- `src/utils/index.js` — date-formatting helper.


---

## Submission 2 — SPA + API, Context, dan Hooks (2026)

Bagian instruksi starter dan dokumentasi submission sebelumnya di atas tetap dipertahankan sebagai riwayat proyek. **Implementasi terbaru menggunakan Notes API v1**, bukan lagi data di memori dari local-data.js. File local-data.js sengaja tidak dihapus agar kode dan instruksi starter sebelumnya tetap utuh.

### Fitur baru

- Registrasi, login, dan logout menggunakan RESTful API Dicoding: https://notes-api.dicoding.dev/v1
- Access token disimpan di localStorage; profil pengguna diperoleh dari endpoint users/me.
- Proteksi daftar, detail, tambah, hapus, arsip dan batal arsip catatan.
- Catatan setiap akun diambil dari server, sehingga tetap ada setelah refresh atau login ulang.
- Tema terang/gelap menggunakan React Context dan localStorage.
- Bahasa Indonesia/Inggris menggunakan React Context dan localStorage.
- Loading indicator dan pesan kesalahan ketika berkomunikasi dengan API.
- Custom hook useInput pada login, registrasi, dan halaman tambah catatan.
- Pencarian judul via URL, 404, arsip, dan tampilan responsif dari submission pertama tetap tersedia.

### Cara menjalankan

Dari folder ini, jalankan:

```bash
npm ci
npm run dev
```

Untuk pengecekan produksi: `npm run build`.

Gunakan email dan password milik akun yang baru diregistrasikan. Perlu koneksi internet karena catatan disimpan di server Dicoding.

### Pengumpulan

ZIP hanya folder proyek ini, termasuk package.json, package-lock.json, index.html dan src. **Jangan sertakan node_modules atau dist.** Source code React/JSX tetap harus disertakan; jangan hanya mengunggah hasil build.
