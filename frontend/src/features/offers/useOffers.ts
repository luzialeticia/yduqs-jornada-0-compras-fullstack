import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../api/client';
import { getOffers } from '../../api/offers';
import type { Offer } from '../../types';

interface UseOffersResult {
  offers: Offer[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useOffers(): UseOffersResult {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setOffers(await getOffers());
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Não foi possível carregar as ofertas.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { offers, loading, error, reload: load };
}
