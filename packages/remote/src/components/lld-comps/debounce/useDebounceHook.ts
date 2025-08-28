import { useEffect, useRef, useState } from "react";

const resultCache = new Map<string, unknown>();

const useDebounceHook = (query: string, ms: number) => {
  const [debounced, setDebounced] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), ms);
    return () => clearTimeout(timer);
  }, [query]);

  return debounced;
};

export const useDebounceSearch = <T>(query: string, ms = 300, url: string) => {
  const debouncedValue = useDebounceHook(query.trim(), ms);

  const [results, setResults] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reqId = useRef<number>(0);

  useEffect(() => {
    if (!debouncedValue) {
      setResults(null);
      setLoading(false);
      setError(null);
      return;
    }

    if (resultCache.has(debouncedValue)) {
      setResults(resultCache.get(debouncedValue) as T);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const currReqId = ++reqId.current; //reqId.current acts as a counter to uniquely identify each API request made by the hook/component.
    //This ID is used to track whether a given response belongs to the latest request or an earlier one
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        resultCache.set(debouncedValue, res);
        if (currReqId === reqId.current) {
          setResults(res as T);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (currReqId === reqId.current) {
          setError(err);
          setLoading(false);
        }
      });
  }, [debouncedValue, url]);
  console.log(results);
  return { results, loading, error };
};
