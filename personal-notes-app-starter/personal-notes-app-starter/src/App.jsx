import React, { useCallback, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import ArchivesPage from './pages/ArchivesPage';
import HomePage from './pages/HomePage';
import NewNotePage from './pages/NewNotePage';
import NoteDetailPage from './pages/NoteDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import {
  addNote,
  archiveNote,
  deleteNote,
  getActiveNotes,
  getArchivedNotes,
  unarchiveNote,
} from './utils/local-data';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [notesVersion, setNotesVersion] = useState(0);
  const queryKeyword = new URLSearchParams(location.search).get('search') || '';
  const [searchValue, setSearchValue] = useState(queryKeyword);

  useEffect(() => {
    setSearchValue(queryKeyword);
  }, [queryKeyword]);

  const updateSearch = useCallback((value) => {
    setSearchValue(value);

    const params = new URLSearchParams(location.search);
    if (value.trim()) {
      params.set('search', value);
    } else {
      params.delete('search');
    }

    const queryString = params.toString();
    navigate(
      {
        pathname: location.pathname,
        search: queryString ? '?' + queryString : '',
      },
      { replace: true },
    );
  }, [location.pathname, location.search, navigate]);

  const refreshNotes = () => {
    setNotesVersion((version) => version + 1);
  };

  const handleAddNote = ({ title, body }) => {
    addNote({ title: title.trim(), body: body.trim() });
    refreshNotes();
    navigate('/');
  };

  const handleDeleteNote = (note) => {
    deleteNote(note.id);
    refreshNotes();
    navigate(note.archived ? '/archives' : '/');
  };

  const handleToggleArchive = (note) => {
    if (note.archived) {
      unarchiveNote(note.id);
      navigate('/');
    } else {
      archiveNote(note.id);
      navigate('/archives');
    }

    refreshNotes();
  };

  return (
    <div className="app-container">
      <AppHeader />
      <Routes key={notesVersion}>
        <Route
          path="/"
          element={
            <HomePage
              notes={getActiveNotes()}
              searchValue={searchValue}
              onSearchChange={updateSearch}
            />
          }
        />
        <Route
          path="/archives"
          element={
            <ArchivesPage
              notes={getArchivedNotes()}
              searchValue={searchValue}
              onSearchChange={updateSearch}
            />
          }
        />
        <Route
          path="/notes/new"
          element={<NewNotePage onAddNote={handleAddNote} />}
        />
        <Route
          path="/notes/:id"
          element={
            <NoteDetailPage
              onDelete={handleDeleteNote}
              onToggleArchive={handleToggleArchive}
            />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <footer className="app-footer">
        Dibuat untuk menyimpan hal-hal yang berarti <span aria-hidden="true">✳</span>
      </footer>
    </div>
  );
}

export default App;
