function filterNotesByTitle(notes, keyword) {
  const normalizedKeyword = keyword.trim().toLowerCase();
  if (!normalizedKeyword) return notes;

  return notes.filter((note) =>
    note.title.toLowerCase().includes(normalizedKeyword),
  );
}

export { filterNotesByTitle };
