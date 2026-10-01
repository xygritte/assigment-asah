import React from 'react';

function NoteActionButton({ variant, onClick, children }) {
  const isArchive = variant === 'archive';

  const className = isArchive
    ? 'note-item__archive-button'
    : 'note-item__delete-button';

  const testId = isArchive
    ? 'note-item-archive-button'
    : 'note-item-delete-button';

  return (
    <button
      className={className}
      type="button"
      onClick={onClick}
      data-testid={testId}
    >
      {children}
    </button>
  );
}

export default NoteActionButton;