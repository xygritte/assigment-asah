import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import NoteList from '../components/NoteList';
import SearchBar from '../components/SearchBar';
import { filterNotesByTitle } from '../utils/note-helpers';

function HomePage({ notes, searchValue, onSearchChange }) {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get('search') || '';
  const filteredNotes = useMemo(
    () => filterNotesByTitle(notes, keyword),
    [notes, keyword],
  );

  return (
    <main>
      <section className="page-intro">
        <p className="eyebrow">PERSONAL WORKSPACE / 01</p>
        <h1>Semua catatan,<br /><span>dalam satu tempat.</span></h1>
        <p className="intro-copy">
          Tangkap ide, simpan rencana, dan kembali kapan saja saat kamu membutuhkannya.
        </p>
      </section>

      <section className="notes-section" aria-labelledby="notes-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">KOLEKSI PRIBADI</p>
            <h2 id="notes-heading">
              Catatan aktif <span className="count-pill">{filteredNotes.length}</span>
            </h2>
          </div>
          <Link className="primary-button" to="/notes/new">
            <span aria-hidden="true">＋</span> Catatan baru
          </Link>
        </div>

        <SearchBar value={searchValue} onChange={onSearchChange} />

        {filteredNotes.length > 0 ? (
          <NoteList notes={filteredNotes} />
        ) : (
          <EmptyState
            title={keyword ? 'Catatan tidak ditemukan' : 'Tidak ada catatan'}
            description={
              keyword
                ? 'Coba kata kunci lain atau hapus pencarian.'
                : 'Mulai dengan membuat catatan pertamamu.'
            }
          />
        )}
      </section>
    </main>
  );
}

export default HomePage;
