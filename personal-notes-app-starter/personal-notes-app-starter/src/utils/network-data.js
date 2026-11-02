// Semua operasi catatan dan autentikasi menggunakan RESTful API Dicoding.
const BASE_URL = 'https://notes-api.dicoding.dev/v1';
const TOKEN_KEY = 'accessToken';

function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function putAccessToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function removeAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: 'Bearer ' + token } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(BASE_URL + path, { ...options, headers });
    const payload = await response.json().catch(() => ({}));
    return {
      error: !response.ok || payload.status !== 'success',
      data: payload.data ?? null,
      message: payload.message || (response.ok ? 'Respons server tidak valid.' : 'Permintaan gagal.'),
      status: response.status,
    };
  } catch {
    return {
      error: true,
      data: null,
      message: 'Tidak dapat terhubung ke server. Periksa koneksi internet.',
      status: 0,
    };
  }
}

const register = ({ name, email, password }) => request('/register', {
  method: 'POST', body: JSON.stringify({ name, email, password }),
});

const login = ({ email, password }) => request('/login', {
  method: 'POST', body: JSON.stringify({ email, password }),
});

const getUserLogged = () => request('/users/me');
const getActiveNotes = () => request('/notes');
const getArchivedNotes = () => request('/notes/archived');
const getNote = (id) => request('/notes/' + encodeURIComponent(id));
const addNote = ({ title, body }) => request('/notes', {
  method: 'POST', body: JSON.stringify({ title, body }),
});
const deleteNote = (id) => request('/notes/' + encodeURIComponent(id), { method: 'DELETE' });
const archiveNote = (id) => request('/notes/' + encodeURIComponent(id) + '/archive', { method: 'POST' });
const unarchiveNote = (id) => request('/notes/' + encodeURIComponent(id) + '/unarchive', { method: 'POST' });

export {
  getAccessToken, putAccessToken, removeAccessToken,
  register, login, getUserLogged, getActiveNotes,
  getArchivedNotes, getNote, addNote, deleteNote, archiveNote, unarchiveNote,
};
