import React from 'react';

function SearchBar({ value, onChange }) {
  return (
    <form
      className="search-bar"
      role="search"
      onSubmit={(event) => event.preventDefault()}
    >
      <span className="search-icon" aria-hidden="true">⌕</span>
      <input
        type="search"
        name="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Cari berdasarkan judul catatan..."
        aria-label="Cari catatan berdasarkan judul"
      />
      {value && (
        <button
          className="clear-search"
          type="button"
          onClick={() => onChange('')}
          aria-label="Hapus pencarian"
        >
          ×
        </button>
      )}
      <span className="search-hint">SEARCH</span>
    </form>
  );
}

export default SearchBar;
