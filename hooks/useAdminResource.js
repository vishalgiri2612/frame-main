"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/admin/client";

export function useAdminResource(path, query = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      params.set(key, String(value));
    });

    return params.toString();
  }, [query]);

  const url = queryString ? `${path}?${queryString}` : path;

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await adminFetch(url);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || "Failed to fetch resource");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError("");

      try {
        const result = await adminFetch(url);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to fetch resource");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return {
    data,
    setData,
    error,
    isLoading,
    refetch,
  };
}
