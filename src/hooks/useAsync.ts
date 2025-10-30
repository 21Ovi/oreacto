import { useState, useCallback, useRef, useEffect } from "react";

export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  success: boolean;
};

export type UseAsyncConfig<T> = {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  retryCount?: number;
  retryDelay?: number;
  staleTime?: number;
  cacheKey?: string;
};

export type UseAsyncResult<T> = AsyncState<T> & {
  execute: (...args: any[]) => Promise<T | undefined>;
  retry: () => Promise<T | undefined>;
  reset: () => void;
  cancel: () => void;
};

// Simple cache for stale-while-revalidate pattern
const cache = new Map<string, { data: any; timestamp: number }>();

/**
 * A powerful hook for managing async operations with built-in loading states, error handling, retry logic, and caching.
 *
 * @template T - The type of data returned by the async function
 * @param {(...args: any[]) => Promise<T>} asyncFn - The async function to execute
 * @param {UseAsyncConfig<T>} [config] - Configuration options
 * @param {function} [config.onSuccess] - Callback fired on successful execution
 * @param {function} [config.onError] - Callback fired on error
 * @param {number} [config.retryCount=0] - Number of retry attempts on failure
 * @param {number} [config.retryDelay=1000] - Delay between retries in milliseconds
 * @param {number} [config.staleTime=0] - Time in ms before data is considered stale (0 = always fresh)
 * @param {string} [config.cacheKey] - Cache key for stale-while-revalidate pattern
 *
 * @returns {UseAsyncResult<T>} Async state and control functions
 *
 * @example
 * // Basic usage
 * const { data, loading, error, execute } = useAsync(async () => {
 *   const response = await fetch('/api/users');
 *   return response.json();
 * });
 *
 * useEffect(() => {
 *   execute();
 * }, []);
 *
 * @example
 * // With retry and error handling
 * const { data, loading, error, retry } = useAsync(
 *   async (userId) => {
 *     const response = await fetch(`/api/users/${userId}`);
 *     if (!response.ok) throw new Error('Failed to fetch user');
 *     return response.json();
 *   },
 *   {
 *     retryCount: 3,
 *     retryDelay: 1000,
 *     onError: (error) => console.error('User fetch failed:', error),
 *   }
 * );
 *
 * @example
 * // With caching (stale-while-revalidate)
 * const { data, loading, execute } = useAsync(
 *   async () => {
 *     const response = await fetch('/api/settings');
 *     return response.json();
 *   },
 *   {
 *     cacheKey: 'user-settings',
 *     staleTime: 5 * 60 * 1000, // 5 minutes
 *     onSuccess: (data) => console.log('Settings loaded:', data),
 *   }
 * );
 *
 * @example
 * // Manual execution with parameters
 * const { data, loading, execute } = useAsync(async (searchTerm) => {
 *   const response = await fetch(`/api/search?q=${searchTerm}`);
 *   return response.json();
 * });
 *
 * const handleSearch = (term) => {
 *   execute(term);
 * };
 */
const useAsync = <T>(
  asyncFn: (...args: any[]) => Promise<T>,
  config: UseAsyncConfig<T> = {}
): UseAsyncResult<T> => {
  const {
    onSuccess,
    onError,
    retryCount = 0,
    retryDelay = 1000,
    staleTime = 0,
    cacheKey,
  } = config;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
    success: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  const lastArgsRef = useRef<any[]>([]);

  const execute = useCallback(
    async (...args: any[]): Promise<T | undefined> => {
      // Cancel previous request if still running
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Check cache first
      if (cacheKey && staleTime > 0) {
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < staleTime) {
          setState({
            data: cached.data,
            loading: false,
            error: null,
            success: true,
          });
          onSuccess?.(cached.data);
          return cached.data;
        }
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();
      lastArgsRef.current = args;

      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        success: false,
      }));

      try {
        const result = await asyncFn(...args);

        // Check if request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          return undefined;
        }

        // Update cache
        if (cacheKey) {
          cache.set(cacheKey, { data: result, timestamp: Date.now() });
        }

        setState({
          data: result,
          loading: false,
          error: null,
          success: true,
        });

        onSuccess?.(result);
        retryCountRef.current = 0; // Reset retry count on success
        return result;
      } catch (error: any) {
        // Check if request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          return undefined;
        }

        const errorObj = error instanceof Error ? error : new Error(String(error));

        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorObj,
          success: false,
        }));

        onError?.(errorObj);

        // Retry logic
        if (retryCountRef.current < retryCount) {
          retryCountRef.current++;
          setTimeout(() => {
            execute(...lastArgsRef.current);
          }, retryDelay);
        }

        throw errorObj;
      }
    },
    [asyncFn, onSuccess, onError, retryCount, retryDelay, cacheKey, staleTime]
  );

  const retry = useCallback(() => {
    retryCountRef.current = 0; // Reset retry count for manual retry
    return execute(...lastArgsRef.current);
  }, [execute]);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState({
      data: null,
      loading: false,
      error: null,
      success: false,
    });
    retryCountRef.current = 0;
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState((prev) => ({
      ...prev,
      loading: false,
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    execute,
    retry,
    reset,
    cancel,
  };
};

export default useAsync;

