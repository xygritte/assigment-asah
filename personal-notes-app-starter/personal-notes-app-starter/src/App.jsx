import React, { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { addNote, archiveNote, deleteNote, getActiveNotes, getArchivedNotes, getNote, unarchiveNote } from './utils/local-data';
import { showFormattedDate } from './utils';

const getVisibleNotes = (notes, keyword) => {
  const normalizedKeyword = keyword.trim().toLowerCase();
  if (!normalizedKeyword) return notes;
  return notes.filter((note) => note.title.toLowerCase().includes(normalizedKeyword));
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [notesVersion, setNotesVersion] = useState(0);
  const [searchInput, setSearchInput] = useState(new URLSearchParams(location.search).get('search') || '');

  useEffect(() => {
    setSearchInput(new URLSearchParams(location.search).get('search') || '');
  }, [location.search]);

  const refreshNotes = () => setNotesVersion((version) => version + 1);

  const updateSearch = (value) => {
    setSearchInput(value);
    const params = new URLSearchParams(location.search);
    if (value.trim()) params.set('search', value);
    else params.delete('search');
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
  };

  const handleAddNote = ({ title, body }) => {
    addNote({ title: title.trim(), body });
    refreshNotes();
    navigate('/');
  };

  const handleDeleteNote = (id) => {
    deleteNote(id);
    refreshNotes();
    navigate('/');
  };

  const handleToggleArchive = (note) => {
    if (note.archived) unarchiveNote(note.id);
    else archiveNote(note.id);
    refreshNotes();
  };

  return (
    <div className="app-container" data-theme="dark">
      <header className="app-header">
        <Link className="brand" to="/" aria-label="Catatan Kita, beranda">
          <span className="brand-mark" aria-hidden="true">N</span>
          <span>Catatan<span className="brand-accent">Kita</span></span>
        </Link>
        <nav className="navigation" aria-label="Navigasi utama">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Catatan</NavLink>
          <NavLink to="/archives" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Arsip</NavLink>
        </nav>
        <div className="header-caption">RUANG UNTUK IDEMU</div>
      </header>
      <Routes>
        <Route path="/" element={<HomePage key={notesVersion} notes={getActiveNotes()} searchInput={searchInput} onSearchChange={updateSearch} />} />
        <Route path="/archives" element={<ArchivePage key={'archives-' + notesVersion} notes={getArchivedNotes()} searchInput={searchInput} onSearchChange={updateSearch} />} />
        <Route path="/notes/new" element={<NewNotePage onAddNote={handleAddNote} />} />
        <Route path="/notes/:id" element={<NoteDetailPage key={location.pathname + notesVersion} onDelete={handleDeleteNote} onToggleArchive={handleToggleArchive} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <footer className="app-footer">Dibuat untuk menyimpan hal-hal yang berarti <span aria-hidden="true">✳</span></footer>
    </div>
  );
}

function HomePage({ notes, searchInput, onSearchChange }) {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get('search') || '';
  const filteredNotes = useMemo(() => getVisibleNotes(notes, keyword), [notes, keyword]);
  return (
    <main>
      <section className="page-intro">
        <p className="eyebrow">PERSONAL WORKSPACE / 01</p>
        <h1>Semua catatan,<br /><span>dalam satu tempat.</span></h1>
        <p className="intro-copy">Tangkap ide, simpan rencana, dan kembali kapan saja saat kamu membutuhkannya.</p>
      </section>
      <section className="notes-section" aria-labelledby="notes-heading">
        <div className="section-heading">
          <div><p className="eyebrow">KOLEKSI PRIBADI</p><h2 id="notes-heading">Catatan aktif <span className="count-pill">{filteredNotes.length}</span></h2></div>
          <Link className="primary-button" to="/notes/new"><span aria-hidden="true">＋</span> Catatan baru</Link>
        </div>
        <SearchBar value={searchInput} onChange={onSearchChange} />
        {filteredNotes.length > 0 ? <NotesList notes={filteredNotes} /> : <EmptyState title={keyword ? 'Catatan tidak ditemukan' : 'Tidak ada catatan'} description={keyword ? 'Coba kata kunci lain atau hapus pencarian.' : 'Mulai dengan membuat catatan pertamamu.'} />}
      </section>
    </main>
  );
}

function ArchivePage({ notes, searchInput, onSearchChange }) {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get('search') || '';
  const filteredNotes = useMemo(() => getVisibleNotes(notes, keyword), [notes, keyword]);
  return (
    <main>
      <section className="page-intro compact-intro">
        <p className="eyebrow">PERSONAL WORKSPACE / 02</p>
        <h1>Yang tersimpan,<br /><span>tetap mudah ditemukan.</span></h1>
        <p className="intro-copy">Catatan yang tidak sedang kamu gunakan, tersimpan rapi di sini.</p>
      </section>
      <section className="notes-section" aria-labelledby="archives-heading">
        <div className="section-heading"><div><p className="eyebrow">ARSIP PRIBADI</p><h2 id="archives-heading">Catatan diarsipkan <span className="count-pill">{filteredNotes.length}</span></h2></div></div>
        <SearchBar value={searchInput} onChange={onSearchChange} />
        {filteredNotes.length > 0 ? <NotesList notes={filteredNotes} /> : <EmptyState title={keyword ? 'Catatan tidak ditemukan' : 'Arsip kosong'} description={keyword ? 'Coba kata kunci lain atau hapus pencarian.' : 'Catatan yang kamu arsipkan akan muncul di sini.'} />}
      </section>
    </main>
  );
}

function SearchBar({ value, onChange }) {
  return (
    <form className="search-bar" role="search" onSubmit={(event) => event.preventDefault()}>
      <span className="search-icon" aria-hidden="true">⌕</span>
      <input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Cari berdasarkan judul catatan..." aria-label="Cari catatan berdasarkan judul" />
      {value && <button className="clear-search" type="button" onClick={() => onChange('')} aria-label="Hapus pencarian">×</button>}
      <span className="search-hint">SEARCH</span>
    </form>
  );
}

function NotesList({ notes }) {
  return <div className="notes-list">{notes.map((note, index) => <NoteItem key={note.id} note={note} index={index} />)}</div>;
}

function NoteItem({ note, index }) {
  const preview = note.body.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return (
    <article className="note-item">
      <Link className="note-item__link" to={`/notes/${note.id}`} aria-label={`Buka catatan ${note.title}`}>
        <div className="note-card-meta"><span className="note-index">{String(index + 1).padStart(2, '0')}</span><span>{note.archived ? 'DIARSIPKAN' : 'CATATAN'}</span></div>
        <h3 className="note-item__title">{note.title || '(Tanpa judul)'}</h3>
        <p className="note-item__createdAt">{showFormattedDate(note.createdAt)}</p>
        <p className="note-item__body">{preview || 'Catatan ini belum memiliki isi.'}</p>
        <span className="note-card-arrow" aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}

function NoteDetailPage({ onDelete, onToggleArchive }) {
  const { id } = useParams();
  const note = getNote(id);
  if (!note) return <main className="state-page"><p className="eyebrow">404 / CATATAN TIDAK DITEMUKAN</p><h1>Catatan ini tidak ada.</h1><p>Mungkin sudah dihapus atau alamat yang kamu buka salah.</p><Link className="primary-button" to="/">Kembali ke catatan</Link></main>;
  return (
    <main className="detail-layout">
      <Link to={note.archived ? '/archives' : '/'} className="back-link">← Kembali ke daftar</Link>
      <article className="detail-page">
        <div className="detail-label"><span className="status-dot" />{note.archived ? 'CATATAN DIARSIPKAN' : 'CATATAN AKTIF'}</div>
        <h1 className="detail-page__title">{note.title || '(Tanpa judul)'}</h1>
        <p className="detail-page__createdAt">Dibuat pada {showFormattedDate(note.createdAt)}</p>
        <div className="detail-divider" />
        <div className="detail-page__body">{note.body || 'Catatan ini belum memiliki isi.'}</div>
      </article>
      <div className="detail-page__action">
        <button className="action action-secondary" type="button" onClick={() => onToggleArchive(note)} aria-label={note.archived ? 'Batalkan arsip catatan' : 'Arsipkan catatan'} title={note.archived ? 'Batalkan arsip' : 'Arsipkan'}>{note.archived ? '↶' : '⌑'}</button>
        <button className="action action-danger" type="button" onClick={() => { if (window.confirm('Hapus catatan ini? Tindakan ini tidak dapat dibatalkan.')) onDelete(note.id); }} aria-label="Hapus catatan" title="Hapus catatan">⌫</button>
      </div>
    </main>
  );
}

function NewNotePage({ onAddNote }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const navigate = useNavigate();
  const submitNote = (event) => {
    event.preventDefault();
    if (!title.trim() || !body.trim()) return;
    onAddNote({ title, body });
  };
  return (
    <main className="new-note-layout">
      <Link to="/" className="back-link">← Kembali ke catatan</Link>
      <form onSubmit={submitNote} className="new-note-form">
        <p className="eyebrow">PERSONAL WORKSPACE / BARU</p>
        <label className="field-label" htmlFor="note-title">JUDUL CATATAN</label>
        <input id="note-title" className="add-new-page__input__title" type="text" placeholder="Beri judul catatan..." value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} required autoFocus />
        <div className="field-divider" />
        <label className="field-label" htmlFor="note-body">ISI CATATAN</label>
        <textarea id="note-body" className="add-new-page__input__body" placeholder="Mulai tulis ide, rencana, atau hal yang ingin kamu ingat..." value={body} onChange={(event) => setBody(event.target.value)} rows={12} required />
        <div className="form-footer"><span>{title.trim().length} karakter judul</span><div className="form-actions"><button type="button" className="text-button" onClick={() => navigate('/')}>Batal</button><button type="submit" className="primary-button" disabled={!title.trim() || !body.trim()}>Simpan catatan <span aria-hidden="true">↗</span></button></div></div>
      </form>
    </main>
  );
}

function EmptyState({ title, description }) {
  return <div className="notes-list-empty"><span className="empty-icon" aria-hidden="true">✳</span><h3>{title}</h3><p>{description}</p></div>;
}

function NotFoundPage() {
  return <main className="state-page"><p className="eyebrow">404 / HALAMAN TIDAK DITEMUKAN</p><h1>Sepertinya kamu tersesat.</h1><p>Halaman yang dicari tidak tersedia atau alamatnya sudah berubah.</p><Link className="primary-button" to="/">Kembali ke beranda</Link></main>;
}

export default App;
