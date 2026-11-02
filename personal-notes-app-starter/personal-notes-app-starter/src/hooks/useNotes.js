import { useEffect, useState } from 'react';
import { getActiveNotes, getArchivedNotes } from '../utils/network-data';

function useNotes(archived, onUnauthorized) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    const load = archived ? getArchivedNotes : getActiveNotes;
    load().then((result) => {
      if (!active) return;
      if (result.status === 401) {
        onUnauthorized();
      } else if (result.error) {
        setError(result.message);
      } else {
        setNotes(result.data || []);
      }
    }).finally(() => {
      if (active) setLoading(false);
    });

    return () => { active = false; };
  }, [archived, onUnauthorized]);

  return { notes, loading, error };
}

export default useNotes;
