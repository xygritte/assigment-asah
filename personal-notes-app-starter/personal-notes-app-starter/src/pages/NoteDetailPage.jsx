import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { archiveNote, deleteNote, getNote, unarchiveNote } from '../utils/network-data';
import { showFormattedDate } from '../utils';
import { Feedback, Loading } from '../components/NotesUI';

function NoteDetailPage({ onUnauthorized }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setNote(null);
    setNotFound(false);
    getNote(id).then((result) => {
      if (!active) return;
      if (result.status === 401) onUnauthorized();
      else if (result.status === 404) setNotFound(true);
      else if (result.error) setError(result.message);
      else setNote(result.data);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [id, onUnauthorized]);

  async function handleAction(action) {
    if (!note || saving) return;
    setSaving(true);
    setError('');
    const operation = action === 'delete' ? deleteNote : note.archived ? unarchiveNote : archiveNote;
    const result = await operation(note.id);
    setSaving(false);
    if (result.status === 401) return onUnauthorized();
    if (result.error) return setError(result.message);
    if (action === 'delete') return navigate('/', { replace: true });
    navigate(note.archived ? '/' : '/archives', { replace: true });
  }

  if (loading) return <main className="detail-layout"><Loading text={t('loadingNotes')} /></main>;
  if (notFound) return (
    <main className="state-page"><p className="eyebrow">404</p><h1>{t('noteNotFound')}</h1>
      <p>{t('noteNotFoundDesc')}</p><Link className="primary-button" to="/">{t('backToNotes')}</Link>
    </main>
  );
  if (!note) return <main className="detail-layout"><Feedback message={error} onRetry={() => window.location.reload()} /></main>;

  return (
    <main className="detail-layout">
      <Link to={note.archived ? '/archives' : '/'} className="back-link">← {t('backToList')}</Link>
      <article className="detail-page">
        <div className="detail-label"><span className="status-dot" />{t(note.archived ? 'archivedStatus' : 'activeLabel')}</div>
        <h1 className="detail-page__title">{note.title || t('untitled')}</h1>
        <p className="detail-page__createdAt">{t('createdOn')} {showFormattedDate(note.createdAt, language)}</p>
        <div className="detail-divider" />
        <div className="detail-page__body">{note.body || t('noBody')}</div>
      </article>
      {error && <Feedback message={error} />}
      <div className="detail-page__action">
        <button className="action action-secondary" type="button" disabled={saving} onClick={() => handleAction('archive')} aria-label={t(note.archived ? 'unarchive' : 'archive')} title={t(note.archived ? 'unarchive' : 'archive')}>{saving ? '…' : note.archived ? '↶' : '⌑'}</button>
        <button className="action action-danger" type="button" disabled={saving} onClick={() => {
          if (window.confirm(t('deleteConfirm'))) handleAction('delete');
        }} aria-label={t('delete')} title={t('delete')}>⌫</button>
      </div>
    </main>
  );
}

export default NoteDetailPage;
