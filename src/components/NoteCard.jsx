import React from 'react';
import { Link } from 'react-router-dom';
import { showFormattedDate } from '../utils';

function NoteCard({ note, index }) {
  const preview = note.body.replace(/\s+/g, ' ').trim();

  return (
    <article className="note-item">
      <Link
        className="note-item__link"
        to={'/notes/' + note.id}
        aria-label={'Buka catatan ' + note.title}
      >
        <div className="note-card-meta">
          <span className="note-index">{String(index + 1).padStart(2, '0')}</span>
          <span>{note.archived ? 'DIARSIPKAN' : 'CATATAN'}</span>
        </div>
        <h3 className="note-item__title">{note.title || '(Tanpa judul)'}</h3>
        <p className="note-item__createdAt">{showFormattedDate(note.createdAt)}</p>
        <p className="note-item__body">{preview || 'Catatan ini belum memiliki isi.'}</p>
        <span className="note-card-arrow" aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}

export default NoteCard;
