import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const translations = {
  id: {
    navNotes: 'Catatan', navArchives: 'Arsip', login: 'Masuk', register: 'Daftar',
    logout: 'Keluar', theme: 'Ganti tema', language: 'Ganti bahasa',
    email: 'Email', password: 'Password', name: 'Nama lengkap', confirmPassword: 'Konfirmasi password',
    loginTitle: 'Selamat datang kembali.', registerTitle: 'Buat akun baru.',
    loginIntro: 'Masuk untuk melihat catatan pribadimu.',
    registerIntro: 'Simpan ide dan rencana dalam akun pribadimu.',
    loginButton: 'Masuk', registerButton: 'Daftar',
    loggingIn: 'Sedang masuk...', registering: 'Mendaftarkan...',
    noAccount: 'Belum punya akun?', haveAccount: 'Sudah punya akun?',
    requiredFields: 'Lengkapi semua kolom yang wajib diisi.',
    passwordLength: 'Password harus memiliki minimal 6 karakter.',
    passwordMismatch: 'Konfirmasi password tidak sama.',
    welcome: 'Masuk sebagai', loading: 'Memuat...', loadingNotes: 'Memuat catatan...',
    loadingSession: 'Memeriksa sesi...', retry: 'Coba lagi',
    homeEyebrow: 'RUANG CATATAN / 01', archiveEyebrow: 'RUANG CATATAN / 02',
    homeHeading: 'Semua catatan,', homeHeadingAccent: 'dalam satu tempat.',
    archiveHeading: 'Yang tersimpan,', archiveHeadingAccent: 'tetap mudah ditemukan.',
    homeIntro: 'Tangkap ide, simpan rencana, dan kembali kapan saja saat kamu membutuhkannya.',
    archiveIntro: 'Catatan yang tidak sedang kamu gunakan, tersimpan rapi di sini.',
    personalCollection: 'KOLEKSI PRIBADI', personalArchive: 'ARSIP PRIBADI',
    activeNotes: 'Catatan aktif', archivedNotes: 'Catatan diarsipkan',
    newNote: 'Catatan baru', searchPlaceholder: 'Cari berdasarkan judul catatan...',
    searchAria: 'Cari catatan berdasarkan judul', clearSearch: 'Hapus pencarian',
    searchTag: 'CARI', noteLabel: 'CATATAN', archivedLabel: 'DIARSIPKAN',
    untitled: '(Tanpa judul)', noBody: 'Catatan ini belum memiliki isi.',
    noNotes: 'Tidak ada catatan', noArchives: 'Arsip kosong', noMatch: 'Catatan tidak ditemukan',
    noNotesDesc: 'Mulai dengan membuat catatan pertamamu.',
    noArchivesDesc: 'Catatan yang kamu arsipkan akan muncul di sini.',
    noMatchDesc: 'Coba kata kunci lain atau hapus pencarian.',
    backToList: 'Kembali ke daftar', backToNotes: 'Kembali ke catatan',
    activeLabel: 'CATATAN AKTIF', archivedStatus: 'CATATAN DIARSIPKAN',
    createdOn: 'Dibuat pada', noteNotFound: 'Catatan ini tidak ada.',
    noteNotFoundDesc: 'Mungkin sudah dihapus atau alamat yang kamu buka salah.',
    pageNotFound: 'Sepertinya kamu tersesat.',
    pageNotFoundDesc: 'Halaman yang dicari tidak tersedia atau alamatnya sudah berubah.',
    backHome: 'Kembali ke beranda', titleLabel: 'JUDUL CATATAN',
    bodyLabel: 'ISI CATATAN', titlePlaceholder: 'Beri judul catatan...',
    bodyPlaceholder: 'Mulai tulis ide, rencana, atau hal yang ingin kamu ingat...',
    titleCount: 'karakter judul', cancel: 'Batal', save: 'Simpan catatan',
    saving: 'Menyimpan...', deleting: 'Menghapus...', processing: 'Memproses...',
    archive: 'Arsipkan catatan', unarchive: 'Batalkan arsip catatan',
    delete: 'Hapus catatan', deleteConfirm: 'Hapus catatan ini? Tindakan ini tidak dapat dibatalkan.',
    loadError: 'Gagal memuat data.', actionError: 'Permintaan gagal.',
    footer: 'Dibuat untuk menyimpan hal-hal yang berarti',
    newEyebrow: 'RUANG CATATAN / BARU', sessionExpired: 'Sesi berakhir. Silakan masuk kembali.',
  },
  en: {
    navNotes: 'Notes', navArchives: 'Archive', login: 'Sign in', register: 'Register',
    logout: 'Sign out', theme: 'Toggle theme', language: 'Change language',
    email: 'Email', password: 'Password', name: 'Full name', confirmPassword: 'Confirm password',
    loginTitle: 'Welcome back.', registerTitle: 'Create an account.',
    loginIntro: 'Sign in to view your personal notes.',
    registerIntro: 'Keep ideas and plans in your own account.',
    loginButton: 'Sign in', registerButton: 'Register',
    loggingIn: 'Signing in...', registering: 'Registering...',
    noAccount: 'No account yet?', haveAccount: 'Already have an account?',
    requiredFields: 'Fill in all required fields.',
    passwordLength: 'Password must be at least 6 characters.',
    passwordMismatch: 'Passwords do not match.',
    welcome: 'Signed in as', loading: 'Loading...', loadingNotes: 'Loading notes...',
    loadingSession: 'Checking session...', retry: 'Try again',
    homeEyebrow: 'NOTES WORKSPACE / 01', archiveEyebrow: 'NOTES WORKSPACE / 02',
    homeHeading: 'All your notes,', homeHeadingAccent: 'in one place.',
    archiveHeading: 'Saved ideas,', archiveHeadingAccent: 'easy to find.',
    homeIntro: 'Capture ideas, keep plans, and return to them whenever you need.',
    archiveIntro: 'Notes you are not currently using remain neatly stored here.',
    personalCollection: 'PRIVATE COLLECTION', personalArchive: 'PRIVATE ARCHIVE',
    activeNotes: 'Active notes', archivedNotes: 'Archived notes',
    newNote: 'New note', searchPlaceholder: 'Search note titles...',
    searchAria: 'Search note titles', clearSearch: 'Clear search',
    searchTag: 'SEARCH', noteLabel: 'NOTE', archivedLabel: 'ARCHIVED',
    untitled: '(Untitled)', noBody: 'This note is empty.',
    noNotes: 'No notes yet', noArchives: 'Archive is empty', noMatch: 'No matching notes',
    noNotesDesc: 'Get started by creating your first note.',
    noArchivesDesc: 'Notes you archive will show up here.',
    noMatchDesc: 'Try another keyword or clear your search.',
    backToList: 'Back to list', backToNotes: 'Back to notes',
    activeLabel: 'ACTIVE NOTE', archivedStatus: 'ARCHIVED NOTE',
    createdOn: 'Created on', noteNotFound: 'This note was not found.',
    noteNotFoundDesc: 'It may have been removed, or the link is incorrect.',
    pageNotFound: 'Looks like you are lost.',
    pageNotFoundDesc: 'This page is unavailable or its address has changed.',
    backHome: 'Back to home', titleLabel: 'NOTE TITLE',
    bodyLabel: 'NOTE BODY', titlePlaceholder: 'Give this note a title...',
    bodyPlaceholder: 'Write down your ideas, plans, or things to remember...',
    titleCount: 'title characters', cancel: 'Cancel', save: 'Save note',
    saving: 'Saving...', deleting: 'Deleting...', processing: 'Working...',
    archive: 'Archive note', unarchive: 'Unarchive note',
    delete: 'Delete note', deleteConfirm: 'Delete this note? This action cannot be undone.',
    loadError: 'Failed to load data.', actionError: 'Request failed.',
    footer: 'Made to keep the things that matter',
    newEyebrow: 'NOTES WORKSPACE / NEW', sessionExpired: 'Session expired. Please sign in again.',
  },
};

const LanguageContext = createContext(null);

function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => (
    localStorage.getItem('language') === 'en' ? 'en' : 'id'
  ));

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem('language', language);
  }, [language]);

  const value = useMemo(() => ({
    language,
    toggleLanguage: () => setLanguage((current) => current === 'id' ? 'en' : 'id'),
    t: (key) => translations[language][key] || translations.id[key] || key,
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage harus digunakan di dalam LanguageProvider.');
  return context;
}

export { LanguageProvider, useLanguage };
