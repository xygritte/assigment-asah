import React from 'react';

function EmptyState({ title, description }) {
  return (
    <div className="notes-list-empty" role="status">
      <span className="empty-icon" aria-hidden="true">✳</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default EmptyState;
