import React from 'react';
import NoteCard from './NoteCard';

function NoteList({ notes }) {
  return (
    <div className="notes-list">
      {notes.map((note, index) => (
        <NoteCard key={note.id} note={note} index={index} />
      ))}
    </div>
  );
}

export default NoteList;
