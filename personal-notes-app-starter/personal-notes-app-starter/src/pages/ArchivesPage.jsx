import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import NoteList from '../components/NoteList';
import SearchBar from '../components/SearchBar';
import { filterNotesByTitle } from '../utils/note-helpers';

function ArchivesPage({ notes, searchValue, onSearchChange }) {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get('search') || '';
  const filteredNotes = useMemo(
    () => filterNotesByTitle(notes, keyword),
    [notes, keyword],
  );

  return (
    <main>
      <section className="page-intro compact-intro">
        <p className="eyebrow">PERSONAL WORKSPACE / 02</p>
        <h1>Yang tersimpan,<br /><span>tetap mudah ditemukan.</span></h1>
        <p className="intro-copy">
          Catatan yang tidak sedang kamu gunakan tersimpan rapi di sini.
        </p>
      </section>

      <section className="notes-section" aria-labelledby="archives-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ARSIP PRIBADI</p>
            <h2 id="archives-heading">
              Catatan diarsipkan <span className="count-pill">{filteredNotes.length}</span>
            </h2>
          </div>
        </div>

        <SearchBar value={searchValue} onChange={onSearchChange} />

        {filteredNotes.length > 0 ? (
          <NoteList notes={filteredNotes} />
        ) : (
          <EmptyState
            title={keyword ? 'Catatan tidak ditemukan' : 'Arsip kosong'}
            description={
              keyword
                ? 'Coba kata kunci lain atau hapus pencarian.'
                : 'Catatan yang kamu arsipkan akan muncul di sini.'
            }
          />
        )}
      </section>
    </main>
  );
}

export default ArchivesPage;
