import { Link } from 'react-router-dom';
import { showFormattedDate } from '../utils';
import { useLanguage } from '../contexts/LanguageContext';

function Loading({ text }) {
  const { t } = useLanguage();
  return <div className="loading-state" role="status" aria-live="polite"><span className="loading-spinner" aria-hidden="true" />{text || t('loading')}</div>;
}

function Feedback({ message, onRetry }) {
  const { t } = useLanguage();
  return <div className="feedback-error" role="alert"><p>{message || t('loadError')}</p>{onRetry && <button type="button" className="text-button" onClick={onRetry}>{t('retry')}</button>}</div>;
}

function EmptyState({ title, description }) {
  return <div className="notes-list-empty"><span className="empty-icon" aria-hidden="true">✳</span><h3>{title}</h3><p>{description}</p></div>;
}

function SearchBar({ value, onChange }) {
  const { t } = useLanguage();
  return (
    <form className="search-bar" role="search" onSubmit={(event) => event.preventDefault()}>
      <span className="search-icon" aria-hidden="true">⌕</span>
      <input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={t('searchPlaceholder')} aria-label={t('searchAria')} />
      {value && <button className="clear-search" type="button" onClick={() => onChange('')} aria-label={t('clearSearch')}>×</button>}
      <span className="search-hint">{t('searchTag')}</span>
    </form>
  );
}

function NoteItem({ note, index }) {
  const { t, language } = useLanguage();
  const preview = (note.body || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return (
    <article className="note-item">
      <Link className="note-item__link" to={'/notes/' + note.id} aria-label={note.title}>
        <div className="note-card-meta"><span className="note-index">{String(index + 1).padStart(2, '0')}</span><span>{note.archived ? t('archivedLabel') : t('noteLabel')}</span></div>
        <h3 className="note-item__title">{note.title || t('untitled')}</h3>
        <p className="note-item__createdAt">{showFormattedDate(note.createdAt, language)}</p>
        <p className="note-item__body">{preview || t('noBody')}</p>
        <span className="note-card-arrow" aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}

function NotesList({ notes }) {
  return <div className="notes-list">{notes.map((note, index) => <NoteItem key={note.id} note={note} index={index} />)}</div>;
}

export { Loading, Feedback, EmptyState, SearchBar, NotesList };
