import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import useInput from '../hooks/useInput';
import { addNote } from '../utils/network-data';
import { Feedback } from '../components/NotesUI';

function NewNotePage({ onUnauthorized }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [title, onTitleChange] = useInput('');
  const [body, onBodyChange] = useInput('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submitNote(event) {
    event.preventDefault();
    if (loading || !title.trim() || !body.trim()) return;
    setLoading(true);
    setError('');
    const result = await addNote({ title: title.trim(), body: body.trim() });
    setLoading(false);
    if (result.status === 401) return onUnauthorized();
    if (result.error) return setError(result.message);
    navigate('/', { replace: true });
  }

  return (
    <main className="new-note-layout">
      <Link to="/" className="back-link">← {t('backToNotes')}</Link>
      <form onSubmit={submitNote} className="new-note-form">
        <p className="eyebrow">{t('newEyebrow')}</p>
        <label className="field-label" htmlFor="note-title">{t('titleLabel')}</label>
        <input id="note-title" className="add-new-page__input__title" type="text" placeholder={t('titlePlaceholder')} value={title} onChange={onTitleChange} maxLength={120} required autoFocus />
        <div className="field-divider" />
        <label className="field-label" htmlFor="note-body">{t('bodyLabel')}</label>
        <textarea id="note-body" className="add-new-page__input__body" placeholder={t('bodyPlaceholder')} value={body} onChange={onBodyChange} rows={12} required />
        {error && <Feedback message={error} />}
        <div className="form-footer"><span>{title.trim().length} {t('titleCount')}</span>
          <div className="form-actions">
            <button type="button" className="text-button" onClick={() => navigate('/')}>{t('cancel')}</button>
            <button type="submit" className="primary-button" disabled={loading || !title.trim() || !body.trim()}>{loading ? t('saving') : t('save')} <span aria-hidden="true">↗</span></button>
          </div>
        </div>
      </form>
    </main>
  );
}

export default NewNotePage;
