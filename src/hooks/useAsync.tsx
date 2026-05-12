import { useCallback, useEffect, useRef, useState } from 'react';
import { adminLog } from '@/lib/adminErrorLog';

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  error: string | null;
  status: AsyncStatus;
}

/**
 * withTimeout - wraps a promise so it always resolves within `ms`.
 * Prevents admin pages from getting stuck on "Loading..." forever
 * if Supabase requests stall (network drop, RLS deadlock, etc.).
 */
export const withTimeout = <T,>(promise: Promise<T>, ms = 15000, label = 'request'): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s`)), ms);
    promise.then(
      (v) => { clearTimeout(t); resolve(v); },
      (e) => { clearTimeout(t); reject(e); },
    );
  });
};

/**
 * useAsyncResource - run an async loader with timeout, error capture
 * and a stable refetch handler. The component never hangs because the
 * status always transitions to either `success` or `error`.
 */
export function useAsyncResource<T>(loader: () => Promise<T>, deps: any[] = [], timeoutMs = 15000) {
  const [state, setState] = useState<AsyncState<T>>({ data: null, error: null, status: 'loading' });
  const mounted = useRef(true);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  useEffect(() => () => { mounted.current = false; }, []);

  const run = useCallback(async () => {
    if (!mounted.current) return;
    setState((s) => ({ ...s, status: 'loading', error: null }));
    try {
      const data = await withTimeout(loaderRef.current(), timeoutMs, 'load');
      if (!mounted.current) return;
      setState({ data, error: null, status: 'success' });
    } catch (err: any) {
      console.error('[useAsyncResource]', err);
      if (!mounted.current) return;
      setState({ data: null, error: err?.message || 'Failed to load', status: 'error' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeoutMs]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { run(); }, deps);

  return { ...state, refetch: run, setData: (d: T) => setState({ data: d, error: null, status: 'success' }) };
}
