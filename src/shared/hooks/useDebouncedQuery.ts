"use client";
import { useEffect, useState } from "react";

/**
 * Debounces a query value with a specified delay
 * @param query - The query string to debounce
 * @param delay - Delay in milliseconds (default: 700ms)
 * @returns The debounced query value
 */
export const useDebouncedQuery = (query: string, delay: number = 700): string => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [query, delay]);

  return debouncedQuery;
};
