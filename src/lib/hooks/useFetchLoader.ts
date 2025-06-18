import { useCallback, useState } from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseFetchLoaderReturn<T> extends FetchState<T> {
  setLoading: (loading: boolean) => void;
  setData: (data: T) => void;
  setError: (error: string) => void;
  reset: () => void;
  execute: (asyncFunction: () => Promise<T>) => Promise<T | null>;
}

export function useFetchLoader<T = any>(initialData: T | null = null): UseFetchLoaderReturn<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading, error: loading ? null : prev.error }));
  }, []);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data, loading: false, error: null }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  const reset = useCallback(() => {
    setState({ data: initialData, loading: false, error: null });
  }, [initialData]);

  const execute = useCallback(async (asyncFunction: () => Promise<T>): Promise<T | null> => {
    try {
      setLoading(true);
      const result = await asyncFunction();
      setData(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur s'est produite";
      setError(errorMessage);
      return null;
    }
  }, [setLoading, setData, setError]);

  return {
    ...state,
    setLoading,
    setData,
    setError,
    reset,
    execute,
  };
}

// Specialized hook for carpool operations
export function useCarpoolLoader<T = any>() {
  return useFetchLoader<T>();
}

// Hook for managing multiple fetch states
export function useMultipleFetchLoaders<T extends Record<string, any>>() {
  const [states, setStates] = useState<Record<keyof T, FetchState<any>>>({} as any);

  const setLoading = useCallback((key: keyof T, loading: boolean) => {
    setStates(prev => ({
      ...prev,
      [key]: { ...prev[key], loading, error: loading ? null : prev[key]?.error }
    }));
  }, []);

  const setData = useCallback((key: keyof T, data: any) => {
    setStates(prev => ({
      ...prev,
      [key]: { ...prev[key], data, loading: false, error: null }
    }));
  }, []);

  const setError = useCallback((key: keyof T, error: string) => {
    setStates(prev => ({
      ...prev,
      [key]: { ...prev[key], error, loading: false }
    }));
  }, []);

  const execute = useCallback(async <K extends keyof T>(
    key: K, 
    asyncFunction: () => Promise<T[K]>
  ): Promise<T[K] | null> => {
    try {
      setLoading(key, true);
      const result = await asyncFunction();
      setData(key, result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur s'est produite";
      setError(key, errorMessage);
      return null;
    }
  }, [setLoading, setData, setError]);

  return {
    states,
    setLoading,
    setData,
    setError,
    execute,
  };
} 