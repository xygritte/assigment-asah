import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import useInput from '../hooks/useInput';
import { login, register } from '../utils/network-data';
import { Feedback } from '../components/NotesUI';

function Field({ id, label, type = 'text', value, onChange, autoComplete, minLength }) {
  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} value={value} onChange={onChange} autoComplete={autoComplete} minLength={minLength} required />
    </div>
  );
}

function AuthLayout({ title, intro, children }) {
  return <main className="auth-layout"><section className="auth-card">
    <p className="eyebrow">CATATANKITA / ACCOUNT</p>
    <h1>{title}</h1><p className="intro-copy">{intro}</p>{children}
  </section></main>;
}

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    const result = await login({ email: email.trim(), password });
    if (result.error || !result.data?.accessToken) {
      setError(result.message || t('actionError'));
      setLoading(false);
      return;
    }
    const profileResult = await onLogin(result.data.accessToken);
    setLoading(false);
    if (!profileResult.error) navigate('/', { replace: true });
    else setError(profileResult.message);
  }

  return (
    <AuthLayout title={t('loginTitle')} intro={t('loginIntro')}>
      {location.state?.registered && <p className="auth-success" role="status">{language === 'id' ? 'Akun berhasil dibuat. Silakan masuk.' : 'Account created. Please sign in.'}</p>}
      <form className="auth-form" onSubmit={submit}>
        <Field id="login-email" label={t('email')} type="email" value={email} onChange={onEmailChange} autoComplete="email" />
        <Field id="login-password" label={t('password')} type="password" value={password} onChange={onPasswordChange} autoComplete="current-password" />
        {error && <Feedback message={error} />}
        <button type="submit" className="primary-button auth-submit" disabled={loading}>{loading ? t('loggingIn') : t('loginButton')}</button>
      </form>
      <p className="auth-link">{t('noAccount')} <Link to="/register">{t('register')}</Link></p>
    </AuthLayout>
  );
}

function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [name, onNameChange] = useInput('');
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [confirmPassword, onConfirmPasswordChange] = useInput('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    if (loading) return;
    if (!name.trim() || !email.trim() || !password) return setError(t('requiredFields'));
    if (password.length < 6) return setError(t('passwordLength'));
    if (password !== confirmPassword) return setError(t('passwordMismatch'));
    setLoading(true);
    setError('');
    const result = await register({ name: name.trim(), email: email.trim(), password });
    setLoading(false);
    if (result.error) return setError(result.message);
    navigate('/login', { replace: true, state: { registered: true } });
  }

  return (
    <AuthLayout title={t('registerTitle')} intro={t('registerIntro')}>
      <form className="auth-form" onSubmit={submit}>
        <Field id="register-name" label={t('name')} value={name} onChange={onNameChange} autoComplete="name" />
        <Field id="register-email" label={t('email')} type="email" value={email} onChange={onEmailChange} autoComplete="email" />
        <Field id="register-password" label={t('password')} type="password" value={password} onChange={onPasswordChange} autoComplete="new-password" minLength={6} />
        <Field id="register-confirm" label={t('confirmPassword')} type="password" value={confirmPassword} onChange={onConfirmPasswordChange} autoComplete="new-password" />
        {error && <Feedback message={error} />}
        <button type="submit" className="primary-button auth-submit" disabled={loading}>{loading ? t('registering') : t('registerButton')}</button>
      </form>
      <p className="auth-link">{t('haveAccount')} <Link to="/login">{t('login')}</Link></p>
    </AuthLayout>
  );
}

export { LoginPage, RegisterPage };
