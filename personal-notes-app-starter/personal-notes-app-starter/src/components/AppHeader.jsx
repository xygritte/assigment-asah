import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function AppHeader() {
  return (
    <header className="app-header">
      <Link className="brand" to="/" aria-label="CatatanKita, beranda">
        <span className="brand-mark" aria-hidden="true">N</span>
        <span>Catatan<span className="brand-accent">Kita</span></span>
      </Link>
      <nav className="navigation" aria-label="Navigasi utama">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Catatan
        </NavLink>
        <NavLink to="/archives" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Arsip
        </NavLink>
      </nav>
      <div className="header-caption">RUANG UNTUK IDEMU</div>
    </header>
  );
}

export default AppHeader;
