import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import useNotes from '../hooks/useNotes';
import { EmptyState, Feedback, Loading, NotesList, SearchBar } from '../components/NotesUI';

function NotesPage({ archived = false, onUnauthorized }) {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('search') || '';
  const { notes, loading, error } = useNotes(archived, onUnauthorized);

  const visibleNotes = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();
    return normalized ? notes.filter((note) => (note.title || '').toLowerCase().includes(normalized)) : notes;
  }, [notes, keyword]);

  function updateSearch(value) {
    const params = new URLSearchParams(searchParams);
    if (value.trim()) params.set('search', value);
    else params.delete('search');
    setSearchParams(params, { replace: true });
  }

  return (
    <main>
      <section className={archived ? 'page-intro compact-intro' : 'page-intro'}>
        <p className="eyebrow">{t(archived ? 'archiveEyebrow' : 'homeEyebrow')}</p>
        <h1>{t(archived ? 'archiveHeading' : 'homeHeading')}<br /><span>{t(archived ? 'archiveHeadingAccent' : 'homeHeadingAccent')}</span></h1>
        <p className="intro-copy">{t(archived ? 'archiveIntro' : 'homeIntro')}</p>
      </section>
      <section className="notes-section" aria-labelledby="notes-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t(archived ? 'personalArchive' : 'personalCollection')}</p>
            <h2 id="notes-heading">{t(archived ? 'archivedNotes' : 'activeNotes')} <span className="count-pill">{loading ? '—' : visibleNotes.length}</span></h2>
          </div>
          {!archived && <Link className="primary-button" to="/notes/new"><span aria-hidden="true">＋</span> {t('newNote')}</Link>}
        </div>
        <SearchBar value={keyword} onChange={updateSearch} />
        {loading ? <Loading text={t('loadingNotes')} /> : error ? <Feedback message={error} onRetry={() => window.location.reload()} /> : (
          visibleNotes.length
            ? <NotesList notes={visibleNotes} />
            : <EmptyState
                title={keyword ? t('noMatch') : t(archived ? 'noArchives' : 'noNotes')}
                description={keyword ? t('noMatchDesc') : t(archived ? 'noArchivesDesc' : 'noNotesDesc')}
              />
        )}
      </section>
    </main>
  );
}

export default NotesPage;
