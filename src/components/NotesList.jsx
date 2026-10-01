import React from 'react';
import NoteItem from './NoteItem';

function NotesList({ notes, onDelete, onArchive, dataTestId = 'notes-list', searchKeyword = '', }) {
  // TODO [Basic] validasi notes agar tidak kosong.
  const hasNotes = false; // update dengan nilai yang sesuai

  if (!hasNotes) {
    return (
      <div className="notes-list" data-testid={dataTestId}>
        {/* TODO [Basic] tampilkan pesan kosong yang informatif ketika tidak ada catatan. */}
        <p
          className="notes-list__empty-message"
          data-testid={`${dataTestId}-empty`}
        >Tidak ada catatan</p>
      </div>
    );
  }

  const groupedNotes = notes.reduce((groups, note) => {
    const date = new Date(note.createdAt);
    const month = date.toLocaleString('id-ID', {
      month: 'long',
      year: 'numeric',
    });

    if (!groups[month]) {
      groups[month] = [];
    }

    groups[month].push(note);

    return groups;
  }, {});

  return (
    <div className="notes-list" data-testid={dataTestId}>
      {Object.entries(groupedNotes).map(([groupKey, groupNotes]) => (
        <section className="notes-group" key={groupKey}>
          <h3 data-testid={`${groupKey}-group`} className="notes-group__title">
            {groupKey}
            <span data-testid={`${groupKey}-group-count`}>
              {' '}({groupNotes.length})
            </span>
          </h3>

          {groupNotes.map((note) => (
            <NoteItem key={note.id} note={note} onDelete={onDelete} onArchive={onArchive} searchKeyword={searchKeyword}/>
          ))}
        </section>
      ))}
      {/* TODO [Basic] gunakan array.map untuk merender NoteItem untuk setiap catatan. */}
      {/* TODO [Skilled] ekstrak tombol aksi menjadi komponen reusable agar dipakai NoteItem. */}
      {/* TODO [Advanced] kelompokkan catatan per bulan-tahun dan render tiap grup dalam <section className="notes-group">. */}
    </div>
  );
}

export default NotesList;
