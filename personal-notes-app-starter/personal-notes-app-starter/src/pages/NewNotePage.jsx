import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
        <input
          id="note-title"
          className="add-new-page__input__title"
          type="text"
          placeholder="Beri judul catatan..."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={120}
          required
          autoFocus
        />

        <div className="field-divider" />
        <label className="field-label" htmlFor="note-body">ISI CATATAN</label>
        <textarea
          id="note-body"
          className="add-new-page__input__body"
          placeholder="Mulai tulis ide, rencana, atau hal yang ingin kamu ingat..."
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={12}
          required
        />

        <div className="form-footer">
          <span>{title.trim().length} karakter judul</span>
          <div className="form-actions">
            <button type="button" className="text-button" onClick={() => navigate('/')}>
              Batal
            </button>
            <button
              type="submit"
              className="primary-button"
              disabled={!title.trim() || !body.trim()}
            >
              Simpan catatan <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}

export default NewNotePage;
