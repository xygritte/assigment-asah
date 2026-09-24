import React from 'react';
import { getInitialData } from '../utils/data';
import NoteInput from './NoteInput';
import NotesList from './NotesList';
import NoteSearch from './NoteSearch';
import { preview, searchForWorkspaceRoot } from 'vite';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // TODO [Basic] simpan data catatan dari util getInitialData supaya daftar awal langsung tampil.
      notes: getInitialData(),

      // TODO [Skilled] sediakan state untuk kata kunci pencarian.
      searchKeyword:'',
    };

    this.onAddNoteHandler = this.onAddNoteHandler.bind(this);
    this.onDeleteHandler = this.onDeleteHandler.bind(this);
    this.onArchiveHandler = this.onArchiveHandler.bind(this);
    this.onSearchHandler = this.onSearchHandler.bind(this);
  }

  onAddNoteHandler({ title, body }) {
    // TODO [Basic] tambahkan catatan baru ke state.notes gunakan spread operator dan +new Date() sebagai id.
    // TODO [Advanced] setelah menambahkan, pastikan catatan baru muncul pada daftar aktif.
    this.setState((prevState) => ({
      notes: [
        ...prevState.notes,
        {
          id: +new Date(),
          title,
          body,
          createdAt: new Date().tolSOString(),
          archived: false,
        },
      ],
    }));
    console.warn('[TODO] Implement onAddNoteHandler', { title, body });
  }

  onDeleteHandler(id) {
    // TODO [Basic] gunakan array.filter untuk menghapus catatan berdasarkan id.
    this.setState((prevState) => ({
      notes: prevState.notes.filter((note) => note.id !== id),
    }));
    console.warn('[TODO] Implement onDeleteHandler', { id });
  }

  onArchiveHandler(id) {
    // TODO [Advanced] gunakan array.map untuk toggle nilai archived catatan sesuai id dan pisahkan daftar aktif/arsip.
    this.setState((prevState) => ({
      notes: prevState.notes.map((note) =>
        note.id === id
          ? { ...note, archived: !note.archived }
          : note
      ),
    }));
    console.warn('[TODO] Implement onArchiveHandler', { id });
  }

  onSearchHandler(keyword) {
    // TODO [Skilled] simpan keyword ke state dan manfaatkan untuk memfilter catatan.
    this.setState({
      searchKeyword: keyword,
    });
    console.warn('[TODO] Implement onSearchHandler', { keyword });
  }

  render() {
    const { notes, searchKeyword } = this.state;

    // TODO [Skilled] filter catatan berdasarkan searchKeyword (case-insensitive).
    const filteredNotes = notes.filter((note) =>
      note.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    // TODO [Advanced] pisahkan catatan aktif dan arsip menggunakan array.filter, lalu urutkan berdasarkan tanggal terbaru.
    const activeNotes = filteredNotes
      .filter((note) => !note.archived)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const archivedNotes = filteredNotes
      .filter((note) => note.archived)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


    return (
      <div className="note-app" data-testid="note-app">
        <div className="note-app__header" data-testid="note-app-header">
          <h1>Notes</h1>
          <NoteSearch onSearch={this.onSearchHandler} />
        </div>
        <div className="note-app__body" data-testid="note-app-body">
          <NoteInput addNote={this.onAddNoteHandler} />
          <section
            aria-labelledby="active-notes-title"
            data-testid="active-notes-section"
          >
            <h2 id="active-notes-title">Catatan Aktif</h2>
            <NotesList
              notes={activeNotes}
              onDelete={this.onDeleteHandler}
              onArchive={this.onArchiveHandler}
              dataTestId="active-notes-list"
              searchKeyword={searchKeyword}
            />
          </section>
          <section
            aria-labelledby="archived-notes-title"
            data-testid="archived-notes-section"
          >
            <h2 id="archived-notes-title">Arsip ({archivedNotes.length})</h2>
            <NotesList
              notes={archivedNotes}
              onDelete={this.onDeleteHandler}
              onArchive={this.onArchiveHandler}
              dataTestId="archived-notes-list"
              searchKeyword={searchKeyword}
            />
          </section>
        </div>
      </div>
    );
  }
}

export default App;