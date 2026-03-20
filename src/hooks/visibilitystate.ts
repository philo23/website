import { useCallback, useEffect, useState } from 'react';

export function useVisibilityState() {
  const [state, setState] = useState(document.visibilityState ?? 'visible');

  const listener = useCallback(() => {
    setState(document.visibilityState);
  }, []);

  useEffect(() => {
    document.addEventListener('visibilitychange', listener);

    return () => {
      document.removeEventListener('visibilitychange', listener);
    };
  }, []);

  return state === 'visible';
}
