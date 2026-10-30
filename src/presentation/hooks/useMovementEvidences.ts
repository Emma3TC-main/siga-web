import { useCallback, useEffect, useState } from 'react';
import type { Evidence } from '../../domain/entities/Evidence';
import { evidenceUseCases } from '../../app/compositionRoot';

export function useMovementEvidences(movementId: string) {
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    evidenceUseCases.listMovement(movementId)
      .then(page => { if (active) setEvidences(page.content); })
      .catch(cause => { if (active) setError(cause); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [movementId, version]);

  const refresh = useCallback(() => setVersion(value => value + 1), []);
  return { evidences, loading, error, refresh };
}
