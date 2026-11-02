import { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import { useLanguage } from './contexts/LanguageContext';
import { useTheme } from './contexts/ThemeContext';
import { getAccessToken, getUserLogged, putAccessToken, removeAccessToken } from './utils/network-data';
import { Loading } from './components/NotesUI';
import NotesPage from './pages/NotesPage';
import NoteDetailPage from './pages/NoteDetailPage';
import NewNotePage from './pages/NewNotePage';
import { LoginPage, RegisterPage } from './pages/AuthPages';

function Header({ user, onLogout }) {
  const { t, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <Link className="brand" to={user ? '/' : '/login'} aria-label="CatatanKita">
        <span className="brand-mark" aria-hidden="true">N</span>
        <span>Catatan<span className="brand-accent">Kita</span></span>
      </Link>
      <nav className="navigation" aria-label="Main navigation">
        {user ? (
          <>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>{t('navNotes')}</NavLink>
            <NavLink to="/archives" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>{t('navArchives')}</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>{t('login')}</NavLink>
            <NavLink to="/register" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>{t('register')}</NavLink>
          </>
        )}
      </nav>
      <div className="header-tools">
        <button type="button" className="header-tool" onClick={toggleTheme} aria-label={t('theme')} title={t('theme')}>{theme === 'dark' ? '☀' : '☾'}</button>
        <button type="button" className="header-tool" onClick={toggleLanguage} aria-label={t('language')} title={t('language')}>{language === 'id' ? 'EN' : 'ID'}</button>
        {user && (
          <>
            <span className="user-name" title={user.email}>{t('welcome')} <strong>{user.name || user.email}</strong></span>
            <button className="header-logout" type="button" onClick={onLogout}>{t('logout')}</button>
          </>
        )}
      </div>
    </header>
  );
}

function ProtectedRoute({ user, checking }) {
  const { t } = useLanguage();
  if (checking) return <main><Loading text={t('loadingSession')} /></main>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

function PublicRoute({ user, checking, children }) {
  const { t } = useLanguage();
  if (checking) return <main><Loading text={t('loadingSession')} /></main>;
  return user ? <Navigate to="/" replace /> : children;
}

function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <main className="state-page">
      <p className="eyebrow">404</p>
      <h1>{t('pageNotFound')}</h1>
      <p>{t('pageNotFoundDesc')}</p>
      <Link className="primary-button" to="/">{t('backHome')}</Link>
    </main>
  );
}

function App() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      if (!getAccessToken()) {
        if (active) setChecking(false);
        return;
      }
      const result = await getUserLogged();
      if (!active) return;
      if (!result.error && result.data) {
        setUser(result.data);
      } else {
        removeAccessToken();
        setUser(null);
      }
      setChecking(false);
    }

    restoreSession();
    return () => { active = false; };
  }, []);

  const onUnauthorized = useCallback(() => {
    removeAccessToken();
    setUser(null);
    setChecking(false);
    navigate('/login', { replace: true });
  }, [navigate]);

  async function onLogin(token) {
    putAccessToken(token);
    const result = await getUserLogged();
    if (result.error || !result.data) {
      removeAccessToken();
      setUser(null);
      return { error: true, message: result.message || t('actionError') };
    }
    setUser(result.data);
    return { error: false };
  }

  function onLogout() {
    removeAccessToken();
    setUser(null);
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-container" data-theme={theme}>
      <Header user={user} onLogout={onLogout} />
      <Routes>
        <Route path="/login" element={<PublicRoute user={user} checking={checking}><LoginPage onLogin={onLogin} /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute user={user} checking={checking}><RegisterPage /></PublicRoute>} />
        <Route element={<ProtectedRoute user={user} checking={checking} />}>
          <Route path="/" element={<NotesPage onUnauthorized={onUnauthorized} />} />
          <Route path="/archives" element={<NotesPage archived onUnauthorized={onUnauthorized} />} />
          <Route path="/notes/new" element={<NewNotePage onUnauthorized={onUnauthorized} />} />
          <Route path="/notes/:id" element={<NoteDetailPage onUnauthorized={onUnauthorized} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <footer className="app-footer">{t('footer')} <span aria-hidden="true">✳</span></footer>
    </div>
  );
}

export default App;
