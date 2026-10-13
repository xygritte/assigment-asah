import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { showFormattedDate } from '../utils';
import { getNote } from '../utils/local-data';

function NoteDetailPage({ onDelete, onToggleArchive }) {
  const { id } = useParams();
  const note = getNote(id);

  if (!note) {
    return (
      <main className="state-page">
        <p className="eyebrow">404 / CATATAN TIDAK DITEMUKAN</p>
        <h1>Catatan ini tidak ada.</h1>
        <p>Mungkin catatan sudah dihapus atau alamat yang kamu buka salah.</p>
        <Link className="primary-button" to="/">Kembali ke catatan</Link>
      </main>
    );
  }

  return (
    <main className="detail-layout">
      <Link to={note.archived ? '/archives' : '/'} className="back-link">
        ← Kembali ke daftar
      </Link>
      <article className="detail-page">
        <div className="detail-label">
          <span className="status-dot" />
          {note.archived ? 'CATATAN DIARSIPKAN' : 'CATATAN AKTIF'}
        </div>
        <h1 className="detail-page__title">{note.title || '(Tanpa judul)'}</h1>
        <p className="detail-page__createdAt">
          Dibuat pada {showFormattedDate(note.createdAt)}
        </p>
        <div className="detail-divider" />
        <div className="detail-page__body">
          {note.body || 'Catatan ini belum memiliki isi.'}
        </div>
      </article>

      <div className="detail-page__action">
        <button
          className="action action-secondary"
          type="button"
          onClick={() => onToggleArchive(note)}
          aria-label={note.archived ? 'Batalkan arsip catatan' : 'Arsipkan catatan'}
          title={note.archived ? 'Batalkan arsip' : 'Arsipkan'}
        >
          {note.archived ? '↶' : '⌑'}
        </button>
        <button
          className="action action-danger"
          type="button"
          onClick={() => {
            if (window.confirm('Hapus catatan ini? Tindakan ini tidak dapat dibatalkan.')) {
              onDelete(note);
            }
          }}
          aria-label="Hapus catatan"
          title="Hapus catatan"
        >
          ⌫
        </button>
      </div>
    </main>
  );
}

export default NoteDetailPage;
