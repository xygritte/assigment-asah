import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <main className="state-page">
      <p className="eyebrow">404 / HALAMAN TIDAK DITEMUKAN</p>
      <h1>Sepertinya kamu tersesat.</h1>
      <p>Halaman yang dicari tidak tersedia atau alamatnya sudah berubah.</p>
      <Link className="primary-button" to="/">Kembali ke beranda</Link>
    </main>
  );
}

export default NotFoundPage;
