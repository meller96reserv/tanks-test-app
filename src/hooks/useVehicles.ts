import { useCallback, useEffect, useState } from 'react';
import { fetchVehicles, Vehicle } from '../services/vehiclesService';

export interface UseVehiclesResult {
  vehicles: Vehicle[];
  isLoading: boolean;
  isError: boolean;
  retry: () => void;
}

/**
 * Fetches the full Tanki vehicles list once on mount.
 * Call `retry()` to reset state and re-fetch after an error.
 *
 * @returns `{ vehicles, isLoading, isError, retry }`
 */
export function useVehicles(): UseVehiclesResult {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    setVehicles([]);

    void (async () => {
      try {
        const data = await fetchVehicles();
        setVehicles(data);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [retryCount]);

  const retry = useCallback(() => setRetryCount((c) => c + 1), []);

  return { vehicles, isLoading, isError, retry };
}
