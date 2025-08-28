import { useEffect, useRef, useState } from "react";

type UseFetchArgs<T> = {
  key: string;
  fetcher: () => Promise<T>;
  options?: { staleMs?: number };
};

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

const cache = new Map<string, unknown>();
const pending = new Map<string, Promise<unknown>>();

export function useDataFetch<T>(args: UseFetchArgs<T>) {
  const { key, fetcher, options } = args;

  const KeyTimeStamp = key + ":ts"; // time stamp key

  const [state, setState] = useState<FetchState<T>>({
    data: (cache.has(key) as T) ? (cache.get(key) as T) : null,
    loading: !cache.has(key),
    error: null,
  });

  // last fetched data for the key with :TS to mark it as a timestamp
  const lastFetched = useRef<number>(
    (cache.has(KeyTimeStamp) as boolean)
      ? (cache.get(KeyTimeStamp) as number)
      : 0
  );

  const fetchData = async (forceFetch: boolean = false) => {
    // Getting data from cache and date compare
    if (
      !forceFetch &&
      cache.has(key) &&
      Date.now() - lastFetched.current < (options?.staleMs ?? 30000)
    ) {
      setState({ data: cache.get(key) as T, loading: false, error: null });
      return cache.get(key) as T;
    }

    setState({ ...state, loading: true }); // fetch in progress

    if (pending.has(key)) return pending.get(key); // If already a req is going on, this will prevent duplicate req

    const result: Promise<T | unknown> = fetcher()
      .then((data) => {
        if (data === undefined) throw "Got undefined";

        // Caching
        cache.set(key, data);
        cache.set(KeyTimeStamp, Date.now());

        // storing last fetch time
        lastFetched.current = cache.get(KeyTimeStamp) as number;

        setState({ data: data as T, loading: false, error: null });
        return data;
      })
      .catch((err: Error) => {
        setState({ data: null, loading: false, error: err });
        throw err;
      })
      .finally(() => {
        pending.delete(key);
      });

    pending.set(key, result);
    return result;
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(
      () => fetchData(true),
      options?.staleMs ?? 30000
    );

    return () => clearInterval(interval);
  }, [key]);

  const updateData = (updatedData: T) => {
    setState({ data: updatedData, loading: false, error: null });
    cache.set(key, updatedData);
  };

  return {
    refetch: () => fetchData(true),
    updateData,
    ...state,
  };
}
